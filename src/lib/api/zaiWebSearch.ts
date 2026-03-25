/**
 * Z.AI Web Search — LLM-oriented web search for unstructured / hard-to-scrape signals.
 *
 * Use for Part B signals in the mapping doc: news, closure articles, municipal pages,
 * policy PDFs indexed on the web, etc. (not a substitute for dedicated APIs where they exist.)
 *
 * Docs: https://docs.z.ai/api-reference/tools/web-search
 * API key: https://z.ai/manage-apikey/apikey-list
 *
 * Security: `VITE_*` vars ship to the browser. For production, call Z.AI from a backend proxy.
 */

import type { ApiHealthResult } from './types.ts'

const ENDPOINT = 'https://api.z.ai/api/paas/v4/web_search'

export type ZaiSearchEngine = 'search-prime'

export type ZaiWebSearchRequest = {
  search_engine: ZaiSearchEngine
  search_query: string
  /** 1–50; default 10 per API docs */
  count?: number
  request_id?: string
  user_id?: string
}

export type ZaiWebSearchHit = {
  title?: string
  content?: string
  link?: string
  media?: string
  icon?: string
  refer?: string
  publish_date?: string
}

export type ZaiWebSearchResponse = {
  id?: string
  created?: number
  search_result?: ZaiWebSearchHit[]
}

type ZaiApiError = { code?: number; message?: string }

export function zaiApiKey(): string {
  return import.meta.env.VITE_ZAI_API_KEY ?? ''
}

async function postSearch(body: ZaiWebSearchRequest): Promise<ZaiWebSearchResponse> {
  const key = zaiApiKey()
  if (!key) throw new Error('VITE_ZAI_API_KEY is not set')

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = (await res.json()) as ZaiWebSearchResponse & ZaiApiError
  if (!res.ok) {
    const msg = data.message ?? res.statusText
    throw new Error(`Z.AI ${res.status}: ${msg}`)
  }
  if (data.code != null && data.message) {
    throw new Error(`Z.AI ${data.code}: ${data.message}`)
  }
  return data
}

/**
 * Run a web search (default engine: `search-prime`).
 */
export async function webSearch(
  query: string,
  options?: { count?: number; engine?: ZaiSearchEngine },
): Promise<ZaiWebSearchHit[]> {
  const data = await postSearch({
    search_engine: options?.engine ?? 'search-prime',
    search_query: query,
    count: options?.count != null ? Math.min(50, Math.max(1, options.count)) : undefined,
  })
  return data.search_result ?? []
}

export async function healthCheck(): Promise<ApiHealthResult> {
  if (!zaiApiKey()) {
    return {
      source: 'Z.AI Web Search',
      status: 'no_key',
      message: 'VITE_ZAI_API_KEY not configured',
    }
  }
  const t0 = performance.now()
  try {
    const hits = await webSearch('EPA brownfield program', { count: 1 })
    if (!Array.isArray(hits)) throw new Error('Invalid response shape')
    return {
      source: 'Z.AI Web Search',
      status: 'connected',
      message: 'Web search API responding',
      latencyMs: Math.round(performance.now() - t0),
    }
  } catch (err) {
    return {
      source: 'Z.AI Web Search',
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - t0),
    }
  }
}
