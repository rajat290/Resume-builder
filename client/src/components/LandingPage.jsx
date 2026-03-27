import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  SearchCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";

const steps = [
  {
    title: "Enter your details",
    description: "Add your experience, skills, and projects once in a clean guided flow."
  },
  {
    title: "Paste job description",
    description: "Drop in any role description and let AI detect what matters most."
  },
  {
    title: "Get optimized resume",
    description: "See a tailored version instantly, then export as a recruiter-ready PDF."
  }
];

const features = [
  {
    icon: Sparkles,
    title: "AI Resume Customization",
    description: "Tailors your resume for each role so you stop sending the same version everywhere."
  },
  {
    icon: FileCheck2,
    title: "ATS-Friendly Templates",
    description: "Use clean templates built for readability and parsing by hiring systems."
  },
  {
    icon: Zap,
    title: "Real-Time Preview",
    description: "Watch every edit update instantly before you send your next application."
  },
  {
    icon: CheckCircle2,
    title: "One-Click PDF Download",
    description: "Export a polished resume fast without formatting it again in Word."
  }
];

const trustStats = [
  { value: "1000+", label: "Resumes optimized" },
  { value: "4.8/5", label: "Average user rating" },
  { value: "< 2 min", label: "To tailor a resume" }
];

const proofPoints = [
  "No signup required",
  "ATS-friendly PDF export",
  "Built for fast job applications"
];

const companyStrip = ["Google", "Amazon", "TCS", "Infosys", "Accenture", "Startups"];

const beforePoints = [
  "Generic summary with no target role",
  "Missing backend and ATS keywords",
  "Weak bullet phrasing with low recruiter impact"
];

const afterPoints = [
  "Summary rewritten for the exact job opening",
  "Missing keywords surfaced and matched where relevant",
  "Experience reframed to highlight transferable backend work"
];

export default function LandingPage({ onPrimaryCta, onSecondaryCta }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fbff_0%,_#edf5ff_44%,_#ffffff_100%)] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(22,163,74,0.12),_transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/85 px-5 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
                Smart Resume Builder
              </p>
              <p className="mt-1 text-sm text-slate-500">
                AI resume optimizer for ATS and recruiters.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onSecondaryCta}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                Try Demo
              </button>
              <button
                type="button"
                onClick={onPrimaryCta}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Optimize My Resume
              </button>
            </div>
          </header>

          <div className="grid gap-12 py-14 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:py-20">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                <Star size={14} className="fill-current" />
                AI Resume Optimizer
              </p>
              <h1 className="mt-6 font-display text-4xl leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Optimize Your Resume for ATS and Recruiters in Seconds
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Upload your resume, paste any job description, and get a tailored
                version with stronger keywords, sharper positioning, and a better
                chance of getting shortlisted.
              </p>
              <p className="mt-4 text-lg font-semibold text-slate-800">
                Stop sending the same resume everywhere.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onPrimaryCta}
                  className="rounded-full bg-sky-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-sky-700"
                >
                  Optimize My Resume
                </button>
                <button
                  type="button"
                  onClick={onSecondaryCta}
                  className="rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                >
                  Try Demo
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {proofPoints.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_10px_20px_rgba(15,23,42,0.05)]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {trustStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                  >
                    <p className="text-2xl font-bold text-slate-950">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl md:block" />
              <div className="absolute -right-10 bottom-10 hidden h-40 w-40 rounded-full bg-sky-200/50 blur-3xl md:block" />
              <div className="relative rounded-[2.4rem] border border-sky-100 bg-white p-4 shadow-[0_32px_100px_rgba(15,23,42,0.14)] sm:p-5">
                <div className="rounded-[1.9rem] bg-slate-950 p-4 text-white sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-sky-300">
                        AI Resume Optimizer
                      </p>
                      <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                        Backend Engineer at ProductFlow
                      </h2>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300">
                      <TrendingUp size={14} />
                      ATS Score 94
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] bg-white/6 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Job Description Match
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["REST APIs", "Backend", "Scalability", "Node.js", "Performance"].map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] bg-white/6 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Smart Suggestions
                        </p>
                        <div className="mt-3 space-y-3">
                          <div className="rounded-2xl bg-white/5 p-3">
                            <p className="text-sm font-semibold">Add 4 missing backend keywords</p>
                            <p className="mt-1 text-sm text-slate-300">
                              Improve recruiter and ATS match for this role.
                            </p>
                          </div>
                          <div className="rounded-2xl bg-emerald-500/10 p-3">
                            <p className="text-sm font-semibold text-emerald-300">
                              Rewrite weak experience bullets
                            </p>
                            <p className="mt-1 text-sm text-slate-300">
                              Focus more on APIs, scalability, and impact.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] bg-white p-4 text-slate-900">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
                            Live Resume Preview
                          </p>
                          <h3 className="mt-2 text-2xl font-bold">Aarav Sharma</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Backend Developer | aarav.dev@email.com | Bengaluru
                          </p>
                        </div>
                        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Recruiter Ready
                        </div>
                      </div>

                      <div className="mt-5 space-y-4 text-sm">
                        <div>
                          <p className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                            Summary
                          </p>
                          <p className="mt-2 leading-6 text-slate-600">
                            Backend-focused engineer with experience building APIs,
                            optimizing workflows, and shipping reliable product features.
                          </p>
                        </div>
                        <div>
                          <p className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                            Score Breakdown
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                                ATS
                              </p>
                              <p className="mt-1 text-lg font-bold text-slate-900">96</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                                Keywords
                              </p>
                              <p className="mt-1 text-lg font-bold text-slate-900">91</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                                Impact
                              </p>
                              <p className="mt-1 text-lg font-bold text-slate-900">88</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                            Experience
                          </p>
                          <ul className="mt-2 space-y-2 text-slate-600">
                            <li>Built recruiter workflow APIs that reduced manual review effort.</li>
                            <li>Improved platform performance and resume processing speed.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[1.75rem] border border-slate-200 bg-white/80 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-400">
              <span className="uppercase tracking-[0.22em]">Trusted by job seekers targeting</span>
              {companyStrip.map((company) => (
                <span key={company} className="text-slate-500">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              Before vs After
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-950 sm:text-4xl">
              See What Changes When Your Resume Is Written for the Job
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              The experience stays the same. The positioning, keywords, and recruiter
              impact improve.
            </p>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
            <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                    Before
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                    Generic Resume
                  </h3>
                </div>
                <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                  ATS 61
                </div>
              </div>

              <div className="mt-5 rounded-[1.4rem] bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Summary
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  JavaScript developer looking for a software role with opportunities to
                  grow and work on exciting projects.
                </p>

                <div className="mt-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Problems
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {beforePoints.map((item) => (
                      <li key={item} className="rounded-2xl bg-amber-50 px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)]">
                <ArrowRight size={16} />
                Score +33
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    After
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                    Tailored for the Role
                  </h3>
                </div>
                <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                  ATS 94
                </div>
              </div>

              <div className="mt-5 rounded-[1.4rem] bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Summary
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Backend-focused engineer with experience building APIs, optimizing
                  performance, and shipping product workflows aligned to recruiter needs.
                </p>

                <div className="mt-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Improvements
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {afterPoints.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 rounded-2xl bg-emerald-50 px-3 py-2"
                      >
                        <SearchCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              How It Works
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-950 sm:text-4xl">
              Three simple steps to a stronger application
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              Why It Converts
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-950 sm:text-4xl">
              Built to solve the real reason resumes get ignored
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              You are not losing interviews because you cannot write. You are losing
              them because the same resume rarely fits every role. This product fixes
              that fast.
            </p>
            <button
              type="button"
              onClick={onPrimaryCta}
              className="mt-6 rounded-full bg-sky-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-sky-700"
            >
              Optimize My Resume
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="rounded-[2.5rem] bg-slate-950 px-6 py-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              Ready To Start
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Increase your chances of getting shortlisted without slowing down your applications
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Value first, friction later. Start with a demo or continue with Google
              and get into the dashboard quickly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={onPrimaryCta}
                className="rounded-full bg-emerald-500 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Start Building
              </button>
              <button
                type="button"
                onClick={onSecondaryCta}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Try Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
