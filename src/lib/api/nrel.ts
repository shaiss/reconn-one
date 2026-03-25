/**
 * NREL / AFDC Station Locator API client.
 *
 * Docs:  https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/
 * Signup: https://developer.nrel.gov/signup/  (free, instant key via email)
 *
 * NOTE — NREL is migrating to developer.nlr.gov by April 30 2026.
 */

import { nrelApiKey, nrelFetchJson } from './nrelClient.ts'
import type { AFDCStation, ApiHealthResult, LatLng } from './types.ts'

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  return nrelFetchJson<T>(`/api/alt-fuel-stations/v1${path}`, { format: 'JSON', ...params })
}

/**
 * Fetch EV stations near a location.
 * @param center  Lat/lng to search around
 * @param radiusMiles  Search radius (default 10)
 * @param limit  Max results (default 50, API max 200)
 */
export async function fetchNearbyStations(
  center: LatLng,
  radiusMiles = 10,
  limit = 50,
): Promise<AFDCStation[]> {
  const data = await get<{ fuel_stations: AFDCStation[] }>('.json', {
    fuel_type: 'ELEC',
    latitude: String(center.lat),
    longitude: String(center.lng),
    radius: String(radiusMiles),
    limit: String(Math.min(limit, 200)),
    status: 'E',
  })
  return data.fuel_stations ?? []
}

/**
 * Fetch stations by state code (2-letter).
 */
export async function fetchStationsByState(
  state: string,
  limit = 100,
): Promise<AFDCStation[]> {
  const data = await get<{ fuel_stations: AFDCStation[] }>('.json', {
    fuel_type: 'ELEC',
    state,
    limit: String(Math.min(limit, 200)),
    status: 'E',
  })
  return data.fuel_stations ?? []
}

/**
 * Quick health check — fetches 1 station to verify key + connectivity.
 */
export async function healthCheck(): Promise<ApiHealthResult> {
  const key = nrelApiKey()
  if (!key) {
    return { source: 'NREL / AFDC', status: 'no_key', message: 'VITE_NREL_API_KEY not configured' }
  }
  const t0 = performance.now()
  try {
    await get<unknown>('.json', { limit: '1', fuel_type: 'ELEC' })
    return {
      source: 'NREL / AFDC',
      status: 'connected',
      message: 'Station Locator API responding',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'NREL / AFDC',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
