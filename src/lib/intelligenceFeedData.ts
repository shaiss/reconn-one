/**
 * Assembles Intelligence Feed cards from live public APIs (FHWA, NREL, NY Open Data, EJScreen, optional Z.AI).
 */

import { fetchCorridorsByState } from './api/fhwa.ts'
import { fetchNearbyStations, fetchStationsByState } from './api/nrel.ts'
import { nrelApiKey } from './api/nrelClient.ts'
import { fetchUtilityRates } from './api/nrelUtilityRates.ts'
import { fetchEJScreenData } from './api/ejscreen.ts'
import { fetchRemediationSites } from './api/nyDecRemediation.ts'
import { zaiApiKey, webSearch } from './api/zaiWebSearch.ts'
import type { AFDCStation, FHWACorridor } from './api/types.ts'
import type { NYDecRemediationRow } from './api/nyDecRemediation.ts'

export type IntelligenceFeedItem = {
  id: string
  time: string
  account: string
  accountSlug: string
  score: number
  title: string
  description: string
  icon: string
  iconColor: string
  actionLabel: string
  date: 'today' | 'yesterday'
  tabKey: string
  /** Short provenance, e.g. "FHWA" */
  sourceLabel?: string
  externalUrl?: string
}

function clampScore(n: number): number {
  return Math.min(99, Math.max(42, Math.round(n)))
}

function staggeredTimes(count: number, base = new Date()): string[] {
  const out: string[] = []
  let m = base.getMinutes()
  let h = base.getHours()
  for (let i = 0; i < count; i++) {
    m -= 12 + (i % 5) * 3
    while (m < 0) {
      m += 60
      h -= 1
    }
    if (h < 0) h = 23
    const d = new Date(base)
    d.setHours(h, m, 0, 0)
    out.push(
      d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true }),
    )
  }
  return out
}

function truncate(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function fwhaToItems(corridors: FHWACorridor[], times: string[]): IntelligenceFeedItem[] {
  const uniq = corridors.filter((c) => c.fuelType === 'Electric').slice(0, 4)
  return uniq.map((c, i) => ({
    id: `fwha-oh-${c.objectId}`,
    time: times[i] ?? times[0],
    account: 'GreenCharge Networks',
    accountSlug: 'greencharge',
    score: clampScore(86 + (c.objectId % 7)),
    title: `Ohio EV corridor: ${c.routeName || 'Designated route'}`,
    description: truncate(
      `${c.status || 'Active'} · ${c.corridorName ?? 'FHWA Alternative Fuel Corridors'} · Electric designation (live ArcGIS query).`,
      220,
    ),
    icon: 'route',
    iconColor: 'text-brand',
    actionLabel: 'View Dossier',
    date: 'today',
    tabKey: 'nevi',
    sourceLabel: 'FHWA',
  }))
}

function fwhaNyItems(corridors: FHWACorridor[], times: string[], timeOffset: number): IntelligenceFeedItem[] {
  const uniq = corridors.filter((c) => c.fuelType === 'Electric').slice(0, 2)
  return uniq.map((c, i) => ({
    id: `fwha-ny-${c.objectId}`,
    time: times[i + timeOffset] ?? times[0],
    account: 'TriState EV Corridor Group',
    accountSlug: 'tristate-corridor',
    score: clampScore(58 + (c.objectId % 5)),
    title: `NY EV corridor: ${c.routeName || 'Designated route'}`,
    description: truncate(
      `${c.status || 'Active'} · ${c.corridorName ?? 'Tri-state bundle context'} · FHWA public corridors layer.`,
      220,
    ),
    icon: 'map',
    iconColor: 'text-[#854D0E]',
    actionLabel: 'View Dossier',
    date: 'today',
    tabKey: 'nevi',
    sourceLabel: 'FHWA',
  }))
}

const MS_PER_DAY = 86400000

function stationStalenessMonths(st: AFDCStation): number | null {
  const raw = st.date_last_confirmed
  if (!raw) return null
  const t = Date.parse(raw)
  if (Number.isNaN(t)) return null
  return (Date.now() - t) / (MS_PER_DAY * 30)
}

function afdcTexasItems(stations: AFDCStation[], times: string[], timeOffset: number): IntelligenceFeedItem[] {
  if (!stations.length) return []
  let dcFastPorts = 0
  let withDcfc = 0
  let stale12mo = 0
  for (const s of stations) {
    const n = s.ev_dc_fast_num ?? 0
    if (n > 0) withDcfc += 1
    dcFastPorts += n
    const mo = stationStalenessMonths(s)
    if (mo != null && mo >= 12) stale12mo += 1
  }
  const title = `AFDC · Texas: ${stations.length} public EV sites (API sample)`
  const desc = `${dcFastPorts} DC fast ports across ${withDcfc} locations with DCFC. ${stale12mo} sites not confirmed in 12+ months — reliability / rip-replace screen. NREL Station Locator.`
  return [
    {
      id: 'nrel-tx-afdc',
      time: times[timeOffset] ?? times[0],
      account: 'AmeriCharge Holdings',
      accountSlug: 'americharge',
      score: clampScore(88 + Math.min(6, Math.floor(stale12mo / 3))),
      title,
      description: truncate(desc, 240),
      icon: 'ev_station',
      iconColor: 'text-danger',
      actionLabel: 'View Dossier',
      date: 'today',
      tabKey: 'distress',
      sourceLabel: 'NREL AFDC',
    },
  ]
}

function afdcOhioItems(stations: AFDCStation[], times: string[], timeOffset: number): IntelligenceFeedItem[] {
  if (!stations.length) return []
  const hub = stations[0]
  const dc = hub.ev_dc_fast_num ?? 0
  const l2 = hub.ev_level2_evse_num ?? 0
  return [
    {
      id: `nrel-oh-${hub.id}`,
      time: times[timeOffset] ?? times[0],
      account: 'GreenCharge Networks',
      accountSlug: 'greencharge',
      score: clampScore(90 + (hub.id % 5)),
      title: `AFDC · Ohio hub: ${hub.station_name || 'Charging site'}`,
      description: truncate(
        `${hub.city}, ${hub.state} · ${dc} DC fast / ${l2} L2 EVSE · ${hub.ev_network ?? 'Network TBD'} · NREL live lookup near Columbus.`,
        240,
      ),
      icon: 'bolt',
      iconColor: 'text-brand-muted',
      actionLabel: 'View Dossier',
      date: 'today',
      tabKey: 'nevi',
      sourceLabel: 'NREL AFDC',
    },
  ]
}

function nyDecItems(rows: NYDecRemediationRow[], times: string[], timeOffset: number): IntelligenceFeedItem[] {
  return rows.slice(0, 3).map((r, i) => {
    const name = r.program_facility_name ?? r.program_number ?? 'Remediation site'
    const loc = [r.address1, r.locality, r.county].filter(Boolean).join(', ')
    return {
      id: `ny-dec-${r.program_number ?? i}-${i}`,
      time: times[timeOffset + i] ?? times[0],
      account: 'PeakVolt Energy',
      accountSlug: 'peakvolt',
      score: clampScore(78 + (i % 8)),
      title: `${name} (${r.program_type ?? 'Program'})`,
      description: truncate(`${loc}. NY Open Data — DEC environmental remediation registry.`, 240),
      icon: 'eco',
      iconColor: 'text-brand-muted',
      actionLabel: 'View Dossier',
      date: 'today',
      tabKey: 'environmental',
      sourceLabel: 'NY DEC',
    }
  })
}

function ejItem(
  times: string[],
  timeOffset: number,
): (r: Awaited<ReturnType<typeof fetchEJScreenData>>) => IntelligenceFeedItem[] {
  return (ej) => [
    {
      id: `ejscreen-albany`,
      time: times[timeOffset] ?? times[0],
      account: 'PeakVolt Energy',
      accountSlug: 'peakvolt',
      score: clampScore(80 + (ej.isDisadvantaged ? 8 : 0)),
      title: `EJScreen · Albany 1-mi buffer: ${Math.round(ej.percentMinority)}% minority`,
      description: truncate(
        `Low-income ${Math.round(ej.percentLowIncome)}% · Pop. ${ej.totalPopulation.toLocaleString()} · ${ej.isDisadvantaged ? 'Disadvantaged / Justice40-style screen — siting & grants context.' : 'Baseline EJ metrics (EPA EJScreen API).'}`,
        260,
      ),
      icon: 'groups',
      iconColor: 'text-info',
      actionLabel: 'View Dossier',
      date: 'today',
      tabKey: 'environmental',
      sourceLabel: 'EPA EJScreen',
    },
  ]
}

function utilityItem(
  rates: Awaited<ReturnType<typeof fetchUtilityRates>>,
  times: string[],
  timeOffset: number,
): IntelligenceFeedItem[] {
  const name =
    rates.utility_name ??
    rates.utility_info?.[0]?.utility_name ??
    'Utility territory (NREL v3)'
  const commercial = rates.commercial
  const res = rates.residential
  const cents = (kwh?: number) =>
    kwh != null && !Number.isNaN(kwh) ? `${(kwh * 100).toFixed(1)}¢/kWh` : 'n/a'
  return [
    {
      id: 'nrel-utility-sf',
      time: times[timeOffset] ?? times[0],
      account: 'CrossGrid Power',
      accountSlug: 'crossgrid',
      score: clampScore(82),
      title: `Utility rates snapshot: ${truncate(name, 48)}`,
      description: truncate(
        `Commercial ~${cents(commercial)} · Residential ~${cents(res)} (2012 Ventyx baseline, NREL Utility Rates v3). Tariff / queue screening near SF.`,
        260,
      ),
      icon: 'account_balance',
      iconColor: 'text-brand',
      actionLabel: 'View Dossier',
      date: 'today',
      tabKey: 'grid',
      sourceLabel: 'NREL Rates',
    },
  ]
}

function zaiItems(hits: Awaited<ReturnType<typeof webSearch>>, times: string[], timeOffset: number): IntelligenceFeedItem[] {
  return hits.slice(0, 2).map((h, i) => ({
    id: `zai-${i}-${(h.link ?? h.title ?? '').slice(0, 24)}`,
    time: times[timeOffset + i] ?? times[0],
    account: 'GreenCharge Networks',
    accountSlug: 'greencharge',
    score: clampScore(85 - i * 3),
    title: truncate(h.title ?? 'Web signal', 90),
    description: truncate(h.content ?? 'Z.AI web search result.', 220),
    icon: 'search',
    iconColor: 'text-text-secondary',
    actionLabel: 'Open source',
    date: 'today',
    tabKey: 'nevi',
    sourceLabel: 'Z.AI',
    externalUrl: h.link,
  }))
}

export type FetchIntelligenceFeedResult = {
  items: IntelligenceFeedItem[]
  errors: string[]
}

/**
 * Pulls feed cards from configured APIs. NREL-backed calls are skipped when `VITE_NREL_API_KEY` is unset.
 * Z.AI search runs only when `VITE_ZAI_API_KEY` is set (2 results).
 */
export async function fetchIntelligenceFeedItems(): Promise<FetchIntelligenceFeedResult> {
  const errors: string[] = []
  const hasNrel = Boolean(nrelApiKey())
  const hasZai = Boolean(zaiApiKey())

  const settled = await Promise.allSettled([
    fetchCorridorsByState('OH', 12),
    fetchCorridorsByState('NY', 8),
    hasNrel ? fetchStationsByState('TX', 80) : Promise.resolve([] as AFDCStation[]),
    hasNrel ? fetchNearbyStations({ lat: 39.9612, lng: -82.9988 }, 35, 25) : Promise.resolve([] as AFDCStation[]),
    fetchRemediationSites({
      programTypes: ['BCP', 'VCP'],
      where: "upper(locality) like '%ALBANY%' OR upper(county) like '%ALBANY%'",
      limit: 8,
    }),
    fetchEJScreenData(42.6526, -73.7562, 1),
    hasNrel ? fetchUtilityRates(37.7749, -122.4194, 0) : Promise.resolve({}),
    hasZai
      ? webSearch('NEVI electric vehicle charging corridor funding 2025', { count: 2 })
      : Promise.resolve([]),
  ])

  const ohCorridors = settled[0].status === 'fulfilled' ? settled[0].value : []
  if (settled[0].status === 'rejected') errors.push(`FHWA OH: ${(settled[0].reason as Error)?.message ?? 'failed'}`)

  const nyCorridors = settled[1].status === 'fulfilled' ? settled[1].value : []
  if (settled[1].status === 'rejected') errors.push(`FHWA NY: ${(settled[1].reason as Error)?.message ?? 'failed'}`)

  const txStations = settled[2].status === 'fulfilled' ? settled[2].value : []
  if (settled[2].status === 'rejected') errors.push(`NREL TX: ${(settled[2].reason as Error)?.message ?? 'failed'}`)

  const ohStations = settled[3].status === 'fulfilled' ? settled[3].value : []
  if (settled[3].status === 'rejected') errors.push(`NREL OH: ${(settled[3].reason as Error)?.message ?? 'failed'}`)

  const nyRows = settled[4].status === 'fulfilled' ? settled[4].value : []
  if (settled[4].status === 'rejected') errors.push(`NY DEC: ${(settled[4].reason as Error)?.message ?? 'failed'}`)

  const ej = settled[5].status === 'fulfilled' ? settled[5].value : null
  if (settled[5].status === 'rejected') errors.push(`EJScreen: ${(settled[5].reason as Error)?.message ?? 'failed'}`)

  const rates = settled[6].status === 'fulfilled' ? settled[6].value : {}
  if (settled[6].status === 'rejected') errors.push(`NREL rates: ${(settled[6].reason as Error)?.message ?? 'failed'}`)

  const zaiHits = settled[7].status === 'fulfilled' ? settled[7].value : []
  if (settled[7].status === 'rejected') errors.push(`Z.AI: ${(settled[7].reason as Error)?.message ?? 'failed'}`)

  if (!hasNrel) errors.push('NREL: VITE_NREL_API_KEY not set — AFDC + utility rate cards skipped')

  // Build ordered list; ~12 staggered timestamps
  const totalSlots =
    4 +
    2 +
    1 +
    1 +
    3 +
    1 +
    1 +
    zaiHits.length
  const times = staggeredTimes(Math.max(12, totalSlots + 2))
  let t = 0
  const items: IntelligenceFeedItem[] = []

  items.push(...fwhaToItems(ohCorridors, times))
  t += items.length

  items.push(...fwhaNyItems(nyCorridors, times, t))
  t = items.length

  items.push(...afdcTexasItems(txStations, times, t))
  t = items.length

  items.push(...afdcOhioItems(ohStations, times, t))
  t = items.length

  items.push(...nyDecItems(nyRows, times, t))
  t = items.length

  if (ej) items.push(...ejItem(times, t)(ej))
  t = items.length

  if (hasNrel && Object.keys(rates).length) items.push(...utilityItem(rates, times, t))
  t = items.length

  if (hasZai && zaiHits.length) items.push(...zaiItems(zaiHits, times, t))

  return { items, errors }
}
