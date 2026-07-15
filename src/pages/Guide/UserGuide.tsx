import { useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarPlus,
  ClipboardList,
  Download,
  FileSpreadsheet,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  Mail,
  MailCheck,
  Monitor,
  ScanFace,
  Settings,
  Smartphone,
  Sparkles,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import { BackgroundFX, LandingStyles, Reveal } from "../Landing/Landing";

const PDF_URL = "/CheckIn-User-Guide.pdf";

type Step = {
  icon: ComponentType<{ size?: number | string; className?: string }>;
  title: string;
  points: string[];
  note?: string;
  accent: string;
};

const OWNER_STEPS: Step[] = [
  {
    icon: UserPlus,
    title: "Create your company account",
    accent: "from-sky-400 to-cyan-500",
    points: [
      "Open the CheckIn+ website and click Sign Up.",
      "Fill in company name, login email, and a recovery email (important!).",
      "Choose type: Company (business) or Academic (school). Add a logo (optional).",
      "Click Sign Up, or continue with Login with Google.",
      "Check your email for your password, then log in.",
    ],
    note: "You start on the Free plan — up to 10 people.",
  },
  {
    icon: MailCheck,
    title: "Verify your recovery email",
    accent: "from-indigo-400 to-violet-500",
    points: [
      "After logging in you may be sent straight to Edit Profile.",
      "Find the Recovery email section and click Send Verify Email.",
      "Open your recovery inbox and click the link.",
      "Back in CheckIn+, click “I already verified, refresh”.",
    ],
    note: "You must verify before using the rest of the website.",
  },
  {
    icon: LayoutDashboard,
    title: "Understand the menu",
    accent: "from-fuchsia-400 to-pink-500",
    points: [
      "Dashboard — charts and numbers about your team.",
      "Employee / Student Management — add and manage people.",
      "Attendance Management — see check-ins, late and absent.",
      "Leave Management — approve or reject requests.",
      "Plans & Pricing — view your plan and upgrade.",
    ],
    note: "Schools see Employee + Student. Businesses see only Employee.",
  },
  {
    icon: Users,
    title: "Add your first employee",
    accent: "from-emerald-400 to-teal-500",
    points: [
      "Open Employee Management and click Create Employee.",
      "Fill in name, position, email and optional details.",
      "Click Save — they receive an email with their password.",
    ],
    note: "You can add as many people as your plan allows (Free = 10).",
  },
  {
    icon: GraduationCap,
    title: "Add students (schools only)",
    accent: "from-amber-400 to-orange-500",
    points: [
      "Open Student Management and click Create Student.",
      "Fill in name, class, class days, times and enrollment period.",
      "Click Save — the student gets login details by email.",
    ],
    note: "Skip this step if you are a business.",
  },
  {
    icon: BarChart3,
    title: "View the Dashboard reports",
    accent: "from-sky-400 to-indigo-500",
    points: [
      "Choose a period: Weekly, Monthly or Yearly.",
      "Set work hours (e.g. 09:00–17:00) to detect late arrivals.",
      "Mark off days — the days that are NOT working days.",
      "Read the top cards, then scroll for charts and leaderboards.",
    ],
    note: "Off days (red) are never counted as absent.",
  },
  {
    icon: ClipboardList,
    title: "Check attendance",
    accent: "from-cyan-400 to-blue-500",
    points: [
      "Open Attendance Management and click Show Search.",
      "Pick dates, set off days and optional grace period.",
      "Click Search to see the results.",
    ],
  },
  {
    icon: CalendarCheck,
    title: "Handle leave requests",
    accent: "from-violet-400 to-purple-500",
    points: [
      "Open Leave Management (watch for the red bell badge).",
      "Filter by person, status or month, then Search.",
      "Approve a request, or Reject with a reason.",
    ],
  },
  {
    icon: UserCog,
    title: "Edit your company profile",
    accent: "from-rose-400 to-pink-500",
    points: [
      "Click your name/photo → Edit Profile.",
      "Update logo and details, then Save.",
      "Danger Zone lets you deactivate or delete the account.",
    ],
  },
  {
    icon: KeyRound,
    title: "Change your password",
    accent: "from-teal-400 to-emerald-500",
    points: [
      "Click your profile → Reset Password.",
      "Enter your current and new passwords, then Save.",
    ],
  },
  {
    icon: ArrowUpRight,
    title: "Upgrade your plan",
    accent: "from-sky-400 to-fuchsia-500",
    points: [
      "Open Plans & Pricing and pick the plan you need.",
      "Click Contact us on that plan.",
      "Email office@techhive-innovation.io with your company name, plan and member count.",
      "Wait for activation, then refresh the website.",
    ],
  },
  {
    icon: FileSpreadsheet,
    title: "Downgrade your plan",
    accent: "from-slate-400 to-slate-600",
    points: [
      "Downgrades are processed by support (office@techhive-innovation.io).",
      "Choose who to keep (up to the new limit).",
      "Download member and attendance data (.xlsx).",
      "Confirm “Remove [N] & downgrade”.",
    ],
  },
];

const MEMBER_STEPS: Step[] = [
  {
    icon: Smartphone,
    title: "Install and open the app",
    accent: "from-sky-400 to-cyan-500",
    points: [
      "Install CheckIn+ on your phone.",
      "Log in with the email and password your company owner gave you.",
    ],
  },
  {
    icon: ScanFace,
    title: "Check in / Check out",
    accent: "from-indigo-400 to-violet-500",
    points: [
      "Allow Camera and Location permissions.",
      "Point the camera at your face and take a photo.",
      "Confirm Check In (or Check Out).",
    ],
  },
  {
    icon: CalendarPlus,
    title: "Request leave (website)",
    accent: "from-fuchsia-400 to-pink-500",
    points: [
      "Open Leave Management → Create Leave Form.",
      "Fill in type, dates, reason and an optional attachment.",
      "Submit and track the status.",
    ],
  },
];

const PLANS = [
  { name: "Free", members: "Up to 10", price: "Free" },
  { name: "Basic Business", members: "11 – 50", price: "$10 – $40 / mo" },
  { name: "Medium Business", members: "51 – 200", price: "$50 – $100 / mo" },
  { name: "Enterprise", members: "201+", price: "$100 – $300 / mo" },
];

const LEGEND = [
  { label: "On time", color: "bg-slate-400" },
  { label: "Late", color: "bg-rose-500" },
  { label: "Overtime", color: "bg-emerald-500" },
  { label: "Leave", color: "bg-amber-400" },
  { label: "Absent", color: "bg-slate-300" },
];

type TabKey = "owner" | "member";

const StepCard = ({ step, index }: { step: Step; index: number }) => (
  <Reveal delay={(index % 2) * 90}>
    <article className="group relative flex h-full gap-4 overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-white shadow-lg`}
        >
          <step.icon size={22} />
        </div>
        <span className="mt-2 text-xs font-bold text-slate-400">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
        <ul className="mt-3 space-y-2">
          {step.points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
        {step.note && (
          <p className="mt-4 rounded-xl bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700">
            {step.note}
          </p>
        )}
      </div>
    </article>
  </Reveal>
);

const UserGuide = () => {
  const [tab, setTab] = useState<TabKey>("owner");
  const steps = tab === "owner" ? OWNER_STEPS : MEMBER_STEPS;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f6f9ff] text-slate-800 font-sans antialiased">
      <BackgroundFX />

      {/* ------------------------------------------------------------- Nav */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/60 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/login-logo.png"
              alt="CheckIn+"
              className="h-8 w-auto max-w-[170px] object-contain"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 sm:inline-flex"
            >
              <ArrowLeft size={16} /> Home
            </Link>
            <a
              href={PDF_URL}
              download
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/40"
            >
              <Download size={16} /> Download PDF
            </a>
          </div>
        </nav>
      </header>

      {/* ------------------------------------------------------------ Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-10 pt-32 text-center sm:px-8 sm:pt-40">
        <div className="animate-fade-down inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
          <Sparkles size={14} className="text-sky-500" />
          Smart. Secure. Scalable
        </div>
        <h1 className="animate-fade-up mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl">
          The{" "}
          <span className="animate-gradient bg-[linear-gradient(110deg,#0ea5e9,#6366f1,#d946ef,#0ea5e9)] bg-[length:200%_auto] bg-clip-text text-transparent">
            User Guide
          </span>
        </h1>
        <p className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 [animation-delay:120ms]">
          Everything you need to run CheckIn+, step by step. No technical
          knowledge required.
        </p>
        <div className="animate-fade-up mt-8 flex justify-center [animation-delay:220ms]">
          <a
            href={PDF_URL}
            download
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-sky-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          >
            <Download size={18} className="transition-transform group-hover:translate-y-0.5" />
            Download the PDF guide
          </a>
        </div>
      </section>

      {/* ------------------------------------------------------- Who is it for */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Building2,
              role: "Company owner",
              use: "Website — full control",
              text: "You signed up the business. Manage everything from your browser.",
              accent: "from-sky-400 to-indigo-500",
            },
            {
              icon: BadgeCheck,
              role: "Employee or student",
              use: "Mobile app + website",
              text: "Your boss added you. Check in on the app, view leave on the web.",
              accent: "from-fuchsia-400 to-pink-500",
            },
          ].map((card, i) => (
            <Reveal key={card.role} delay={i * 100}>
              <div className="flex h-full items-start gap-4 rounded-3xl border border-white/70 bg-white/70 p-6 backdrop-blur-xl">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}
                >
                  <card.icon size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{card.role}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                    {card.use}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{card.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- Tabs */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pt-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-md rounded-full border border-white/70 bg-white/70 p-1.5 backdrop-blur-xl">
          {(
            [
              { key: "owner", label: "Company Owner", icon: Monitor },
              { key: "member", label: "Employee / Student", icon: Smartphone },
            ] as { key: TabKey; label: string; icon: Step["icon"] }[]
          ).map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/25"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <item.icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">
                  {item.key === "owner" ? "Owner" : "Member"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------- Steps */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div
          key={tab}
          className="grid animate-fade-up gap-5 md:grid-cols-2"
        >
          {steps.map((step, i) => (
            <StepCard key={`${tab}-${step.title}`} step={step} index={i} />
          ))}
        </div>

        {/* extras for owner tab */}
        {tab === "owner" && (
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl border border-white/70 bg-white/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-sky-500" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Attendance colours
                  </h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {LEGEND.map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="rounded-3xl border border-white/70 bg-white/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-fuchsia-500" />
                  <h3 className="text-lg font-bold text-slate-900">Plans</h3>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Plan</th>
                        <th className="px-4 py-2.5 font-semibold">Members</th>
                        <th className="px-4 py-2.5 font-semibold">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {PLANS.map((plan) => (
                        <tr key={plan.name} className="text-slate-700">
                          <td className="px-4 py-2.5 font-semibold text-slate-900">
                            {plan.name}
                          </td>
                          <td className="px-4 py-2.5">{plan.members}</td>
                          <td className="px-4 py-2.5">{plan.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </section>

      {/* -------------------------------------------------------- CTA + help */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 px-8 py-14 text-center shadow-2xl shadow-indigo-500/30 sm:px-16">
            <div className="animate-blob-slow absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
            <div className="animate-blob-slower absolute -bottom-16 -right-6 h-64 w-64 rounded-full bg-fuchsia-300/30 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Still have a question?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
                Reach our team at{" "}
                <span className="font-semibold text-white">
                  office@techhive-innovation.io
                </span>{" "}
                — we're happy to help.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:office@techhive-innovation.io"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition-all hover:-translate-y-0.5 sm:w-auto"
                >
                  <Mail size={18} /> Email support
                </a>
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
                >
                  <Settings size={18} /> Go to app
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
          <img
            src="/login-logo.png"
            alt="CheckIn+"
            className="h-7 w-auto max-w-[150px] object-contain"
          />
          <p className="text-sm font-medium text-slate-600">
            © {new Date().getFullYear()} CheckIn+. Smart. Secure. Scalable.
          </p>
          <p className="text-sm font-medium text-slate-600">
            Powered by{" "}
            <a
              href="https://techhive-innovation.io"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 transition-opacity hover:opacity-80"
            >
              TechHive Innovation
            </a>
          </p>
        </div>
      </footer>

      <LandingStyles />
    </div>
  );
};

export default UserGuide;
