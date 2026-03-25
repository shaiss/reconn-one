/**
 * FHWA Alternative Fuel Corridors — ArcGIS FeatureServer client.
 *
 * Endpoint: https://services1.arcgis.com/4yjifSiIG17X0gW4/ArcGIS/rest/services/Alternative_Fuel_Corridors/FeatureServer
 *
 * Fully public — no API key required.
 */

import type { ApiHealthResult, FHWACorridor } from './types.ts'

const BASE =
  'https://services1.arcgis.com/4yjifSiIG17X0gW4/ArcGIS/rest/services/Alternative_Fuel_Corridors/FeatureServer/0/query'

type ArcGISAttributes = Record<string, string | number | null>
type ArcGISFeature = { attributes: ArcGISAttributes }
type ArcGISResponse = { features?: ArcGISFeature[] }

function mapCorridor(feat: ArcGISFeature): FHWACorridor {
  const a = feat.attributes
  return {
    objectId: Number(a['OBJECTID'] ?? a['ObjectId'] ?? 0),
    routeName: String(a['Route_Name'] ?? a['ROUTE_NAME'] ?? ''),
    corridorName: a['Corridor_Name'] ? String(a['Corridor_Name']) : null,
    fuelType: String(a['Fuel_Type'] ?? a['FUEL_TYPE'] ?? ''),
    status: String(a['Status'] ?? a['STATUS'] ?? ''),
    roundDesignated: a['Round_Designated'] ? String(a['Round_Designated']) : null,
  }
}

/**
 * Query EV-designated corridors by state (2-letter code).
 * Filters to Electric fuel type only.
 */
export async function fetchCorridorsByState(
  state: string,
  limit = 100,
): Promise<FHWACorridor[]> {
  const params = new URLSearchParams({
    where: `State='${state.toUpperCase()}' AND Fuel_Type='Electric'`,
    outFields: '*',
    resultRecordCount: String(Math.min(limit, 2000)),
    f: 'json',
  })
  const res = await fetch(`${BASE}?${params.toString()}`)
  if (!res.ok) throw new Error(`FHWA ArcGIS ${res.status}: ${res.statusText}`)
  const data = (await res.json()) as ArcGISResponse
  return (data.features ?? []).map(mapCorridor)
}

/**
 * Query corridors near a point (spatial query).
 * Uses a simple envelope buffer in decimal degrees (~0.15° ≈ 10 mi).
 */
export async function fetchCorridorsNear(
  lat: number,
  lng: number,
  bufferDeg = 0.15,
): Promise<FHWACorridor[]> {
  const params = new URLSearchParams({
    geometry: JSON.stringify({
      xmin: lng - bufferDeg,
      ymin: lat - bufferDeg,
      xmax: lng + bufferDeg,
      ymax: lat + bufferDeg,
      spatialReference: { wkid: 4326 },
    }),
    geometryType: 'esriGeometryEnvelope',
    spatialRel: 'esriSpatialRelIntersects',
    where: "Fuel_Type='Electric'",
    outFields: '*',
    f: 'json',
  })
  const res = await fetch(`${BASE}?${params.toString()}`)
  if (!res.ok) throw new Error(`FHWA ArcGIS ${res.status}: ${res.statusText}`)
  const data = (await res.json()) as ArcGISResponse
  return (data.features ?? []).map(mapCorridor)
}

/**
 * Quick health check — fetches 1 feature to verify service availability.
 */
export async function healthCheck(): Promise<ApiHealthResult> {
  const t0 = performance.now()
  try {
    const params = new URLSearchParams({
      where: '1=1',
      outFields: 'OBJECTID',
      resultRecordCount: '1',
      f: 'json',
    })
    const res = await fetch(`${BASE}?${params.toString()}`)
    if (!res.ok) throw new Error(`${res.status}`)
    return {
      source: 'FHWA Corridors',
      status: 'connected',
      message: 'Alt-Fuel Corridors service online',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'FHWA Corridors',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
