import React from "react";
import {
  BarChart,
  Button,
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

type GrowthScenarioKey = "reference" | "adverse" | "severe";
type LensKey = "vader" | "conventional";
type TheaterKey = "global" | "euro-atlantic" | "indo-pacific" | "mena" | "global-south";

type Source = {
  label: string;
  href: string;
  note?: string;
};

type MetricRow = {
  metric: string;
  value: string;
  timeframe: string;
  whyItMattersSith: string;
  sources: Source[];
};

const SOURCES = {
  imfWEO: {
    label: "IMF WEO (Apr 2026)",
    href: "https://www.imf.org/en/publications/weo/issues/2026/04/14/world-economic-outlook-april-2026",
  },
  imfWEOPdf: {
    label: "IMF WEO PDF (Apr 2026)",
    href: "https://www.imf.org/-/media/files/publications/weo/2026/april/english/text.pdf",
  },
  blsCpiApr2026: {
    label: "BLS CPI (Apr 2026, released May 12)",
    href: "https://www.bls.gov/news.release/archives/cpi_05122026.htm",
  },
  blsEmpsitApr2026: {
    label: "BLS Employment Situation (Apr 2026, released May 8)",
    href: "https://www.bls.gov/news.release/archives/empsit_05082026.htm",
  },
  fedFomcApr2026: {
    label: "Fed FOMC statement (Apr 29, 2026)",
    href: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260429a.htm",
  },
  eurostatHicpApr2026: {
    label: "Eurostat HICP euro area (Apr 2026)",
    href: "https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-20052026-ap",
  },
  ecbMpApr2026: {
    label: "ECB monetary policy decision (Apr 30, 2026)",
    href: "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260430~81b7179e6f.en.html",
  },
  nbsChinaCpiApr2026: {
    label: "NBS China CPI (Apr 2026)",
    href: "https://www.stats.gov.cn/english/PressRelease/202605/t20260512_1963677.html",
  },
  ftBrentMay282026: {
    label: "FT Brent historical close (May 28, 2026)",
    href: "https://markets.ft.com/data/commodities/tearsheet/historical?c=Brent+Crude+Oil",
  },
  investingUs10yMay282026: {
    label: "Investing.com US 10Y historical close (May 28, 2026)",
    href: "https://www.investing.com/rates-bonds/u.s.-10-year-bond-yield-historical-data",
  },
  drewryWciMay212026: {
    label: "Drewry WCI (May 21, 2026)",
    href: "https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry",
  },
  sipriMilex: {
    label: "SIPRI: Trends in world military expenditure, 2025 (Apr 2026)",
    href: "https://www.sipri.org/publications/2026/sipri-fact-sheets/trends-world-military-expenditure-2025",
  },
  ieaGER: {
    label: "IEA: Global Energy Review 2026 (key findings)",
    href: "https://www.iea.org/reports/global-energy-review-2026/key-findings",
  },
  ieaOMRMay: {
    label: "IEA: Oil Market Report (May 2026)",
    href: "https://www.iea.org/reports/oil-market-report-may-2026",
  },
  sipriYearbook: {
    label: "SIPRI Yearbook (2026)",
    href: "https://www.sipri.org/yearbook/2026",
    note: "security and conflict context",
  },
  worldBankWGI: {
    label: "World Bank: Worldwide Governance Indicators",
    href: "https://info.worldbank.org/governance/wgi/",
    note: "state capacity proxies",
  },
  uncetaTrade: {
    label: "UNCTAD: Global trade updates",
    href: "https://unctad.org/topic/trade-analysis/global-trade-update",
    note: "trade fragmentation context",
  },
} satisfies Record<string, Source>;

const IMF_GROWTH_2026 = {
  reference: 3.1,
  adverse: 2.5,
  severe: 2.0,
} satisfies Record<GrowthScenarioKey, number>;

const IMF_HEADLINE_INFLATION_2026_REFERENCE = 4.4; // IMF WEO Apr 2026 reference forecast

const SIPRI_WORLD_MILEX_2025_USD_B = 2887; // $ billions
const SIPRI_MILEX_SHARE_GLOBAL_GDP_2025 = 2.5; // %

const IEA_RENEWABLE_CAPACITY_ADDITIONS_2025_GW = 800;
const IEA_SOLAR_SHARE_OF_ADDITIONS_2025 = 75; // %
const IEA_BATTERY_STORAGE_ADDITIONS_2025_GW = 110; // "almost 110 GW"
const IEA_EV_SALES_2025_M = 20; // "more than 20 million"

// --- Current snapshot values (embedded, with as-of dates in labels) ---
const US_CPI_YOY_APR_2026 = 3.8; // CPI-U YoY, Apr 2026 (BLS release May 12, 2026)
const EURO_AREA_HICP_YOY_APR_2026 = 3.0; // Euro area HICP YoY, Apr 2026 (Eurostat)
const CHINA_CPI_YOY_APR_2026 = 1.2; // China CPI YoY, Apr 2026 (NBS)

const FED_FUNDS_TARGET_RANGE_LO = 3.5; // Apr 2026 FOMC
const FED_FUNDS_TARGET_RANGE_HI = 3.75; // Apr 2026 FOMC
const ECB_DEPOSIT_FACILITY_RATE_APR_2026 = 2.0; // ECB Apr 30, 2026 decision

const US_UNEMPLOYMENT_RATE_APR_2026 = 4.3; // BLS, Apr 2026

const BRENT_CLOSE_USD_MAY_28_2026 = 96.09; // FT historical close
const US10Y_YIELD_CLOSE_PCT_MAY_28_2026 = 4.502; // Investing.com historical close
const DREWRY_WCI_USD_PER_FEU_MAY_21_2026 = 2712; // Drewry WCI composite

function formatPct(x: number, digits = 1) {
  return `${x.toFixed(digits)}%`;
}

function formatB(x: number) {
  return `$${x.toLocaleString("en-US")}B`;
}

function formatUsd(x: number, digits = 2) {
  return `$${x.toFixed(digits)}`;
}

function formatUsd0(x: number) {
  return `$${Math.round(x).toLocaleString("en-US")}`;
}

function SourceLinks({ sources }: { sources: Source[] }) {
  const theme = useHostTheme();
  return (
    <Row gap={10} align="center" wrap style={{ minWidth: 0 }}>
      <Text tone="tertiary" size="small" style={{ whiteSpace: "nowrap" }}>
        Source
      </Text>
      {sources.map((s) => (
        <Row key={s.href} gap={8} align="center" style={{ minWidth: 0 }}>
          <Link href={s.href} style={{ color: theme.text.link }}>
            {s.label}
          </Link>
          {s.note ? (
            <Text tone="quaternary" size="small" style={{ whiteSpace: "nowrap" }}>
              ({s.note})
            </Text>
          ) : null}
        </Row>
      ))}
    </Row>
  );
}

function LensCopy({
  lens,
  sith,
  conventional,
}: {
  lens: LensKey;
  sith: React.ReactNode;
  conventional: React.ReactNode;
}) {
  return <>{lens === "vader" ? sith : conventional}</>;
}

function computeRiskTone(
  scenario: GrowthScenarioKey
): "success" | "warning" | "danger" {
  if (scenario === "reference") return "warning";
  if (scenario === "adverse") return "danger";
  return "danger";
}

function ScenarioPills({
  scenario,
  setScenario,
}: {
  scenario: GrowthScenarioKey;
  setScenario: (s: GrowthScenarioKey) => void;
}) {
  return (
    <Row gap={8} align="center" wrap>
      <Pill active={scenario === "reference"} onClick={() => setScenario("reference")}>
        IMF reference
      </Pill>
      <Pill active={scenario === "adverse"} onClick={() => setScenario("adverse")}>
        IMF adverse
      </Pill>
      <Pill active={scenario === "severe"} onClick={() => setScenario("severe")}>
        IMF severe
      </Pill>
    </Row>
  );
}

function LensPills({ lens, setLens }: { lens: LensKey; setLens: (l: LensKey) => void }) {
  return (
    <Row gap={8} align="center" wrap>
      <Pill active={lens === "vader"} onClick={() => setLens("vader")}>
        Vader lens
      </Pill>
      <Pill active={lens === "conventional"} onClick={() => setLens("conventional")}>
        Conventional lens
      </Pill>
    </Row>
  );
}

type TheaterBrief = {
  key: TheaterKey;
  name: string;
  summaryVader: string;
  summaryConventional: string;
  escalationRisk010: number; // 0-10
  energyShock010: number; // 0-10
  supplyChainFriction010: number; // 0-10
  financialStress010: number; // 0-10
  coercionLeverage010: number; // 0-10 (sanctions, chokepoints, capital control)
};

const THEATERS: TheaterBrief[] = [
  {
    key: "global",
    name: "Global overview",
    summaryVader:
      "The system is multipolar and liquid: power concentrates where chokepoints exist (energy, finance, shipping, compute). When growth narrows, coercion outperforms persuasion.",
    summaryConventional:
      "Growth is positive but uneven, with elevated geopolitical risk premia in energy and trade. Fragmentation pressures persist alongside selective cooperation.",
    escalationRisk010: 6.5,
    energyShock010: 6.0,
    supplyChainFriction010: 5.5,
    financialStress010: 5.0,
    coercionLeverage010: 6.5,
  },
  {
    key: "euro-atlantic",
    name: "Euro-Atlantic",
    summaryVader:
      "High cohesion, high burn-rate: unity is maintained by perceived threat. Defense outlays rise; industrial policy hardens borders for capital and technology.",
    summaryConventional:
      "Security competition elevates defense investment and reshapes energy mixes. Policy coordination remains strong, but fiscal trade-offs become sharper.",
    escalationRisk010: 7.0,
    energyShock010: 5.0,
    supplyChainFriction010: 5.0,
    financialStress010: 5.5,
    coercionLeverage010: 7.0,
  },
  {
    key: "indo-pacific",
    name: "Indo-Pacific",
    summaryVader:
      "The decisive theater: manufacturing depth plus maritime chokepoints. Deterrence is a balance sheet—shipyards, munitions, and semiconductor tooling.",
    summaryConventional:
      "Strategic competition centers on trade, tech controls, and maritime security. Supply chain reconfiguration continues with episodic flare-ups of tension.",
    escalationRisk010: 7.5,
    energyShock010: 6.0,
    supplyChainFriction010: 7.0,
    financialStress010: 5.0,
    coercionLeverage010: 6.5,
  },
  {
    key: "mena",
    name: "Middle East & North Africa (MENA)",
    summaryVader:
      "Energy and geography remain levers. Instability is a pricing mechanism: it taxes rivals through fuel and freight while funding loyal actors.",
    summaryConventional:
      "Oil market sensitivity is high; regional instability can quickly transmit to inflation and shipping. Diplomatic dynamics remain fluid.",
    escalationRisk010: 7.0,
    energyShock010: 8.0,
    supplyChainFriction010: 7.0,
    financialStress010: 5.5,
    coercionLeverage010: 7.5,
  },
  {
    key: "global-south",
    name: "Global South",
    summaryVader:
      "Debt and food/energy exposure create opportunities for dependency. Infrastructure finance and security assistance buy alignment more cheaply than ideology.",
    summaryConventional:
      "Debt vulnerabilities and climate/commodity shocks remain key risks. Countries diversify partnerships and pursue industrial policy for resilience.",
    escalationRisk010: 5.5,
    energyShock010: 6.5,
    supplyChainFriction010: 5.0,
    financialStress010: 6.5,
    coercionLeverage010: 5.5,
  },
];

function TheaterPills({
  theater,
  setTheater,
}: {
  theater: TheaterKey;
  setTheater: (t: TheaterKey) => void;
}) {
  return (
    <Row gap={8} align="center" wrap>
      <Pill active={theater === "global"} onClick={() => setTheater("global")}>
        Global
      </Pill>
      <Pill active={theater === "euro-atlantic"} onClick={() => setTheater("euro-atlantic")}>
        Euro-Atlantic
      </Pill>
      <Pill active={theater === "indo-pacific"} onClick={() => setTheater("indo-pacific")}>
        Indo-Pacific
      </Pill>
      <Pill active={theater === "mena"} onClick={() => setTheater("mena")}>
        MENA
      </Pill>
      <Pill active={theater === "global-south"} onClick={() => setTheater("global-south")}>
        Global South
      </Pill>
    </Row>
  );
}

function buildMetricRows(): MetricRow[] {
  return [
    {
      metric: "Inflation (headline, latest prints)",
      value: `US CPI ${formatPct(US_CPI_YOY_APR_2026, 1)} · Euro area HICP ${formatPct(
        EURO_AREA_HICP_YOY_APR_2026,
        1
      )} · China CPI ${formatPct(CHINA_CPI_YOY_APR_2026, 1)}`,
      timeframe: "Apr 2026 (YoY)",
      whyItMattersSith:
        "Inflation is a legitimacy constraint: it drives populism, subsidy pressure, and tighter internal security posture.",
      sources: [SOURCES.blsCpiApr2026, SOURCES.eurostatHicpApr2026, SOURCES.nbsChinaCpiApr2026],
    },
    {
      metric: "Policy rates (selected)",
      value: `Fed ${formatPct(FED_FUNDS_TARGET_RANGE_LO, 2)}–${formatPct(
        FED_FUNDS_TARGET_RANGE_HI,
        2
      )} · ECB deposit ${formatPct(ECB_DEPOSIT_FACILITY_RATE_APR_2026, 2)}`,
      timeframe: "Late Apr 2026",
      whyItMattersSith:
        "Policy rates set the price of obedience: they determine who can refinance, who fails, and who consolidates assets.",
      sources: [SOURCES.fedFomcApr2026, SOURCES.ecbMpApr2026],
    },
    {
      metric: "Labor market (US headline)",
      value: `Unemployment rate ${formatPct(US_UNEMPLOYMENT_RATE_APR_2026, 1)}`,
      timeframe: "Apr 2026",
      whyItMattersSith:
        "Employment conditions govern social tolerance for austerity, mobilization, and trade-offs between butter and guns.",
      sources: [SOURCES.blsEmpsitApr2026],
    },
    {
      metric: "Energy price proxy (Brent close)",
      value: `${formatUsd(BRENT_CLOSE_USD_MAY_28_2026)} / bbl`,
      timeframe: "May 28, 2026 (close)",
      whyItMattersSith:
        "Oil is a short-run coercion channel: it moves inflation, logistics costs, and political stability faster than reforms can.",
      sources: [SOURCES.ftBrentMay282026],
    },
    {
      metric: "Financial conditions proxy (US 10Y close)",
      value: formatPct(US10Y_YIELD_CLOSE_PCT_MAY_28_2026, 3),
      timeframe: "May 28, 2026 (close)",
      whyItMattersSith:
        "Long rates price the future. When they rise, debt service bites and weaker states/firms become acquisition targets.",
      sources: [SOURCES.investingUs10yMay282026],
    },
    {
      metric: "Shipping cost proxy (Drewry WCI)",
      value: `${formatUsd0(DREWRY_WCI_USD_PER_FEU_MAY_21_2026)} per 40ft container`,
      timeframe: "May 21, 2026",
      whyItMattersSith:
        "Freight is the empire’s tax on distance: higher rates favor nearshoring blocs and punish import-dependent states.",
      sources: [SOURCES.drewryWciMay212026],
    },
    {
      metric: "Global real GDP growth (IMF scenarios)",
      value:
        `2026 reference ${formatPct(IMF_GROWTH_2026.reference, 1)} · ` +
        `adverse ${formatPct(IMF_GROWTH_2026.adverse, 1)} · ` +
        `severe ${formatPct(IMF_GROWTH_2026.severe, 1)}`,
      timeframe: "2026",
      whyItMattersSith:
        "Lower growth narrows policy options, increases social strain, and strengthens arguments for central control.",
      sources: [SOURCES.imfWEO, SOURCES.imfWEOPdf],
    },
    {
      metric: "Global headline inflation (IMF reference forecast)",
      value: formatPct(IMF_HEADLINE_INFLATION_2026_REFERENCE, 1),
      timeframe: "2026",
      whyItMattersSith:
        "Inflation is a legitimacy tax. It amplifies political polarization and raises the value of coercive capacity.",
      sources: [SOURCES.imfWEOPdf],
    },
    {
      metric: "World military spending (SIPRI)",
      value: `${formatB(SIPRI_WORLD_MILEX_2025_USD_B)} (${formatPct(
        SIPRI_MILEX_SHARE_GLOBAL_GDP_2025,
        1
      )} of world GDP)`,
      timeframe: "2025",
      whyItMattersSith:
        "A larger 'security budget' reallocates capital toward state priorities and hardens bloc competition.",
      sources: [SOURCES.sipriMilex],
    },
    {
      metric: "Renewable capacity additions (IEA)",
      value: `${IEA_RENEWABLE_CAPACITY_ADDITIONS_2025_GW} GW total · solar ${IEA_SOLAR_SHARE_OF_ADDITIONS_2025}%`,
      timeframe: "2025",
      whyItMattersSith:
        "Energy independence erodes traditional chokepoints, but the transition creates new ones (minerals, grids, storage).",
      sources: [SOURCES.ieaGER],
    },
    {
      metric: "Battery storage additions (IEA)",
      value: `~${IEA_BATTERY_STORAGE_ADDITIONS_2025_GW} GW`,
      timeframe: "2025",
      whyItMattersSith:
        "Storage is strategic: it buffers shocks and shifts bargaining power away from fuel exporters toward grid owners.",
      sources: [SOURCES.ieaGER],
    },
    {
      metric: "Electric car sales (IEA)",
      value: `> ${IEA_EV_SALES_2025_M}M`,
      timeframe: "2025",
      whyItMattersSith:
        "Electrification reduces oil’s leverage over mobility—but increases dependence on power systems and supply chains.",
      sources: [SOURCES.ieaGER],
    },
  ];
}

function ExportButton({
  scenario,
  lens,
}: {
  scenario: GrowthScenarioKey;
  lens: LensKey;
}) {
  const theme = useHostTheme();
  const text = [
    "Earth economy dashboard (2025–2026)",
    "",
    `Lens: ${lens}`,
    `IMF scenario: ${scenario}`,
    "",
    `Global growth 2026 (IMF): reference ${IMF_GROWTH_2026.reference}% · adverse ${IMF_GROWTH_2026.adverse}% · severe ${IMF_GROWTH_2026.severe}%`,
    `Global headline inflation 2026 (IMF reference): ${IMF_HEADLINE_INFLATION_2026_REFERENCE}%`,
    `World military spending 2025 (SIPRI): $${SIPRI_WORLD_MILEX_2025_USD_B}B (~${SIPRI_MILEX_SHARE_GLOBAL_GDP_2025}% of world GDP)`,
    `Renewable capacity additions 2025 (IEA): ${IEA_RENEWABLE_CAPACITY_ADDITIONS_2025_GW} GW (solar ${IEA_SOLAR_SHARE_OF_ADDITIONS_2025}%)`,
    `Battery storage additions 2025 (IEA): ~${IEA_BATTERY_STORAGE_ADDITIONS_2025_GW} GW`,
    `EV sales 2025 (IEA): >${IEA_EV_SALES_2025_M}M`,
    "",
    `Sources:`,
    `- ${SOURCES.imfWEO.label}: ${SOURCES.imfWEO.href}`,
    `- ${SOURCES.imfWEOPdf.label}: ${SOURCES.imfWEOPdf.href}`,
    `- ${SOURCES.sipriMilex.label}: ${SOURCES.sipriMilex.href}`,
    `- ${SOURCES.ieaGER.label}: ${SOURCES.ieaGER.href}`,
    `- ${SOURCES.ieaOMRMay.label}: ${SOURCES.ieaOMRMay.href}`,
  ].join("\n");

  return (
    <Button
      variant="secondary"
      onClick={() => {
        try {
          navigator.clipboard.writeText(text);
        } catch {
          // Clipboard may be unavailable in some hosts; keep UI simple.
        }
      }}
      style={{ background: theme.fill.secondary }}
    >
      Copy snapshot
    </Button>
  );
}

export default function EarthEconomySithDashboard() {
  const theme = useHostTheme();
  const [scenario, setScenario] = useCanvasState<GrowthScenarioKey>("scenario", "reference");
  const [lens, setLens] = useCanvasState<LensKey>("lens", "vader");
  const [theater, setTheater] = useCanvasState<TheaterKey>("theater", "global");

  const inflationCategories = ["US CPI", "Euro area HICP", "China CPI"];
  const inflationSeries = [
    {
      name: "Headline inflation (YoY)",
      data: [US_CPI_YOY_APR_2026, EURO_AREA_HICP_YOY_APR_2026, CHINA_CPI_YOY_APR_2026],
      tone: "warning" as const,
    },
  ];

  const policyCategories = ["Fed (upper)", "ECB deposit"];
  const policySeries = [
    {
      name: "Policy rate",
      data: [FED_FUNDS_TARGET_RANGE_HI, ECB_DEPOSIT_FACILITY_RATE_APR_2026],
      tone: "info" as const,
    },
  ];

  const marketsCategories = ["Brent (USD/bbl)", "US 10Y (%, close)", "Drewry WCI (USD/FEU)"];
  const marketsSeries = [
    {
      name: "Level (mixed units)",
      data: [BRENT_CLOSE_USD_MAY_28_2026, US10Y_YIELD_CLOSE_PCT_MAY_28_2026, DREWRY_WCI_USD_PER_FEU_MAY_21_2026],
      tone: "neutral" as const,
    },
  ];

  const growthSeries = [
    {
      name: "Real GDP growth (IMF)",
      data: [IMF_GROWTH_2026.reference, IMF_GROWTH_2026.adverse, IMF_GROWTH_2026.severe],
      tone: "info" as const,
    },
  ];

  const growthCategories = ["Reference", "Adverse", "Severe"];
  const selectedGrowth = IMF_GROWTH_2026[scenario];

  const energyAdditionsPie = [
    {
      label: "Solar PV",
      value: IEA_SOLAR_SHARE_OF_ADDITIONS_2025,
      tone: "info" as const,
    },
    {
      label: "Other renewables",
      value: 100 - IEA_SOLAR_SHARE_OF_ADDITIONS_2025,
      tone: "neutral" as const,
    },
  ];

  const metricRows = buildMetricRows();

  const keyStrip = [
    {
      value: formatPct(selectedGrowth, 1),
      label: "Global growth (2026, IMF scenario)",
      tone: computeRiskTone(scenario),
    },
    {
      value: formatPct(US_CPI_YOY_APR_2026, 1),
      label: "US CPI (Apr 2026, YoY)",
    },
    {
      value: formatB(SIPRI_WORLD_MILEX_2025_USD_B),
      label: "Military spend (2025, SIPRI)",
    },
    {
      value: formatUsd(BRENT_CLOSE_USD_MAY_28_2026),
      label: "Brent (May 28, 2026 close)",
    },
  ] as const;

  const interpretationTitle =
    lens === "vader" ? "Interpretation (Vader)" : "Interpretation (conventional)";

  const selectedTheater = THEATERS.find((t) => t.key === theater) ?? THEATERS[0];
  const theaterCategories = [
    "Escalation risk",
    "Energy shock",
    "Supply-chain friction",
    "Financial stress",
    "Coercion leverage",
  ];
  const theaterSeries = [
    {
      name: `${selectedTheater.name} (0–10)`,
      data: [
        selectedTheater.escalationRisk010,
        selectedTheater.energyShock010,
        selectedTheater.supplyChainFriction010,
        selectedTheater.financialStress010,
        selectedTheater.coercionLeverage010,
      ],
      tone: "warning" as const,
    },
  ];

  return (
    <Stack gap={16} style={{ padding: 16, background: theme.bg.editor }}>
      <Stack gap={8}>
        <Row gap={12} align="center" wrap>
          <H1>Earth economy & geopolitics war-room (2025–2026)</H1>
          <Spacer />
          <ExportButton scenario={scenario} lens={lens} />
        </Row>

        <Text tone="secondary">
          Frozen snapshot (as-of May 2026 releases and May 28 market closes), plus structural indicators.
          Geopolitics is expressed as a transparent, subjective risk matrix (0–10) so you can change assumptions quickly.
        </Text>

        <Row gap={10} align="center" wrap>
          <Text tone="tertiary" size="small">
            Controls
          </Text>
          <LensPills lens={lens} setLens={setLens} />
          <ScenarioPills scenario={scenario} setScenario={setScenario} />
          <TheaterPills theater={theater} setTheater={setTheater} />
        </Row>
      </Stack>

      <Grid columns={4} gap={14} style={{ alignItems: "stretch" }}>
        {keyStrip.map((s) => (
          <Card key={s.label} variant="default">
            <CardBody>
              <Stat value={s.value} label={s.label} tone={s.tone} />
            </CardBody>
          </Card>
        ))}
      </Grid>

      <Grid columns={"1.35fr 1fr"} gap={16} align="stretch">
        <Stack gap={10}>
          <H2>Current macro snapshot</H2>
          <Text tone="secondary">
            Latest major prints and policy anchors. All charts are explicitly labeled with units and as-of dates.
          </Text>

          <Grid columns={2} gap={14} align="stretch">
            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">Units: % YoY</Text>}>
                Inflation (Apr 2026)
              </CardHeader>
              <CardBody>
                <BarChart
                  categories={inflationCategories}
                  series={inflationSeries}
                  height={200}
                  valueSuffix="%"
                />
                <Divider style={{ marginTop: 12, marginBottom: 10 }} />
                <SourceLinks
                  sources={[SOURCES.blsCpiApr2026, SOURCES.eurostatHicpApr2026, SOURCES.nbsChinaCpiApr2026]}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader trailing={<Text tone="tertiary" size="small">Units: %</Text>}>
                Policy rates (late Apr 2026)
              </CardHeader>
              <CardBody>
                <BarChart categories={policyCategories} series={policySeries} height={200} valueSuffix="%" />
                <Divider style={{ marginTop: 12, marginBottom: 10 }} />
                <SourceLinks sources={[SOURCES.fedFomcApr2026, SOURCES.ecbMpApr2026]} />
              </CardBody>
            </Card>
          </Grid>

          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">Units: %</Text>}>
              US labor market (Apr 2026)
            </CardHeader>
            <CardBody>
              <Grid columns={2} gap={14}>
                <Stat value={formatPct(US_UNEMPLOYMENT_RATE_APR_2026, 1)} label="Unemployment rate (U-3)" />
                <Stat value="See release" label="Payrolls / participation details" />
              </Grid>
              <Divider style={{ marginTop: 12, marginBottom: 10 }} />
              <SourceLinks sources={[SOURCES.blsEmpsitApr2026]} />
            </CardBody>
          </Card>

          <Callout tone={scenario === "reference" ? "warning" : "danger"} title={interpretationTitle}>
            <LensCopy
              lens={lens}
              sith={
                <Text>
                  The Empire’s problem is not growth—it is control under constraint. Inflation and rates remain
                  gatekeepers; energy and freight are rapid coercion channels; credit is the slow one. Expand where
                  chokepoints exist, not where GDP headlines look flattering.
                </Text>
              }
              conventional={
                <Text>
                  With inflation elevated and policy rates restrictive, the key macro question is whether
                  energy-driven price pressure fades fast enough to allow easing without reigniting inflation.
                </Text>
              }
            />
          </Callout>

          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">Subjective but explicit</Text>}>
              Geopolitical pressure matrix (selected theater)
            </CardHeader>
            <CardBody>
              <Text tone="secondary">
                Scores are 0–10. Higher means more pressure/risk or more leverage (for “coercion leverage”). Adjust the
                assumptions by editing the embedded theater constants.
              </Text>
              <Divider style={{ marginTop: 12, marginBottom: 10 }} />
              <BarChart categories={theaterCategories} series={theaterSeries} height={230} valueSuffix="" />
              <Divider style={{ marginTop: 12, marginBottom: 10 }} />
              <SourceLinks sources={[SOURCES.sipriYearbook, SOURCES.uncetaTrade, SOURCES.worldBankWGI]} />
            </CardBody>
          </Card>
        </Stack>

        <Stack gap={10}>
          <H2>Markets & chokepoints</H2>
          <Text tone="secondary">
            Simple proxies for energy stress, financing stress, and physical trade friction.
          </Text>

          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">Mixed units</Text>}>
              Benchmarks (May 2026)
            </CardHeader>
            <CardBody>
              <BarChart categories={marketsCategories} series={marketsSeries} height={230} />
              <Divider style={{ marginTop: 12, marginBottom: 10 }} />
              <SourceLinks sources={[SOURCES.ftBrentMay282026, SOURCES.investingUs10yMay282026, SOURCES.drewryWciMay212026]} />
            </CardBody>
          </Card>

          <Card collapsible defaultOpen={false}>
            <CardHeader trailing={<Text tone="tertiary" size="small">Transition</Text>}>
              Energy transition capacity (2025)
            </CardHeader>
            <CardBody>
              <Row gap={16} align="center" wrap>
                <PieChart data={energyAdditionsPie} donut size={180} />
                <Stack gap={8} style={{ minWidth: 260 }}>
                  <Text>
                    Total additions:{" "}
                    <Text as="span" weight="semibold">
                      {`${IEA_RENEWABLE_CAPACITY_ADDITIONS_2025_GW} GW`}
                    </Text>
                  </Text>
                  <Text tone="secondary">
                    Solar share:{" "}
                    <Text as="span" weight="semibold">
                      {formatPct(IEA_SOLAR_SHARE_OF_ADDITIONS_2025, 0)}
                    </Text>
                  </Text>
                  <Text tone="secondary">
                    Battery additions:{" "}
                    <Text as="span" weight="semibold">
                      {`~${IEA_BATTERY_STORAGE_ADDITIONS_2025_GW} GW`}
                    </Text>
                  </Text>
                  <Text tone="secondary">
                    EV sales:{" "}
                    <Text as="span" weight="semibold">
                      {`>${IEA_EV_SALES_2025_M}M`}
                    </Text>
                  </Text>
                </Stack>
              </Row>
              <Divider style={{ marginTop: 12, marginBottom: 10 }} />
              <SourceLinks sources={[SOURCES.ieaGER]} />
            </CardBody>
          </Card>

          <Card collapsible defaultOpen={false}>
            <CardHeader trailing={<Text tone="tertiary" size="small">Scenario framing</Text>}>
              IMF growth scenarios (2026)
            </CardHeader>
            <CardBody>
              <Text tone="secondary">
                Published scenarios (reference/adverse/severe) to contextualize how macro outcomes shift with conflict and
                commodity dynamics.
              </Text>
              <Divider style={{ marginTop: 12, marginBottom: 10 }} />
              <BarChart categories={growthCategories} series={growthSeries} height={180} valueSuffix="%" />
              <Divider style={{ marginTop: 12, marginBottom: 10 }} />
              <SourceLinks sources={[SOURCES.imfWEO, SOURCES.imfWEOPdf]} />
            </CardBody>
          </Card>

          <Card collapsible defaultOpen={false}>
            <CardHeader trailing={<Text tone="tertiary" size="small">Event sensitivity</Text>}>
              Oil volatility (IEA context, May 2026)
            </CardHeader>
            <CardBody>
              <Text tone="secondary">
                Some 2026 energy outcomes are highly contingent on conflict dynamics and shipping chokepoints. The IEA’s Oil
                Market Report (May 2026) is a reference point for how quickly assumptions can swing with disruptions.
              </Text>
              <Divider style={{ marginTop: 12, marginBottom: 10 }} />
              <SourceLinks sources={[SOURCES.ieaOMRMay]} />
            </CardBody>
          </Card>
        </Stack>
      </Grid>

      <H2>Theater brief (from your selected lens)</H2>
      <Grid columns={"1.2fr 0.8fr"} gap={16} align="stretch">
        <Card>
          <CardHeader trailing={<Text tone="tertiary" size="small">Narrative</Text>}>
            {selectedTheater.name}
          </CardHeader>
          <CardBody>
            <LensCopy
              lens={lens}
              sith={<Text>{selectedTheater.summaryVader}</Text>}
              conventional={<Text>{selectedTheater.summaryConventional}</Text>}
            />
            <Divider style={{ marginTop: 12, marginBottom: 10 }} />
            <Text tone="secondary" size="small">
              Source anchors (qualitative): SIPRI security context, UNCTAD trade fragmentation, WGI governance proxies.
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardHeader trailing={<Text tone="tertiary" size="small">0–10</Text>}>
            Quick-read scores
          </CardHeader>
          <CardBody>
            <Stack gap={10}>
              <Stat
                value={selectedTheater.escalationRisk010.toFixed(1)}
                label="Escalation risk"
                tone={selectedTheater.escalationRisk010 >= 7 ? "danger" : "warning"}
              />
              <Stat
                value={selectedTheater.energyShock010.toFixed(1)}
                label="Energy shock risk"
                tone={selectedTheater.energyShock010 >= 7 ? "danger" : "warning"}
              />
              <Stat
                value={selectedTheater.supplyChainFriction010.toFixed(1)}
                label="Supply-chain friction"
                tone={selectedTheater.supplyChainFriction010 >= 7 ? "danger" : "warning"}
              />
              <Stat
                value={selectedTheater.financialStress010.toFixed(1)}
                label="Financial stress"
                tone={selectedTheater.financialStress010 >= 7 ? "danger" : "warning"}
              />
              <Stat
                value={selectedTheater.coercionLeverage010.toFixed(1)}
                label="Coercion leverage"
                tone={selectedTheater.coercionLeverage010 >= 7 ? "warning" : "neutral"}
              />
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <H2>Key indicators table</H2>
      <Text tone="secondary">
        Scan-friendly list of the embedded values and why they matter under a power/constraint lens.
      </Text>

      <Table
        headers={["Metric", "Value", "Timeframe", "Why it matters (Sith framing)", "Sources"]}
        rows={metricRows.map((r) => [
          <Text key={`${r.metric}-m`} weight="semibold">
            {r.metric}
          </Text>,
          <Text key={`${r.metric}-v`}>{r.value}</Text>,
          <Text key={`${r.metric}-t`} tone="secondary">
            {r.timeframe}
          </Text>,
          <Text key={`${r.metric}-w`} tone="secondary">
            {r.whyItMattersSith}
          </Text>,
          <Row key={`${r.metric}-s`} gap={8} wrap align="center" style={{ minWidth: 0 }}>
            {r.sources.map((s) => (
              <Link key={s.href} href={s.href} style={{ color: theme.text.link }}>
                {s.label}
              </Link>
            ))}
          </Row>,
        ])}
        columnAlign={["left", "left", "left", "left", "left"]}
        striped
        framed
      />

      <Divider style={{ marginTop: 8 }} />

      <Stack gap={8}>
        <H3>Notes & constraints</H3>
        <Text tone="secondary">
          - This dashboard avoids live market feeds. “Current data” here means a frozen snapshot using the latest available
          releases and closes as of the dates shown.
        </Text>
        <Text tone="secondary">
          - If you want truly live updating, we’d need to build this outside canvas (e.g. a small web app that fetches APIs).
        </Text>
      </Stack>
    </Stack>
  );
}

