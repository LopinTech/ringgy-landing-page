import type { Metadata } from "next";
import { AddOnsView } from "./AddOnsView";

export const metadata: Metadata = { title: "Add-ons" };

export default function AddOnsPage() {
  return <AddOnsView />;
}
