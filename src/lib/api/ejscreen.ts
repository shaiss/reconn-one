/**
 * EPA EJScreen API client — environmental justice screening data.
 *
 * Docs:  https://www.epa.gov/ejscreen/ejscreen-api
 * Interactive builder: https://ejscreen.epa.gov/mapper/ejscreenapi1.html
 *
 * Fully public — no API key required.
 */

import type { ApiHealthResult, EJScreenResult } from './types.ts'

const BASE = 'https://ejscreen.epa.gov/mapper/ejscreenapi1.aspx'

/**
 * Fetch EJScreen environmental justice data for a point + buffer.
 * @param lat  Latitude
 * @param lng  Longitude
 * @param bufferMiles  Radius in miles (default 1)
 */
export async function fetchEJScreenData(
  lat: number,
  lng: number,
  bufferMiles = 1,
): Promise<EJScreenResult> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    distance: String(bufferMiles),
    unit: 'miles',
    f: 'json',
  })

  const res = await fetch(`${BASE}?${params.toString()}`)
  if (!res.ok) throw new Error(`EJScreen ${res.status}: ${res.statusText}`)

  const data = (await res.json()) as Record<string, unknown>
  const raw = (data['data'] ?? data) as Record<string, unknown>

  const demographics = (raw['demographics'] ?? raw) as Record<string, unknown>
  const indexes = (raw['ejindexes'] ?? {}) as Record<string, number>

  const pctMinority = Number(demographics['PCT_MINORITY'] ?? demographics['pctMinority'] ?? 0)
  const pctLowIncome = Number(demographics['PCT_LOWINCOME'] ?? demographics['pctLowIncome'] ?? 0)
  const pctLingIso = Number(
    demographics['PCT_LINGISO'] ?? demographics['pctLinguisticallyIsolated'] ?? 0,
  )

  return {
    stateAbbr: String(demographics['STATE_ABBR'] ?? demographics['stateAbbr'] ?? ''),
    totalPopulation: Number(demographics['TOTALPOP'] ?? demographics['totalPopulation'] ?? 0),
    percentMinority: pctMinority,
    percentLowIncome: pctLowIncome,
    percentLinguisticallyIsolated: pctLingIso,
    ejIndexes: indexes,
    isDisadvantaged: pctMinority >= 0.4 || pctLowIncome >= 0.4,
  }
}

/**
 * Quick health check — makes a lightweight request to the EJScreen endpoint.
 */
export async function healthCheck(): Promise<ApiHealthResult> {
  const t0 = performance.now()
  try {
    const params = new URLSearchParams({
      latitude: '40.7128',
      longitude: '-74.006',
      distance: '1',
      unit: 'miles',
      f: 'json',
    })
    const res = await fetch(`${BASE}?${params.toString()}`)
    if (!res.ok) throw new Error(`${res.status}`)
    return {
      source: 'EPA EJScreen',
      status: 'connected',
      message: 'EJScreen / Justice40 data available',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'EPA EJScreen',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
