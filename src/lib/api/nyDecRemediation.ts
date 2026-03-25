/**
 * New York State DEC — Environmental Remediation Sites (Socrata SODA).
 *
 * Dataset: https://data.ny.gov/d/c6ci-rzpg
 * Public — no API key required (optional Socrata app token for higher limits).
 */

import type { ApiHealthResult } from './types.ts'

const BASE = 'https://data.ny.gov/resource/c6ci-rzpg.json'

export type NYDecRemediationRow = {
  program_number?: string
  program_type?: string
  program_facility_name?: string
  siteclass?: string
  address1?: string
  locality?: string
  county?: string
  zipcode?: string
  dec_region?: string
  [key: string]: string | undefined
}

function buildSoql(params: { limit?: number; where?: string }): string {
  const q = new URLSearchParams()
  if (params.limit != null) q.set('$limit', String(params.limit))
  if (params.where) q.set('$where', params.where)
  return q.toString()
}

/**
 * Query remediation sites. Filter by program types (e.g. BCP, VCP) with SoQL `IN (...)`.
 * Optional `where` is combined with AND (Socrata SoQL).
 */
export async function fetchRemediationSites(options: {
  programTypes?: string[]
  /** Extra SoQL predicate, e.g. `upper(locality) like '%ALBANY%'` */
  where?: string
  limit?: number
}): Promise<NYDecRemediationRow[]> {
  const limit = Math.min(options.limit ?? 100, 5000)
  const parts: string[] = []
  if (options.programTypes?.length) {
    const list = options.programTypes.map((t) => `'${t.replace(/'/g, "''")}'`).join(', ')
    parts.push(`program_type IN (${list})`)
  }
  if (options.where) parts.push(`(${options.where})`)
  const where = parts.length ? parts.join(' AND ') : undefined
  const qs = buildSoql({ limit, where })
  const url = qs ? `${BASE}?${qs}` : `${BASE}?$limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`NY Open Data ${res.status}: ${res.statusText}`)
  const data = (await res.json()) as unknown
  if (!Array.isArray(data)) throw new Error('NY Open Data: unexpected response')
  return data as NYDecRemediationRow[]
}

export async function healthCheck(): Promise<ApiHealthResult> {
  const t0 = performance.now()
  try {
    const res = await fetch(`${BASE}?$limit=1`)
    if (!res.ok) throw new Error(`${res.status}`)
    const data = (await res.json()) as unknown
    if (!Array.isArray(data)) throw new Error('Invalid response')
    return {
      source: 'NY DEC Remediation',
      status: 'connected',
      message: 'NY Open Data remediation sites online',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'NY DEC Remediation',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
