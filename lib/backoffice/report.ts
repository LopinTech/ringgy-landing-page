import type { ReportRow } from "./api";

/** Cost / revenue breakdowns of a ReportRow as label/value rows for bar lists. */
export function costRows(row: ReportRow) {
  const c = row.cost;
  return [
    { label: "Telnyx (calls)", value: c.telnyxCents },
    { label: "AI", value: c.aiCents },
    { label: "Infrastructure", value: c.infraCents },
    { label: "Other", value: c.otherCents },
    { label: "Legacy", value: c.legacyCents, hint: "costed before the pricing model" },
    { label: "Phone numbers", value: c.phoneNumberCents },
    { label: "Add-ons", value: c.addOnCents },
  ];
}

export function revenueRows(row: ReportRow) {
  const r = row.revenue;
  return [
    { label: "Plans", value: r.planCents },
    { label: "Overage", value: r.overageCents },
    { label: "Phone numbers", value: r.phoneNumberCents },
    { label: "Add-ons", value: r.addOnCents },
    { label: "Other", value: r.otherCents },
  ];
}
