import React, { useMemo, useState } from "react";
import Layout from "../component/layouts/layout";
import Breadcrumb from "../component/layouts/common/Breadcrumb";
import { useAuthStore } from "../stores/authStore";
import {
  useAdminUsageAnalytics,
  useCompanyAnalytics,
  type AdminUsageAnalytics,
  type CompanyAnalytics,
  type LeaderEntry,
} from "../hooks/useCompanyAnalytics";
import type { AnalyticsPeriod } from "../repositories/analyticsRepository";
import { analyticsRepository } from "../repositories/analyticsRepository";
import WorkingDaysFilter from "../component/forms/WorkingDaysFilter";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from "recharts";

// Landing page "Weekly attendance" bar gradient (Tailwind sky-400 → indigo-400)
const LANDING_WEEKLY = {
  sky: "#38bdf8",
  indigo: "#818cf8",
};

// Palette aligned with the marketing landing page (sky → indigo → fuchsia,
// plus its supporting accent tones) so the dashboard feels consistent.
const COLORS = {
  present: "#10b981", // emerald
  leave: "#fbbf24", // amber
  absent: "#f43f5e", // rose
  late: "#fb923c", // orange
  onTime: "#14b8a6", // teal
  bar: "#6366f1", // indigo (primary)
  users: "#8b5cf6", // violet
  members: "#06b6d4", // cyan
  companies: "#0ea5e9", // sky
  brand: "#d946ef", // fuchsia
};
const STATUS_COLORS = [COLORS.present, COLORS.leave, COLORS.absent];
const PUNCTUALITY_COLORS = [COLORS.onTime, COLORS.late];
const BREAKDOWN_COLORS = [
  COLORS.companies, // sky
  COLORS.bar, // indigo
  COLORS.brand, // fuchsia
  COLORS.members, // cyan
  COLORS.users, // violet
  "#ec4899", // pink
  COLORS.present, // emerald
  COLORS.leave, // amber
];
const OFF_DAY_COLOR = "#94a3b8";

const offDayBands = (trend: CompanyAnalytics["trend"]) => {
  const bands: { x1: string; x2: string }[] = [];
  let runStart: string | null = null;
  let runEnd: string | null = null;

  for (const point of trend) {
    if (point.isWorkingDay === false) {
      if (!runStart) runStart = point.label;
      runEnd = point.label;
    } else if (runStart && runEnd) {
      bands.push({ x1: runStart, x2: runEnd });
      runStart = null;
      runEnd = null;
    }
  }

  if (runStart && runEnd) bands.push({ x1: runStart, x2: runEnd });
  return bands;
};

const TrendTick = (props: {
  x?: string | number;
  y?: string | number;
  payload?: { value: string };
  trend: CompanyAnalytics["trend"];
}) => {
  const { x, y, payload, trend } = props;
  const xNum = typeof x === "number" ? x : parseFloat(String(x ?? 0));
  const yNum = typeof y === "number" ? y : parseFloat(String(y ?? 0));
  const point = trend.find((t) => t.label === payload?.value);
  const isOff = point?.isWorkingDay === false;
  return (
    <text
      x={xNum}
      y={yNum + 12}
      textAnchor="end"
      fontSize={10}
      fill={isOff ? OFF_DAY_COLOR : "#64748b"}
      transform={`rotate(-45, ${xNum}, ${yNum + 12})`}
    >
      {payload?.value}
    </text>
  );
};

const TrendTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
    payload?: CompanyAnalytics["trend"][number];
  }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  const isOff = point?.isWorkingDay === false;
  const hasTrendData = payload.some((entry) => entry.value > 0);

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-xs shadow-md">
      <p className="font-semibold">{label}</p>
      {isOff && <p className="mt-1 text-base-content/60">Off day</p>}
      {hasTrendData ? (
        <ul className="mt-1 space-y-0.5">
          {payload.map((entry) => (
            <li key={entry.name} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </li>
          ))}
        </ul>
      ) : isOff ? null : (
        <p className="mt-1 text-base-content/60">No attendance</p>
      )}
    </div>
  );
};

const PERIODS: { key: AnalyticsPeriod; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const dateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (key: string, delta: number) => {
  const date = new Date(`${key}T00:00:00`);
  date.setDate(date.getDate() + delta);
  return dateKey(date);
};

const mondayOfWeek = (key: string) => {
  const date = new Date(`${key}T00:00:00`);
  const day = date.getDay();
  return addDays(key, day === 0 ? -6 : 1 - day);
};

const weekInputValue = (key: string) => {
  const monday = new Date(`${mondayOfWeek(key)}T00:00:00`);
  const thursday = new Date(monday);
  thursday.setDate(monday.getDate() + 3);
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  const week =
    1 +
    Math.round(
      ((thursday.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getDay() + 6) % 7)) /
        7,
    );

  return `${thursday.getFullYear()}-W${String(week).padStart(2, "0")}`;
};

const weekInputToMonday = (value: string) => {
  const match = value.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return mondayOfWeek(dateKey());
  const year = Number(match[1]);
  const week = Number(match[2]);
  const janFourth = new Date(year, 0, 4);
  const janFourthDay = janFourth.getDay() || 7;
  const monday = new Date(janFourth);
  monday.setDate(janFourth.getDate() - janFourthDay + 1 + (week - 1) * 7);
  return dateKey(monday);
};

const KpiCard = ({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  accent?: string;
}) => (
  <div className="rounded-xl border border-base-300 bg-base-100 p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-base-content/60">
      {label}
    </p>
    <p className="mt-1 text-2xl font-bold" style={accent ? { color: accent } : undefined}>
      {value}
      {suffix ? <span className="text-base font-semibold">{suffix}</span> : null}
    </p>
  </div>
);

const ChartCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-xl border border-base-300 bg-base-100 p-4 ${className}`}>
    <h4 className="mb-3 text-sm font-semibold text-base-content/80">{title}</h4>
    {children}
  </div>
);

const formatLeaderboardValue = (value: number, unit: string) => {
  if (unit === "day") {
    return `${value} ${value === 1 ? "day" : "days"}`;
  }
  return `${value}${unit}`;
};

const Leaderboard = ({
  title,
  entries,
  unit,
  metric,
  accent,
}: {
  title: string;
  entries: LeaderEntry[];
  unit: string;
  metric: (e: LeaderEntry) => number;
  accent: string;
}) => (
  <ChartCard title={title}>
    {entries.length === 0 ? (
      <p className="py-6 text-center text-sm text-base-content/50">No data</p>
    ) : (
      <ul className="space-y-2">
        {entries.map((e, i) => (
          <li key={e.employeeId} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-base-200 text-xs font-semibold">
              {i + 1}
            </span>
            <span className="flex-1 truncate text-sm">{e.name}</span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: `${accent}22`, color: accent }}
            >
              {formatLeaderboardValue(metric(e), unit)}
            </span>
          </li>
        ))}
      </ul>
    )}
  </ChartCard>
);

const AdminBreakdownPie = ({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) => (
  <ChartCard title={title}>
    {data.length === 0 ? (
      <p className="py-6 text-center text-sm text-base-content/50">No data</p>
    ) : (
      <>
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={42}
              outerRadius={68}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-base-content/70">
          {data.map((item, i) => (
            <span key={item.name}>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-full"
                style={{ background: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length] }}
              />
              {item.name}: {item.value}
            </span>
          ))}
        </div>
      </>
    )}
  </ChartCard>
);

const AdminEmployeeDirectory = ({
  companies = [],
  employees = [],
}: {
  companies?: AdminUsageAnalytics["companyDirectory"];
  employees?: AdminUsageAnalytics["employeeDirectory"];
}) => {
  const [companyId, setCompanyId] = useState("");
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const companyList = companies ?? [];
  const employeeList = employees ?? [];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return employeeList.filter((employee) => {
      if (companyId && employee.companyId !== companyId) return false;
      if (!query) return true;
      return (
        employee.name.toLowerCase().includes(query) ||
        employee.companyName.toLowerCase().includes(query) ||
        (employee.position?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [companyId, employeeList, search]);

  const selectedCompany = companyList.find((company) => company.companyId === companyId);

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await analyticsRepository.exportAdminEmployeeDirectory({
        companyId: companyId || undefined,
        search: search || undefined,
      });
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to export employee directory.";
      setExportError(message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <ChartCard title="Employee directory">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="form-control w-full max-w-xs">
          <span className="label-text text-xs text-base-content/60">Company</span>
          <select
            className="select select-bordered select-sm"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            aria-label="Filter by company"
          >
            <option value="">All companies ({employeeList.length} members)</option>
            {companyList.map((company) => (
              <option key={company.companyId} value={company.companyId}>
                {company.name} ({company.members})
              </option>
            ))}
          </select>
        </label>

        <label className="form-control w-full max-w-sm">
          <span className="label-text text-xs text-base-content/60">Search name</span>
          <input
            type="search"
            className="input input-bordered input-sm"
            placeholder="Employee or company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search employees"
          />
        </label>

        <p className="text-xs text-base-content/60">
          Showing {filtered.length}
          {selectedCompany ? ` in ${selectedCompany.name}` : " across all companies"}
        </p>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleExport}
          disabled={exporting || companyList.length === 0}
        >
          {exporting ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Exporting...
            </>
          ) : (
            "Export .xlsx"
          )}
        </button>
      </div>

      {exportError && (
        <div className="alert alert-error mb-4 py-2 text-xs">
          <span>{exportError}</span>
        </div>
      )}

      {companyList.length === 0 ? (
        <p className="py-6 text-center text-sm text-base-content/50">
          Employee directory is loading or unavailable. Restart the backend if this persists.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-base-content/50">
          No employees match this filter
        </p>
      ) : (
        <div className="overflow-x-auto max-h-96">
          <table className="table table-sm table-pin-rows">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Company</th>
                <th>Type</th>
                <th>Position / Class</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee, index) => (
                <tr key={employee.employeeId}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{employee.name}</td>
                  <td>{employee.companyName}</td>
                  <td>{employee.memberType}</td>
                  <td>{employee.position || "—"}</td>
                  <td>
                    <span
                      className={`badge badge-sm ${
                        employee.status === "active" ? "badge-success" : "badge-ghost"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
};

const AdminUsageDashboard = () => {
  const { data, isLoading, error } = useAdminUsageAnalytics(true);
  const analytics = data as AdminUsageAnalytics | undefined;

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>Failed to load usage analytics. Please try again.</span>
        </div>
      )}

      {analytics && !isLoading && (
        <>
          <p className="text-xs text-base-content/50">
            Platform usage · {analytics.from} → {analytics.to} ·{" "}
            {analytics.timezone}
          </p>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            <KpiCard label="Companies" value={analytics.summary.totalCompanies} />
            <KpiCard label="Active companies" value={analytics.summary.activeCompanies} />
            <KpiCard label="Users" value={analytics.summary.totalUsers} accent={COLORS.users} />
            <KpiCard label="Members" value={analytics.summary.totalMembers} accent={COLORS.members} />
            <KpiCard
              label="Active this month"
              value={analytics.summary.activeMembersThisMonth}
              accent={COLORS.present}
            />
            <KpiCard
              label="Leave requests"
              value={analytics.summary.leaveRequests}
              accent={COLORS.leave}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartCard title="User usage trend" className="xl:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={analytics.trend}
                  margin={{ left: -12, right: 12, top: 8, bottom: 8 }}
                >
                  <defs>
                    <linearGradient id="usageUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={LANDING_WEEKLY.indigo} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={LANDING_WEEKLY.sky} stopOpacity={0.04} />
                    </linearGradient>
                    <linearGradient id="usageMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={LANDING_WEEKLY.sky} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={LANDING_WEEKLY.indigo} stopOpacity={0.04} />
                    </linearGradient>
                    <linearGradient id="usageAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={LANDING_WEEKLY.indigo} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={LANDING_WEEKLY.sky} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884880f" />
                  <XAxis dataKey="label" fontSize={11} />
                  <YAxis allowDecimals={false} fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="New users"
                    stroke={LANDING_WEEKLY.indigo}
                    strokeWidth={2}
                    fill="url(#usageUsers)"
                    fillOpacity={1}
                  />
                  <Area
                    type="monotone"
                    dataKey="members"
                    name="New members"
                    stroke={LANDING_WEEKLY.sky}
                    strokeWidth={2}
                    fill="url(#usageMembers)"
                    fillOpacity={1}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    name="Attendance records"
                    stroke={LANDING_WEEKLY.indigo}
                    strokeWidth={2}
                    fill="url(#usageAttendance)"
                    fillOpacity={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User flow">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics.userFlow}
                  layout="vertical"
                  margin={{ left: 20, right: 16 }}
                >
                  <defs>
                    {/* Landing Weekly attendance colors: sky-400 → indigo-400 */}
                    <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={LANDING_WEEKLY.sky} />
                      <stop offset="100%" stopColor={LANDING_WEEKLY.indigo} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884880f" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} fontSize={11} />
                  <YAxis type="category" dataKey="name" width={118} fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="url(#flowGradient)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminBreakdownPie title="Users by role" data={analytics.roleBreakdown} />
            <AdminBreakdownPie title="Companies by plan" data={analytics.planBreakdown} />
            <AdminBreakdownPie title="Members by type" data={analytics.memberTypeBreakdown} />
            <AdminBreakdownPie title="Leave status this month" data={analytics.leaveStatusBreakdown} />
          </div>

          <ChartCard title="Top companies by members">
            {analytics.topCompanies.length === 0 ? (
              <p className="py-6 text-center text-sm text-base-content/50">
                No companies yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Plan</th>
                      <th className="text-right">Members</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topCompanies.map((company) => (
                      <tr key={company.companyId}>
                        <td className="font-medium">{company.name}</td>
                        <td>{company.plan}</td>
                        <td className="text-right">{company.members}</td>
                        <td>
                          <span
                            className={`badge badge-sm ${
                              company.activeThisMonth ? "badge-success" : "badge-ghost"
                            }`}
                          >
                            {company.activeThisMonth ? "Active this month" : "No activity"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>

          <AdminEmployeeDirectory
            companies={analytics.companyDirectory ?? analytics.topCompanies}
            employees={analytics.employeeDirectory ?? []}
          />
        </>
      )}
    </div>
  );
};

const CompanyDashboard: React.FC<{ companyId?: string }> = ({ companyId }) => {
  const today = dateKey();
  const [period, setPeriod] = useState<AnalyticsPeriod>("monthly");
  const [selectedWeek, setSelectedWeek] = useState(weekInputValue(today));
  const [selectedMonth, setSelectedMonth] = useState(today.slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(today.slice(0, 4));
  const [workStart, setWorkStart] = useState("09:00");
  const [workEnd, setWorkEnd] = useState("17:00");
  const [workDays, setWorkDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const safeSelectedMonth = selectedMonth || today.slice(0, 7);
  const safeSelectedYear = selectedYear || today.slice(0, 4);
  const anchorDate =
    period === "weekly"
      ? weekInputToMonday(selectedWeek)
      : period === "monthly"
        ? `${safeSelectedMonth}-01`
        : `${safeSelectedYear}-01-01`;

  const { data, isLoading, error } = useCompanyAnalytics({
    period,
    companyId,
    anchorDate,
    workStart,
    workEnd,
    workDays,
  });

  const analytics = data as CompanyAnalytics | undefined;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="join">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                className={`btn join-item btn-sm ${
                  period === p.key ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setPeriod(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {period === "weekly" && (
            <input
              type="week"
              aria-label="Select week"
              className="input input-bordered input-sm w-40"
              value={selectedWeek}
              max={weekInputValue(today)}
              onChange={(e) => setSelectedWeek(e.target.value)}
            />
          )}

          {period === "monthly" && (
            <input
              type="month"
              aria-label="Select month"
              className="input input-bordered input-sm w-40"
              value={selectedMonth}
              max={today.slice(0, 7)}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          )}

          {period === "yearly" && (
            <input
              type="number"
              aria-label="Select year"
              className="input input-bordered input-sm w-28"
              min="2000"
              max={today.slice(0, 4)}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-base-content/60">Work hours</span>
          <input
            type="time"
            aria-label="Work start time"
            className="input input-bordered input-sm w-28"
            value={workStart}
            onChange={(e) => setWorkStart(e.target.value)}
          />
          <span className="text-base-content/60">–</span>
          <input
            type="time"
            aria-label="Work end time"
            className="input input-bordered input-sm w-28"
            value={workEnd}
            onChange={(e) => setWorkEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border border-base-300 bg-base-100 p-3">
        <WorkingDaysFilter value={workDays} onChange={setWorkDays} />
        <p className="mt-1 text-xs text-base-content/50">
          Off days are excluded from scheduled days, so attendance % and absent
          counts ignore them.
        </p>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>Failed to load analytics. Please try again.</span>
        </div>
      )}

      {analytics && !isLoading && (
        <>
          <p className="text-xs text-base-content/50">
            {analytics.from} → {analytics.to}
            {analytics.trendTo && analytics.trendTo !== analytics.to
              ? ` (trend through ${analytics.trendTo})`
              : ""}{" "}
            · {analytics.timezone} · grace {analytics.graceMinutes}m · late
            counted after each member's start time (default {analytics.workStart}–
            {analytics.workEnd})
          </p>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            <KpiCard label="Members" value={analytics.summary.totalMembers} />
            <KpiCard
              label="Attendance"
              value={analytics.summary.attendancePct}
              suffix="%"
              accent={COLORS.present}
            />
            <KpiCard
              label="On time"
              value={analytics.summary.onTimePct}
              suffix="%"
              accent={COLORS.onTime}
            />
            <KpiCard label="Present" value={analytics.summary.present} accent={COLORS.present} />
            <KpiCard label="Late" value={analytics.summary.late} accent={COLORS.late} />
            <KpiCard label="Leave" value={analytics.summary.leave} accent={COLORS.leave} />
            <KpiCard label="Absent" value={analytics.summary.absent} accent={COLORS.absent} />
          </div>

          {/* Trend + pies */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ChartCard title="Attendance trend" className="lg:col-span-2">
              <div className="mb-2 flex flex-wrap gap-3 text-xs text-base-content/60">
                <span>
                  <span
                    className="mr-1 inline-block h-2 w-2 rounded-sm"
                    style={{ background: OFF_DAY_COLOR, opacity: 0.35 }}
                  />
                  Off day
                </span>
                <span>
                  All dates in month shown · gray = off day · check-ins on off
                  days still appear as Present
                </span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.trend} margin={{ left: -12, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884880f" />
                  {offDayBands(analytics.trend).map((band) => (
                    <ReferenceArea
                      key={`${band.x1}-${band.x2}`}
                      x1={band.x1}
                      x2={band.x2}
                      strokeOpacity={0}
                      fill={OFF_DAY_COLOR}
                      fillOpacity={0.18}
                      ifOverflow="extendDomain"
                    />
                  ))}
                  <XAxis
                    dataKey="label"
                    fontSize={10}
                    tickMargin={4}
                    height={56}
                    interval={0}
                    tick={(props) => (
                      <TrendTick {...props} trend={analytics.trend} />
                    )}
                  />
                  <YAxis allowDecimals={false} fontSize={11} />
                  <Tooltip content={<TrendTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="present"
                    name="Present"
                    stackId="1"
                    stroke={COLORS.present}
                    fill={COLORS.present}
                    fillOpacity={0.5}
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="leave"
                    name="Leave"
                    stackId="1"
                    stroke={COLORS.leave}
                    fill={COLORS.leave}
                    fillOpacity={0.5}
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="absent"
                    name="Absent"
                    stackId="1"
                    stroke={COLORS.absent}
                    fill={COLORS.absent}
                    fillOpacity={0.5}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Status & punctuality">
              <div className="grid grid-cols-2 gap-2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={analytics.statusBreakdown} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62} paddingAngle={2}>
                      {analytics.statusBreakdown.map((_, i) => (
                        <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={analytics.punctualityBreakdown} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62} paddingAngle={2}>
                      {analytics.punctualityBreakdown.map((_, i) => (
                        <Cell key={i} fill={PUNCTUALITY_COLORS[i % PUNCTUALITY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-1 flex justify-center gap-4 text-xs text-base-content/70">
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: COLORS.present }} />Present</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: COLORS.leave }} />Leave</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: COLORS.absent }} />Absent</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: COLORS.late }} />Late</span>
              </div>
            </ChartCard>
          </div>

          {/* Attendance % by employee */}
          <ChartCard title="Attendance % by member">
            {analytics.attendancePctByEmployee.length === 0 ? (
              <p className="py-6 text-center text-sm text-base-content/50">No members yet</p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={Math.max(160, analytics.attendancePctByEmployee.length * 34)}
              >
                <BarChart
                  data={analytics.attendancePctByEmployee}
                  layout="vertical"
                  margin={{ left: 20, right: 16 }}
                >
                  <defs>
                    <linearGradient id="attendancePctGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669"  />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884880f" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} fontSize={11} unit="%" />
                  <YAxis type="category" dataKey="name" width={120} fontSize={11} />
                  <Tooltip formatter={(v) => [`${v}%`, "Attendance"]} />
                  <Bar dataKey="pct" fill="url(#attendancePctGradient)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Leaderboards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Leaderboard title="Most on time" entries={analytics.leaderboards.onTime} unit="%" metric={(e) => e.rate ?? 0} accent={COLORS.onTime} />
            <Leaderboard title="Most late" entries={analytics.leaderboards.late} unit="day" metric={(e) => e.count ?? 0} accent={COLORS.late} />
            <Leaderboard title="Most overtime" entries={analytics.leaderboards.overtime} unit="day" metric={(e) => e.count ?? 0} accent={COLORS.bar} />
            <Leaderboard title="Most leave" entries={analytics.leaderboards.leave} unit="day" metric={(e) => e.days ?? 0} accent={COLORS.leave} />
            <Leaderboard title="Most absent" entries={analytics.leaderboards.absent} unit="day" metric={(e) => e.count ?? 0} accent={COLORS.absent} />
          </div>
        </>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const role = useAuthStore((state) => state.user?.role);
  const isCompanyView = role === "CLIENT";

  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full bg-base-100">
          <div className="card-body">
            <Breadcrumb items={[{ label: "Home", path: "/" }]} />
            <h3 className="text-2xl font-bold my-4">Dashboard</h3>
            {role === "ADMIN" ? (
              <AdminUsageDashboard />
            ) : isCompanyView ? (
              <CompanyDashboard />
            ) : (
              <p className="text-base-content/60">
                Welcome back! Use the sidebar to check in and manage your attendance and leave.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
