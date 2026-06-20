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
  UsageBar,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type DashboardView = "overview" | "powers" | "threats" | "domains";

const KPI = {
  gdpTrillion: 126.3,
  populationB: 8.3,
  milexBillion: 2890,
  nuclearTotal: 12187,
  tradeTrillion: 35,
  polities: 195,
  nuclearStates: 9,
  aiTradeSharePct: 50,
  usChinaGdpSharePct: 42.1,
  usMilexSharePct: 35.2,
  nuclearDeployed: 4012,
  nuclearHighAlert: 2100,
};

const GDP_TOP6 = [
  { name: "United States", gdp: 32.38, designation: "Fractured Hegemon" },
  { name: "China", gdp: 20.85, designation: "Silent Rival" },
  { name: "Germany", gdp: 5.45, designation: "Reluctant Arsenal" },
  { name: "Japan", gdp: 4.38, designation: "Pacified Forgemaster" },
  { name: "United Kingdom", gdp: 4.26, designation: "Diminished Archipelago" },
  { name: "India", gdp: 4.15, designation: "Rising Mass" },
];

const MILEX_TOP6 = [
  { name: "United States", value: 921 },
  { name: "China", value: 251 },
  { name: "Russia", value: 161 },
  { name: "Germany", value: 107 },
  { name: "United Kingdom", value: 94 },
  { name: "India", value: 78 },
];

const NUCLEAR_TOP5 = [
  { name: "Russia", total: 5459 },
  { name: "United States", total: 5177 },
  { name: "China", total: 620 },
  { name: "France", total: 290 },
  { name: "United Kingdom", total: 225 },
];

const ALLIANCE_BLOCS = [
  { name: "NATO", members: 32, gdpPct: 55, milexPct: 62, designation: "Western Senate" },
  { name: "BRICS", members: 10, gdpPct: 36, milexPct: 22, designation: "Counter-Order" },
  { name: "EU", members: 27, gdpPct: 18, milexPct: 15, designation: "Bureaucratic Empire" },
  { name: "G7", members: 7, gdpPct: 45, milexPct: 58, designation: "Old Guard's Club" },
  { name: "ASEAN", members: 10, gdpPct: 3.5, milexPct: 2, designation: "Neutralist Bazaar" },
];

const EXPLOITATION_TOP = [
  { label: "Taiwan semiconductors", score: 10 },
  { label: "Energy chokepoints", score: 9.0 },
  { label: "Partisan division", score: 8.5 },
  { label: "Nuclear escalation fear", score: 8.5 },
  { label: "AI hype dependency", score: 8.0 },
  { label: "Tech supply chains", score: 8.0 },
];

const MARITIME_TOP = [
  { name: "Taiwan Strait", score: 10 },
  { name: "Hormuz", score: 9.5 },
  { name: "Malacca", score: 9.0 },
  { name: "Suez", score: 8.5 },
  { name: "Bab el-Mandeb", score: 8.5 },
];

const DOMAIN_STATUS = [
  {
    domain: "Economy",
    status: "Bipolar",
    metric: "$126.3T · US+CN 42%",
    tone: "warning" as const,
    read: "Galactic wealth, marketplace governance.",
  },
  {
    domain: "Military",
    status: "Fragmented",
    metric: "$2.89T · US 35%",
    tone: "danger" as const,
    read: "Vast arsenals, no unified command.",
  },
  {
    domain: "Nuclear",
    status: "Critical",
    metric: "12,187 warheads · 9 states",
    tone: "danger" as const,
    read: "Powder keg. Match in our hand.",
  },
  {
    domain: "Energy",
    status: "Contested",
    metric: "104 mb/d oil · 800 GW renewables",
    tone: "warning" as const,
    read: "Old chokepoints yield to mineral ones.",
  },
  {
    domain: "Technology",
    status: "Concentrated",
    metric: "50% trade growth from AI",
    tone: "info" as const,
    read: "One sector holds the future hostage.",
  },
  {
    domain: "Trade",
    status: "Slowing",
    metric: "$35T · +7.5% (2025)",
    tone: "warning" as const,
    read: "Arteries of dependency — slow them.",
  },
  {
    domain: "Space",
    status: "Militarized",
    metric: "10,000+ satellites · ASAT active",
    tone: "danger" as const,
    read: "High ground already occupied.",
  },
  {
    domain: "Cyber",
    status: "Permeable",
    metric: "5 state actors + criminal scale",
    tone: "warning" as const,
    read: "Infrastructure runs on lowest bidder.",
  },
  {
    domain: "Climate",
    status: "Destabilizing",
    metric: "~37 Gt CO₂ · water stress rising",
    tone: "warning" as const,
    read: "Use their crisis; offer order.",
  },
  {
    domain: "Population",
    status: "Divided",
    metric: "8.3B · India #1",
    tone: "info" as const,
    read: "Masses without a master.",
  },
];

const THREAT_MATRIX = [
  { vector: "Taiwan Strait", domain: "Maritime", score: 10, tone: "danger" as const },
  { vector: "US–China rivalry", domain: "Geopolitical", score: 9.5, tone: "danger" as const },
  { vector: "Nuclear alert status", domain: "Nuclear", score: 9.0, tone: "danger" as const },
  { vector: "Hormuz / MENA energy", domain: "Energy", score: 9.0, tone: "warning" as const },
  { vector: "Semiconductor supply", domain: "Technology", score: 9.0, tone: "warning" as const },
  { vector: "ASAT / space weapons", domain: "Space", score: 8.5, tone: "warning" as const },
  { vector: "AI investment bubble", domain: "Economy", score: 8.0, tone: "warning" as const },
  { vector: "Critical infra cyber", domain: "Cyber", score: 8.0, tone: "warning" as const },
  { vector: "Food / water stress", domain: "Climate", score: 7.5, tone: "info" as const },
  { vector: "Debt (Global South)", domain: "Finance", score: 7.0, tone: "info" as const },
];

const VIEW_LABELS: Record<DashboardView, string> = {
  overview: "Overview",
  powers: "Great Powers",
  threats: "Threat Matrix",
  domains: "All Domains",
};

function ViewPills({
  view,
  setView,
}: {
  view: DashboardView;
  setView: (v: DashboardView) => void;
}) {
  const keys = Object.keys(VIEW_LABELS) as DashboardView[];
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

function KpiStrip() {
  return (
    <Grid columns={4} gap={12}>
      <Card variant="default">
        <CardBody>
          <Stat value={`$${KPI.gdpTrillion}T`} label="Planetary GDP (2026)" tone="info" />
        </CardBody>
      </Card>
      <Card variant="default">
        <CardBody>
          <Stat value={`${KPI.populationB}B`} label="Population" tone="info" />
        </CardBody>
      </Card>
      <Card variant="default">
        <CardBody>
          <Stat value={`$${KPI.milexBillion}B`} label="Military spend (2025)" tone="warning" />
        </CardBody>
      </Card>
      <Card variant="default">
        <CardBody>
          <Stat value={KPI.nuclearTotal.toLocaleString()} label="Nuclear warheads" tone="danger" />
        </CardBody>
      </Card>
      <Card variant="default">
        <CardBody>
          <Stat value={`$${KPI.tradeTrillion}T`} label="Global trade (2025)" tone="info" />
        </CardBody>
      </Card>
      <Card variant="default">
        <CardBody>
          <Stat value={`${KPI.usChinaGdpSharePct}%`} label="US + China GDP share" tone="danger" />
        </CardBody>
      </Card>
      <Card variant="default">
        <CardBody>
          <Stat value={`${KPI.usMilexSharePct}%`} label="US share of milex" tone="warning" />
        </CardBody>
      </Card>
      <Card variant="default">
        <CardBody>
          <Stat value={`${KPI.aiTradeSharePct}%`} label="AI share of trade growth" tone="warning" />
        </CardBody>
      </Card>
    </Grid>
  );
}

function OverviewDashboard() {
  const gdpPie = [
    { label: "United States", value: 25.6, tone: "danger" as const },
    { label: "China", value: 16.5, tone: "warning" as const },
    { label: "Rest of world", value: 57.9, tone: "neutral" as const },
  ];

  const milexPie = [
    { label: "United States", value: KPI.usMilexSharePct, tone: "danger" as const },
    { label: "All others", value: 100 - KPI.usMilexSharePct, tone: "neutral" as const },
  ];

  return (
    <Stack gap={14}>
      <Grid columns={"1fr 1fr 1fr"} gap={14} align="stretch">
        <Card>
          <CardHeader trailing={<Text tone="tertiary" size="small">$T · IMF 2026</Text>}>
            Top economies
          </CardHeader>
          <CardBody>
            <BarChart
              categories={GDP_TOP6.map((p) => p.name)}
              series={[{ name: "Nominal GDP ($T)", data: GDP_TOP6.map((p) => p.gdp), tone: "info" }]}
              horizontal
              height={220}
              valuePrefix="$"
              valueSuffix="T"
              showValues
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader trailing={<Text tone="tertiary" size="small">$B · SIPRI 2025</Text>}>
            Top military spenders
          </CardHeader>
          <CardBody>
            <BarChart
              categories={MILEX_TOP6.map((p) => p.name)}
              series={[{ name: "Defense ($B)", data: MILEX_TOP6.map((p) => p.value), tone: "danger" }]}
              horizontal
              height={220}
              valuePrefix="$"
              valueSuffix="B"
              showValues
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader trailing={<Text tone="tertiary" size="small">SIPRI Jan 2026</Text>}>
            Nuclear inventory (top 5)
          </CardHeader>
          <CardBody>
            <BarChart
              categories={NUCLEAR_TOP5.map((p) => p.name)}
              series={[{ name: "Warheads", data: NUCLEAR_TOP5.map((p) => p.total), tone: "danger" }]}
              height={220}
              showValues
            />
          </CardBody>
        </Card>
      </Grid>

      <Grid columns={"1fr 1fr 1fr"} gap={14} align="stretch">
        <Card>
          <CardHeader>GDP concentration</CardHeader>
          <CardBody>
            <Row gap={12} align="center" wrap>
              <PieChart data={gdpPie} donut size={160} />
              <Stack gap={6}>
                <Text weight="semibold">Two powers, 42% of output</Text>
                <Text tone="secondary" size="small">
                  Remaining 157+ polities fight over the rest.
                </Text>
              </Stack>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Military concentration</CardHeader>
          <CardBody>
            <Row gap={12} align="center" wrap>
              <PieChart data={milexPie} donut size={160} />
              <Stack gap={6}>
                <Text weight="semibold">US: 35% of global milex</Text>
                <Text tone="secondary" size="small">
                  More than the next nine combined.
                </Text>
              </Stack>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Alliance blocs at a glance</CardHeader>
          <CardBody>
            <Stack gap={8}>
              {ALLIANCE_BLOCS.slice(0, 4).map((b) => (
                <Row gap={8} align="center" justify="space-between">
                  <Text weight="semibold">{b.name}</Text>
                  <Text tone="secondary" size="small">
                    {b.members} members · {b.gdpPct}% GDP
                  </Text>
                </Row>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Grid columns={"1fr 1fr"} gap={14} align="stretch">
        <Card>
          <CardHeader trailing={<Text tone="tertiary" size="small">0–10 leverage</Text>}>
            Top exploitation vectors
          </CardHeader>
          <CardBody>
            <BarChart
              categories={EXPLOITATION_TOP.map((e) => e.label)}
              series={[{ name: "Score", data: EXPLOITATION_TOP.map((e) => e.score), tone: "warning" }]}
              horizontal
              height={200}
              showValues
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader trailing={<Text tone="tertiary" size="small">0–10 leverage</Text>}>
            Maritime chokepoints
          </CardHeader>
          <CardBody>
            <BarChart
              categories={MARITIME_TOP.map((m) => m.name)}
              series={[{ name: "Score", data: MARITIME_TOP.map((m) => m.score), tone: "warning" }]}
              horizontal
              height={200}
              showValues
            />
          </CardBody>
        </Card>
      </Grid>

      <H3>Domain status board</H3>
      <Grid columns={5} gap={10}>
        {DOMAIN_STATUS.map((d) => (
          <Card>
            <CardBody>
              <Stack gap={6}>
                <Row gap={8} align="center" justify="space-between">
                  <Text weight="semibold">{d.domain}</Text>
                  <Text tone="tertiary" size="small">
                    {d.status}
                  </Text>
                </Row>
                <Stat value={d.metric} label={d.read} tone={d.tone} />
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <Grid columns={2} gap={14}>
        <Callout tone="danger" title="Emperor's assessment">
          <Text>
            Do not invade. Infiltrate. They possess the resources of a galactic empire and the governance of a
            marketplace — 8.3 billion souls, 12,187 warheads, $126T in output, and not one Emperor. When they
            beg for order, we shall provide it.
          </Text>
        </Callout>
        <Callout tone="warning" title="Priority action">
          <Text>
            Wedge NATO against BRICS. Pressure Taiwan semiconductor lane. Amplify energy dependencies through
            Hormuz and MENA. Let AI investment concentration become their single point of failure.
          </Text>
        </Callout>
      </Grid>
    </Stack>
  );
}

function PowersView() {
  return (
    <Stack gap={14}>
      <H2>Great Powers dossier</H2>
      <Table
        headers={["Rank", "Territory", "Imperial designation", "GDP ($T)", "Milex ($B)", "Assessment"]}
        rows={[
          [1, "United States", "Fractured Hegemon", "32.38", "921", "Most exploitable through division."],
          [2, "China", "Silent Rival", "20.85", "251", "Worthy adversary or useful instrument."],
          [3, "Germany", "Reluctant Arsenal", "5.45", "107", "Turn guilt into leverage."],
          [4, "Japan", "Pacified Forgemaster", "4.38", "59", "Constitutional leash is fraying."],
          [5, "United Kingdom", "Diminished Archipelago", "4.26", "94", "Useful relay for influence."],
          [6, "India", "Rising Mass", "4.15", "78", "Buy alignment cheaply now."],
          [7, "France", "Proud Autonomist", "3.60", "65", "Flatter independence; undermine unity."],
          [8, "Italy", "Beautiful Liability", "2.74", "38", "Debt pressure point in EU bloc."],
          [9, "Russia", "Chaos Agent", "2.66", "161", "Do not destroy. Use."],
          [10, "Brazil", "Sleeping Continent", "2.64", "24", "Infrastructure finance buys dependency."],
        ]}
        striped
        framed
      />

      <H3>Alliance comparison</H3>
      <Table
        headers={["Bloc", "Designation", "Members", "GDP share", "Milex share"]}
        rows={ALLIANCE_BLOCS.map((b) => [
          <Text weight="semibold">{b.name}</Text>,
          b.designation,
          b.members,
          `~${b.gdpPct}%`,
          `~${b.milexPct}%`,
        ])}
        striped
        framed
      />
    </Stack>
  );
}

function ThreatsView() {
  const categories = THREAT_MATRIX.map((t) => t.vector);
  const scores = THREAT_MATRIX.map((t) => t.score);

  return (
    <Stack gap={14}>
      <H2>Threat & exploitation matrix</H2>
      <Text tone="secondary">
        Composite risk index (0–10) across all domains. Higher = greater leverage for Imperial operations without
        direct invasion.
      </Text>

      <Card>
        <CardHeader trailing={<Text tone="tertiary" size="small">Score 0–10</Text>}>
          Priority threat vectors
        </CardHeader>
        <CardBody>
          <BarChart
            categories={categories}
            series={[{ name: "Threat / leverage score", data: scores, tone: "danger" }]}
            horizontal
            height={360}
            showValues
          />
        </CardBody>
      </Card>

      <Table
        headers={["Vector", "Domain", "Score", "Priority"]}
        rows={THREAT_MATRIX.map((t) => [
          <Text weight="semibold">{t.vector}</Text>,
          t.domain,
          t.score.toFixed(1),
          t.score >= 9 ? "IMMEDIATE" : t.score >= 8 ? "HIGH" : "MONITOR",
        ])}
        striped
        framed
      />

      <Grid columns={3} gap={14}>
        <Card>
          <CardBody>
            <Stat value={KPI.nuclearDeployed.toLocaleString()} label="Deployed warheads" tone="danger" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value={`${KPI.nuclearHighAlert}+`} label="High alert (missiles)" tone="danger" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="83%" label="US + Russia usable nukes" tone="warning" />
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}

function DomainsView() {
  return (
    <Stack gap={14}>
      <H2>All domains — full status board</H2>
      <Grid columns={2} gap={14}>
        {DOMAIN_STATUS.map((d) => (
          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">{d.status}</Text>}>
              {d.domain}
            </CardHeader>
            <CardBody>
              <Stat value={d.metric} label={d.read} tone={d.tone} />
            </CardBody>
          </Card>
        ))}
      </Grid>

      <H3>Global power distribution</H3>
      <Card>
        <CardBody>
          <UsageBar
            total={100}
            topLeftLabel="World GDP share (top powers)"
            topRightLabel="IMF 2026"
            segments={[
              { id: "us", value: 25.6, color: "orange" },
              { id: "cn", value: 16.5, color: "yellow" },
              { id: "de", value: 4.3, color: "blue" },
              { id: "jp", value: 3.5, color: "purple" },
              { id: "other-top8", value: 12.0, color: "gray" },
            ]}
          />
          <Divider style={{ marginTop: 14, marginBottom: 14 }} />
          <UsageBar
            total={100}
            topLeftLabel="World military spend share (top powers)"
            topRightLabel="SIPRI 2025"
            segments={[
              { id: "us-m", value: 31.9, color: "orange" },
              { id: "cn-m", value: 8.7, color: "yellow" },
              { id: "ru-m", value: 5.6, color: "orange" },
              { id: "other-m", value: 10.0, color: "gray" },
            ]}
          />
        </CardBody>
      </Card>

      <Grid columns={2} gap={14}>
        <Callout tone="info" title="Technology">
          <Text>
            ~50% of 2025 merchandise trade growth from AI. ~70% of North American investment growth. Semiconductors
            and data centers are the new forges — Taiwan is the most valuable rock in the sector.
          </Text>
        </Callout>
        <Callout tone="warning" title="Energy">
          <Text>
            104 mb/d oil demand. 800 GW renewable additions (2025). Transition shifts dependency from sheikhdoms to
            mineral refiners — China dominates processing.
          </Text>
        </Callout>
        <Callout tone="danger" title="Space">
          <Text>
            10,000+ satellites. Starlink owns low orbit. ASAT weapons demonstrated by four powers. Nuclear ASAT
            reportedly under development — blind them and they stumble.
          </Text>
        </Callout>
        <Callout tone="warning" title="Climate & food">
          <Text>
            ~37 Gt CO₂/year. Food and water stress in 2B+ lives. Empty bellies topple thrones faster than armies.
          </Text>
        </Callout>
      </Grid>
    </Stack>
  );
}

export default function PalpatineImperialDashboard() {
  const theme = useHostTheme();
  const [view, setView] = useCanvasState<DashboardView>("view", "overview");

  return (
    <Stack gap={16} style={{ padding: 16, background: theme.bg.editor }}>
      <Stack gap={8}>
        <Row gap={12} align="center" wrap>
          <H1>Imperial Command Dashboard — Sector 001 (Earth)</H1>
          <Spacer />
          <Pill active>Live snapshot · Jun 2026</Pill>
        </Row>

        <Text tone="secondary">
          Emperor Palpatine's unified war-room view of Terra. KPI strip, power rankings, threat matrix, and domain
          status across economy, military, nuclear, energy, technology, trade, space, cyber, and climate.
        </Text>

        <Callout tone="info" title="Imperial directive">
          <Text>
            "This dashboard is your instrument, Lord Vader. Monitor the KPIs. Watch the chokepoints. When a domain
            turns red — that is where we strike, or where we offer the comforting lie of order."
          </Text>
        </Callout>

        <ViewPills view={view} setView={setView} />
      </Stack>

      <KpiStrip />

      {view === "overview" && <OverviewDashboard />}
      {view === "powers" && <PowersView />}
      {view === "threats" && <ThreatsView />}
      {view === "domains" && <DomainsView />}

      <Divider />

      <Stack gap={8}>
        <H3>Sources</H3>
        <Row gap={14} wrap>
          <Link href="https://www.imf.org/en/publications/weo/issues/2026/04/14/world-economic-outlook-april-2026">
            IMF WEO 2026
          </Link>
          <Link href="https://www.sipri.org/yearbook/2026">SIPRI 2026</Link>
          <Link href="https://unctad.org/system/files/official-document/ditcinf2026d4_en.pdf">UNCTAD 2026</Link>
          <Link href="https://www.wto.org/english/res_e/booksp_e/gtos0326_e.pdf">WTO 2026</Link>
          <Link href="https://www.iea.org/reports/global-energy-review-2026/key-findings">IEA 2026</Link>
          <Link href="https://worldpopulationreview.com/">Population 2026</Link>
        </Row>
        <Text tone="tertiary" size="small">
          Fictional Imperial framing atop public data. Detailed sector drill-down: palpatine-earth-assessment.canvas.tsx
        </Text>
      </Stack>
    </Stack>
  );
}
