"use client";

import { useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from "react";
import { BotIcon, PersonIcon } from "./ui";

/** A pre-recorded clip for one transcript line; `duration` (seconds) drives the timeline before the file loads. */
export type CallAudio = { src: string; duration: number };
/** Lines spoken by "Ringgy" render as the AI; any other speaker is the caller. */
export type CallLine = [speaker: "Ringgy" | "Caller" | "Customer", text: string, audio?: CallAudio];
export type CallPlayerHandle = { play(): void };

type CallPlayerProps = {
  scripts: Record<string, CallLine[]>;
  /** Scenario picker entries; the first one is selected initially. The picker is hidden unless there are 2+. */
  options?: { value: string; label: string }[];
  /** "icon": bot/person glyphs. "initials": solid "AI" / "You" badges. */
  avatar?: "icon" | "initials";
  footer: ReactNode;
  ref?: Ref<CallPlayerHandle>;
};

const BAR_COUNT = 44;
const BAR_HEIGHTS = Array.from(
  { length: BAR_COUNT },
  (_, i) => 25 + Math.round(Math.abs(Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.53) * 0.4) * 75),
);

/** Pause between one speaker finishing and the next starting. */
const LINE_GAP_MS = 350;

const lineDur = ([, text, audio]: CallLine) => audio?.duration ?? 0.9 + text.split(/\s+/).length * 0.36;
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
const fmt2 = (t: number) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/**
 * Sample-call card with a seekable waveform and a synced transcript. Lines with
 * an `audio` clip play the recording; lines without one are read aloud with the
 * browser's speech synthesis.
 */
export function CallPlayer({ scripts, options, avatar = "icon", footer, ref }: CallPlayerProps) {
  const [scriptKey, setScriptKey] = useState(options?.[0]?.value ?? Object.keys(scripts)[0]);
  const [line, setLine] = useState(0);
  const [lineT, setLineT] = useState(0);
  const [playing, setPlaying] = useState(false);

  const token = useRef(0);
  const lineTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const progTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const voices = useRef<{ ai?: SpeechSynthesisVoice; caller?: SpeechSynthesisVoice }>({});
  // One reused element: after the first click-initiated play(), browsers let it keep playing clip after clip.
  const audioEl = useRef<HTMLAudioElement>(null);
  const prefetched = useRef(new Set<string>());
  const cardRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const script = scripts[scriptKey];
  const durs = script.map(lineDur);
  const starts = durs.map((_, i) => durs.slice(0, i).reduce((a, b) => a + b, 0));
  const total = durs.reduce((a, b) => a + b, 0);
  const elapsed = starts[line] + durs[line] * lineT;
  const frac = elapsed / total;
  const finished = line >= script.length - 1 && lineT >= 1;

  function pickVoices() {
    const ss = window.speechSynthesis;
    if (!ss) return;
    const vs = ss.getVoices().filter((v) => /^en/i.test(v.lang));
    const find = (re: RegExp) => vs.find((v) => re.test(v.name));
    const ai = find(/Samantha|Jenny|Aria|Google US English|Female|Zira|Karen/i) || vs[0];
    const caller = find(/Daniel|Alex|Guy|Google UK English Male|Male|David|Fred/i) || vs.find((v) => v !== ai) || vs[0];
    voices.current = { ai, caller };
  }

  function stopAudio() {
    clearTimeout(lineTimer.current);
    clearInterval(progTimer.current);
    window.speechSynthesis?.cancel();
    const el = audioEl.current;
    if (el) {
      el.onended = el.onerror = null;
      el.pause();
    }
  }

  /** Warm the browser cache for an upcoming clip so lines follow each other without a gap. */
  function prefetch(src: string) {
    if (prefetched.current.has(src)) return;
    prefetched.current.add(src);
    const a = new Audio();
    a.preload = "auto";
    a.src = src;
  }

  function stop() {
    token.current = -1;
    stopAudio();
  }

  function playLine(key: string, i: number) {
    const lines = scripts[key];
    stopAudio();
    if (i >= lines.length) {
      setPlaying(false);
      setLine(lines.length - 1);
      setLineT(1);
      return;
    }
    const [who, text, audio] = lines[i];
    const myToken = ++token.current;
    const dur = lineDur(lines[i]);
    setLine(i);
    setLineT(0);
    setPlaying(true);
    const next = () => {
      if (token.current === myToken) playLine(key, i + 1);
    };

    const speak = () => {
      clearInterval(progTimer.current);
      const start = Date.now();
      progTimer.current = setInterval(() => setLineT(Math.min(1, (Date.now() - start) / 1000 / dur)), 100);
      const ss = window.speechSynthesis;
      if (ss && window.SpeechSynthesisUtterance) {
        if (!voices.current.ai) pickVoices();
        const u = new SpeechSynthesisUtterance(text);
        const ai = who === "Ringgy";
        const voice = ai ? voices.current.ai : voices.current.caller;
        if (voice) u.voice = voice;
        u.rate = ai ? 1.02 : 1.05;
        u.pitch = ai ? 1.1 : 0.85;
        u.onend = () => setTimeout(next, LINE_GAP_MS);
        ss.speak(u);
        // Fallback in case the speech engine never fires onend.
        lineTimer.current = setTimeout(next, dur * 2200 + 1500);
      } else {
        lineTimer.current = setTimeout(next, dur * 1000);
      }
    };

    if (!audio) return speak();

    const el = (audioEl.current ??= new Audio());
    // If the clip can't load or play, read the line aloud instead so the call keeps going.
    const fallback = () => {
      if (token.current === myToken) speak();
    };
    el.onended = () => setTimeout(next, LINE_GAP_MS);
    el.onerror = fallback;
    el.src = audio.src;
    el.play().catch(fallback);
    progTimer.current = setInterval(() => setLineT(Math.min(1, el.currentTime / dur)), 100);
    const upcoming = lines[i + 1]?.[2];
    if (upcoming) prefetch(upcoming.src);
  }

  function seekTo(i: number) {
    if (playing) playLine(scriptKey, i);
    else {
      setLine(i);
      setLineT(0);
    }
  }

  function togglePlay() {
    if (playing) {
      stop();
      setPlaying(false);
      setLineT(0);
    } else {
      playLine(scriptKey, finished ? 0 : line);
    }
  }

  useImperativeHandle(ref, () => ({
    play() {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      if (!playing) playLine(scriptKey, finished ? 0 : line);
    },
  }));

  useEffect(() => {
    const ss = window.speechSynthesis;
    if (ss) {
      pickVoices();
      ss.onvoiceschanged = () => pickVoices();
    }
    return () => {
      stop();
      if (ss) ss.onvoiceschanged = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const box = transcriptRef.current;
    const el = box?.querySelector<HTMLElement>(`[data-line="${line}"]`);
    if (box && el) box.scrollTo({ top: Math.max(0, el.offsetTop - 70), behavior: "smooth" });
  }, [scriptKey, line]);

  return (
    <div ref={cardRef} className="rounded-[22px] border border-line bg-white p-[clamp(18px,2.4vw,34px)] shadow-[0_40px_80px_-40px_rgba(21,87,176,.35)]">
      <div className="flex flex-wrap items-center gap-[22px]">
        <div className="flex min-w-0 flex-[1_1_300px] items-center gap-[18px] rounded-full bg-[#EEF3FA] py-1.5 pl-1.5 pr-[26px]">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause call recording" : "Play call recording"}
            className="flex h-[62px] w-[62px] flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-lg text-white shadow-[0_8px_16px_-8px_rgba(31,111,235,.7)] transition-colors hover:bg-brand"
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <div
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const t = ((e.clientX - r.left) / r.width) * total;
              const i = starts.findIndex((st, k) => t >= st && t < st + durs[k]);
              seekTo(i < 0 ? script.length - 1 : i);
            }}
            className="flex h-[34px] min-w-0 flex-1 cursor-pointer items-center gap-[3px]"
          >
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="min-w-px flex-1 rounded-[2px]"
                style={{ height: `${h}%`, background: i / BAR_COUNT < frac ? "#1557B0" : "#B3BFCE" }}
              />
            ))}
          </div>
          <span className="h-[22px] w-px flex-none bg-[#B3BFCE]" />
          <span className="flex-none text-[17px] tabular-nums text-muted">
            {fmt(elapsed)} / {fmt(total)}
          </span>
        </div>
        {options && options.length > 1 && (
          <div className="relative flex-none">
            <select
              value={scriptKey}
              aria-label="Choose a sample call"
              onChange={(e) => {
                stop();
                setScriptKey(e.target.value);
                setLine(0);
                setLineT(0);
                setPlaying(false);
              }}
              className="h-[62px] cursor-pointer appearance-none rounded-full border border-line-2 bg-white pl-6 pr-[58px] text-[19px] font-medium text-ink outline-none"
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F6FEB" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-6 top-[21px]" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        )}
      </div>

      <div ref={transcriptRef} className="relative mt-[22px] flex h-[390px] flex-col gap-[26px] overflow-y-auto scroll-smooth py-2 pr-3">
        {script.map(([who, text], i) => {
          const state = i < line ? "past" : i === line ? "now" : "future";
          const ai = who === "Ringgy";
          return (
            <button
              type="button"
              key={`${scriptKey}-${i}`}
              data-line={i}
              onClick={() => seekTo(i)}
              className="grid cursor-pointer grid-cols-[62px_minmax(0,1fr)] gap-[22px] border-0 bg-transparent p-0 text-left transition-opacity duration-300"
              style={{ opacity: state === "future" ? 0.45 : 1 }}
            >
              {avatar === "icon" ? (
                <div
                  className="flex h-[62px] w-[62px] items-center justify-center rounded-full border"
                  style={{ background: ai ? "#EEF4FD" : "#EEF1F5", borderColor: ai ? "#C9DCFA" : "#E3E8EF" }}
                >
                  {ai ? <BotIcon className="text-primary" /> : <PersonIcon size={24} className="text-muted" />}
                </div>
              ) : (
                <div
                  className="flex h-[62px] w-[62px] items-center justify-center rounded-full text-[13px] font-bold"
                  style={{ background: ai ? "#1F6FEB" : "#E9EDF3", color: ai ? "#fff" : "#58687B" }}
                >
                  {ai ? "AI" : "You"}
                </div>
              )}
              <div className="min-w-0">
                <div className="mb-2.5 flex items-baseline gap-[18px]">
                  <span className="text-[19px] font-bold text-ink">{who}</span>
                  <span className="text-base tabular-nums text-faint">{fmt2(starts[i])}</span>
                </div>
                <div
                  className="inline-block max-w-[30em] rounded-xl px-[22px] py-3.5 text-lg leading-[1.55] text-text-2"
                  style={{ background: ai ? (state === "now" ? "#E3EDFC" : "#EEF4FD") : state === "now" ? "#E9EDF3" : "#F1F4F9" }}
                >
                  {text}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-[18px] flex flex-wrap items-center justify-between gap-[18px] border-t border-line pt-6">{footer}</div>
    </div>
  );
}
