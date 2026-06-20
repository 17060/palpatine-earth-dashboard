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
  LineChart,
  PieChart,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  UsageBar,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type ViewKey = "overview" | "institutions" | "obstacles" | "prerequisites" | "scenarios";

type ReadinessDomain = {
  domain: string;
  score: number;
  vulcanLabel: string;
  assessment: string;
};

type ProtoInstitution = {
  name: string;
  members: number;
  integrationPct: number;
  scope: string;
  vulcanAnalog: string;
  unificationContribution: number;
  note: string;
};

type Obstacle = {
  factor: string;
  severity: number;
  category: string;
  vulcanAnalysis: string;
  mitigationDifficulty: "low" | "moderate" | "high" | "extreme";
};

type Prerequisite = {
  requirement: string;
  currentState: string;
  gapScore: number;
  timeframe: string;
  vulcanRationale: string;
};

type Scenario = {
  name: string;
  horizon: string;
  probabilityPct: number;
  form: string;
  description: string;
};

const UPI_FULL = 31;
const UPI_FUNCTIONAL = 54;
const UPI_CRISIS_TRIGGERED = 68;

const READINESS_DOMAINS: ReadinessDomain[] = [
  {
    domain: "Economic interdependence",
    score: 74,
    vulcanLabel: "Material coupling",
    assessment:
      "$35T in annual cross-border flows. Supply chains bind polities tighter than treaties. Trade integration exceeds political integration — a common Vulcan pre-unification pattern.",
  },
  {
    domain: "Institutional maturity",
    score: 34,
    vulcanLabel: "Governance substrate",
    assessment:
      "UN General Assembly: deliberative, non-binding. Security Council: veto-paralyzed. EU is the strongest proto-structure (~27 states) but lacks unified defense or fiscal union.",
  },
  {
    domain: "Security integration",
    score: 17,
    vulcanLabel: "Collective defense",
    assessment:
      "NATO (32 members) is regional, not planetary. No global peacekeeping force with enforcement mandate. Nine nuclear sovereignties — each retains independent launch authority.",
  },
  {
    domain: "Political convergence",
    score: 21,
    vulcanLabel: "Shared executive will",
    assessment:
      "US–China bipolar rivalry absorbs diplomatic bandwidth. Nationalist movements in major powers resist ceding authority. No consensus candidate for a planetary capital.",
  },
  {
    domain: "Cultural cohesion",
    score: 14,
    vulcanLabel: "IDIC tolerance index",
    assessment:
      "~7,000 living languages, thousands of belief systems. Diversity is not the obstacle — intolerance of diversity is. Earth has not yet embraced IDIC as governing principle.",
  },
  {
    domain: "Legal harmonization",
    score: 26,
    vulcanLabel: "Unified jurisprudence",
    assessment:
      "ICC jurisdiction accepted by 124 states; major powers absent or non-compliant. No planetary constitution. WTO rules bind trade; human-rights law remains fragmented.",
  },
  {
    domain: "Technological commons",
    score: 48,
    vulcanLabel: "Shared infrastructure",
    assessment:
      "Internet protocols, GPS, maritime law, aviation standards, and pandemic surveillance networks function as de facto global systems — often without corresponding governance.",
  },
  {
    domain: "Existential pressure",
    score: 61,
    vulcanLabel: "Surak coefficient",
    assessment:
      "Climate (~37 Gt CO₂/yr), pandemic risk, AI alignment, and asteroid detection create shared-threat incentives. Vulcan history suggests crisis catalyzes logic — but only after near-catastrophe.",
  },
];

const PROTO_INSTITUTIONS: ProtoInstitution[] = [
  {
    name: "United Nations",
    members: 193,
    integrationPct: 22,
    scope: "Peace, development, standards, humanitarian",
    vulcanAnalog: "Pre-Surak councils — many voices, no binding logic",
    unificationContribution: 25,
    note: "Universal membership but no executive authority. Veto structure mirrors pre-reform Vulcan factional paralysis.",
  },
  {
    name: "European Union",
    members: 27,
    integrationPct: 58,
    scope: "Single market, regulation, partial monetary union",
    vulcanAnalog: "Closest Terran analog to early Vulcan Confederacy",
    unificationContribution: 45,
    note: "Deepest supranational integration on Earth. Still lacks unified military command or fiscal federalism.",
  },
  {
    name: "NATO",
    members: 32,
    integrationPct: 35,
    scope: "Collective defense (Article 5)",
    vulcanAnalog: "Regional security compact — not planetary",
    unificationContribution: 20,
    note: "Demonstrates collective-defense feasibility within a bloc. Excludes half the planet's population.",
  },
  {
    name: "WTO / trade architecture",
    members: 164,
    integrationPct: 42,
    scope: "Trade rules, dispute settlement",
    vulcanAnalog: "Commercial logic without political union",
    unificationContribution: 38,
    note: "Functional integration of markets precedes political integration — historically consistent with Vulcan unification sequence.",
  },
  {
    name: "Paris Agreement / climate regime",
    members: 195,
    integrationPct: 30,
    scope: "Emissions pledges, climate finance",
    vulcanAnalog: "Shared-threat protocol without enforcement",
    unificationContribution: 32,
    note: "Near-universal accession; compliance voluntary. A template for functional planetary governance if enforcement matures.",
  },
  {
    name: "International Space Station partnership",
    members: 15,
    integrationPct: 40,
    scope: "Orbital research, shared operations",
    vulcanAnalog: "Vulcan Science Academy cooperative model",
    unificationContribution: 28,
    note: "Proof that rival powers can share critical infrastructure when stakes are existential and benefits mutual.",
  },
  {
    name: "WHO / pandemic architecture",
    members: 194,
    integrationPct: 28,
    scope: "Health standards, outbreak coordination",
    vulcanAnalog: "Medical logic transcending borders — underfunded",
    unificationContribution: 30,
    note: "COVID-19 revealed both necessity and limits of planetary health governance.",
  },
];

const OBSTACLES: Obstacle[] = [
  {
    factor: "Nuclear sovereignty (9 states)",
    severity: 9.5,
    category: "Security",
    vulcanAnalysis:
      "No polity will surrender launch authority without verified disarmament of all others. A classic prisoner's dilemma — solvable only through phased, inspectable mutual reduction.",
    mitigationDifficulty: "extreme",
  },
  {
    factor: "US–China strategic rivalry",
    severity: 9.2,
    category: "Geopolitical",
    vulcanAnalysis:
      "Two powers control 42% of GDP and set the tone for bloc alignment. Unification requires their voluntary subordination to a neutral institution — improbable without external shock or generational shift.",
    mitigationDifficulty: "extreme",
  },
  {
    factor: "National identity & sovereignty doctrine",
    severity: 8.8,
    category: "Political",
    vulcanAnalysis:
      "Westphalian sovereignty is the foundational myth of 195 polities. Vulcan unification required abandoning the doctrine that one's clan's logic was supreme. Terrans have not reached this insight.",
    mitigationDifficulty: "high",
  },
  {
    factor: "Military-industrial dependency",
    severity: 8.5,
    category: "Economic",
    vulcanAnalysis:
      "$2.89T annual military expenditure creates constituencies with vested interest in fragmentation. Peace is economically disruptive to the defense sector.",
    mitigationDifficulty: "high",
  },
  {
    factor: "Linguistic fragmentation",
    severity: 7.5,
    category: "Cultural",
    vulcanAnalysis:
      "Vulcan adopted a single formal language for governance while preserving dialects. Terrans lack a neutral lingua franca with political legitimacy — English dominates informally but carries imperial residue.",
    mitigationDifficulty: "moderate",
  },
  {
    factor: "Income & development inequality",
    severity: 7.8,
    category: "Economic",
    vulcanAnalysis:
      "Per-capita GDP ranges from ~$300 to ~$140,000. A unified government must redistribute or federate — both trigger resistance from wealthy polities fearing subsidy burdens.",
    mitigationDifficulty: "high",
  },
  {
    factor: "Democratic deficit of global bodies",
    severity: 7.2,
    category: "Institutional",
    vulcanAnalysis:
      "UN Security Council permanent members hold veto power disproportionate to population. Any planetary government perceived as undemocratic will lack legitimacy.",
    mitigationDifficulty: "moderate",
  },
  {
    factor: "Religious & ideological pluralism",
    severity: 7.0,
    category: "Cultural",
    vulcanAnalysis:
      "Surak's insight: logic does not require uniformity of belief, only non-violence in disagreement. Terran history shows belief systems frequently override logic in governance.",
    mitigationDifficulty: "high",
  },
  {
    factor: "AI governance vacuum",
    severity: 6.8,
    category: "Technology",
    vulcanAnalysis:
      "~50% of 2025 trade growth linked to AI. A technology without planetary regulatory consensus could either accelerate integration (shared standards) or deepen fracture (rival blocs).",
    mitigationDifficulty: "moderate",
  },
  {
    factor: "Resource competition (water, minerals)",
    severity: 6.5,
    category: "Environmental",
    vulcanAnalysis:
      "Critical mineral refining concentrated in few polities. Climate-driven water stress affects 2+ billion. Shared-resource governance is prerequisite, not outcome, of unification.",
    mitigationDifficulty: "moderate",
  },
];

const PREREQUISITES: Prerequisite[] = [
  {
    requirement: "Phased nuclear disarmament with inspection",
    currentState: "12,187 warheads; 2,100+ on high alert",
    gapScore: 92,
    timeframe: "50–100 years (optimistic)",
    vulcanRationale:
      "Vulcan reunification followed the near-extinction of nuclear-equivalent weapons. Terrans will likely require a comparable scare — or centuries of patient diplomacy.",
  },
  {
    requirement: "Neutral planetary executive institution",
    currentState: "UN Secretary-General: moral authority only",
    gapScore: 78,
    timeframe: "30–60 years",
    vulcanRationale:
      "An executive must be perceived as serving all polities, not any single bloc. Rotation, weighted representation, and veto reform are necessary.",
  },
  {
    requirement: "Global lingua franca for governance",
    currentState: "English de facto; no treaty ratification",
    gapScore: 55,
    timeframe: "20–40 years",
    vulcanRationale:
      "Administrative language need not erase cultural languages. Vulcan preserved diversity within unity.",
  },
  {
    requirement: "Federated military under civilian control",
    currentState: "Regional alliances only; no planetary force",
    gapScore: 85,
    timeframe: "40–80 years",
    vulcanRationale:
      "Monopoly on legitimate force is the definition of government. A planetary federation requires a peacekeeping corps with enforcement mandate.",
  },
  {
    requirement: "Shared fiscal capacity",
    currentState: "EU partial; no global treasury",
    gapScore: 80,
    timeframe: "40–70 years",
    vulcanRationale:
      "Climate adaptation, pandemic response, and development require taxing and spending at planetary scale. Functional federation may precede full political union.",
  },
  {
    requirement: "IDIC — tolerance of infinite diversity",
    currentState: "Rising nationalism in multiple regions",
    gapScore: 88,
    timeframe: "Generational (50+ years)",
    vulcanRationale:
      "Unification without suppression of difference. Surak's teaching: difference is not threat; refusal to accommodate difference is.",
  },
  {
    requirement: "Crisis-driven mandate (Surak coefficient)",
    currentState: "Climate, AI, biosecurity pressures rising",
    gapScore: 45,
    timeframe: "10–30 years (trigger window)",
    vulcanRationale:
      "Historically, Terrans form ad hoc coalitions under existential threat. The question is whether crisis produces federation or authoritarian bloc rivalry.",
  },
];

const SCENARIOS: Scenario[] = [
  {
    name: "Status quo fragmentation",
    horizon: "2026–2040",
    probabilityPct: 45,
    form: "195 sovereignties, deepening blocs",
    description:
      "Most probable near-term outcome. Functional cooperation on trade and standards continues; political unification stalls. US–China rivalry defines the era.",
  },
  {
    name: "Functional federation",
    horizon: "2040–2075",
    probabilityPct: 30,
    form: "Climate, health, AI, space — shared agencies",
    description:
      "Partial planetary governance without a single executive. Analogous to pre-Surak Vulcan cooperative networks. UPI functional index: 54/100.",
  },
  {
    name: "Crisis-triggered union",
    horizon: "2050–2090",
    probabilityPct: 15,
    form: "Emergency planetary council → constitutional convention",
    description:
      "Pandemic, climate tipping event, or asteroid scare forces rapid institution-building. Vulcan historical parallel: the Reformation followed near-self-destruction.",
  },
  {
    name: "Bipolar planetary order",
    horizon: "2035–2060",
    probabilityPct: 8,
    form: "Two competing global governance systems",
    description:
      "Not unification but consolidation into rival planetary blocs — each internally more unified, externally hostile. The antithesis of IDIC.",
  },
  {
    name: "Full planetary republic",
    horizon: "2090–2150+",
    probabilityPct: 2,
    form: "Elected planetary assembly, federated states",
    description:
      "Complete political unification with preserved local autonomy. Probability low absent centuries of preparation or First Contact catalysis.",
  },
];

const UPI_TIMELINE = [
  { year: 2026, functional: 54, full: 31 },
  { year: 2035, functional: 58, full: 34 },
  { year: 2050, functional: 65, full: 38 },
  { year: 2075, functional: 72, full: 48 },
  { year: 2100, functional: 78, full: 55 },
  { year: 2150, functional: 85, full: 68 },
];

const VULCAN_VERDICTS = [
  {
    title: "Logical assessment",
    tone: "info" as const,
    text: "Full planetary government before 2100: improbable (UPI 31/100). Functional federation on shared threats: plausible (UPI 54/100). Terrans possess the material prerequisites; they lack the philosophical ones.",
  },
  {
    title: "Historical parallel",
    tone: "warning" as const,
    text: "Vulcan unification required near-extinction, Surak's Reformation, and centuries of logic-discipline. Terrans are at the 'factional warfare' stage — economically interdependent, politically sovereign, existentially threatened.",
  },
  {
    title: "IDIC observation",
    tone: "info" as const,
    text: "Infinite diversity is not the barrier to unification — it is the justification. A government that homogenizes will fail. One that federates difference may endure.",
  },
  {
    title: "First Contact variable",
    tone: "warning" as const,
    text: "External perspective often accelerates internal unity. Whether contact comes from Vulcans or another observer, the effect on Terran institution-building would be significant — and unpredictable.",
  },
  {
    title: "Recommendation",
    tone: "success" as const,
    text: "Do not intervene. Observe. Offer logic when asked. Premature unification imposed from outside would replicate the failures of colonialism. The prospect improves if Terrans choose it themselves.",
  },
];

const VIEW_LABELS: Record<ViewKey, string> = {
  overview: "Overview",
  institutions: "Proto-Institutions",
  obstacles: "Obstacles",
  prerequisites: "Prerequisites",
  scenarios: "Scenarios",
};

function ViewPills({ view, setView }: { view: ViewKey; setView: (v: ViewKey) => void }) {
  const keys = Object.keys(VIEW_LABELS) as ViewKey[];
  return (
    <Row gap={8} align="center" wrap>
      {keys.map((k) => (
        <Pill active={view === k} onClick={() => setView(k)}>
          {VIEW_LABELS[k]}
        </Pill>
      ))}
    </Row>
  );
}

function ReadinessBar({ score, label }: { score: number; label: string }) {
  return (
    <UsageBar
      total={100}
      topLeftLabel={label}
      topRightLabel={`${score}/100`}
      segments={[{ id: "achieved", value: score, color: score >= 60 ? "green" : score >= 35 ? "yellow" : "orange" }]}
    />
  );
}

export default function VulcanUnifiedEarthGovernment() {
  const theme = useHostTheme();
  const [view, setView] = useCanvasState<ViewKey>("view", "overview");

  const readinessCategories = READINESS_DOMAINS.map((d) => d.domain);
  const readinessScores = READINESS_DOMAINS.map((d) => d.score);
  const obstacleCategories = OBSTACLES.map((o) => o.factor);
  const obstacleScores = OBSTACLES.map((o) => o.severity);
  const institutionCategories = PROTO_INSTITUTIONS.map((i) => i.name);
  const institutionScores = PROTO_INSTITUTIONS.map((i) => i.unificationContribution);
  const scenarioCategories = SCENARIOS.map((s) => s.name);
  const scenarioProbs = SCENARIOS.map((s) => s.probabilityPct);

  const scenarioPie = SCENARIOS.map((s, i) => ({
    label: s.name,
    value: s.probabilityPct,
    tone: (i === 0 ? "neutral" : i === 1 ? "info" : i === 2 ? "warning" : i === 3 ? "danger" : "success") as
      | "neutral"
      | "info"
      | "warning"
      | "danger"
      | "success",
  }));

  const upiSegments = [
    { id: "achieved", value: UPI_FULL, color: "blue" as const },
    { id: "gap", value: 100 - UPI_FULL, color: "gray" as const },
  ];

  return (
    <Stack gap={16} style={{ padding: 16, background: theme.bg.editor }}>
      <Stack gap={8}>
        <Row gap={12} align="center" wrap>
          <H1>Vulcan Survey Division: Planetary Unification Prospect</H1>
          <Spacer />
          <Pill tone="info">STARFLEET ARCHIVES — TERRA (EARTH)</Pill>
        </Row>

        <Text tone="secondary">
          Logical assessment of unified planetary government prospects for Sector Sol-III (Earth), stardate equivalent
          2026.06. Data: IMF WEO Apr 2026, SIPRI 2025–2026, UN/UNCTAD/WTO 2025–2026, World Population Review 2026.
          Analysis framed through Surakian logic and IDIC principles.
        </Text>

        <Callout tone="info" title="From the desk of the Vulcan Ambassador to Earth">
          <Text>
            "Your species asks whether one world can govern itself as one. The question is logical. The answer is
            conditional. You have built the arteries of interdependence without the heart of shared authority. Whether
            you install that heart before or after a crisis will determine if your unification resembles ours — or your
            extinction."
          </Text>
        </Callout>

        <ViewPills view={view} setView={setView} />
      </Stack>

      <Grid columns={4} gap={14}>
        <Card>
          <CardBody>
            <Stat value={`${UPI_FULL}/100`} label="Full unification prospect (UPI)" tone="warning" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value={`${UPI_FUNCTIONAL}/100`} label="Functional federation prospect" tone="info" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="~195" label="Sovereign polities" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="9" label="Nuclear sovereignties" tone="danger" />
          </CardBody>
        </Card>
      </Grid>

      {view === "overview" && (
        <Stack gap={14}>
          <H2>Unification readiness by domain</H2>
          <Text tone="secondary">
            Vulcan Readiness Index (0–100) per domain. Higher = more conducive to unification. Composite full-UPI: 31.
            Functional federation UPI: 54.
          </Text>

          <Grid columns={"1.4fr 1fr"} gap={16} align="stretch">
            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">0–100 scale</Text>}>
                Readiness score by domain
              </CardHeader>
              <CardBody>
                <BarChart
                  categories={readinessCategories}
                  series={[{ name: "Readiness score", data: readinessScores, tone: "info" }]}
                  horizontal
                  height={340}
                  showValues
                />
                <Text tone="tertiary" size="small" style={{ marginTop: 10 }}>
                  Source: Vulcan Survey Division composite · public Terran data 2025–2026
                </Text>
              </CardBody>
            </Card>

            <Stack gap={14}>
              <Card>
                <CardHeader>Full unification prospect</CardHeader>
                <CardBody>
                  <UsageBar
                    total={100}
                    topLeftLabel="Planetary Republic UPI"
                    topRightLabel={`${UPI_FULL}/100`}
                    segments={upiSegments}
                  />
                  <Text tone="secondary" size="small" style={{ marginTop: 10 }}>
                    Probability of elected planetary government with federated states before 2100: ~2%. Before 2150:
                    ~8%.
                  </Text>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>Scenario probability distribution</CardHeader>
                <CardBody>
                  <Row gap={12} align="center" wrap>
                    <PieChart data={scenarioPie} donut size={160} />
                    <Text tone="secondary" size="small">
                      Most probable path: continued fragmentation with functional cooperation on trade, climate, and
                      health.
                    </Text>
                  </Row>
                </CardBody>
              </Card>
            </Stack>
          </Grid>

          <Table
            headers={["Domain", "Vulcan label", "Score", "Assessment"]}
            rows={READINESS_DOMAINS.map((d) => [
              <Text weight="semibold">{d.domain}</Text>,
              <Text tone="secondary">{d.vulcanLabel}</Text>,
              `${d.score}/100`,
              <Text tone="secondary">{d.assessment}</Text>,
            ])}
            striped
            framed
          />

          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">Projected UPI · 2026–2150</Text>}>
              Unification prospect trajectory (logical projection)
            </CardHeader>
            <CardBody>
              <LineChart
                categories={UPI_TIMELINE.map((p) => String(p.year))}
                series={[
                  { name: "Functional federation UPI", data: UPI_TIMELINE.map((p) => p.functional), tone: "info" },
                  { name: "Full planetary republic UPI", data: UPI_TIMELINE.map((p) => p.full), tone: "warning" },
                ]}
                height={260}
              />
              <Text tone="tertiary" size="small" style={{ marginTop: 10 }}>
                Projection assumes no major war, no First Contact, gradual institutional deepening. Crisis or contact
                events would shift curves unpredictably.
              </Text>
            </CardBody>
          </Card>
        </Stack>
      )}

      {view === "institutions" && (
        <Stack gap={14}>
          <H2>Proto-institutions — seeds of planetary governance</H2>
          <Text tone="secondary">
            Existing Terran bodies ranked by contribution to unification (0–100). None constitutes a planetary
            government; several demonstrate that functional integration precedes political union.
          </Text>

          <BarChart
            categories={institutionCategories}
            series={[
              { name: "Unification contribution index", data: institutionScores, tone: "info" },
            ]}
            horizontal
            height={300}
            showValues
          />

          <Table
            headers={[
              "Institution",
              "Members",
              "Integration",
              "Scope",
              "Vulcan analog",
              "Contribution",
              "Note",
            ]}
            rows={PROTO_INSTITUTIONS.map((i) => [
              <Text weight="semibold">{i.name}</Text>,
              i.members,
              `${i.integrationPct}%`,
              i.scope,
              <Text tone="secondary">{i.vulcanAnalog}</Text>,
              `${i.unificationContribution}/100`,
              <Text tone="secondary">{i.note}</Text>,
            ])}
            striped
            framed
          />

          <Callout tone="info" title="Vulcan institutional observation">
            <Text>
              The European Union is instructive: 27 polities surrendered regulatory and partial monetary sovereignty
              without abandoning cultural identity. If this model scaled globally — federated, not centralized — the
              logical path to unification becomes visible. The obstacle is not architecture; it is trust.
            </Text>
          </Callout>
        </Stack>
      )}

      {view === "obstacles" && (
        <Stack gap={14}>
          <H2>Obstacles to unification — severity index</H2>
          <Text tone="secondary">
            Ranked barriers (0–10 severity). Higher = greater resistance to planetary government formation.
          </Text>

          <BarChart
            categories={obstacleCategories}
            series={[{ name: "Severity (0–10)", data: obstacleScores, tone: "danger" }]}
            horizontal
            height={360}
            showValues
          />

          <Table
            headers={["Factor", "Category", "Severity", "Mitigation", "Vulcan analysis"]}
            rows={OBSTACLES.map((o) => [
              <Text weight="semibold">{o.factor}</Text>,
              o.category,
              o.severity.toFixed(1),
              o.mitigationDifficulty.toUpperCase(),
              <Text tone="secondary">{o.vulcanAnalysis}</Text>,
            ])}
            striped
            framed
          />

          <Callout tone="warning" title="The nuclear paradox">
            <Text>
              Nine polities possess 12,187 warheads; 2,100+ remain on high alert. A planetary government cannot form
              while any member retains independent extinction capability. Vulcan logic is unambiguous: disarmament is
              prerequisite, not consequence, of unity.
            </Text>
          </Callout>
        </Stack>
      )}

      {view === "prerequisites" && (
        <Stack gap={14}>
          <H2>Logical prerequisites — gap analysis</H2>
          <Text tone="secondary">
            Conditions Vulcan history suggests are necessary for durable unification. Gap score (0–100): distance from
            current Terran state to requirement.
          </Text>

          <Grid columns={2} gap={14}>
            {PREREQUISITES.map((p) => (
              <Card key={p.requirement}>
                <CardHeader trailing={<Text tone="tertiary" size="small">{p.timeframe}</Text>}>
                  {p.requirement}
                </CardHeader>
                <CardBody>
                  <Stack gap={10}>
                    <ReadinessBar score={100 - p.gapScore} label="Progress toward requirement" />
                    <Text tone="secondary" size="small">
                      <Text weight="semibold">Current: </Text>
                      {p.currentState}
                    </Text>
                    <Text tone="secondary" size="small">{p.vulcanRationale}</Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Grid>

          <Callout tone="success" title="Surak coefficient — the catalytic variable">
            <Text>
              Of all prerequisites, only existential shared threat has a relatively low gap score (45). Climate,
              pandemic, and AI alignment pressures may accomplish in decades what diplomacy cannot in centuries — if
              Terrans respond with federation rather than fortress-building. This is the decisive variable.
            </Text>
          </Callout>
        </Stack>
      )}

      {view === "scenarios" && (
        <Stack gap={14}>
          <H2>Scenario analysis — probability-weighted outcomes</H2>

          <Grid columns={"1fr 1fr"} gap={16} align="stretch">
            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">% probability · 2026–2150</Text>}>
                Scenario likelihood
              </CardHeader>
              <CardBody>
                <BarChart
                  categories={scenarioCategories}
                  series={[{ name: "Probability (%)", data: scenarioProbs, tone: "info" }]}
                  horizontal
                  height={280}
                  valueSuffix="%"
                  showValues
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>Distribution</CardHeader>
              <CardBody>
                <PieChart data={scenarioPie} donut size={200} />
                <Text tone="secondary" size="small" style={{ marginTop: 10 }}>
                  Status quo fragmentation (45%) and functional federation (30%) account for three-quarters of
                  projected outcomes.
                </Text>
              </CardBody>
            </Card>
          </Grid>

          <Table
            headers={["Scenario", "Horizon", "Probability", "Form", "Description"]}
            rows={SCENARIOS.map((s) => [
              <Text weight="semibold">{s.name}</Text>,
              s.horizon,
              `${s.probabilityPct}%`,
              <Text tone="secondary">{s.form}</Text>,
              <Text tone="secondary">{s.description}</Text>,
            ])}
            striped
            framed
          />

          <Grid columns={3} gap={14}>
            <Stat value="45%" label="Status quo fragmentation" />
            <Stat value="30%" label="Functional federation" tone="info" />
            <Stat value="2%" label="Full planetary republic by 2150" tone="warning" />
          </Grid>
        </Stack>
      )}

      <Divider />

      <H2>Vulcan verdicts</H2>
      <Grid columns={3} gap={14}>
        {VULCAN_VERDICTS.map((v) => (
          <Callout tone={v.tone} title={v.title}>
            <Text>{v.text}</Text>
          </Callout>
        ))}
      </Grid>

      <Stack gap={8}>
        <H3>Sources</H3>
        <Row gap={16} wrap>
          <Link href="https://www.imf.org/en/publications/weo/issues/2026/04/14/world-economic-outlook-april-2026">
            IMF WEO April 2026
          </Link>
          <Link href="https://www.sipri.org/yearbook/2026">SIPRI Yearbook 2026</Link>
          <Link href="https://www.sipri.org/publications/2026/sipri-fact-sheets/trends-world-military-expenditure-2025">
            SIPRI Milex 2025
          </Link>
          <Link href="https://unctad.org/system/files/official-document/ditcinf2026d4_en.pdf">
            UNCTAD Trade Update Apr 2026
          </Link>
          <Link href="https://www.un.org/en/about-us/member-states">UN Member States</Link>
          <Link href="https://worldpopulationreview.com/">World Population Review 2026</Link>
        </Row>
        <Text tone="tertiary" size="small">
          Vulcan assessments are fictional framing atop real public data. Live long and prosper.
        </Text>
      </Stack>
    </Stack>
  );
}
