import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Fingerprint,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { SUBSCRIPTION_PLANS } from "../../config/plans";

/* -------------------------------------------------------------------------- */
/*  Scroll reveal hook                                                         */
/* -------------------------------------------------------------------------- */

export const useReveal = <T extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, shown };
};

export const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const { ref, shown } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Animated counter                                                          */
/* -------------------------------------------------------------------------- */

const Counter = ({
  to,
  suffix = "",
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) => {
  const { ref, shown } = useReveal<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shown) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*  Static data                                                               */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: Fingerprint,
    title: "Smart Check-In",
    text: "One tap to clock in and out. GPS and device-aware attendance that just works, everywhere your team is.",
    accent: "from-sky-400 to-cyan-500",
  },
  {
    icon: CalendarCheck,
    title: "Leave Management",
    text: "Request, approve and track time off in seconds. Balances update automatically, no spreadsheets required.",
    accent: "from-indigo-400 to-violet-500",
  },
  {
    icon: Users,
    title: "Employee Directory",
    text: "A living org chart. Roles, teams and profiles kept in sync across every workspace and device.",
    accent: "from-fuchsia-400 to-pink-500",
  },
  {
    icon: GraduationCap,
    title: "Student Tracking",
    text: "Built for schools too. Track student attendance with the same effortless flow your staff already love.",
    accent: "from-amber-400 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    text: "Beautiful dashboards reveal presence, punctuality and trends the moment they happen.",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    text: "Role-based access, encrypted data and Google sign-in keep every organisation protected.",
    accent: "from-blue-400 to-indigo-500",
  },
];

const STATS = [
  { to: 99, suffix: "%", label: "Check-in accuracy" },
  { to: 12000, suffix: "+", label: "Check-ins tracked" },
  { to: 3, suffix: "s", label: "Average check-in" },
  { to: 24, suffix: "/7", label: "Always available" },
];

const STEPS = [
  {
    icon: Users,
    title: "Add your team",
    text: "Invite employees or import your student roster in minutes.",
  },
  {
    icon: Fingerprint,
    title: "They check in",
    text: "Staff tap to clock in from any device, the moment their day starts.",
  },
  {
    icon: LayoutDashboard,
    title: "You get clarity",
    text: "Watch attendance, leave and trends update live on your dashboard.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const Landing = () => {
  const token = useAuthStore((state) => state.token);
  const isAuthed = !!token;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const primaryCta = useMemo(
    () =>
      isAuthed
        ? { label: "Go to Dashboard", to: "/" }
        : { label: "Get started free", to: "/signup" },
    [isAuthed],
  );

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f6f9ff] text-slate-800 font-sans antialiased">
      <BackgroundFX />

      {/* ---------------------------------------------------------------- Nav */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-white/70 border-b border-white/60 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/login-logo.png"
              alt="CheckIn+"
              className="h-8 w-auto max-w-[170px] object-contain"
            />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/guide"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-900"
            >
              User Guide
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isAuthed ? (
              <Link
                to="/"
                className="hidden rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800 sm:inline-flex"
              >
                Open app
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="hidden rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/40 sm:inline-flex"
                >
                  Get started
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-slate-700 md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* mobile menu */}
        <div
          className={`overflow-hidden border-t border-white/50 bg-white/80 backdrop-blur-xl transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/guide"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              User Guide
            </Link>
            <Link
              to={isAuthed ? "/" : "/login"}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {isAuthed ? "Open app" : "Log in"}
            </Link>
            <Link
              to={primaryCta.to}
              className="mt-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              {primaryCta.label}
            </Link>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------- Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-down inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
            <Sparkles size={14} className="text-sky-500" />
            Smart. Secure. Scalable attendance
          </div>

          <h1 className="animate-fade-up mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Attendance that feels{" "}
            <span className="relative whitespace-nowrap">
              <span className="animate-gradient bg-[linear-gradient(110deg,#0ea5e9,#6366f1,#d946ef,#0ea5e9)] bg-[length:200%_auto] bg-clip-text text-transparent">
                effortless
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C60 3 120 3 150 5C180 7 240 7 298 4"
                  stroke="url(#underline)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underline" x1="0" y1="0" x2="300" y2="0">
                    <stop stopColor="#0ea5e9" />
                    <stop offset="1" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="animate-fade-up mx-auto mt-7 max-w-xl text-lg leading-relaxed text-slate-600 [animation-delay:120ms]">
            CheckIn+ turns messy timesheets into one calm, live dashboard. Track
            attendance, leave and teams for companies and schools, all in real
            time.
          </p>

          <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:220ms]">
            <Link
              to={primaryCta.to}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-sky-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-sky-500/40 sm:w-auto"
            >
              {primaryCta.label}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              to={isAuthed ? "/" : "/login"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white sm:w-auto"
            >
              <Play size={16} className="text-sky-500" />
              {isAuthed ? "Open dashboard" : "Log in"}
            </Link>
          </div>

          <p className="animate-fade-up mt-5 text-xs font-medium text-slate-400 [animation-delay:320ms]">
            Free plan for up to 10 members · No credit card required
          </p>
        </div>

        {/* floating product preview */}
        <Reveal delay={200} className="mt-16 sm:mt-20">
          <HeroPreview />
        </Reveal>
      </section>

      {/* -------------------------------------------------------------- Stats */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/60 bg-white/60 p-6 backdrop-blur-xl sm:grid-cols-4 sm:p-8">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <div className="text-center">
                <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                  <Counter to={stat.to} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-sky-500">
            Everything in one place
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            One workspace for every check-in
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From the first clock-in to the monthly report, CheckIn+ handles the
            whole journey with a little bit of delight along the way.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 100}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-7 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${feature.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30`}
                />
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-white shadow-lg`}
                >
                  <feature.icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Up and running in three steps
          </h2>
        </Reveal>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent md:block" />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 130}>
              <div className="relative flex h-full flex-col items-center rounded-3xl border border-white/70 bg-white/70 p-8 text-center backdrop-blur-xl">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                    <step.icon size={26} />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-indigo-500 shadow">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ Pricing */}
      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-fuchsia-500">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Plans that grow with your team
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start free, upgrade only when you need more seats.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUBSCRIPTION_PLANS.map((plan, i) => (
            <Reveal key={plan.key} delay={i * 90}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${
                  plan.highlight
                    ? "border-transparent bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl shadow-slate-900/30"
                    : "border-white/70 bg-white/70 text-slate-900 shadow-[0_10px_40px_rgba(15,23,42,0.05)]"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                )}
                <h3
                  className={`text-lg font-bold ${
                    plan.highlight ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    plan.highlight ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {plan.employeeRange}
                </p>
                <div
                  className={`mt-5 text-2xl font-extrabold ${
                    plan.highlight ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.priceLabel}
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        size={18}
                        className={`mt-0.5 shrink-0 ${
                          plan.highlight ? "text-sky-400" : "text-sky-500"
                        }`}
                      />
                      <span
                        className={
                          plan.highlight ? "text-slate-200" : "text-slate-600"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={isAuthed ? "/pricing" : "/signup"}
                  className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    plan.highlight
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {plan.key === "FREE" ? "Start free" : "Choose plan"}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- CTA banner */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 px-8 py-16 text-center shadow-2xl shadow-indigo-500/30 sm:px-16">
            <div className="animate-blob-slow absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
            <div className="animate-blob-slower absolute -bottom-16 -right-6 h-64 w-64 rounded-full bg-fuchsia-300/30 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to make check-ins effortless?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">
                Join teams and schools who replaced spreadsheets with CheckIn+.
                Get started in minutes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to={primaryCta.to}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                >
                  {primaryCta.label}
                  <ArrowRight size={18} />
                </Link>
                {!isAuthed && (
                  <Link
                    to="/login"
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------- Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <img
              src="/login-logo.png"
              alt="CheckIn+"
              className="h-7 w-auto max-w-[150px] object-contain"
            />
          </div>
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

/* -------------------------------------------------------------------------- */
/*  Hero preview mock                                                          */
/* -------------------------------------------------------------------------- */

const HeroPreview = () => (
  <div className="relative mx-auto max-w-5xl">
    {/* glow */}
    <div className="absolute inset-x-8 -top-6 bottom-6 rounded-[2rem] bg-gradient-to-r from-sky-400/30 via-indigo-400/30 to-fuchsia-400/30 blur-3xl" />

    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      {/* window bar */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-white/70 px-5 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <div className="ml-3 hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-400 sm:flex">
          <ShieldCheck size={12} /> app.checkinplus.com
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7">
        {/* mini stat cards */}
        {[
          { label: "Present today", value: "48", tone: "text-emerald-500", bar: "92%", barColor: "bg-emerald-400" },
          { label: "On leave", value: "5", tone: "text-amber-500", bar: "18%", barColor: "bg-amber-400" },
          { label: "Late", value: "2", tone: "text-rose-500", bar: "6%", barColor: "bg-rose-400" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {card.label}
              </span>
              <Clock size={14} className="text-slate-300" />
            </div>
            <div className={`mt-2 text-3xl font-extrabold ${card.tone}`}>
              {card.value}
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${card.barColor}`}
                style={{ width: card.bar }}
              />
            </div>
          </div>
        ))}

        {/* fake chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              Weekly attendance
            </span>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-600">
              +8.2%
            </span>
          </div>
          <div className="mt-5 flex items-end gap-2">
            {[52, 68, 60, 82, 74, 90, 66].map((h, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="animate-grow w-full rounded-t-lg bg-gradient-to-t from-sky-400 to-indigo-400"
                  style={{
                    height: `${Math.round(h * 1.1)}px`,
                    animationDelay: `${i * 90}ms`,
                  }}
                />
                <span className="text-[10px] text-slate-400">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* live check-in feed */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <span className="text-sm font-semibold text-slate-700">
            Live check-ins
          </span>
          <ul className="mt-4 space-y-3">
            {[
              { name: "Emma W.", time: "09:01" },
              { name: "Liam C.", time: "09:03" },
              { name: "Sofia R.", time: "09:04" },
            ].map((row, i) => (
              <li
                key={row.name}
                className="animate-fade-up flex items-center gap-3"
                style={{ animationDelay: `${400 + i * 150}ms` }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-400 text-xs font-bold text-white">
                  {row.name.charAt(0)}
                </span>
                <span className="flex-1 text-sm text-slate-600">{row.name}</span>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                  {row.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* floating badges */}
    <div className="animate-float absolute -left-4 top-16 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <Fingerprint size={18} />
        </span>
        <div>
          <div className="text-xs font-bold text-slate-900">Checked in</div>
          <div className="text-[11px] text-slate-400">in 2.4 seconds</div>
        </div>
      </div>
    </div>

    <div className="animate-float-delayed absolute -right-4 bottom-16 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
          <BarChart3 size={18} />
        </span>
        <div>
          <div className="text-xs font-bold text-slate-900">99% accuracy</div>
          <div className="text-[11px] text-slate-400">this month</div>
        </div>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Animated background                                                        */
/* -------------------------------------------------------------------------- */

export const BackgroundFX = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute -left-24 -top-24 h-[38rem] w-[38rem] animate-blob-slow rounded-full bg-sky-300/40 blur-[130px]" />
    <div className="absolute right-0 top-1/4 h-[32rem] w-[32rem] animate-blob-slower rounded-full bg-indigo-300/40 blur-[130px]" />
    <div className="absolute bottom-0 left-1/3 h-[34rem] w-[34rem] animate-blob-slow rounded-full bg-fuchsia-200/40 blur-[140px]" />
    <div className="absolute right-1/4 top-1/2 h-[26rem] w-[26rem] animate-blob-slower rounded-full bg-amber-200/30 blur-[120px]" />
    {/* subtle grid */}
    <div
      className="absolute inset-0 opacity-[0.4]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)",
      }}
    />
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Keyframes                                                                  */
/* -------------------------------------------------------------------------- */

export const LandingStyles = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes gradientMove {
      to { background-position: 200% center; }
    }
    @keyframes floaty {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-14px); }
    }
    @keyframes blobDrift {
      0%, 100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(40px,-30px) scale(1.08); }
      66% { transform: translate(-30px,20px) scale(0.96); }
    }
    @keyframes growBar {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }

    .animate-fade-up { animation: fadeUp 0.8s ease-out both; }
    .animate-fade-down { animation: fadeDown 0.7s ease-out both; }
    .animate-gradient { animation: gradientMove 5s linear infinite; }
    .animate-float { animation: floaty 6s ease-in-out infinite; }
    .animate-float-delayed { animation: floaty 6s ease-in-out infinite; animation-delay: 2s; }
    .animate-blob-slow { animation: blobDrift 24s ease-in-out infinite; }
    .animate-blob-slower { animation: blobDrift 32s ease-in-out infinite; }
    .animate-grow { transform-origin: bottom; animation: growBar 1s cubic-bezier(0.16,1,0.3,1) both; }

    @media (prefers-reduced-motion: reduce) {
      .animate-fade-up,
      .animate-fade-down,
      .animate-gradient,
      .animate-float,
      .animate-float-delayed,
      .animate-blob-slow,
      .animate-blob-slower,
      .animate-grow {
        animation: none !important;
      }
    }
  `}</style>
);

export default Landing;
