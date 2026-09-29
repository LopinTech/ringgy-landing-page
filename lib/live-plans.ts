import type { Plan } from "@/components/PricingSection";

interface ApiPlan {
   slug: string;
   name: string;
   priceCents: number;
   includedMinutes: number;
   overageCentsPerMin: number;
   overageEnabled: boolean;
   features: string[];
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");

/**
 * Prices, allowances and features come from the plans configured in the
 * backoffice, so a price change there shows up here without a deploy
 * (refetched at most every five minutes). The design of each card — icon,
 * colours, tagline, CTA — stays in PricingSection, matched by plan name.
 * If the API is unreachable the static copy is shown as-is rather than
 * breaking the page.
 */
export async function withLivePlans(plans: Plan[]): Promise<Plan[]> {
   let live: ApiPlan[];
   try {
      const res = await fetch(`${API_URL}/billing/plans`, { next: { revalidate: 300 } });
      if (!res.ok) return plans;
      live = ((await res.json()) as { plans: ApiPlan[] }).plans;
   } catch {
      return plans;
   }

   return plans.map((plan) => {
      const match = live.find((p) => p.name.toLowerCase() === plan.name.toLowerCase());
      if (!match) return plan;
      const minutes = `${match.includedMinutes.toLocaleString("en-US")} call minutes included`;
      const overage = match.overageEnabled ? `Extra minutes ${formatRate(match.overageCentsPerMin)}/min` : null;
      const features = match.features.length ? match.features : plan.features;
      return {
         ...plan,
         price: formatPrice(match.priceCents),
         period: "/month",
         features: [minutes, ...(overage ? [overage] : []), ...features.filter((f) => !/minutes included/i.test(f))],
      };
   });
}

function formatPrice(cents: number): string {
   return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: cents % 100 ? 2 : 0, minimumFractionDigits: cents % 100 ? 2 : 0 })}`;
}

function formatRate(centsPerMin: number): string {
   return `$${(centsPerMin / 100).toFixed(centsPerMin % 1 ? 4 : 2)}`;
}
