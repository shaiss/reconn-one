/** Shared types for all data-source API clients. */

export type LatLng = { lat: number; lng: number }

export type ApiHealthStatus = 'connected' | 'error' | 'no_key' | 'pending'

export type ApiHealthResult = {
  source: string
  status: ApiHealthStatus
  message: string
  latencyMs?: number
}

// ── NREL / AFDC ──────────────────────────────────────────

export type AFDCStation = {
  id: number
  station_name: string
  street_address: string
  city: string
  state: string
  zip: string
  latitude: number
  longitude: number
  ev_level2_evse_num: number | null
  ev_dc_fast_num: number | null
  ev_connector_types: string[] | null
  ev_network: string | null
  status_code: string
  access_code: string
  date_last_confirmed: string | null
  facility_type: string | null
}

// ── EPA Envirofacts / ACRES ──────────────────────────────

export type EPABrownfieldSite = {
  program_id: string
  site_name: string
  city_name: string
  state_code: string
  zipcode: string
  latitude: number | null
  longitude: number | null
  assessment_type: string | null
  cleanup_status: string | null
  contaminant: string | null
}

// ── FHWA Alternative Fuel Corridors ──────────────────────

export type FHWACorridor = {
  objectId: number
  routeName: string
  corridorName: string | null
  fuelType: string
  status: string
  roundDesignated: string | null
}

// ── EJScreen / Justice40 ─────────────────────────────────

export type EJScreenResult = {
  stateAbbr: string
  totalPopulation: number
  percentMinority: number
  percentLowIncome: number
  percentLinguisticallyIsolated: number
  ejIndexes: Record<string, number>
  isDisadvantaged: boolean
}
