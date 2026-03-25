/**
 * California DTSC — EnviroStor cleanup sites (ArcGIS FeatureServer export).
 *
 * Layer: Envirostor_Public_Data_Export / cleanupsites (0)
 * Public — no API key required.
 */

import type { ApiHealthResult } from './types.ts'

const QUERY_URL =
  'https://services3.arcgis.com/Oy2JTCD10wkoelxS/arcgis/rest/services/Envirostor_Public_Data_Export/FeatureServer/0/query'

type ArcGISAttributes = Record<string, string | number | null>
type ArcGISFeature = { attributes: ArcGISAttributes }
type ArcGISResponse = { features?: ArcGISFeature[]; error?: { message?: string } }

export type CAEnvirostorCleanupSite = {
  objectId: number
  envirostorId: string | null
  projectName: string | null
  address: string | null
  city: string | null
  county: string | null
  zip: string | null
  siteType: string | null
  status: string | null
  latitude: number | null
  longitude: number | null
}

function mapRow(feat: ArcGISFeature): CAEnvirostorCleanupSite {
  const a = feat.attributes
  return {
    objectId: Number(a['OBJECTID'] ?? 0),
    envirostorId: a['envirostor_id'] != null ? String(a['envirostor_id']) : null,
    projectName: a['project_name'] != null ? String(a['project_name']) : null,
    address: a['address'] != null ? String(a['address']) : null,
    city: a['city'] != null ? String(a['city']) : null,
    county: a['county'] != null ? String(a['county']) : null,
    zip: a['zip'] != null ? String(a['zip']) : null,
    siteType: a['site_type'] != null ? String(a['site_type']) : null,
    status: a['status'] != null ? String(a['status']) : null,
    latitude: a['latitude'] != null ? Number(a['latitude']) : null,
    longitude: a['longitude'] != null ? Number(a['longitude']) : null,
  }
}

async function query(params: URLSearchParams): Promise<CAEnvirostorCleanupSite[]> {
  const res = await fetch(`${QUERY_URL}?${params.toString()}`)
  if (!res.ok) throw new Error(`DTSC ArcGIS ${res.status}: ${res.statusText}`)
  const data = (await res.json()) as ArcGISResponse
  if (data.error?.message) throw new Error(data.error.message)
  return (data.features ?? []).map(mapRow)
}

/**
 * Cleanup sites whose centroid falls inside a WGS84 bounding box.
 */
export async function fetchCleanupSitesInExtent(
  minLng: number,
  minLat: number,
  maxLng: number,
  maxLat: number,
  limit = 100,
): Promise<CAEnvirostorCleanupSite[]> {
  const params = new URLSearchParams({
    geometry: JSON.stringify({
      xmin: minLng,
      ymin: minLat,
      xmax: maxLng,
      ymax: maxLat,
      spatialReference: { wkid: 4326 },
    }),
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    where: '1=1',
    outFields:
      'OBJECTID,envirostor_id,project_name,address,city,county,zip,site_type,status,latitude,longitude',
    resultRecordCount: String(Math.min(limit, 2000)),
    f: 'json',
  })
  return query(params)
}

export async function healthCheck(): Promise<ApiHealthResult> {
  const t0 = performance.now()
  try {
    const params = new URLSearchParams({
      where: '1=1',
      outFields: 'OBJECTID',
      resultRecordCount: '1',
      f: 'json',
    })
    const res = await fetch(`${QUERY_URL}?${params.toString()}`)
    if (!res.ok) throw new Error(`${res.status}`)
    const data = (await res.json()) as ArcGISResponse
    if (data.error?.message) throw new Error(data.error.message)
    if (!data.features?.length) throw new Error('No features returned')
    return {
      source: 'CA DTSC EnviroStor',
      status: 'connected',
      message: 'EnviroStor public export online',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'CA DTSC EnviroStor',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
