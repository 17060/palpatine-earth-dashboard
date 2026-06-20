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

type SectorKey =
  | "economy"
  | "military"
  | "nuclear"
  | "energy"
  | "alliances"
  | "technology"
  | "space"
  | "demographics"
  | "trade"
  | "maritime"
  | "cyber"
  | "climate"
  | "exploitation";

type Power = {
  rank: number;
  name: string;
  palpatineName: string;
  gdpTrillion: number;
  gdpSharePct: number;
  milexBillion: number | null;
  threatLevel: "negligible" | "moderate" | "significant" | "critical";
  palpatineNote: string;
};

type TopicBrief = {
  title: string;
  metric: string;
  palpatineRead: string;
  source: string;
};

const US_MILEX_BILLION = 921;
const US_MILEX_SHARE = 35.2;
const WORLD_POP_BILLION = 8.3;
const GLOBAL_TRADE_TRILLION = 35;
const NUCLEAR_TOTAL = 12187;
const NUCLEAR_DEPLOYED = 4012;
const NUCLEAR_HIGH_ALERT = 2100;

const GDP_POWERS: Power[] = [
  {
    rank: 1,
    name: "United States",
    palpatineName: "The Fractured Hegemon",
    gdpTrillion: 32.38,
    gdpSharePct: 25.6,
    milexBillion: 921,
    threatLevel: "critical",
    palpatineNote:
      "A Republic in all but name — vast wealth, endless elections, and a Senate that cannot govern. *Most exploitable through division.*",
  },
  {
    rank: 2,
    name: "China",
    palpatineName: "The Silent Rival",
    gdpTrillion: 20.85,
    gdpSharePct: 16.5,
    milexBillion: 251,
    threatLevel: "critical",
    palpatineNote:
      "They build in silence, as I once did. Manufacturing depth, maritime chokepoints, single-party command. *Worthy adversary or useful instrument.*",
  },
  {
    rank: 3,
    name: "Germany",
    palpatineName: "The Reluctant Arsenal",
    gdpTrillion: 5.45,
    gdpSharePct: 4.3,
    milexBillion: 107,
    threatLevel: "significant",
    palpatineNote: "Industrial precision without imperial ambition — until recently. *Turn their guilt into leverage.*",
  },
  {
    rank: 4,
    name: "Japan",
    palpatineName: "The Pacified Forgemaster",
    gdpTrillion: 4.38,
    gdpSharePct: 3.5,
    milexBillion: 59,
    threatLevel: "significant",
    palpatineNote: "Once they understood power. Their constitution is a leash — one that is fraying.",
  },
  {
    rank: 5,
    name: "United Kingdom",
    palpatineName: "The Diminished Archipelago",
    gdpTrillion: 4.26,
    gdpSharePct: 3.4,
    milexBillion: 94,
    threatLevel: "moderate",
    palpatineNote: "They once ruled a quarter of this planet. Now they cling to a 'special relationship.'",
  },
  {
    rank: 6,
    name: "India",
    palpatineName: "The Rising Mass",
    gdpTrillion: 4.15,
    gdpSharePct: 3.3,
    milexBillion: 78,
    threatLevel: "significant",
    palpatineNote: "Population without cohesion — yet. *Buy alignment cheaply now.*",
  },
  {
    rank: 7,
    name: "France",
    palpatineName: "The Proud Autonomist",
    gdpTrillion: 3.6,
    gdpSharePct: 2.9,
    milexBillion: 65,
    threatLevel: "moderate",
    palpatineNote: "Nuclear vanity and diplomatic pretension. *Flatter independence; undermine unity.*",
  },
  {
    rank: 8,
    name: "Italy",
    palpatineName: "The Beautiful Liability",
    gdpTrillion: 2.74,
    gdpSharePct: 2.2,
    milexBillion: 38,
    threatLevel: "moderate",
    palpatineNote: "Culture without command. Debt without discipline.",
  },
  {
    rank: 9,
    name: "Russia",
    palpatineName: "The Chaos Agent",
    gdpTrillion: 2.66,
    gdpSharePct: 2.1,
    milexBillion: 161,
    threatLevel: "significant",
    palpatineNote: "Chaos is a weapon — energy leverage, frozen conflicts, information warfare. *Use them.*",
  },
  {
    rank: 10,
    name: "Brazil",
    palpatineName: "The Sleeping Continent",
    gdpTrillion: 2.64,
    gdpSharePct: 2.1,
    milexBillion: 24,
    threatLevel: "negligible",
    palpatineNote: "Resources without resolve. *Infrastructure finance buys decades of dependency.*",
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
  { name: "Saudi Arabia", value: 58 },
  { name: "Ukraine", value: 54 },
];

const NUCLEAR_POWERS = [
  { name: "Russia", total: 5459, deployed: 1150, palpatineName: "The Frozen Arsenal" },
  { name: "United States", total: 5177, deployed: 1477, palpatineName: "The Hegemon's Annihilation Clause" },
  { name: "China", total: 620, deployed: 576, palpatineName: "The Quiet Multiplier" },
  { name: "France", total: 290, deployed: 10, palpatineName: "Vanity Deterrence" },
  { name: "United Kingdom", total: 225, deployed: 105, palpatineName: "Submarine Pride" },
  { name: "India", total: 180, deployed: 180, palpatineName: "Regional Ambition" },
  { name: "Pakistan", total: 170, deployed: 170, palpatineName: "Permanent Crisis" },
  { name: "Israel", total: 90, deployed: 90, palpatineName: "The Unacknowledged" },
  { name: "North Korea", total: 50, deployed: 50, palpatineName: "The Mad Jester" },
];

const POPULATION_POWERS = [
  { name: "India", popM: 1500, sharePct: 18.1 },
  { name: "China", popM: 1400, sharePct: 16.9 },
  { name: "United States", popM: 345, sharePct: 4.2 },
  { name: "Indonesia", popM: 285, sharePct: 3.4 },
  { name: "Pakistan", popM: 255, sharePct: 3.1 },
  { name: "Nigeria", popM: 230, sharePct: 2.8 },
  { name: "Brazil", popM: 215, sharePct: 2.6 },
  { name: "Bangladesh", popM: 175, sharePct: 2.1 },
];

const ALLIANCE_BLOCS = [
  {
    name: "NATO",
    members: 32,
    gdpSharePct: 55,
    milexSharePct: 62,
    populationB: 1.0,
    palpatineName: "The Western Senate",
    note: "Article 5 collective defense — an oath of mutual suicide dressed as security. Fragmented will, unified bureaucracy.",
  },
  {
    name: "BRICS (expanded)",
    members: 10,
    gdpSharePct: 36,
    milexSharePct: 22,
    populationB: 3.6,
    palpatineName: "The Counter-Order",
    note: "An economic confederation pretending it is not an alliance. Population weight without military integration — yet.",
  },
  {
    name: "European Union",
    members: 27,
    gdpSharePct: 18,
    milexSharePct: 15,
    populationB: 0.45,
    palpatineName: "The Bureaucratic Empire",
    note: "Regulation without rifles. They harmonize cheese labels while Russia rearmaments.",
  },
  {
    name: "G7",
    members: 7,
    gdpSharePct: 45,
    milexSharePct: 58,
    populationB: 0.8,
    palpatineName: "The Old Guard's Club",
    note: "Coordination without command. Useful for sanctions theater.",
  },
  {
    name: "ASEAN",
    members: 10,
    gdpSharePct: 3.5,
    milexSharePct: 2,
    populationB: 0.68,
    palpatineName: "The Neutralist Bazaar",
    note: "Refuses to choose sides — which means everyone bids for their loyalty.",
  },
];

const ENERGY_METRICS: TopicBrief[] = [
  {
    title: "Global oil demand",
    metric: "~104 million barrels/day (2026, IEA)",
    palpatineRead: "Liquid power. Who controls the spigot controls the Senate — or whatever passes for one.",
    source: "IEA Oil Market Report 2026",
  },
  {
    title: "Brent crude (proxy)",
    metric: "$96.09/bbl (May 28, 2026 close)",
    palpatineRead: "A single pipeline explosion moves more policy than a thousand diplomats.",
    source: "FT markets",
  },
  {
    title: "Renewable capacity added",
    metric: "800 GW in 2025 (solar ~75%)",
    palpatineRead: "They flee hydrocarbon dependency — only to create new chokepoints in minerals and grids.",
    source: "IEA Global Energy Review 2026",
  },
  {
    title: "Battery storage added",
    metric: "~110 GW (2025)",
    palpatineRead: "Strategic buffering — shifts leverage from fuel exporters to grid owners.",
    source: "IEA",
  },
  {
    title: "Electric vehicle sales",
    metric: ">20 million (2025)",
    palpatineRead: "Mobility without oil — but total dependence on power systems and supply chains.",
    source: "IEA",
  },
  {
    title: "Critical minerals",
    metric: "China dominates refining (lithium, rare earths, cobalt processing)",
    palpatineRead: "The new kyber crystals. He who refines them holds the high ground.",
    source: "IEA / USGS context",
  },
];

const TECH_METRICS: TopicBrief[] = [
  {
    title: "AI-linked trade growth",
    metric: "~50% of 2025 merchandise trade growth (value terms)",
    palpatineRead: "They have built a new religion around 'intelligence.' Perfect — religions are easily corrupted.",
    source: "UN DESA WESP 2026 / WTO",
  },
  {
    title: "AI share of investment growth",
    metric: "~70% of North American investment growth (2025 Q1–Q3)",
    palpatineRead: "One sector consumes the future. When it stumbles, the entire economy kneels.",
    source: "WTO Global Trade Outlook Mar 2026",
  },
  {
    title: "Semiconductor demand",
    metric: "Double/triple-digit YoY growth in AI hardware categories",
    palpatineRead: "The forges of their era. Taiwan is the most valuable rock in the sector.",
    source: "UNCTAD Trade Foresights 2026",
  },
  {
    title: "Data center FDI",
    metric: ">20% of global greenfield FDI (2025)",
    palpatineRead: "Temples of computation — power-hungry, water-hungry, vulnerable.",
    source: "UNCTAD / WTO",
  },
  {
    title: "Leading AI powers",
    metric: "US (models/chips), China (scale/manufacturing), EU (regulation)",
    palpatineRead: "Three factions racing to build a mind without a master. *Ensure there is only one master.*",
    source: "Public industry estimates",
  },
];

const SPACE_METRICS: TopicBrief[] = [
  {
    title: "Active satellites",
    metric: "~10,000+ in orbit (majority commercial/US-led constellations)",
    palpatineRead: "Their eyes in the sky — navigation, communication, reconnaissance. Blind them and they stumble.",
    source: "Union of Concerned Scientists estimates",
  },
  {
    title: "Starlink dominance",
    metric: "6,000+ satellites (SpaceX constellation)",
    palpatineRead: "One private firm owns low-orbit communications. A single point of leverage — or failure.",
    source: "Public launch manifests",
  },
  {
    title: "Anti-satellite weapons",
    metric: "US, Russia, China, India demonstrated ASAT capability",
    palpatineRead: "They can shoot down their own eyes. Russia reportedly pursues nuclear ASAT — *madness, or opportunity?*",
    source: "SIPRI / Atlantic Council 2026",
  },
  {
    title: "Space militarization",
    metric: "Space Force (US), PLA Aerospace Force (China), dual-use RPO satellites",
    palpatineRead: "The next battlefield is already occupied. Whoever controls orbit controls the surface.",
    source: "IISS / Atlantic Council",
  },
];

const MARITIME_CHOKEPOINTS = [
  { name: "Strait of Hormuz", flow: "~20% of global oil", score: 9.5, note: "Persian Gulf exit — Iran's thumb on the scale" },
  { name: "Strait of Malacca", flow: "~25% of traded goods", score: 9.0, note: "Indo-Pacific lifeline between Hegemon and Silent Rival" },
  { name: "Suez Canal", flow: "~12% of global trade", score: 8.5, note: "Europe-Asia shortcut — already proven fragile" },
  { name: "Bab el-Mandeb", flow: "Red Sea gateway", score: 8.5, note: "Houthi disruptions proved shipping is a political weapon" },
  { name: "Panama Canal", flow: "Americas connector", score: 7.5, note: "Drought and congestion — nature joins the conspiracy" },
  { name: "Taiwan Strait", flow: "Semiconductor corridor", score: 10.0, note: "The most valuable shipping lane in the sector. *Handle with precision.*" },
];

const CYBER_VECTORS = [
  { actor: "Russia", focus: "Critical infrastructure, elections, energy", score: 8.5 },
  { actor: "China", focus: "IP theft, telecom, supply chain", score: 8.0 },
  { actor: "North Korea", focus: "Cryptocurrency theft, ransomware", score: 7.0 },
  { actor: "Iran", focus: "Regional infrastructure, Israel/US targets", score: 7.5 },
  { actor: "Non-state / criminal", focus: "Ransomware, fraud at scale", score: 7.0 },
];

const CLIMATE_METRICS: TopicBrief[] = [
  {
    title: "Global CO₂ emissions",
    metric: "~37 Gt/year (energy + industry, recent levels)",
    palpatineRead: "They poison their own world while debating who pays. *Excellent.*",
    source: "Global Carbon Project / IEA",
  },
  {
    title: "Climate displacement",
    metric: "Tens of millions annually (conflict + disaster + drought)",
    palpatineRead: "Refugees are recruits — for labor, for resentment, for revolution.",
    source: "UNHCR / IPCC context",
  },
  {
    title: "Food price sensitivity",
    metric: "Wheat, rice, corn markets tied to energy and weather shocks",
    palpatineRead: "Empty bellies topple thrones faster than armies.",
    source: "FAO",
  },
  {
    title: "Water stress",
    metric: "2+ billion live in water-stressed regions",
    palpatineRead: "The next wars will be fought over rivers, not borders.",
    source: "UN Water",
  },
];

const EXPLOITATION_VECTORS = [
  { label: "Partisan division (US/EU)", score: 8.5, note: "Election cycles create predictable paralysis windows" },
  { label: "Energy chokepoints (MENA)", score: 9.0, note: "Oil and gas remain the planet's true currency" },
  { label: "Taiwan semiconductor lane", score: 10.0, note: "Single point of failure for global compute" },
  { label: "Trade fragmentation", score: 7.5, note: "Tariffs and sanctions reshape blocs to your design" },
  { label: "Debt leverage (Global South)", score: 7.0, note: "Infrastructure finance buys alignment cheaply" },
  { label: "AI hype dependency", score: 8.0, note: "One sector's collapse cascades through investment" },
  { label: "Nuclear escalation fear", score: 8.5, note: "Deterrence theology keeps rivals frozen — or desperate" },
  { label: "Information warfare", score: 6.5, note: "Narrative without unified doctrine — room for a stronger voice" },
  { label: "Climate displacement", score: 7.0, note: "Migration flows destabilize receiving states" },
  { label: "Space asset dependency", score: 7.5, note: "GPS/comms blindness cripples modern militaries" },
];

const IMPERIAL_VERDICTS = [
  {
    title: "Economic assessment",
    verdict:
      "126 trillion credits in planetary output, concentrated in two rival blocs controlling 42%. No unified treasury, no Emperor — only a marketplace of competing Senates.",
    tone: "warning" as const,
  },
  {
    title: "Military assessment",
    verdict:
      "$2.89T on 'defense' in 2025. The Hegemon spends one-third of all military credits alone. Arsenals vast; will fragmented. They would unite against each other before they united against us.",
    tone: "danger" as const,
  },
  {
    title: "Nuclear assessment",
    verdict:
      "12,187 warheads across nine states. Russia and the Hegemon hold 83% of usable stockpiles. 2,100+ on high alert. They call this 'stability.' I call it a powder keg with a lit fuse — *and a match in my hand.*",
    tone: "danger" as const,
  },
  {
    title: "Technology assessment",
    verdict:
      "Half their trade growth flows from 'artificial intelligence.' They worship a tool they barely understand. Control the chips, the data, and the narrative — and you control them.",
    tone: "info" as const,
  },
  {
    title: "Demographic assessment",
    verdict:
      "8.3 billion souls, no shared identity. India now outnumbers China — two giants, one crowded continent. Population is power only when harnessed. *They are not harnessed.*",
    tone: "warning" as const,
  },
  {
    title: "Strategic recommendation",
    verdict:
      "Do not invade. Infiltrate. Sow distrust, amplify dependencies, fund chaos and order alike. When they beg for stability — offer the Empire. They will thank you for their chains.",
    tone: "info" as const,
  },
];

const SECTOR_LABELS: Record<SectorKey, string> = {
  economy: "Economy",
  military: "Military",
  nuclear: "Nuclear",
  energy: "Energy",
  alliances: "Alliances",
  technology: "Technology",
  space: "Space",
  demographics: "Population",
  trade: "Trade",
  maritime: "Maritime",
  cyber: "Cyber",
  climate: "Climate",
  exploitation: "Exploitation",
};

function SectorPills({
  sector,
  setSector,
}: {
  sector: SectorKey;
  setSector: (s: SectorKey) => void;
}) {
  const keys = Object.keys(SECTOR_LABELS) as SectorKey[];
  return (
    <Row gap={8} align="center" wrap>
      {keys.map((k) => (
        <Pill active={sector === k} onClick={() => setSector(k)}>
          {SECTOR_LABELS[k]}
        </Pill>
      ))}
    </Row>
  );
}

function TopicTable({ topics }: { topics: TopicBrief[] }) {
  return (
    <Table
      headers={["Subject", "Data", "Imperial reading", "Source"]}
      rows={topics.map((t) => [
        <Text weight="semibold">{t.title}</Text>,
        t.metric,
        <Text tone="secondary">{t.palpatineRead}</Text>,
        <Text tone="tertiary" size="small">
          {t.source}
        </Text>,
      ])}
      striped
      framed
    />
  );
}

export default function PalpatineEarthAssessment() {
  const theme = useHostTheme();
  const [sector, setSector] = useCanvasState<SectorKey>("sector", "economy");

  const gdpCategories = GDP_POWERS.slice(0, 8).map((p) => p.name);
  const gdpData = GDP_POWERS.slice(0, 8).map((p) => p.gdpTrillion);
  const milexCategories = MILEX_TOP.map((m) => m.name);
  const milexData = MILEX_TOP.map((m) => m.value);
  const nuclearCategories = NUCLEAR_POWERS.map((n) => n.name);
  const nuclearData = NUCLEAR_POWERS.map((n) => n.total);
  const popCategories = POPULATION_POWERS.map((p) => p.name);
  const popData = POPULATION_POWERS.map((p) => p.popM);
  const exploitCategories = EXPLOITATION_VECTORS.map((e) => e.label);
  const exploitScores = EXPLOITATION_VECTORS.map((e) => e.score);
  const maritimeCategories = MARITIME_CHOKEPOINTS.map((m) => m.name);
  const maritimeScores = MARITIME_CHOKEPOINTS.map((m) => m.score);

  const gdpPie = [
    { label: "United States", value: 25.6, tone: "danger" as const },
    { label: "China", value: 16.5, tone: "warning" as const },
    { label: "Rest of world", value: 57.9, tone: "neutral" as const },
  ];

  const milexPie = [
    { label: "United States", value: US_MILEX_SHARE, tone: "danger" as const },
    { label: "All others", value: 100 - US_MILEX_SHARE, tone: "neutral" as const },
  ];

  const nuclearPie = [
    { label: "Russia", value: 44.8, tone: "danger" as const },
    { label: "United States", value: 42.5, tone: "warning" as const },
    { label: "All others", value: 12.7, tone: "neutral" as const },
  ];

  return (
    <Stack gap={16} style={{ padding: 16, background: theme.bg.editor }}>
      <Stack gap={8}>
        <Row gap={12} align="center" wrap>
          <H1>Imperial Intelligence Briefing: Sector Zero-Zero-Zero-One</H1>
          <Spacer />
          <Pill tone="warning">CLASSIFIED — EYES OF THE EMPEROR ONLY</Pill>
        </Row>

        <Text tone="secondary">
          Comprehensive assessment of Terra (Earth). Thirteen domains of analysis covering economy, force,
          population, alliances, energy, technology, space, trade, maritime chokepoints, cyber, climate, and
          exploitation vectors. Data as of IMF April 2026, SIPRI/IISS 2025–2026, UN/UNCTAD/WTO 2025–2026.
        </Text>

        <Callout tone="info" title="From the desk of Emperor Palpatine">
          <Text>
            "You asked for a fuller picture, Lord Vader. Very well. This mudball is not merely rich and armed — it
            is *connected*, *dependent*, and *fractured* in a dozen different ways. Study each domain. Find the
            pressure points. Then apply them — slowly, precisely, and without mercy."
          </Text>
        </Callout>

        <SectorPills sector={sector} setSector={setSector} />
      </Stack>

      <Grid columns={4} gap={14}>
        <Card>
          <CardBody>
            <Stat value="$126.3T" label="Planetary GDP (2026)" tone="info" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="8.3B" label="Population (2026)" tone="info" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="$2.89T" label="Military spend (2025)" tone="warning" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="12,187" label="Nuclear warheads (Jan 2026)" tone="danger" />
          </CardBody>
        </Card>
      </Grid>

      <Grid columns={4} gap={14}>
        <Card>
          <CardBody>
            <Stat value="$35T" label="Global trade (2025)" tone="info" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="~195" label="Independent polities" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="9" label="Nuclear-armed states" tone="danger" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value="~50%" label="AI share of 2025 trade growth" tone="warning" />
          </CardBody>
        </Card>
      </Grid>

      {sector === "economy" && (
        <Stack gap={14}>
          <H2>Economic dominions</H2>
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
              <CardHeader>Bipolar concentration</CardHeader>
              <CardBody>
                <Row gap={16} align="center" wrap>
                  <PieChart data={gdpPie} donut size={200} />
                  <Text tone="secondary">
                    US + China: 42.1% of planetary output. The rest fight over scraps — ideal conditions for a patient
                    manipulator.
                  </Text>
                </Row>
              </CardBody>
            </Card>
          </Grid>
          <Table
            headers={["Rank", "Territory", "Designation", "GDP", "Share", "Threat", "Assessment"]}
            rows={GDP_POWERS.map((p) => [
              p.rank,
              <Text weight="semibold">{p.name}</Text>,
              <Text tone="secondary">{p.palpatineName}</Text>,
              `$${p.gdpTrillion.toFixed(2)}T`,
              `${p.gdpSharePct}%`,
              p.threatLevel.toUpperCase(),
              <Text tone="secondary">{p.palpatineNote}</Text>,
            ])}
            striped
            framed
          />
        </Stack>
      )}

      {sector === "military" && (
        <Stack gap={14}>
          <H2>Military posture</H2>
          <Grid columns={"1.4fr 1fr"} gap={16} align="stretch">
            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">Billions USD</Text>}>
                Top 10 military spenders (2025)
              </CardHeader>
              <CardBody>
                <BarChart
                  categories={milexCategories}
                  series={[{ name: "Defense budget ($B)", data: milexData, tone: "danger" }]}
                  horizontal
                  height={340}
                  valuePrefix="$"
                  valueSuffix="B"
                  showValues
                />
                <Text tone="tertiary" size="small" style={{ marginTop: 10 }}>
                  Source: SIPRI / IISS 2025
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>War chest concentration</CardHeader>
              <CardBody>
                <PieChart data={milexPie} donut size={180} />
                <Stat value={`$${US_MILEX_BILLION}B`} label="US defense budget" tone="danger" />
                <Text tone="secondary">
                  Carriers, stealth aircraft, hypersonics, drones, cyber commands — enough to sterilize the planet,
                  deployed against each other.
                </Text>
              </CardBody>
            </Card>
          </Grid>
          <Callout tone="danger" title="Emperor's military verdict">
            <Text>
              Active personnel exceeds 20 million globally across all states. NATO fields integrated command; BRICS
              does not — yet. Their greatest weakness is not firepower but *coordination*. A house divided.
            </Text>
          </Callout>
        </Stack>
      )}

      {sector === "nuclear" && (
        <Stack gap={14}>
          <H2>Nuclear arsenal — the annihilation calculus</H2>
          <Text tone="secondary">
            SIPRI Yearbook 2026 (January inventory). Nine nuclear-armed states; 12,187 total warheads; 9,745
            available for military use; ~4,012 deployed; ~2,100 on high operational alert.
          </Text>
          <Grid columns={4} gap={14}>
            <Stat value="12,187" label="Total warheads" tone="danger" />
            <Stat value="4,012" label="Deployed" tone="danger" />
            <Stat value="2,100+" label="High alert (missiles)" tone="danger" />
            <Stat value="83%" label="US + Russia share of usable stockpile" tone="warning" />
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
              <CardHeader>Bipolar nuclear order</CardHeader>
              <CardBody>
                <PieChart data={nuclearPie} donut size={200} />
                <Text tone="secondary">
                  China is the fastest-growing arsenal (~620 warheads, tripling since 2020). By 2030 they may match
                  ICBM counts of the two giants — a third pole of annihilation.
                </Text>
              </CardBody>
            </Card>
          </Grid>
          <Table
            headers={["State", "Imperial designation", "Total", "Deployed", "Palpatine's note"]}
            rows={NUCLEAR_POWERS.map((n) => [
              <Text weight="semibold">{n.name}</Text>,
              <Text tone="secondary">{n.palpatineName}</Text>,
              n.total.toLocaleString(),
              n.deployed.toLocaleString(),
              <Text tone="secondary">
                {n.name === "Russia" || n.name === "United States"
                  ? "Mutual assured destruction — a standoff I can exploit without firing a shot."
                  : n.name === "China"
                    ? "Growing fast. Do not let them reach parity unnoticed."
                    : n.name === "North Korea"
                      ? "Unpredictable — useful for distraction."
                      : "Regional deterrent. Manage, do not fear."}
              </Text>,
            ])}
            striped
            framed
          />
        </Stack>
      )}

      {sector === "energy" && (
        <Stack gap={14}>
          <H2>Energy & resources — the true currency</H2>
          <Callout tone="warning" title="Emperor's energy verdict">
            <Text>
              They transition from oil to electrons — believing this frees them. It merely shifts dependency from
              sheikhdoms to grid operators and mineral refiners. Control lithium, copper, and rare earth processing,
              and you control the transition itself.
            </Text>
          </Callout>
          <TopicTable topics={ENERGY_METRICS} />
        </Stack>
      )}

      {sector === "alliances" && (
        <Stack gap={14}>
          <H2>Alliances & blocs — competing Senates</H2>
          <Text tone="secondary">
            No single bloc commands the planet. Each is a coalition of convenience — ripe for wedge strategies.
          </Text>
          <Table
            headers={["Bloc", "Designation", "Members", "GDP share", "Milex share", "Population", "Assessment"]}
            rows={ALLIANCE_BLOCS.map((b) => [
              <Text weight="semibold">{b.name}</Text>,
              <Text tone="secondary">{b.palpatineName}</Text>,
              b.members,
              `~${b.gdpSharePct}%`,
              `~${b.milexSharePct}%`,
              `~${b.populationB}B`,
              <Text tone="secondary">{b.note}</Text>,
            ])}
            striped
            framed
          />
          <Callout tone="info" title="Wedge strategy">
            <Text>
              NATO vs BRICS is the primary fault line — but ASEAN, the EU, and the Global South refuse to align fully.
              Play one bloc against another. Offer trade to BRICS, security to NATO, neutrality to ASEAN. *Divide the
              Senate.*"
            </Text>
          </Callout>
        </Stack>
      )}

      {sector === "technology" && (
        <Stack gap={14}>
          <H2>Technology & AI — the new religion</H2>
          <Callout tone="info" title="Emperor's tech verdict">
            <Text>
              They have redirected half their trade growth and seventy percent of their investment growth toward
              'artificial intelligence.' A civilization betting its future on a tool. When the bubble falters — and
              it will — they will seek a strong hand to restore order.
            </Text>
          </Callout>
          <TopicTable topics={TECH_METRICS} />
        </Stack>
      )}

      {sector === "space" && (
        <Stack gap={14}>
          <H2>Space domain — the high ground</H2>
          <TopicTable topics={SPACE_METRICS} />
          <Callout tone="danger" title="ASAT warning">
            <Text>
              A nuclear detonation in low Earth orbit would blind reconnaissance, navigation, and communications for
              weeks. Russia's reported nuclear ASAT program is either bluster or the most dangerous development in
              this sector. *Either way, useful.*
            </Text>
          </Callout>
        </Stack>
      )}

      {sector === "demographics" && (
        <Stack gap={14}>
          <H2>Population — masses without a master</H2>
          <Grid columns={"1.4fr 1fr"} gap={16} align="stretch">
            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">Millions</Text>}>
                Most populous territories (2026)
              </CardHeader>
              <CardBody>
                <BarChart
                  categories={popCategories}
                  series={[{ name: "Population (M)", data: popData, tone: "info" }]}
                  horizontal
                  height={300}
                  showValues
                />
                <Text tone="tertiary" size="small" style={{ marginTop: 10 }}>
                  Source: UN / World Population Review 2026 · India surpassed China as #1 in 2023
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Demographic verdict</CardHeader>
              <CardBody>
                <Stack gap={10}>
                  <Stat value="8.3B" label="World population (2026)" tone="info" />
                  <Stat value="132M" label="Births per year" />
                  <Stat value="0.84%" label="Global growth rate" tone="warning" />
                  <Text tone="secondary">
                    Aging in the West and East Asia; youth bulges in Africa and South Asia. Demographic dividends
                    unclaimed — labor without leadership, numbers without unity. *A hoard of potential servants.*
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </Grid>
        </Stack>
      )}

      {sector === "trade" && (
        <Stack gap={14}>
          <H2>Trade & commerce — the arteries of dependency</H2>
          <Grid columns={3} gap={14}>
            <Stat value="$35T" label="Global trade value (2025)" tone="info" />
            <Stat value="+7.5%" label="Trade growth (2025)" tone="success" />
            <Stat value="1.5–2.7%" label="Projected growth (2026)" tone="warning" />
          </Grid>
          <Callout tone="warning" title="Emperor's trade verdict">
            <Text>
              $35 trillion in goods and services flow across borders they pretend to control. AI hardware, semiconductors,
              and data-center equipment drove 2025's surge — nearly half of merchandise trade growth in value terms.
              Tariffs, sanctions, and chokepoint closures are your levers. Slow the arteries; watch them beg for relief.
            </Text>
          </Callout>
          <TopicTable
            topics={[
              {
                title: "South–South trade",
                metric: "Accelerating (East Asia, Africa leading)",
                palpatineRead: "They build alternate arteries outside Western control. Infiltrate both networks.",
                source: "UNCTAD Apr 2026",
              },
              {
                title: "Services trade",
                metric: "+8% in 2025 (~$700B increase)",
                palpatineRead: "Intangible flows — finance, IP, cloud. Harder to block, easier to corrupt.",
                source: "UNCTAD",
              },
              {
                title: "US import composition",
                metric: "AI/data-processing machines = ~75% of 2025 import growth",
                palpatineRead: "One category dominates their appetite. Cut that supply and they convulse.",
                source: "UNCTAD Foresights 2026",
              },
            ]}
          />
        </Stack>
      )}

      {sector === "maritime" && (
        <Stack gap={14}>
          <H2>Maritime chokepoints — where the sector narrows</H2>
          <Text tone="secondary">
            Subjective vulnerability index (0–10). Higher = greater strategic leverage for a patient manipulator.
          </Text>
          <BarChart
            categories={maritimeCategories}
            series={[{ name: "Leverage index (0–10)", data: maritimeScores, tone: "warning" }]}
            height={280}
            showValues
          />
          <Table
            headers={["Chokepoint", "Flow / role", "Leverage", "Imperial note"]}
            rows={MARITIME_CHOKEPOINTS.map((m) => [
              <Text weight="semibold">{m.name}</Text>,
              m.flow,
              m.score.toFixed(1),
              <Text tone="secondary">{m.note}</Text>,
            ])}
            striped
            framed
          />
        </Stack>
      )}

      {sector === "cyber" && (
        <Stack gap={14}>
          <H2>Cyber & information warfare</H2>
          <Text tone="secondary">
            State and non-state actors contest the digital domain. No unified doctrine — only overlapping campaigns.
          </Text>
          <Table
            headers={["Actor", "Primary focus", "Threat level (0–10)"]}
            rows={CYBER_VECTORS.map((c) => [
              <Text weight="semibold">{c.actor}</Text>,
              c.focus,
              c.score.toFixed(1),
            ])}
            striped
            framed
          />
          <Callout tone="info" title="Emperor's cyber verdict">
            <Text>
              Their critical infrastructure — power grids, pipelines, banks, elections — runs on code written by the
              lowest bidder. Ransomware, espionage, and sabotage are daily occurrences. They lack a Grand Moff of
              Cybersecurity. *The domain is wide open.*
            </Text>
          </Callout>
        </Stack>
      )}

      {sector === "climate" && (
        <Stack gap={14}>
          <H2>Climate, food & water — slow-burn instability</H2>
          <TopicTable topics={CLIMATE_METRICS} />
          <Callout tone="warning" title="Emperor's climate verdict">
            <Text>
              They debate emissions while droughts and floods reshape borders. Food price spikes toppled governments
              before — they will again. Do not waste resources fighting their climate. *Use their crisis.* Offer
              order when their harvests fail.
            </Text>
          </Callout>
        </Stack>
      )}

      {sector === "exploitation" && (
        <Stack gap={14}>
          <H2>Exploitation vectors — pressure point index</H2>
          <BarChart
            categories={exploitCategories}
            series={[{ name: "Exploitation potential (0–10)", data: exploitScores, tone: "warning" }]}
            height={320}
            showValues
          />
          <Table
            headers={["Vector", "Score", "Operational note"]}
            rows={EXPLOITATION_VECTORS.map((e) => [
              <Text weight="semibold">{e.label}</Text>,
              e.score.toFixed(1),
              <Text tone="secondary">{e.note}</Text>,
            ])}
            striped
            framed
          />
        </Stack>
      )}

      <Divider />

      <H2>Imperial verdicts — all domains</H2>
      <Grid columns={3} gap={14}>
        {IMPERIAL_VERDICTS.map((v) => (
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
          <Link href="https://www.sipri.org/yearbook/2026">SIPRI Yearbook 2026 (nuclear)</Link>
          <Link href="https://unctad.org/system/files/official-document/ditcinf2026d4_en.pdf">
            UNCTAD Trade Update Apr 2026
          </Link>
          <Link href="https://www.wto.org/english/res_e/booksp_e/gtos0326_e.pdf">WTO Trade Outlook Mar 2026</Link>
          <Link href="https://www.iea.org/reports/global-energy-review-2026/key-findings">IEA Energy Review 2026</Link>
          <Link href="https://worldpopulationreview.com/">World Population Review 2026</Link>
          <Link href="https://www.atlanticcouncil.org/wp-content/uploads/2026/01/countering-russian-escalation-in-space.pdf">
            Atlantic Council (space/ASAT)
          </Link>
        </Row>
        <Text tone="tertiary" size="small">
          Palpatine assessments are fictional framing atop real public data. No Sith Lords were consulted.
        </Text>
      </Stack>
    </Stack>
  );
}
