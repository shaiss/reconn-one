/**
 * HUD FHA Single-Family REO properties (ArcGIS FeatureServer, public).
 *
 * Data.gov: https://catalog.data.gov/dataset/fha-single-family-reo-properties-for-sale
 */

import type { ApiHealthResult } from './types.ts'

const QUERY_BASE =
  'https://services-nocdn.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/HUD%20REO%20Properties/FeatureServer/0/query'

type ArcGISResponse = { features?: unknown[] }

async function query(params: Record<string, string>): Promise<ArcGISResponse> {
  const q = new URLSearchParams({ f: 'json', ...params })
  const res = await fetch(`${QUERY_BASE}?${q.toString()}`)
  if (!res.ok) throw new Error(`HUD ${res.status}: ${res.statusText}`)
  return res.json() as Promise<ArcGISResponse>
}

export type HudReoProperty = {
  caseNum: string | null
  city: string | null
  stateCode: string | null
  zip: number | null
  lat: number | null
  lon: number | null
  address: string | null
}

function mapRow(a: Record<string, string | number | null>): HudReoProperty {
  return {
    caseNum: a['CASE_NUM'] != null ? String(a['CASE_NUM']) : null,
    city: a['CITY'] != null ? String(a['CITY']) : null,
    stateCode: a['STATE_CODE'] != null ? String(a['STATE_CODE']) : null,
    zip: a['DISPLAY_ZIP_CODE'] != null ? Number(a['DISPLAY_ZIP_CODE']) : null,
    lat: a['MAP_LATITUDE'] != null ? Number(a['MAP_LATITUDE']) : null,
    lon: a['MAP_LONGITUDE'] != null ? Number(a['MAP_LONGITUDE']) : null,
    address: a['ADDRESS'] != null ? String(a['ADDRESS']) : null,
  }
}

export async function fetchReoByState(state: string, limit = 50): Promise<HudReoProperty[]> {
  const st = state.toUpperCase().replace(/'/g, "''")
  const data = await query({
    where: `STATE_CODE='${st}'`,
    outFields: 'CASE_NUM,CITY,STATE_CODE,DISPLAY_ZIP_CODE,MAP_LATITUDE,MAP_LONGITUDE,ADDRESS',
    resultRecordCount: String(Math.min(limit, 2000)),
  })
  const feats = (data.features ?? []) as { attributes: Record<string, string | number | null> }[]
  return feats.map((f) => mapRow(f.attributes))
}

export async function healthCheck(): Promise<ApiHealthResult> {
  const t0 = performance.now()
  try {
    await query({
      where: '1=1',
      outFields: 'OBJECTID',
      resultRecordCount: '1',
    })
    return {
      source: 'HUD eGIS / REO',
      status: 'connected',
      message: 'FHA REO FeatureServer responding',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'HUD eGIS / REO',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
