import type { Metadata } from "next";
import { TrialView } from "./TrialView";

export const metadata: Metadata = { title: "Free trial" };

export default function TrialPage() {
  return <TrialView />;
}
