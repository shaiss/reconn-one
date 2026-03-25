/** Deal-ready dossier payload stored per account in app SQLite. */

export type DossierSentiment = 'positive' | 'neutral' | 'negative'

export type DossierStakeholder = {
  id: string
  initials: string
  name: string
  title: string
  role: string
  sentiment: DossierSentiment
  indented?: boolean
  champion?: boolean
}

export type DossierNewsItem = { id: string; age: string; text: string }

export type DossierWhyNow = { id: string; lead: string; body: string }

export type DossierObjection = { id: string; blocker: string; response: string }

export type DossierPayload = {
  /** Optional; shown under breadcrumb when set */
  displayName?: string
  firmographics: { label: string; value: string }[]
  techStack: string[]
  news: DossierNewsItem[]
  whyNowSignals: DossierWhyNow[]
  /** e.g. "High Intent", "Watchlist" */
  whyNowBadge?: string
  talkTrack: string
  objections: DossierObjection[]
  stakeholders: DossierStakeholder[]
}
