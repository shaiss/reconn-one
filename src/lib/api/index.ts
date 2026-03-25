/**
 * Unified barrel export for all data-source API clients.
 */

export * from './types.ts'

export * as nrel from './nrel.ts'
export * as epa from './epa.ts'
export * as fhwa from './fhwa.ts'
export * as ejscreen from './ejscreen.ts'
export * as epaUst from './epaUst.ts'
export * as hud from './hud.ts'
export * as nrelUtilityRates from './nrelUtilityRates.ts'
export * as nrelPvwatts from './nrelPvwatts.ts'
export * as nyDecRemediation from './nyDecRemediation.ts'
export * as caDtscEnvirostor from './caDtscEnvirostor.ts'
export * as txTceqLpst from './txTceqLpst.ts'
export * as zaiWebSearch from './zaiWebSearch.ts'

// ── Aggregate health check ────────────────────────────────

import { healthCheck as nrelHealth } from './nrel.ts'
import { healthCheck as epaHealth } from './epa.ts'
import { healthCheck as fhwaHealth } from './fhwa.ts'
import { healthCheck as ejHealth } from './ejscreen.ts'
import { healthCheck as epaUstHealth } from './epaUst.ts'
import { healthCheck as hudHealth } from './hud.ts'
import { healthCheck as utilityRatesHealth } from './nrelUtilityRates.ts'
import { healthCheck as pvwattsHealth } from './nrelPvwatts.ts'
import { healthCheck as nyDecHealth } from './nyDecRemediation.ts'
import { healthCheck as caDtscHealth } from './caDtscEnvirostor.ts'
import { healthCheck as txLpstHealth } from './txTceqLpst.ts'
import { healthCheck as zaiWebSearchHealth } from './zaiWebSearch.ts'
import type { ApiHealthResult } from './types.ts'

/**
 * Run health checks against all configured data sources in parallel.
 */
export async function checkAllSources(): Promise<ApiHealthResult[]> {
  return Promise.all([
    nrelHealth(),
    epaHealth(),
    fhwaHealth(),
    ejHealth(),
    epaUstHealth(),
    hudHealth(),
    utilityRatesHealth(),
    pvwattsHealth(),
    nyDecHealth(),
    caDtscHealth(),
    txLpstHealth(),
    zaiWebSearchHealth(),
  ])
}
