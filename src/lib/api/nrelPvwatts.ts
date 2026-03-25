/**
 * NREL PVWatts API v8 — estimated AC energy production for a fixed system at lat/lon.
 *
 * Docs: https://developer.nrel.gov/docs/solar/pvwatts/v8/
 */

import { nrelApiKey, nrelFetchJson } from './nrelClient.ts'
import type { ApiHealthResult } from './types.ts'

export type PVWattsResult = {
  ac_annual?: number
  capacity_factor?: number
  solrad_annual?: number
}

export async function fetchPVWattsAnnual(params: {
  lat: number
  lon: number
  systemCapacityKw?: number
  tilt?: number
  azimuth?: number
}): Promise<PVWattsResult> {
  const {
    lat,
    lon,
    systemCapacityKw = 4,
    tilt = 20,
    azimuth = 180,
  } = params
  const data = await nrelFetchJson<{ outputs?: PVWattsResult }>('/api/pvwatts/v8.json', {
    lat: String(lat),
    lon: String(lon),
    system_capacity: String(systemCapacityKw),
    azimuth: String(azimuth),
    tilt: String(tilt),
    array_type: '1',
    module_type: '0',
    losses: '14',
  })
  return data.outputs ?? {}
}

export async function healthCheck(): Promise<ApiHealthResult> {
  const key = nrelApiKey()
  if (!key) {
    return { source: 'NREL PVWatts', status: 'no_key', message: 'VITE_NREL_API_KEY not configured' }
  }
  const t0 = performance.now()
  try {
    await nrelFetchJson<unknown>('/api/pvwatts/v8.json', {
      lat: '40',
      lon: '-105',
      system_capacity: '4',
      azimuth: '180',
      tilt: '20',
      array_type: '1',
      module_type: '0',
      losses: '14',
    })
    return {
      source: 'NREL PVWatts',
      status: 'connected',
      message: 'PVWatts v8 / NSRDB responding',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'NREL PVWatts',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
