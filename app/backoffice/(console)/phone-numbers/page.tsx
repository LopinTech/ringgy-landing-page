import type { Metadata } from "next";
import { PhoneNumbersView } from "./PhoneNumbersView";

export const metadata: Metadata = { title: "Phone numbers" };

export default function PhoneNumbersPage() {
  return <PhoneNumbersView />;
}
