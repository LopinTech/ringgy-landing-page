import { Accent, Eyebrow, PHONE_PATH, UsersIcon, container, sectionPad } from "./ui";

const PROBLEMS = [
  {
    num: "01",
    title: "Missed Calls",
    body: "You’re busy on a job. The phone rings. The customer calls someone else.",
    bg: "#FDE4E5",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#E5484D" aria-hidden>
        <path d={PHONE_PATH} />
        <path d="M15 3.5l5 5M20 3.5l-5 5" stroke="#E5484D" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "After-Hours Calls",
    body: "Customers don’t only call between 9–5. Opportunities come in at night and on weekends.",
    bg: "#E3EDFC",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F6FEB" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5.5l3.5 2" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Overloaded Staff",
    body: "Your team shouldn’t spend the day answering the same questions and scheduling appointments.",
    bg: "#FFF0D2",
    icon: <UsersIcon size={30} className="text-[#F2A516]" />,
  },
  {
    num: "04",
    title: "Slow Response",
    body: "Customers expect an immediate response. Delays lead to lost business.",
    bg: "#EFE6FD",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#7C3AED" aria-hidden>
        <path d="M13.5 2L5 13.5h6L9.5 22 19 10h-6z" />
      </svg>
    ),
  },
];

export function ProblemSection() {
  return (
    <section className="bg-surface">
      <div className={`${container} ${sectionPad}`}>
        <div data-reveal="" className="flex flex-wrap items-end justify-between gap-x-16 gap-y-7 sm:px-2.5">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="m-0 text-[clamp(38px,4.6vw,66px)] font-bold leading-[1.08] tracking-[-.025em] text-ink">
              Every Missed Call Could Be
              <br />a <Accent>Missed Job</Accent>
            </h2>
          </div>
          <p className="mb-[34px] max-w-[27em] text-[clamp(17px,1.4vw,20px)] leading-[1.7] text-body">
            When calls go unanswered, potential customers move on to your competitors. Here are the most common challenges home service businesses
            face.
          </p>
        </div>
        <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-7">
          {PROBLEMS.map((p) => (
            <div
              key={p.num}
              data-reveal=""
              className="rounded-[14px] border border-line bg-white px-9 pb-[34px] pt-[26px] shadow-[0_14px_34px_-28px_rgba(15,37,64,.3)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-[3px] hover:shadow-[0_20px_40px_-26px_rgba(15,37,64,.35)]"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-[82px] w-[82px] items-center justify-center rounded-xl" style={{ background: p.bg }}>
                  {p.icon}
                </div>
                <div className="pt-2.5 text-[40px] font-medium leading-none text-[#C9D6EA]">{p.num}</div>
              </div>
              <div className="mb-2.5 text-[26px] font-bold tracking-[-.01em] text-ink">{p.title}</div>
              <p className="m-0 text-[19px] leading-[1.6] text-muted [text-wrap:pretty]">{p.body}</p>
            </div>
          ))}
        </div>
        <p data-reveal="" className="mt-14 text-center text-[clamp(24px,2.8vw,42px)] leading-[1.3] tracking-[-.01em] text-ink">
          Ringgy makes sure <Accent>every customer</Accent> gets an answer.
        </p>
      </div>
    </section>
  );
}
