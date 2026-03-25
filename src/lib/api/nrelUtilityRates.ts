/**
 * NREL Utility Rates API v3 — average $/kWh by sector for a lat/lon.
 *
 * Docs: https://developer.nrel.gov/docs/electricity/utility-rates-v3/
 * Data is dated (2012 Ventyx); useful for rough tariff screening.
 */

import { nrelApiKey, nrelFetchJson } from './nrelClient.ts'
import type { ApiHealthResult } from './types.ts'

export type UtilityRatesOutput = {
  utility_name?: string
  company_id?: string
  residential?: number
  commercial?: number
  industrial?: number
  utility_info?: { company_id: string; utility_name: string }[]
}

export async function fetchUtilityRates(lat: number, lon: number, radiusMiles = 0): Promise<UtilityRatesOutput> {
  const data = await nrelFetchJson<{ outputs?: UtilityRatesOutput }>('/api/utility_rates/v3.json', {
    lat: String(lat),
    lon: String(lon),
    radius: String(radiusMiles),
  })
  return data.outputs ?? {}
}

export async function healthCheck(): Promise<ApiHealthResult> {
  const key = nrelApiKey()
  if (!key) {
    return { source: 'NREL Utility Rates', status: 'no_key', message: 'VITE_NREL_API_KEY not configured' }
  }
  const t0 = performance.now()
  try {
    await nrelFetchJson<unknown>('/api/utility_rates/v3.json', {
      lat: '35.45',
      lon: '-82.98',
    })
    return {
      source: 'NREL Utility Rates',
      status: 'connected',
      message: 'Utility rates v3 responding (2012 baseline data)',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'NREL Utility Rates',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
