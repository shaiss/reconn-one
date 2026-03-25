import initSqlJs, { type Database } from 'sql.js'
// Vite resolves WASM to a URL; sql.js browser build expects sql-wasm-browser.wasm next to the bundle.
import sqlWasmBrowserUrl from 'sql.js/dist/sql-wasm-browser.wasm?url'
import { DOSSIER_SEED } from './dossierSeedData.ts'
import type { DossierPayload } from './dossierTypes.ts'

const STORAGE_KEY = 'reconn-one-sqlite-v1'

export type CustomPersonaRow = {
  id: string
  label: string
  description: string
  icon: string
}

let initPromise: ReturnType<typeof initSqlJs> | null = null
let dbInstance: Database | null = null

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk) as unknown as number[])
  }
  return btoa(binary)
}

function base64ToUint8(b64: string): Uint8Array {
  const binary = atob(b64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function persist(): void {
  if (!dbInstance || typeof window === 'undefined') return
  const data = dbInstance.export() as Uint8Array
  try {
    localStorage.setItem(STORAGE_KEY, uint8ToBase64(data))
  } catch {
    // QuotaExceededError — leave DB in memory only
  }
}

/**
 * Browser SQLite (sql.js) with localStorage persistence. Used for app-side data such as custom personas.
 */
export async function getAppDatabase(): Promise<Database> {
  if (typeof window === 'undefined') {
    throw new Error('App database is browser-only')
  }
  if (dbInstance) return dbInstance

  if (!initPromise) {
    initPromise = initSqlJs({
      locateFile: (file) => (file.endsWith('.wasm') ? sqlWasmBrowserUrl : file),
    })
  }
  const SQL = await initPromise
  const raw = localStorage.getItem(STORAGE_KEY)
  dbInstance = raw ? new SQL.Database(base64ToUint8(raw)) : new SQL.Database()

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS custom_personas (
      id TEXT PRIMARY KEY NOT NULL,
      label TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS dossiers (
      account_slug TEXT PRIMARY KEY NOT NULL,
      payload TEXT NOT NULL
    );
  `)

  syncDossierSeed(dbInstance)

  return dbInstance
}

/**
 * Upserts all demo dossiers so AccountList / Dashboard slugs always resolve.
 * Uses INSERT OR REPLACE so existing DBs (including partially migrated localStorage)
 * get corrected on each cold load.
 */
function syncDossierSeed(db: Database): void {
  for (const [slug, payload] of Object.entries(DOSSIER_SEED)) {
    db.run('INSERT OR REPLACE INTO dossiers (account_slug, payload) VALUES (?, ?)', [
      slug,
      JSON.stringify(payload),
    ])
  }
  persist()
}

function readDossierPayloadCell(db: Database, slug: string): string | null {
  try {
    const stmt = db.prepare('SELECT payload FROM dossiers WHERE account_slug = ?', [slug])
    if (!stmt.step()) {
      stmt.free()
      return null
    }
    const row = stmt.getAsObject() as Record<string, unknown>
    stmt.free()
    const payload = row.payload
    return typeof payload === 'string' ? payload : null
  } catch {
    return null
  }
}

/**
 * Load deal-ready dossier JSON for an account slug (e.g. from /crm/dossier/:accountId).
 * Returns null if unknown slug or missing row.
 */
export async function getDossierByAccountSlug(accountSlug: string): Promise<DossierPayload | null> {
  const slug = accountSlug.trim().toLowerCase()
  if (!slug) return null

  const fallback = DOSSIER_SEED[slug]

  try {
    const db = await getAppDatabase()
    let json = readDossierPayloadCell(db, slug)

    if (!json && fallback) {
      db.run('INSERT OR REPLACE INTO dossiers (account_slug, payload) VALUES (?, ?)', [
        slug,
        JSON.stringify(fallback),
      ])
      persist()
      json = readDossierPayloadCell(db, slug)
    }

    if (json) {
      try {
        return JSON.parse(json) as DossierPayload
      } catch {
        /* corrupt JSON in DB */
      }
    }
  } catch (err) {
    console.warn('[reconn-one] SQLite / sql.js failed; using in-memory dossier seed if available.', err)
  }

  return fallback ?? null
}

export async function listCustomPersonas(): Promise<CustomPersonaRow[]> {
  const db = await getAppDatabase()
  const stmt = db.prepare(
    'SELECT id, label, description, icon FROM custom_personas ORDER BY datetime(created_at) ASC'
  )
  const rows: CustomPersonaRow[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject() as Record<string, string>
    rows.push({
      id: row.id,
      label: row.label,
      description: row.description,
      icon: row.icon,
    })
  }
  stmt.free()
  return rows
}

export async function insertCustomPersona(input: {
  label: string
  description: string
  icon: string
}): Promise<CustomPersonaRow> {
  const db = await getAppDatabase()
  const id = crypto.randomUUID()
  const label = input.label.trim()
  const description = input.description.trim()
  const icon = input.icon.trim() || 'person'
  db.run('INSERT INTO custom_personas (id, label, description, icon) VALUES (?, ?, ?, ?)', [
    id,
    label,
    description,
    icon,
  ])
  persist()
  return { id, label, description, icon }
}

export async function deleteCustomPersona(id: string): Promise<void> {
  const db = await getAppDatabase()
  db.run('DELETE FROM custom_personas WHERE id = ?', [id])
  persist()
}
