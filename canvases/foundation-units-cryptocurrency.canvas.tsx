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
  PieChart,
  Pill,
  Row,
  Select,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  TextInput,
  UsageBar,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

const TOTAL_SUPPLY = 100_000_000;
const SYMBOL = "FND";
const NAME = "Foundation Units";
const DECIMALS = 0;

type AllocationPresetKey = "equal" | "sixty-forty" | "with-treasury-10" | "with-treasury-20";

type AllocationBucket = {
  id: string;
  label: string;
  units: number;
  pct: number;
  note: string;
  tone?: "info" | "warning" | "success" | "neutral";
};

type Preset = {
  key: AllocationPresetKey;
  label: string;
  summary: string;
  founderAPct: number;
  founderBPct: number;
  treasuryPct: number;
};

const PRESETS: Preset[] = [
  {
    key: "equal",
    label: "50 / 50 (equal co-founders)",
    summary: "Simplest split when both founders contribute equally from day one.",
    founderAPct: 50,
    founderBPct: 50,
    treasuryPct: 0,
  },
  {
    key: "sixty-forty",
    label: "60 / 40 (weighted contribution)",
    summary: "Use when one founder brought the core IP, capital, or prior traction.",
    founderAPct: 60,
    founderBPct: 40,
    treasuryPct: 0,
  },
  {
    key: "with-treasury-10",
    label: "45 / 45 / 10 treasury",
    summary: "Recommended default — equal founders plus a small protocol reserve.",
    founderAPct: 45,
    founderBPct: 45,
    treasuryPct: 10,
  },
  {
    key: "with-treasury-20",
    label: "40 / 40 / 20 treasury",
    summary: "More runway for grants, liquidity, and future contributors.",
    founderAPct: 40,
    founderBPct: 40,
    treasuryPct: 20,
  },
];

function formatUnits(n: number) {
  return n.toLocaleString("en-US");
}

function formatPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

function pctToUnits(pct: number) {
  return Math.round((TOTAL_SUPPLY * pct) / 100);
}

function buildBuckets(
  founderAName: string,
  founderBName: string,
  founderAPct: number,
  founderBPct: number,
  treasuryPct: number
): AllocationBucket[] {
  const buckets: AllocationBucket[] = [
    {
      id: "founder-a",
      label: founderAName.trim() || "Founder A",
      units: pctToUnits(founderAPct),
      pct: founderAPct,
      note: "Fully allocated at genesis; subject to vesting schedule below.",
      tone: "info",
    },
    {
      id: "founder-b",
      label: founderBName.trim() || "Founder B",
      units: pctToUnits(founderBPct),
      pct: founderBPct,
      note: "Fully allocated at genesis; subject to vesting schedule below.",
      tone: "warning",
    },
  ];

  if (treasuryPct > 0) {
    buckets.push({
      id: "treasury",
      label: "Protocol treasury",
      units: pctToUnits(treasuryPct),
      pct: treasuryPct,
      note: "Unvested reserve for grants, liquidity, and future contributors.",
      tone: "success",
    });
  }

  return buckets;
}

function buildGenesisLedger(buckets: AllocationBucket[]) {
  return buckets.map((b) => ({
    address: `0x${b.id.replace(/-/g, "").padEnd(40, "0").slice(0, 40)}`,
    holder: b.label,
    units: b.units,
    pct: b.pct,
  }));
}

function ExportButton({
  founderAName,
  founderBName,
  founderAPct,
  founderBPct,
  treasuryPct,
  presetLabel,
}: {
  founderAName: string;
  founderBName: string;
  founderAPct: number;
  founderBPct: number;
  treasuryPct: number;
  presetLabel: string;
}) {
  const buckets = buildBuckets(founderAName, founderBName, founderAPct, founderBPct, treasuryPct);
  const ledger = buildGenesisLedger(buckets);

  const text = [
    `${NAME} (${SYMBOL}) — genesis allocation`,
    "",
    `Total supply: ${formatUnits(TOTAL_SUPPLY)} ${SYMBOL}`,
    `Preset: ${presetLabel}`,
    "",
    "Cap table:",
    ...buckets.map((b) => `- ${b.label}: ${formatUnits(b.units)} ${SYMBOL} (${formatPct(b.pct, 0)})`),
    "",
    "Genesis ledger (placeholder addresses):",
    ...ledger.map((r) => `- ${r.holder}: ${formatUnits(r.units)} → ${r.address}`),
    "",
    "Vesting: 4 years, 1-year cliff (founder allocations only)",
    "Treasury: multisig-controlled, no cliff",
  ].join("\n");

  return (
    <Button
      variant="secondary"
      onClick={() => {
        try {
          navigator.clipboard.writeText(text);
        } catch {
          // Clipboard may be unavailable in some hosts.
        }
      }}
    >
      Copy genesis ledger
    </Button>
  );
}

export default function FoundationUnitsCryptocurrency() {
  const theme = useHostTheme();
  const [preset, setPreset] = useCanvasState<AllocationPresetKey>("preset", "with-treasury-10");
  const [founderAName, setFounderAName] = useCanvasState("founderAName", "Founder A");
  const [founderBName, setFounderBName] = useCanvasState("founderBName", "Founder B");
  const [founderAPctRaw, setFounderAPctRaw] = useCanvasState("founderAPct", "45");
  const [founderBPctRaw, setFounderBPctRaw] = useCanvasState("founderBPct", "45");
  const [treasuryPctRaw, setTreasuryPctRaw] = useCanvasState("treasuryPct", "10");

  const selectedPreset = PRESETS.find((p) => p.key === preset) ?? PRESETS[2];

  const founderAPct = Math.min(100, Math.max(0, Number(founderAPctRaw) || 0));
  const founderBPct = Math.min(100, Math.max(0, Number(founderBPctRaw) || 0));
  const treasuryPct = Math.min(100, Math.max(0, Number(treasuryPctRaw) || 0));
  const allocatedPct = founderAPct + founderBPct + treasuryPct;
  const unallocatedPct = Math.max(0, 100 - allocatedPct);
  const isBalanced = Math.abs(allocatedPct - 100) < 0.01;

  const buckets = buildBuckets(founderAName, founderBName, founderAPct, founderBPct, treasuryPct);
  const ledger = buildGenesisLedger(buckets);

  const pieData = [
    ...buckets.map((b) => ({
      label: b.label,
      value: b.pct,
      tone: b.tone ?? ("neutral" as const),
    })),
    ...(unallocatedPct > 0
      ? [{ label: "Unallocated", value: unallocatedPct, tone: "danger" as const }]
      : []),
  ];

  const vestingCategories = ["Year 0 (cliff)", "Year 1", "Year 2", "Year 3", "Year 4 (fully vested)"];
  const founderVestingSeries = [
    {
      name: "Cumulative vested (%)",
      data: [0, 25, 50, 75, 100],
      tone: "info" as const,
    },
  ];

  function applyPreset(key: AllocationPresetKey) {
    const p = PRESETS.find((x) => x.key === key);
    if (!p) return;
    setPreset(key);
    setFounderAPctRaw(String(p.founderAPct));
    setFounderBPctRaw(String(p.founderBPct));
    setTreasuryPctRaw(String(p.treasuryPct));
  }

  return (
    <Stack gap={16} style={{ padding: 16, background: theme.bg.editor }}>
      <Stack gap={8}>
        <Row gap={12} align="center" wrap>
          <H1>Foundation Units ({SYMBOL})</H1>
          <Spacer />
          <ExportButton
            founderAName={founderAName}
            founderBName={founderBName}
            founderAPct={founderAPct}
            founderBPct={founderBPct}
            treasuryPct={treasuryPct}
            presetLabel={selectedPreset.label}
          />
        </Row>
        <Text tone="secondary">
          Fixed-supply cryptocurrency for Sector 001 — {formatUnits(TOTAL_SUPPLY)} whole units minted at genesis,
          no inflation. Use the controls below to model how two founders split the supply.
        </Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Card>
          <CardBody>
            <Stat value={formatUnits(TOTAL_SUPPLY)} label={`Total supply (${SYMBOL})`} tone="info" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat value={String(DECIMALS)} label="Decimals (whole units)" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat
              value={formatPct(allocatedPct, 1)}
              label="Allocated"
              tone={isBalanced ? "success" : "warning"}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat
              value={formatUnits(pctToUnits(allocatedPct))}
              label="Units assigned"
              tone={isBalanced ? "success" : "warning"}
            />
          </CardBody>
        </Card>
      </Grid>

      <Callout tone={isBalanced ? "info" : "warning"} title="Token specification">
        <Stack gap={6}>
          <Text>
            <Text as="span" weight="semibold">
              {NAME}
            </Text>{" "}
            is a fixed-supply ledger token: {formatUnits(TOTAL_SUPPLY)} {SYMBOL} exist, period. There is no mining,
            minting, or burn mechanism in v1. Smallest unit = 1 {SYMBOL}.
          </Text>
          <Text tone="secondary">
            For two co-founders who are unsure how to split: start with{" "}
            <Text as="span" weight="semibold">
              45 / 45 / 10
            </Text>{" "}
            — equal founder stakes plus a 10% treasury for future needs. Adjust only if contribution was clearly
            asymmetric.
          </Text>
        </Stack>
      </Callout>

      <Grid columns={"1.2fr 0.8fr"} gap={16} align="stretch">
        <Stack gap={12}>
          <H2>Allocation model</H2>

          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">Preset templates</Text>}>
              Choose a starting split
            </CardHeader>
            <CardBody>
              <Row gap={8} wrap style={{ marginBottom: 12 }}>
                {PRESETS.map((p) => (
                  <Pill key={p.key} active={preset === p.key} onClick={() => applyPreset(p.key)}>
                    {p.label}
                  </Pill>
                ))}
              </Row>
              <Text tone="secondary">{selectedPreset.summary}</Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">Must sum to 100%</Text>}>
              Customize holders
            </CardHeader>
            <CardBody>
              <Grid columns={2} gap={14}>
                <Stack gap={8}>
                  <Text weight="semibold" size="small">
                    Founder A name
                  </Text>
                  <TextInput value={founderAName} onChange={setFounderAName} placeholder="Founder A" />
                  <Text weight="semibold" size="small">
                    Share (%)
                  </Text>
                  <TextInput
                    type="number"
                    value={founderAPctRaw}
                    onChange={setFounderAPctRaw}
                    placeholder="45"
                  />
                  <Text tone="secondary" size="small">
                    {formatUnits(pctToUnits(founderAPct))} {SYMBOL}
                  </Text>
                </Stack>
                <Stack gap={8}>
                  <Text weight="semibold" size="small">
                    Founder B name
                  </Text>
                  <TextInput value={founderBName} onChange={setFounderBName} placeholder="Founder B" />
                  <Text weight="semibold" size="small">
                    Share (%)
                  </Text>
                  <TextInput
                    type="number"
                    value={founderBPctRaw}
                    onChange={setFounderBPctRaw}
                    placeholder="45"
                  />
                  <Text tone="secondary" size="small">
                    {formatUnits(pctToUnits(founderBPct))} {SYMBOL}
                  </Text>
                </Stack>
              </Grid>
              <Divider style={{ margin: "14px 0" }} />
              <Stack gap={8}>
                <Text weight="semibold" size="small">
                  Protocol treasury (%)
                </Text>
                <TextInput
                  type="number"
                  value={treasuryPctRaw}
                  onChange={setTreasuryPctRaw}
                  placeholder="10"
                  style={{ maxWidth: 120 }}
                />
                <Text tone="secondary" size="small">
                  {formatUnits(pctToUnits(treasuryPct))} {SYMBOL} — grants, liquidity, future hires
                </Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">Supply cap: {formatUnits(TOTAL_SUPPLY)}</Text>}>
              Cap table bar
            </CardHeader>
            <CardBody>
              <UsageBar
                total={100}
                topLeftLabel={`${formatPct(allocatedPct, 1)} allocated`}
                topRightLabel={
                  unallocatedPct > 0
                    ? `${formatPct(unallocatedPct, 1)} unassigned`
                    : "Fully allocated"
                }
                segments={[
                  { id: "a", value: founderAPct, color: "blue" },
                  { id: "b", value: founderBPct, color: "orange" },
                  ...(treasuryPct > 0 ? [{ id: "t", value: treasuryPct, color: "green" }] : []),
                ]}
              />
              {!isBalanced ? (
                <Text tone="secondary" size="small" style={{ marginTop: 10 }}>
                  Percentages currently sum to {formatPct(allocatedPct, 1)} — adjust until they total 100%.
                </Text>
              ) : null}
            </CardBody>
          </Card>
        </Stack>

        <Stack gap={12}>
          <H2>Visual breakdown</H2>
          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">By holder (%)</Text>}>
              Allocation pie
            </CardHeader>
            <CardBody>
              <PieChart data={pieData} donut size={200} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Text tone="tertiary" size="small">Standard founder vesting</Text>}>
              Vesting curve (founders only)
            </CardHeader>
            <CardBody>
              <Text tone="secondary" size="small" style={{ marginBottom: 10 }}>
                4-year linear vesting with a 1-year cliff. Treasury is not subject to founder vesting.
              </Text>
              <BarChart
                categories={vestingCategories}
                series={founderVestingSeries}
                height={180}
                valueSuffix="%"
              />
            </CardBody>
          </Card>
        </Stack>
      </Grid>

      <H2>Genesis ledger</H2>
      <Text tone="secondary">
        Placeholder addresses for export — replace with real wallet addresses before deployment.
      </Text>

      <Table
        headers={["Holder", "Units", "Share", "Placeholder address", "Notes"]}
        rows={[
          ...ledger.map((row) => {
            const bucket = buckets.find((b) => b.label === row.holder);
            return [
              <Text key={`${row.holder}-h`} weight="semibold">
                {row.holder}
              </Text>,
              <Text key={`${row.holder}-u`}>{formatUnits(row.units)}</Text>,
              <Text key={`${row.holder}-p`}>{formatPct(row.pct, 1)}</Text>,
              <Text key={`${row.holder}-a`} tone="secondary" size="small">
                {row.address}
              </Text>,
              <Text key={`${row.holder}-n`} tone="secondary" size="small">
                {bucket?.note ?? ""}
              </Text>,
            ];
          }),
          ...(unallocatedPct > 0
            ? [
                [
                  <Text key="un-h" weight="semibold">
                    Unallocated
                  </Text>,
                  <Text key="un-u">{formatUnits(pctToUnits(unallocatedPct))}</Text>,
                  <Text key="un-p">{formatPct(unallocatedPct, 1)}</Text>,
                  <Text key="un-a" tone="secondary" size="small">
                    —
                  </Text>,
                  <Text key="un-n" tone="secondary" size="small">
                    Assign before genesis mint
                  </Text>,
                ],
              ]
            : []),
        ]}
        striped
        framed
      />

      <Divider />

      <Stack gap={8}>
        <H3>How to think about a two-person split</H3>
        <Text tone="secondary">
          1. <Text as="span" weight="semibold">Default to equal</Text> unless one person clearly contributed more
          capital, IP, or full-time months before launch.
        </Text>
        <Text tone="secondary">
          2. <Text as="span" weight="semibold">Carve out 10–20% treasury</Text> before splitting the remainder — it
          avoids renegotiating equity when you need liquidity or a third contributor.
        </Text>
        <Text tone="secondary">
          3. <Text as="span" weight="semibold">Put founder tokens in vesting</Text> — 4 years / 1-year cliff protects
          both parties if someone leaves early.
        </Text>
        <Text tone="secondary">
          4. <Text as="span" weight="semibold">Write it down</Text> — use Copy genesis ledger and attach it to a
          founders' agreement before minting on-chain.
        </Text>
      </Stack>
    </Stack>
  );
}
