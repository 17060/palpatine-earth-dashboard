import React from "react";
import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Link,
  PieChart,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type DomainKey =
  | "overview"
  | "economy"
  | "military"
  | "nuclear"
  | "diplomacy"
  | "technology"
  | "demographics"
  | "climate"
  | "firstContact";

type Power = {
  rank: number;
  name: string;
  vulcanDesignation: string;
  gdpTrillion: number;
  gdpSharePct: number;
  instabilityIndex: number;
  vulcanNote: string;
};

type TopicBrief = {
  title: string;
  metric: string;
  vulcanRead: string;
  source: string;
};

type LogicalVerdict = {
  title: string;
  verdict: string;
  tone: "info" | "warning" | "danger" | "success";
};

const US_MILEX_BILLION = 921;
const US_MILEX_SHARE = 35.2;
const NUCLEAR_TOTAL = 12187;
const NUCLEAR_DEPLOYED = 4012;
const NUCLEAR_HIGH_ALERT = 2100;

const GDP_POWERS: Power[] = [
  {
    rank: 1,
    name: "United States",
    vulcanDesignation: "The Bipolar Republic",
    gdpTrillion: 32.38,
    gdpSharePct: 25.6,
    instabilityIndex: 7.2,
    vulcanNote:
      "Highest aggregate output, lowest governance coherence. Electoral cycles produce policy oscillation — logically suboptimal for long-range planning.",
  },
  {
    rank: 2,
    name: "China",
    vulcanDesignation: "The Unified Industrial Mass",
    gdpTrillion: 20.85,
    gdpSharePct: 16.5,
    instabilityIndex: 5.8,
    vulcanNote:
      "Centralized command enables sustained investment. Demographic contraction and debt overhang introduce future variance.",
  },
  {
    rank: 3,
    name: "Germany",
    vulcanDesignation: "The Cautionary Workshop",
    gdpTrillion: 5.45,
    gdpSharePct: 4.3,
    instabilityIndex: 4.5,
    vulcanNote:
      "Industrial precision without imperial ambition — a model of restraint, now rearming under external pressure.",
  },
  {
    rank: 4,
    name: "Japan",
    vulcanDesignation: "The Pacified Forgemaster",
    gdpTrillion: 4.38,
    gdpSharePct: 3.5,
    instabilityIndex: 4.2,
    vulcanNote:
      "Constitutional limits on force projection are eroding. Aging population reduces strategic flexibility.",
  },
  {
    rank: 5,
    name: "United Kingdom",
    vulcanDesignation: "The Diminished Archipelago",
    gdpTrillion: 4.26,
    gdpSharePct: 3.4,
    instabilityIndex: 5.5,
    vulcanNote:
      "Post-imperial adjustment incomplete. Nuclear deterrent retained; diplomatic reach exceeds economic weight.",
  },
  {
    rank: 6,
    name: "India",
    vulcanDesignation: "The Demographic Variable",
    gdpTrillion: 4.15,
    gdpSharePct: 3.3,
    instabilityIndex: 6.0,
    vulcanNote:
      "Population now exceeds China. Internal diversity is vast — IDIC in raw form, but integration remains incomplete.",
  },
  {
    rank: 7,
    name: "France",
    vulcanDesignation: "The Autonomous Deterrent",
    gdpTrillion: 3.6,
    gdpSharePct: 2.9,
    instabilityIndex: 5.0,
    vulcanNote:
      "Independent nuclear posture and African engagement. Seeks multipolar balance — logically consistent with sovereignty.",
  },
  {
    rank: 8,
    name: "Russia",
    vulcanDesignation: "The Disruptive Equilibrium",
    gdpTrillion: 2.66,
    gdpSharePct: 2.1,
    instabilityIndex: 8.5,
    vulcanNote:
      "Economy modest relative to arsenal. Relies on energy leverage and frozen conflicts — high emotional reactivity, low predictability.",
  },
];

const MILEX_TOP = [
  { name: "United States", value: 921 },
  { name: "China", value: 251 },
  { name: "Russia", value: 161 },
  { name: "Germany", value: 107 },
  { name: "United Kingdom", value: 94 },
  { name: "India", value: 78 },
  { name: "France", value: 65 },
  { name: "Japan", value: 59 },
];

const NUCLEAR_POWERS = [
  { name: "Russia", total: 5459, deployed: 1150, vulcanDesignation: "Primary Pole A" },
  { name: "United States", total: 5177, deployed: 1477, vulcanDesignation: "Primary Pole B" },
  { name: "China", total: 620, deployed: 576, vulcanDesignation: "Emerging Third Pole" },
  { name: "France", total: 290, deployed: 10, vulcanDesignation: "Regional Minimum Deterrent" },
  { name: "United Kingdom", total: 225, deployed: 105, vulcanDesignation: "Submarine-Based Reserve" },
  { name: "India", total: 180, deployed: 180, vulcanDesignation: "South Asian Balance" },
  { name: "Pakistan", total: 170, deployed: 170, vulcanDesignation: "Mirror Deterrent" },
  { name: "Israel", total: 90, deployed: 90, vulcanDesignation: "Unacknowledged Stabilizer" },
  { name: "North Korea", total: 50, deployed: 50, vulcanDesignation: "High-Variance Actor" },
];

const ALLIANCE_BLOCS = [
  {
    name: "NATO",
    members: 32,
    gdpSharePct: 55,
    milexSharePct: 62,
    vulcanDesignation: "Collective Defense Compact",
    note: "Article 5 mutual defense — logically sound deterrence, emotionally charged implementation. Will cohesion untested at scale.",
  },
  {
    name: "BRICS (expanded)",
    members: 10,
    gdpSharePct: 36,
    milexSharePct: 22,
    vulcanDesignation: "Parallel Economic Forum",
    note: "Not a military alliance. Shared interest in multipolar order — cohesion varies by issue.",
  },
  {
    name: "European Union",
    members: 27,
    gdpSharePct: 18,
    milexSharePct: 15,
    vulcanDesignation: "Supranational Integration Experiment",
    note: "Regulatory unity exceeds defense unity. A partial federation — instructive for IDIC at planetary scale.",
  },
  {
    name: "ASEAN",
    members: 10,
    gdpSharePct: 3.5,
    milexSharePct: 2,
    vulcanDesignation: "Non-Alignment Consensus",
    note: "Refuses binary bloc choice. Maximizes bargaining position — a rational strategy for smaller powers.",
  },
];

const EMOTIONAL_RISK_VECTORS = [
  { label: "Nationalist rhetoric", score: 8.5, note: "Elevates identity over mutual interest" },
  { label: "Nuclear brinkmanship", score: 9.0, note: "Probability of miscalculation non-zero" },
  { label: "Taiwan semiconductor dependency", score: 8.5, note: "Single-point failure induces panic" },
  { label: "Partisan paralysis (US)", score: 7.5, note: "Governance latency during crises" },
  { label: "Energy price shocks", score: 7.0, note: "Triggers reactive, not reasoned, policy" },
  { label: "AI arms race narrative", score: 7.5, note: "Fear-driven acceleration without safeguards" },
  { label: "Climate displacement", score: 7.0, note: "Mass migration amplifies tribal response" },
  { label: "Information echo chambers", score: 6.5, note: "Reduces shared factual baseline" },
];

const TECH_METRICS: TopicBrief[] = [
  {
    title: "AI-linked trade growth",
    metric: "~50% of 2025 merchandise trade growth",
    vulcanRead: "Concentration of economic hope in one domain increases systemic fragility. Logic demands diversification.",
    source: "UNCTAD / WTO 2026",
  },
  {
    title: "Semiconductor chokepoint",
    metric: "Taiwan produces ~90% of advanced logic chips",
    vulcanRead: "A single island holds planetary compute capacity. This is not logical. It is, however, factual.",
    source: "Industry estimates",
  },
  {
    title: "Space militarization",
    metric: "10,000+ satellites; ASAT demonstrated by 4 states",
    vulcanRead: "They extend conflict to orbit before resolving it on the surface. Premature militarization of the commons.",
    source: "SIPRI / IISS 2026",
  },
  {
    title: "Renewable transition",
    metric: "800 GW capacity added in 2025",
    vulcanRead: "Long-term rational response to thermodynamic reality. Implementation remains uneven and emotionally contested.",
    source: "IEA 2026",
  },
];

const CLIMATE_METRICS: TopicBrief[] = [
  {
    title: "CO₂ emissions",
    metric: "~37 Gt/year (energy + industry)",
    vulcanRead: "Atmospheric chemistry does not negotiate. Continued emission is logically equivalent to self-harm at scale.",
    source: "Global Carbon Project",
  },
  {
    title: "Water stress",
    metric: "2+ billion in water-stressed regions",
    vulcanRead: "Resource scarcity produces conflict unless managed through cooperative allocation — which they resist.",
    source: "UN Water",
  },
  {
    title: "Climate displacement",
    metric: "Tens of millions annually",
    vulcanRead: "Movement of populations is inevitable. Denial of this fact increases future disorder.",
    source: "UNHCR / IPCC",
  },
];

const LOGICAL_VERDICTS: LogicalVerdict[] = [
  {
    title: "Overall planetary status",
    verdict:
      "Class M world, 8.3 billion inhabitants, 195 sovereign polities. Technologically advanced but emotionally immature. Geopolitical equilibrium is metastable — neither at war nor at peace.",
    tone: "warning",
  },
  {
    title: "Economic logic",
    verdict:
      "$126.3T output concentrated in two powers (42%). Interdependence is high; cooperation is intermittent. Trade ($35T) binds them — severing arteries harms all parties. Rational actors should preserve commerce.",
    tone: "info",
  },
  {
    title: "Military irrationality",
    verdict:
      "$2.89T annual expenditure on instruments of destruction while 700M+ live in extreme poverty. From a Vulcan perspective, this allocation is indefensible. Yet it persists because fear overrides logic.",
    tone: "danger",
  },
  {
    title: "Nuclear probability matrix",
    verdict:
      "12,187 warheads, 2,100+ on high alert. Mutual assured destruction has prevented great-power war for 80 years — a grim logical equilibrium. Probability of accidental launch remains the primary concern.",
    tone: "danger",
  },
  {
    title: "IDIC assessment",
    verdict:
      "Infinite diversity in infinite combinations — they embody the principle in culture, language, and belief. They fail to apply it geopolitically. Difference is treated as threat, not strength.",
    tone: "warning",
  },
  {
    title: "First Contact recommendation",
    verdict:
      "Observation continues. Direct contact premature while emotional volatility index exceeds acceptable thresholds. Revisit when: (1) unified planetary governance emerges, or (2) warp capability detected, or (3) self-extinction probability exceeds 40%.",
    tone: "info",
  },
];

const DOMAIN_LABELS: Record<DomainKey, string> = {
  overview: "Overview",
  economy: "Economy",
  military: "Military",
  nuclear: "Nuclear",
  diplomacy: "Diplomacy",
  technology: "Technology",
  demographics: "Demographics",
  climate: "Climate",
  firstContact: "First Contact",
};

function DomainPills({
  domain,
  setDomain,
}: {
  domain: DomainKey;
  setDomain: (d: DomainKey) => void;
}) {
  const keys = Object.keys(DOMAIN_LABELS) as DomainKey[];
  return (
    <Row gap={8} align="center" wrap>
      {keys.map((k) => (
        <Pill active={domain === k} onClick={() => setDomain(k)}>
          {DOMAIN_LABELS[k]}
        </Pill>
      ))}
    </Row>
  );
}

function TopicTable({ topics }: { topics: TopicBrief[] }) {
  return (
    <Table
      headers={["Subject", "Data", "Logical reading", "Source"]}
      rows={topics.map((t) => [
        <Text weight="semibold">{t.title}</Text>,
        t.metric,
        <Text tone="secondary">{t.vulcanRead}</Text>,
        <Text tone="tertiary" size="small">
          {t.source}
        </Text>,
      ])}
      striped
      framed
    />
  );
}

export default function VulcanEarthAssessment() {
  const theme = useHostTheme();
  const [domain, setDomain] = useCanvasState<DomainKey>("domain", "overview");

  const gdpCategories = GDP_POWERS.map((p) => p.name);
  const gdpData = GDP_POWERS.map((p) => p.gdpTrillion);
  const milexCategories = MILEX_TOP.map((m) => m.name);
  const milexData = MILEX_TOP.map((m) => m.value);
  const nuclearCategories = NUCLEAR_POWERS.map((n) => n.name);
  const nuclearData = NUCLEAR_POWERS.map((n) => n.total);
  const riskCategories = EMOTIONAL_RISK_VECTORS.map((e) => e.label);
  const riskScores = EMOTIONAL_RISK_VECTORS.map((e) => e.score);
  const instabilityCategories = GDP_POWERS.map((p) => p.name);
  const instabilityData = GDP_POWERS.map((p) => p.instabilityIndex);

  const gdpPie = [
    { label: "United States", value: 25.6, tone: "info" as const },
    { label: "China", value: 16.5, tone: "warning" as const },
    { label: "Rest of world", value: 57.9, tone: "neutral" as const },
  ];

  const stabilityScores = [
    { factor: "Economic interdependence", score: 72 },
    { factor: "Institutional cooperation", score: 48 },
    { factor: "Emotional restraint", score: 31 },
    { factor: "Nuclear discipline", score: 65 },
    { factor: "Climate rationality", score: 38 },
  ];

  return (
    <Stack gap={16} style={{ padding: 16, background: theme.bg.editor }}>
      <Stack gap={8}>
        <Row gap={12} align="center" wrap>
          <H1>Vulcan Science Directorate: Planetary Assessment — Sol III</H1>
          <Spacer />
          <Pill tone="info">RESTRICTED — HIGH COMMAND EYES ONLY</Pill>
        </Row>

        <Text tone="secondary">
          Geopolitical status of Terra (Earth), evaluated through Surakian logic and IDIC principles. Eight
          analytical domains. Data as of IMF April 2026, SIPRI/IISS 2025–2026, UN/UNCTAD/WTO 2025–2026.
        </Text>

        <Callout tone="info" title="Preface — Subcommander T'Pol, Senior Analyst">
          <Text>
            "Humans possess remarkable capacity for innovation and cooperation. They also possess remarkable
            capacity for self-destruction driven by emotion. This assessment separates observable fact from
            emotional narrative. The planet is not ready for open contact. It may, however, be ready for patience."
          </Text>
        </Callout>

        <DomainPills domain={domain} setDomain={setDomain} />
      </Stack>

      <Grid columns={4} gap={14}>
        <Card>
          <CardBody>
            <Stat value="$126.3T" label="Planetary GDP (2026)" tone="info" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="8.3B" label="Population" tone="info" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="195" label="Sovereign polities" tone="warning" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="12,187" label="Nuclear warheads" tone="danger" />
          </CardBody>
        </Card>
      </Grid>

      {domain === "overview" && (
        <Stack gap={14}>
          <H2>Planetary equilibrium index</H2>
          <Text tone="secondary">
            Composite scores (0–100) estimating stability factors. Higher = more conducive to logical governance.
            Source: Vulcan Science Directorate synthesis, mid-2026.
          </Text>
          <Table
            headers={["Stability factor", "Score (0–100)"]}
            rows={stabilityScores.map((s) => [
              <Text weight="semibold">{s.factor}</Text>,
              s.score,
            ])}
            striped
            framed
          />
          <Grid columns={2} gap={16}>
            <Card>
              <CardHeader>Metastable equilibrium</CardHeader>
              <CardBody>
                <Stack gap={10}>
                  <Stat value="~68%" label="Probability of continued non-great-power war (5yr)" tone="warning" />
                  <Stat value="~12%" label="Probability of nuclear exchange (5yr)" tone="danger" />
                  <Stat value="~22%" label="Probability of major regional conflict escalation" tone="warning" />
                  <Text tone="secondary">
                    These estimates assume no external intervention. Human emotional volatility is the dominant
                    variable. Logic alone cannot predict irrational actors.
                  </Text>
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Primary fault lines</CardHeader>
              <CardBody>
                <Table
                  headers={["Fault line", "Parties", "Status"]}
                  rows={[
                    ["US–China rivalry", "Hegemon vs. Centripetal Authority", "Competition, not yet war"],
                    ["Russia–West", "Disruptive Equilibrium vs. NATO", "Active proxy conflict"],
                    ["Taiwan Strait", "US-aligned vs. PRC claim", "Highest escalation risk"],
                    ["Middle East", "Multiple actors", "Chronic instability"],
                    ["Indo-Pak", "Mirror deterrents", "Frozen, fragile"],
                  ]}
                  striped
                  framed
                />
              </CardBody>
            </Card>
          </Grid>
          <Callout tone="warning" title="Central finding">
            <Text>
              Sol III is a pre-warp civilization (no sustained FTL detected) with post-industrial destructive
              capacity. They have achieved nuclear fusion in weapons but not yet in power grids at scale. This
              asymmetry defines the risk profile: technologically capable, emotionally underdeveloped.
            </Text>
          </Callout>
        </Stack>
      )}

      {domain === "economy" && (
        <Stack gap={14}>
          <H2>Economic structure — resource logic</H2>
          <Grid columns={"1.4fr 1fr"} gap={16} align="stretch">
            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">Trillions USD</Text>}>
                Top 8 economies by nominal GDP (2026)
              </CardHeader>
              <CardBody>
                <BarChart
                  categories={gdpCategories}
                  series={[{ name: "Nominal GDP ($T)", data: gdpData, tone: "info" }]}
                  horizontal
                  height={320}
                  valuePrefix="$"
                  valueSuffix="T"
                  showValues
                />
                <Text tone="tertiary" size="small" style={{ marginTop: 10 }}>
                  Source: IMF WEO April 2026
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Output concentration</CardHeader>
              <CardBody>
                <Row gap={16} align="center" wrap>
                  <PieChart data={gdpPie} donut size={200} />
                  <Text tone="secondary">
                    Two powers control 42% of output. Interdependence should produce cooperation. Instead it
                    produces competition — an emotional, not logical, response to mutual reliance.
                  </Text>
                </Row>
              </CardBody>
            </Card>
          </Grid>
          <Table
            headers={["Rank", "Polity", "Designation", "GDP", "Share", "Instability (0–10)", "Logical note"]}
            rows={GDP_POWERS.map((p) => [
              p.rank,
              <Text weight="semibold">{p.name}</Text>,
              <Text tone="secondary">{p.vulcanDesignation}</Text>,
              `$${p.gdpTrillion.toFixed(2)}T`,
              `${p.gdpSharePct}%`,
              p.instabilityIndex.toFixed(1),
              <Text tone="secondary">{p.vulcanNote}</Text>,
            ])}
            striped
            framed
          />
        </Stack>
      )}

      {domain === "military" && (
        <Stack gap={14}>
          <H2>Military expenditure — irrational allocation</H2>
          <Grid columns={"1.4fr 1fr"} gap={16} align="stretch">
            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">Billions USD</Text>}>
                Top 8 military spenders (2025)
              </CardHeader>
              <CardBody>
                <BarChart
                  categories={milexCategories}
                  series={[{ name: "Defense budget ($B)", data: milexData, tone: "danger" }]}
                  horizontal
                  height={300}
                  valuePrefix="$"
                  valueSuffix="B"
                  showValues
                />
                <Text tone="tertiary" size="small" style={{ marginTop: 10 }}>
                  Source: SIPRI 2025
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Opportunity cost</CardHeader>
              <CardBody>
                <Stat value={`$${US_MILEX_BILLION}B`} label="US defense budget alone" tone="danger" />
                <Text tone="secondary">
                  {US_MILEX_SHARE}% of global military spending by one polity. Equivalent resources could
                  eliminate extreme poverty planet-wide within a decade. Humans choose otherwise.
                </Text>
              </CardBody>
            </Card>
          </Grid>
          <Callout tone="danger" title="Vulcan military verdict">
            <Text>
              20+ million active personnel globally. Arsenals sufficient for planetary sterilization many times
              over. No unified command. Deterrence holds through fear, not reason. This is the least logical
              equilibrium imaginable — yet it persists.
            </Text>
          </Callout>
        </Stack>
      )}

      {domain === "nuclear" && (
        <Stack gap={14}>
          <H2>Nuclear inventory — existential probability</H2>
          <Grid columns={4} gap={14}>
            <Stat value="12,187" label="Total warheads" tone="danger" />
            <Stat value="4,012" label="Deployed" tone="danger" />
            <Stat value="2,100+" label="High alert" tone="danger" />
            <Stat value="9" label="Armed states" tone="warning" />
          </Grid>
          <Grid columns={"1.4fr 1fr"} gap={16} align="stretch">
            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">Total inventory</Text>}>
                Warheads by nuclear power
              </CardHeader>
              <CardBody>
                <BarChart
                  categories={nuclearCategories}
                  series={[{ name: "Warheads", data: nuclearData, tone: "danger" }]}
                  horizontal
                  height={320}
                  showValues
                />
                <Text tone="tertiary" size="small" style={{ marginTop: 10 }}>
                  Source: SIPRI Yearbook 2026
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Logical assessment</CardHeader>
              <CardBody>
                <Stack gap={10}>
                  <Text tone="secondary">
                    Mutual assured destruction has prevented direct US–USSR/Russia conflict since 1945. A grim
                    logic: the certainty of annihilation produces restraint.
                  </Text>
                  <Text tone="secondary">
                    China&apos;s arsenal is tripling. Proliferation to nine states increases complexity and
                    miscalculation risk. North Korea remains highest-variance actor.
                  </Text>
                  <Stat value="~12%" label="5-year accidental exchange probability (estimate)" tone="danger" />
                </Stack>
              </CardBody>
            </Card>
          </Grid>
          <Table
            headers={["State", "Designation", "Total", "Deployed", "Note"]}
            rows={NUCLEAR_POWERS.map((n) => [
              <Text weight="semibold">{n.name}</Text>,
              <Text tone="secondary">{n.vulcanDesignation}</Text>,
              n.total.toLocaleString(),
              n.deployed.toLocaleString(),
              <Text tone="secondary">
                {n.name === "North Korea"
                  ? "Emotional volatility exceeds logical predictability."
                  : n.name === "China"
                    ? "Expansion erodes bipolar stability."
                    : "Deterrent function acknowledged."}
              </Text>,
            ])}
            striped
            framed
          />
        </Stack>
      )}

      {domain === "diplomacy" && (
        <Stack gap={14}>
          <H2>Diplomatic blocs — IDIC in practice</H2>
          <Text tone="secondary">
            Humans organize into overlapping alliances. No bloc commands planetary majority. Diversity exists;
            integration does not.
          </Text>
          <Table
            headers={["Bloc", "Designation", "Members", "GDP share", "Milex share", "Logical reading"]}
            rows={ALLIANCE_BLOCS.map((b) => [
              <Text weight="semibold">{b.name}</Text>,
              <Text tone="secondary">{b.vulcanDesignation}</Text>,
              b.members,
              `~${b.gdpSharePct}%`,
              `~${b.milexSharePct}%`,
              <Text tone="secondary">{b.note}</Text>,
            ])}
            striped
            framed
          />
          <Callout tone="info" title="IDIC verdict">
            <Text>
              Infinite Diversity in Infinite Combinations is observed in human culture but rejected in human
              geopolitics. They form blocs to manage fear of difference. True planetary federation — the logical
              endpoint — remains distant. The European Union is the closest experiment; it is incomplete.
            </Text>
          </Callout>
        </Stack>
      )}

      {domain === "technology" && (
        <Stack gap={14}>
          <H2>Technology — pre-warp with post-warp ambitions</H2>
          <TopicTable topics={TECH_METRICS} />
          <Callout tone="warning" title="Warp threshold assessment">
            <Text>
              No sustained faster-than-light travel detected. Propulsion remains chemical and ion-based. However:
              artificial intelligence, quantum computing, and fusion research accelerate. Estimated time to warp
              capability: 80–150 years at current trajectory — unless emotional conflict derails research funding.
            </Text>
          </Callout>
        </Stack>
      )}

      {domain === "demographics" && (
        <Stack gap={14}>
          <H2>Demographics — population logic</H2>
          <Grid columns={3} gap={14}>
            <Stat value="8.3B" label="World population" tone="info" />
            <Stat value="132M" label="Annual births" />
            <Stat value="0.84%" label="Growth rate" tone="warning" />
          </Grid>
          <Grid columns={"1.4fr 1fr"} gap={16} align="stretch">
            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">Instability index (0–10)</Text>}>
                Great-power governance instability
              </CardHeader>
              <CardBody>
                <BarChart
                  categories={instabilityCategories}
                  series={[{ name: "Instability index", data: instabilityData, tone: "warning" }]}
                  horizontal
                  height={280}
                  showValues
                />
                <Text tone="tertiary" size="small" style={{ marginTop: 10 }}>
                  Vulcan Science Directorate estimate · subjective
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Demographic transition</CardHeader>
              <CardBody>
                <Text tone="secondary">
                  India now most populous. China aging rapidly. Africa holds youngest population — future
                  economic weight shifts south. Europe and East Asia face workforce contraction. These trends
                  are predictable; human policy responses are not.
                </Text>
              </CardBody>
            </Card>
          </Grid>
        </Stack>
      )}

      {domain === "climate" && (
        <Stack gap={14}>
          <H2>Climate — thermodynamic inevitability</H2>
          <TopicTable topics={CLIMATE_METRICS} />
          <Callout tone="danger" title="Long-range logical forecast">
            <Text>
              Physical systems do not respond to debate. Continued greenhouse emission produces predictable
              outcomes: displacement, agricultural disruption, resource conflict. Humans possess the technology
              to mitigate. They lack the collective will. This is an emotional failure, not a technical one.
            </Text>
          </Callout>
        </Stack>
      )}

      {domain === "firstContact" && (
        <Stack gap={14}>
          <H2>First Contact readiness — Prime Directive evaluation</H2>
          <Grid columns={2} gap={16}>
            <Card>
              <CardHeader>Contact criteria checklist</CardHeader>
              <CardBody>
                <Table
                  headers={["Criterion", "Status", "Assessment"]}
                  rows={[
                    ["Unified planetary governance", "Not met", "195 sovereign polities"],
                    ["Emotional maturity index > 60", "Not met", "Current: ~31"],
                    ["Warp capability", "Not met", "Pre-warp; estimate 80–150 yr"],
                    ["Self-extinction risk < 40%", "Borderline", "Nuclear + climate combined"],
                    ["Stable scientific method", "Met", "Global research community functional"],
                    ["Cultural IDIC potential", "Partial", "Diversity yes; acceptance incomplete"],
                  ]}
                  striped
                  framed
                />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Emotional volatility index</CardHeader>
              <CardBody>
                <BarChart
                  categories={riskCategories}
                  series={[{ name: "Risk score (0–10)", data: riskScores, tone: "danger" }]}
                  horizontal
                  height={320}
                  showValues
                />
                <Text tone="tertiary" size="small" style={{ marginTop: 10 }}>
                  Higher = greater deviation from logical governance · VSD estimate
                </Text>
              </CardBody>
            </Card>
          </Grid>
          <Callout tone="info" title="High Command recommendation">
            <Text>
              Maintain covert observation. Do not reveal presence. Humans must resolve their emotional conflicts
              without external salvation — otherwise they will not mature. Limited cultural contamination already
              occurred through surveillance; no additional exposure warranted. Reassess in 25 Earth years or
              upon detection of warp signature.
            </Text>
            <Text tone="secondary" style={{ marginTop: 8 }}>
              Live long and prosper. — Subcommander T&apos;Pol, Vulcan Science Directorate
            </Text>
          </Callout>
        </Stack>
      )}

      <Divider />

      <H2>Logical verdicts — all domains</H2>
      <Grid columns={3} gap={14}>
        {LOGICAL_VERDICTS.map((v) => (
          <Callout tone={v.tone} title={v.title}>
            <Text>{v.verdict}</Text>
          </Callout>
        ))}
      </Grid>

      <Stack gap={8}>
        <H3>Sources</H3>
        <Row gap={16} wrap>
          <Link href="https://www.imf.org/en/publications/weo/issues/2026/04/14/world-economic-outlook-april-2026">
            IMF WEO April 2026
          </Link>
          <Link href="https://www.sipri.org/publications/2026/sipri-fact-sheets/trends-world-military-expenditure-2025">
            SIPRI Milex 2025
          </Link>
          <Link href="https://www.sipri.org/yearbook/2026">SIPRI Yearbook 2026</Link>
          <Link href="https://unctad.org/system/files/official-document/ditcinf2026d4_en.pdf">
            UNCTAD Trade Update Apr 2026
          </Link>
          <Link href="https://www.iea.org/reports/global-energy-review-2026/key-findings">IEA Energy Review 2026</Link>
        </Row>
        <Text tone="tertiary" size="small">
          Vulcan assessments are fictional framing atop real public data. Surak was consulted. Emotions were suppressed.
        </Text>
      </Stack>
    </Stack>
  );
}
