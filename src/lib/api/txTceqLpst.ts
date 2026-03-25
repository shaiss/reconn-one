/**
 * Texas TCEQ — Leaking Petroleum Storage Tank (LPST) sites (Socrata).
 *
 * Dataset: https://data.texas.gov/d/hedz-nn4q
 * Public — no API key required.
 */

import type { ApiHealthResult } from './types.ts'

const BASE = 'https://data.texas.gov/resource/hedz-nn4q.json'

export type TXTceqLpstRow = {
  lpst_id?: string
  ref_num?: string
  pst_reg?: string
  site_name?: string
  site_address?: string
  city?: string
  county?: string
  zip?: string
  closure_date?: string
  tceq_region?: string
  [key: string]: string | undefined
}

/**
 * Query LPST records (optional SoQL `where` clause).
 */
export async function fetchLpstSites(options: {
  where?: string
  limit?: number
}): Promise<TXTceqLpstRow[]> {
  const limit = Math.min(options.limit ?? 100, 5000)
  const q = new URLSearchParams({ $limit: String(limit) })
  if (options.where) q.set('$where', options.where)
  const res = await fetch(`${BASE}?${q.toString()}`)
  if (!res.ok) throw new Error(`Texas Open Data ${res.status}: ${res.statusText}`)
  const data = (await res.json()) as unknown
  if (!Array.isArray(data)) throw new Error('Texas Open Data: unexpected response')
  return data as TXTceqLpstRow[]
}

export async function healthCheck(): Promise<ApiHealthResult> {
  const t0 = performance.now()
  try {
    const res = await fetch(`${BASE}?$limit=1`)
    if (!res.ok) throw new Error(`${res.status}`)
    const data = (await res.json()) as unknown
    if (!Array.isArray(data)) throw new Error('Invalid response')
    return {
      source: 'TX TCEQ LPST',
      status: 'connected',
      message: 'Texas LPST open data online',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'TX TCEQ LPST',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
