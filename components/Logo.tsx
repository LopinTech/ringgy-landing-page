import Image from "next/image";

/**
 * Ringgy AI lockup, matching the dashboard app (frontend/components/brand/Logo.tsx):
 * the blue app-icon mark plus the wordmark set as real text, so it stays crisp
 * at small sizes. The mark has an empty alt because the wordmark beside it is text.
 */
export function Logo({ tone = "light", size = 32 }: { tone?: "light" | "dark"; size?: number }) {
  return (
    <span className="flex select-none items-center gap-2.5">
      <Image
        src="/assets/images/logo-mark.png"
        alt=""
        width={432}
        height={418}
        preload
        className="rounded-[9px]"
        style={{ width: size, height: size }}
      />
      <span className={`whitespace-nowrap text-[21px] font-extrabold tracking-[-.02em] ${tone === "dark" ? "text-white" : "text-ink"}`}>
        Ringgy <span className={tone === "dark" ? "text-on-dark-accent" : "text-primary"}>AI</span>
      </span>
    </span>
  );
}
