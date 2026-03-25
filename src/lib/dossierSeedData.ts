import type { DossierPayload } from './dossierTypes.ts'

/** Seed dossiers keyed by account slug (matches Dashboard / AccountList routes). */
export const DOSSIER_SEED: Record<string, DossierPayload> = {
  greencharge: {
    displayName: 'GreenCharge Networks',
    firmographics: [
      { label: 'Industry', value: 'CPO / Site Developer' },
      { label: 'Employees', value: '85–120' },
      { label: 'Revenue', value: '$18M ARR (2025 est.)' },
      { label: 'HQ', value: 'Columbus, OH' },
      { label: 'Active Sites', value: '45 (OH, PA, IN)' },
      { label: 'Primary Hardware', value: 'BTC Power 150 kW' },
    ],
    techStack: ['OCPP 2.0.1', 'ChargePoint Network', 'BTC Power 150 kW'],
    news: [
      {
        id: 'gc-n1',
        age: '2 days ago',
        text: 'Awarded 8 new NEVI-funded sites along I-70/I-71 Ohio corridor (Q1 2026).',
      },
      {
        id: 'gc-n2',
        age: '1 week ago',
        text: 'AFDC data shows 2 existing sites averaging ~18% downtime over the last 30 days.',
      },
      {
        id: 'gc-n3',
        age: '3 weeks ago',
        text: 'Hired Director of Site Development from EVgo; expanding Midwest footprint.',
      },
    ],
    whyNowBadge: 'High Intent',
    whyNowSignals: [
      {
        id: 'gc-w1',
        lead: 'NEVI Funding Received:',
        body: 'Eight new corridor sites in Ohio need hardware procurement in the next ~60 days per construction permit timeline.',
      },
      {
        id: 'gc-w2',
        lead: 'Current Vendor Downtime:',
        body: 'BTC Power units on two legacy sites show ~18% downtime — NEVI compliance and uptime SLAs are at risk.',
      },
      {
        id: 'gc-w3',
        lead: 'Expansion Hiring:',
        body: 'New Director of Site Development signals accelerated procurement and rollout cadence.',
      },
    ],
    talkTrack: `Hi Sarah — congrats on the Ohio NEVI bundle. We pulled AFDC utilization on your existing BTC Power footprint: two sites are averaging ~18% downtime, which is exactly where operators get dinged on NEVI-style uptime expectations.

Our [product] is built for that reliability gap — field data shows [X]% fewer hard faults vs. your current stack on comparable 150 kW posts. Worth 15 minutes to walk through how we de-risk the next 8 sites before procurement locks?`,
    objections: [
      {
        id: 'gc-o1',
        blocker: '"We\'re locked into BTC Power through 2027."',
        response:
          'Lead with warranty / swap-out and phased corridor rollout: use AFDC downtime as leverage for pilot replacements on the worst two sites without ripping the whole contract.',
      },
      {
        id: 'gc-o2',
        blocker: '"Remediation on two sites isn\'t complete yet."',
        response:
          'Reference NY DEC / state VCP NFA timeline from open data; position hardware selection now so procurement is ready the moment construction green-lights.',
      },
    ],
    stakeholders: [
      {
        id: 'gc-s1',
        initials: 'SC',
        name: 'Sarah Chen',
        title: 'VP Procurement',
        role: 'Champion',
        sentiment: 'positive',
        champion: true,
      },
      {
        id: 'gc-s2',
        initials: 'MR',
        name: 'Mark Rivera',
        title: 'Director of Site Development',
        role: 'Economic Buyer',
        sentiment: 'neutral',
        indented: true,
      },
      {
        id: 'gc-s3',
        initials: 'DP',
        name: 'David Park',
        title: 'Head of Network Operations',
        role: 'Blocker (incumbent vendor)',
        sentiment: 'negative',
        indented: true,
      },
    ],
  },

  americharge: {
    displayName: 'AmeriCharge Holdings',
    firmographics: [
      { label: 'Industry', value: 'CPO (National rollup)' },
      { label: 'Employees', value: '420–550' },
      { label: 'Revenue', value: '$94M ARR (2024)' },
      { label: 'HQ', value: 'Dallas, TX' },
      { label: 'Active Sites', value: '214 (multi-state)' },
      { label: 'Primary Hardware', value: 'Mixed OEM (legacy dominant)' },
    ],
    techStack: ['OCPP 1.6J', 'Multi-network NOC', 'ABB + Tritium + legacy ABB'],
    news: [
      {
        id: 'ac-n1',
        age: '1 day ago',
        text: 'AFDC aggregate: 14 sites flagged with >15% reported downtime in rolling 90-day window.',
      },
      {
        id: 'ac-n2',
        age: '5 days ago',
        text: 'Investor deck leak: board pushing “fleet reliability reset” before Q4 board meeting.',
      },
      {
        id: 'ac-n3',
        age: '2 weeks ago',
        text: 'Master service agreement with incumbent OEM up for renewal in Q3 — legal review started.',
      },
    ],
    whyNowBadge: 'High Intent',
    whyNowSignals: [
      {
        id: 'ac-w1',
        lead: 'Rip-and-replace window:',
        body: 'Contract renewal + chronic downtime creates a rare opening to standardize on a single hardware line without a full rip in one quarter.',
      },
      {
        id: 'ac-w2',
        lead: 'Capital partner pressure:',
        body: 'Lenders tied to NEVI-backed sites are asking for documented uptime plans; status quo is a covenant risk.',
      },
      {
        id: 'ac-w3',
        lead: 'Field ops cost spike:',
        body: 'Truck rolls and spare parts spend up 31% YoY on oldest 40 sites — COO flagged in internal ops review.',
      },
    ],
    talkTrack: `Hi James — we modeled your 214-site footprint against AFDC downtime clusters. Fourteen sites are driving a disproportionate share of truck rolls.

We're seeing operators in your situation use a phased swap on the worst quartile first, fund it from O&M savings, then negotiate fleet pricing on the rest. Open to a 20-minute working session with your VP Ops and procurement?`,
    objections: [
      {
        id: 'ac-o1',
        blocker: '"We can\'t take all chargers offline during tourist season."',
        response: 'Propose lane-by-lane or overnight cutovers; reference peer CPO playbook with zero full-site shutdowns.',
      },
      {
        id: 'ac-o2',
        blocker: '"Our NOC already monitors everything."',
        response: 'Acknowledge — pivot to mean-time-to-restore and parts interoperability; bring third-party MTTR benchmarks for same OEM generation.',
      },
    ],
    stakeholders: [
      {
        id: 'ac-s1',
        initials: 'JW',
        name: 'James Whitaker',
        title: 'VP Operations',
        role: 'Champion',
        sentiment: 'positive',
        champion: true,
      },
      {
        id: 'ac-s2',
        initials: 'LN',
        name: 'Lisa Nguyen',
        title: 'VP Procurement',
        role: 'Economic Buyer',
        sentiment: 'neutral',
        indented: true,
      },
      {
        id: 'ac-s3',
        initials: 'RK',
        name: 'Robert Kim',
        title: 'Head of NOC',
        role: 'Blocker (tooling lock-in)',
        sentiment: 'negative',
        indented: true,
      },
    ],
  },

  peakvolt: {
    displayName: 'PeakVolt Energy',
    firmographics: [
      { label: 'Industry', value: 'Site Developer / IPP-adjacent' },
      { label: 'Employees', value: '34–48' },
      { label: 'Pipeline', value: '12 DCFC hubs (Northeast)' },
      { label: 'HQ', value: 'Albany, NY' },
      { label: 'Active Sites', value: '3 operating, 9 in development' },
      { label: 'Brownfield focus', value: 'Former retail / petroleum-adjacent parcels' },
    ],
    techStack: ['Procore', 'ArcGIS Online', 'NY Open Data (DEC)', 'Interconnection queue trackers'],
    news: [
      {
        id: 'pv-n1',
        age: '3 days ago',
        text: 'NY DEC: NFA issued for 401 Main St — site cleared for vertical construction.',
      },
      {
        id: 'pv-n2',
        age: '1 week ago',
        text: 'City planning staff report: conditional use approved for 6-port DCFC + canopy.',
      },
      {
        id: 'pv-n3',
        age: '2 weeks ago',
        text: 'Submitted interconnect pre-application for 3.2 MW nameplate (utility scoping response pending).',
      },
    ],
    whyNowBadge: 'Construction gate',
    whyNowSignals: [
      {
        id: 'pv-w1',
        lead: 'NFA + permits aligned:',
        body: 'Hardware and EPC packages typically lock within 45 days of NFA — you are in the procurement sweet spot.',
      },
      {
        id: 'pv-w2',
        lead: 'Brownfield narrative:',
        body: 'Municipal staff favor vendors with documented vapor / IC awareness — your messaging should lead with cap-compatible layouts.',
      },
      {
        id: 'pv-w3',
        lead: 'Utility queue:',
        body: 'Feeder upgrade estimate came back under budget; developer is accelerating bid collection for switchgear + DCFC.',
      },
    ],
    talkTrack: `Hi Elena — saw the NFA hit on 401 Main. That usually means you’re about to freeze DCFC specs for the EPC package.

We specialize in brownfield pads where trenching and canopy loads interact with ICs — happy to share a one-pager our engineers use with AHJs in NY. Worth a quick call before you issue the RFP?`,
    objections: [
      {
        id: 'pv-o1',
        blocker: '"EPC is already married to a single charger brand."',
        response: 'Offer alternate-compliant spec sheet and owner-direct procurement split (switchgear vs. dispensers).',
      },
      {
        id: 'pv-o2',
        blocker: '"We need UL listings and AHJ sign-off fast."',
        response: 'Bring stamped single-line examples from three comparable NY counties; offer PE intro call.',
      },
    ],
    stakeholders: [
      {
        id: 'pv-s1',
        initials: 'EM',
        name: 'Elena Morales',
        title: 'Director of Development',
        role: 'Champion',
        sentiment: 'positive',
        champion: true,
      },
      {
        id: 'pv-s2',
        initials: 'GT',
        name: 'Greg Torres',
        title: 'VP Construction',
        role: 'Technical gate',
        sentiment: 'neutral',
        indented: true,
      },
      {
        id: 'pv-s3',
        initials: 'AF',
        name: 'Amy Frost',
        title: 'Legal / Land',
        role: 'Risk reviewer',
        sentiment: 'neutral',
        indented: true,
      },
    ],
  },

  'rivian-fleet': {
    displayName: 'Rivian Fleet Services',
    firmographics: [
      { label: 'Industry', value: 'OEM captive fleet charging' },
      { label: 'Depot locations', value: '22 (US)' },
      { label: 'RFP status', value: 'DCFC + load management (Phase 2)' },
      { label: 'HQ', value: 'Irvine, CA' },
      { label: 'Connector standard', value: 'NACS primary; CCS legacy depots' },
      { label: 'Timeline', value: 'Vendor down-select Q3' },
    ],
    techStack: ['Fleet telematics APIs', 'OCPP 2.0.1 pilot', 'Site load controllers'],
    news: [
      {
        id: 'rf-n1',
        age: '4 days ago',
        text: 'RFP amendment: added requirement for depot peak-shaving integration with on-site BESS optionality.',
      },
      {
        id: 'rf-n2',
        age: '10 days ago',
        text: 'Pilot depot (AZ) completed 6-month uptime report — cited as baseline for national RFP scoring.',
      },
      {
        id: 'rf-n3',
        age: '3 weeks ago',
        text: 'Sustainability report emphasized 99.5% session-start success target for fleet depots.',
      },
    ],
    whyNowBadge: 'RFP active',
    whyNowSignals: [
      {
        id: 'rf-w1',
        lead: 'Structured evaluation:',
        body: 'Scoring rubric weights uptime history and API depth — good fit if you bring referenceable fleet depots.',
      },
      {
        id: 'rf-w2',
        lead: 'Load management:',
        body: 'Amendment signals they will shortlist vendors who can co-sell DERMS-friendly power caps.',
      },
      {
        id: 'rf-w3',
        lead: 'Competitive set:',
        body: 'Only two incumbents have NACS-native field history at this scale — window for a third entrant.',
      },
    ],
    talkTrack: `Hi Morgan — congrats on tightening the RFP around peak-shaving. We’ve deployed the same controller stack at two Class-8-style depots with OCPP 2.0.1 and fleet SSO.

Happy to share anonymized uptime + API latency metrics that map directly to your scoring sheet. 15 minutes with you and grid integration lead?`,
    objections: [
      {
        id: 'rf-o1',
        blocker: '"We standardize on one OEM globally."',
        response: 'Position as qualified second source for Americas depots only; offer shared spare-pool MOU.',
      },
      {
        id: 'rf-o2',
        blocker: '"Security review will take months."',
        response: 'Offer pre-filled SOC2 + pen-test package from last fleet win; propose parallel track with InfoSec.',
      },
    ],
    stakeholders: [
      {
        id: 'rf-s1',
        initials: 'MH',
        name: 'Morgan Hayes',
        title: 'Fleet Operations Manager',
        role: 'Champion',
        sentiment: 'positive',
        champion: true,
      },
      {
        id: 'rf-s2',
        initials: 'DL',
        name: 'Devon Liu',
        title: 'Sr. Manager, Energy & Charging',
        role: 'Economic Buyer',
        sentiment: 'neutral',
        indented: true,
      },
      {
        id: 'rf-s3',
        initials: 'SK',
        name: 'Sam Klein',
        title: 'IT / Security Architecture',
        role: 'Gate (SSO / SCADA)',
        sentiment: 'negative',
        indented: true,
      },
    ],
  },

  'tristate-corridor': {
    displayName: 'TriState EV Corridor Group',
    firmographics: [
      { label: 'Industry', value: 'Transit authority JV / corridor CPO' },
      { label: 'Stakeholders', value: '3 DOTs + 2 MPOs' },
      { label: 'Sites in bundle', value: '8 highway-adjacent' },
      { label: 'HQ', value: 'Harrisburg, PA' },
      { label: 'Funding', value: 'State + federal corridor mix' },
      { label: 'Status', value: 'Procurement paused (30d signal gap)' },
    ],
    techStack: ['Socrata open data', 'NEVI corridor GIS layers', 'Shared PMO (Smartsheet)'],
    news: [
      {
        id: 'ts-n1',
        age: '18 days ago',
        text: 'Joint committee minutes: “re-baseline hardware spec” after supplier lead times slipped.',
      },
      {
        id: 'ts-n2',
        age: '24 days ago',
        text: 'No new RFQ amendments published — watchdog site notes activity stall vs. peer states.',
      },
      {
        id: 'ts-n3',
        age: '5 weeks ago',
        text: 'Advocacy group op-ed pushed for standardized NACS pull-through layout on interstate sites.',
      },
    ],
    whyNowBadge: 'Watchlist',
    whyNowSignals: [
      {
        id: 'ts-w1',
        lead: 'Quiet period ≠ dead deal:',
        body: 'JV procurement often pauses during fiscal reconciliations — ideal time to shape spec without a live RFP clock.',
      },
      {
        id: 'ts-w2',
        lead: 'Political cover:',
        body: 'Standardization narrative (NACS, single maintenance contract) helps PMO sell internally after lead-time shock.',
      },
      {
        id: 'ts-w3',
        lead: 'Competitor fatigue:',
        body: 'Incumbent OEM burned trust on delivery dates; window to insert credible alternative with domestic lead-time story.',
      },
    ],
    talkTrack: `Hi Patricia — read the committee minutes on re-baselining specs. We’ve helped two multistate JVs compress vendor count and get predictable ship dates without reopening environmental review.

If helpful, we can leave a one-slide “standardized corridor kit” you can drop into the next interagency packet — no obligation.`,
    objections: [
      {
        id: 'ts-o1',
        blocker: '"We can\'t favor one vendor across three states."',
        response: 'Frame as performance-based spec + multi-award IDIQ; you stay compliant with competitive norms.',
      },
      {
        id: 'ts-o2',
        blocker: '"Federal strings restrict how we buy."',
        response: 'Offer NEVI-compliant reference configurations with Buy America documentation pre-cleared.',
      },
    ],
    stakeholders: [
      {
        id: 'ts-s1',
        initials: 'PC',
        name: 'Patricia Cole',
        title: 'Corridor Program Director',
        role: 'Influencer',
        sentiment: 'neutral',
        champion: true,
      },
      {
        id: 'ts-s2',
        initials: 'BW',
        name: 'Brian Wu',
        title: 'State DOT Procurement Lead',
        role: 'Economic Buyer',
        sentiment: 'neutral',
        indented: true,
      },
      {
        id: 'ts-s3',
        initials: 'JR',
        name: 'Jan Ruiz',
        title: 'MPO Liaison',
        role: 'Watchdog (equity / access)',
        sentiment: 'negative',
        indented: true,
      },
    ],
  },

  crossgrid: {
    displayName: 'CrossGrid Power',
    firmographics: [
      { label: 'Industry', value: 'Grid-adjacent developer / queue shop' },
      { label: 'Employees', value: '62–78' },
      { label: 'Active interconnection projects', value: '14 (CA, TX, AZ)' },
      { label: 'HQ', value: 'San Diego, CA' },
      { label: 'Sweet spot', value: '6–12 port DCFC on constrained feeders' },
      { label: 'Data moat', value: 'GRIP / queue scrape + transformer sizing models' },
    ],
    techStack: ['Utility capacity APIs', 'Python queue ETL', 'Partner EPC roster'],
    news: [
      {
        id: 'cg-n1',
        age: '1 day ago',
        text: 'PG&E GRIP refresh: feeder 1192 now shows 2.4 MW headroom — matches CrossGrid parcel shortlist.',
      },
      {
        id: 'cg-n2',
        age: '6 days ago',
        text: 'Closed land control on Bakersfield infill; targeting co-located BESS + 6x350kW.',
      },
      {
        id: 'cg-n3',
        age: '2 weeks ago',
        text: 'Hired former utility DER interconnection lead as VP Grid Strategy.',
      },
    ],
    whyNowBadge: 'Grid unlock',
    whyNowSignals: [
      {
        id: 'cg-w1',
        lead: 'Hosting proof:',
        body: 'They can show developers “green feeder” maps — partners who align hardware VA profiles win preferred EPC slots.',
      },
      {
        id: 'cg-w2',
        lead: 'BESS bundling:',
        body: 'New hire signals shift toward hybrid sites; inverter/charger coordination is the new buying conversation.',
      },
      {
        id: 'cg-w3',
        lead: 'Speed:',
        body: 'Parcel option windows are 90 days — equipment letters of intent needed before financial close.',
      },
    ],
    talkTrack: `Hi Victor — congrats on the GRIP match for 1192. We’re seeing hybrid sites fail when the PCS and DCFC load steps don’t match utility models.

We can run a 30-minute desk review with your new VP Grid Strategy and leave you with a one-line diagram utilities rarely push back on. Good next week?`,
    objections: [
      {
        id: 'cg-o1',
        blocker: '"EPC picks the charger — we\'re wires-only."',
        response: 'Offer white-label spec support EPCs can paste into RFP; you stay vendor-neutral on paper.',
      },
      {
        id: 'cg-o2',
        blocker: '"Utility may re-run the study."',
        response: 'Lead with conservative VA envelope + soft-start configs that survive sensitivity runs.',
      },
    ],
    stakeholders: [
      {
        id: 'cg-s1',
        initials: 'VR',
        name: 'Victor Ramos',
        title: 'VP Development',
        role: 'Champion',
        sentiment: 'positive',
        champion: true,
      },
      {
        id: 'cg-s2',
        initials: 'NS',
        name: 'Nina Shah',
        title: 'VP Grid Strategy',
        role: 'Technical buyer',
        sentiment: 'positive',
        indented: true,
      },
      {
        id: 'cg-s3',
        initials: 'CH',
        name: 'Chris Holt',
        title: 'Head of Finance',
        role: 'Cap / ROI gate',
        sentiment: 'neutral',
        indented: true,
      },
    ],
  },
}
