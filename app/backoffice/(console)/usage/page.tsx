import type { Metadata } from "next";
import { UsageView } from "./UsageView";

export const metadata: Metadata = { title: "Usage & costs" };

export default function UsagePage() {
  return <UsageView />;
}
