/**
 * Shared NREL Developer Network (NLR) HTTP helper.
 * Same API key powers AFDC, Utility Rates, PVWatts, and other NREL endpoints.
 */

export function nrelApiKey(): string {
  return import.meta.env.VITE_NREL_API_KEY ?? ''
}

export async function nrelFetchJson<T>(apiPath: string, params: Record<string, string> = {}): Promise<T> {
  const key = nrelApiKey()
  if (!key) throw new Error('VITE_NREL_API_KEY is not set')

  const url = new URL(`https://developer.nlr.gov${apiPath.startsWith('/') ? '' : '/'}${apiPath}`)
  url.searchParams.set('api_key', key)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`NREL ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}
