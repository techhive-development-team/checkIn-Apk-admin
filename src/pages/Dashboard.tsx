import React, { useState } from "react";
import Layout from "../component/layouts/layout";
import Breadcrumb from "../component/layouts/common/Breadcrumb";
import { useAuthStore } from "../stores/authStore";
import {
  useCompanyAnalytics,
  type CompanyAnalytics,
  type LeaderEntry,
} from "../hooks/useCompanyAnalytics";
import type { AnalyticsPeriod } from "../repositories/analyticsRepository";
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
} from "recharts";

const COLORS = {
  present: "#10b981",
  leave: "#f59e0b",
  absent: "#ef4444",
  late: "#f97316",
  onTime: "#22c55e",
  bar: "#2563eb",
};
const STATUS_COLORS = [COLORS.present, COLORS.leave, COLORS.absent];
const PUNCTUALITY_COLORS = [COLORS.onTime, COLORS.late];

const PERIODS: { key: AnalyticsPeriod; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

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

const CompanyDashboard: React.FC<{ companyId?: string }> = ({ companyId }) => {
  const [period, setPeriod] = useState<AnalyticsPeriod>("monthly");
  const [workStart, setWorkStart] = useState("09:00");
  const [workEnd, setWorkEnd] = useState("17:00");
  const [workDays, setWorkDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);

  const { data, isLoading, error } = useCompanyAnalytics({
    period,
    companyId,
    workStart,
    workEnd,
    workDays,
  });

  const analytics = data as CompanyAnalytics | undefined;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
            {analytics.from} → {analytics.to} · {analytics.timezone} · grace{" "}
            {analytics.graceMinutes}m · late counted after each member's start
            time (default {analytics.workStart}–{analytics.workEnd})
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
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={analytics.trend} margin={{ left: -18, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884880f" />
                  <XAxis dataKey="label" fontSize={11} tickMargin={6} />
                  <YAxis allowDecimals={false} fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="present" name="Present" stackId="1" stroke={COLORS.present} fill={COLORS.present} fillOpacity={0.5} />
                  <Area type="monotone" dataKey="leave" name="Leave" stackId="1" stroke={COLORS.leave} fill={COLORS.leave} fillOpacity={0.5} />
                  <Area type="monotone" dataKey="absent" name="Absent" stackId="1" stroke={COLORS.absent} fill={COLORS.absent} fillOpacity={0.5} />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884880f" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} fontSize={11} unit="%" />
                  <YAxis type="category" dataKey="name" width={120} fontSize={11} />
                  <Tooltip formatter={(v) => [`${v}%`, "Attendance"]} />
                  <Bar dataKey="pct" fill={COLORS.bar} radius={[0, 4, 4, 0]} />
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
  const companyId = useAuthStore((state) => state.user?.companyId);
  const isCompanyView = role === "CLIENT" || role === "ADMIN";

  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full bg-base-100">
          <div className="card-body">
            <Breadcrumb items={[{ label: "Home", path: "/" }]} />
            <h3 className="text-2xl font-bold my-4">Dashboard</h3>
            {isCompanyView ? (
              <CompanyDashboard companyId={role === "ADMIN" ? companyId : undefined} />
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
