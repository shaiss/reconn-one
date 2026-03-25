/**
 * EPA UST Finder — national UST / LUST composite (ArcGIS hosted).
 *
 * Item: https://www.arcgis.com/home/item.html?id=88d551abd342485582c5ca4aac6ac0d6
 * Map:  https://gispub.epa.gov/ustfinder
 *
 * No API key. Layer 1 = Releases (LUST), Layer 0 = Facilities.
 */

import type { ApiHealthResult } from './types.ts'

const FEATURE_SERVER =
  'https://services.arcgis.com/cJ9YHowT8TU7DUyn/arcgis/rest/services/US_Underground_Storage_Tank_2019/FeatureServer'

type ArcGISFeature = { attributes: Record<string, string | number | null> }
type ArcGISResponse = { features?: ArcGISFeature[] }

async function queryLayer(layerId: number, params: Record<string, string>): Promise<ArcGISResponse> {
  const q = new URLSearchParams({ f: 'json', ...params })
  const res = await fetch(`${FEATURE_SERVER}/${layerId}/query?${q.toString()}`)
  if (!res.ok) throw new Error(`UST ArcGIS ${res.status}: ${res.statusText}`)
  return res.json() as Promise<ArcGISResponse>
}

export type USTRelease = {
  objectId: number
  attributes: Record<string, string | number | null>
}

/**
 * Query LUST / release points by 2-letter state (field name varies; try common EPA fields).
 */
export async function fetchReleasesByState(state: string, limit = 50): Promise<USTRelease[]> {
  const st = state.toUpperCase().replace(/'/g, "''")
  const data = await queryLayer(1, {
    where: `State='${st}'`,
    outFields: '*',
    resultRecordCount: String(Math.min(limit, 2000)),
  })
  return (data.features ?? []).map((f, i) => ({
    objectId: Number(f.attributes['OBJECTID'] ?? f.attributes['ObjectId'] ?? i),
    attributes: f.attributes,
  }))
}

export async function healthCheck(): Promise<ApiHealthResult> {
  const t0 = performance.now()
  try {
    await queryLayer(1, {
      where: '1=1',
      outFields: 'OBJECTID',
      resultRecordCount: '1',
    })
    return {
      source: 'EPA UST Finder',
      status: 'connected',
      message: 'National UST / LUST FeatureServer responding',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'EPA UST Finder',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
