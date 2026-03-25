/**
 * EPA Envirofacts REST API client — brownfield / ACRES data.
 *
 * Docs:  https://www.epa.gov/enviro/envirofacts-data-service-api
 * Model: https://www.epa.gov/enviro/acres-model
 *
 * Fully public — no API key required.
 */

import type { ApiHealthResult, EPABrownfieldSite } from './types.ts'

const BASE = 'https://data.epa.gov/efservice'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`EPA ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

type RawAcresSite = Record<string, string | number | null>

function mapSite(raw: RawAcresSite): EPABrownfieldSite {
  return {
    program_id: String(raw['HANDLER_ID'] ?? raw['PROGRAM_ID'] ?? ''),
    site_name: String(raw['SITE_NAME'] ?? raw['PRIMARY_NAME'] ?? ''),
    city_name: String(raw['CITY_NAME'] ?? ''),
    state_code: String(raw['STATE_CODE'] ?? raw['STATE_ABBR'] ?? ''),
    zipcode: String(raw['ZIP_CODE'] ?? ''),
    latitude: raw['LATITUDE83'] != null ? Number(raw['LATITUDE83']) : null,
    longitude: raw['LONGITUDE83'] != null ? Number(raw['LONGITUDE83']) : null,
    assessment_type: raw['ASSESSMENT_TYPE'] ? String(raw['ASSESSMENT_TYPE']) : null,
    cleanup_status: raw['CLEANUP_STATUS'] ? String(raw['CLEANUP_STATUS']) : null,
    contaminant: raw['CONTAMINANT_NAME'] ? String(raw['CONTAMINANT_NAME']) : null,
  }
}

/**
 * Search ACRES brownfield sites by state code.
 * @param state  2-letter state abbreviation (e.g. "NY")
 * @param rows   Max rows to return (default 100)
 */
export async function fetchBrownfieldsByState(
  state: string,
  rows = 100,
): Promise<EPABrownfieldSite[]> {
  const data = await get<RawAcresSite[]>(
    `/ACRES.ACRES_SITES/STATE_CODE/${state.toUpperCase()}/rows/0:${rows}/JSON`,
  )
  return (data ?? []).map(mapSite)
}

/**
 * Search ACRES brownfield sites by ZIP code.
 */
export async function fetchBrownfieldsByZip(
  zip: string,
  rows = 100,
): Promise<EPABrownfieldSite[]> {
  const data = await get<RawAcresSite[]>(
    `/ACRES.ACRES_SITES/ZIP_CODE/${zip}/rows/0:${rows}/JSON`,
  )
  return (data ?? []).map(mapSite)
}

/**
 * Quick connectivity check — pulls 1 row from the ACRES table.
 */
export async function healthCheck(): Promise<ApiHealthResult> {
  const t0 = performance.now()
  try {
    await get<unknown>('/ACRES.ACRES_SITES/rows/0:1/JSON')
    return {
      source: 'EPA Envirofacts',
      status: 'connected',
      message: 'ACRES brownfield data available',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'EPA Envirofacts',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
