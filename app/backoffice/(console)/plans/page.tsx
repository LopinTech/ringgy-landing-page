import type { Metadata } from "next";
import { PlansView } from "./PlansView";

export const metadata: Metadata = { title: "Plans" };

export default function PlansPage() {
  return <PlansView />;
}
