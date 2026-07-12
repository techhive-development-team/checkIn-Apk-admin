import useSWR from "swr";
import { API_URLS } from "../enum/urls";
import {
  analyticsRepository,
  type CompanyAnalyticsParams,
} from "../repositories/analyticsRepository";

export interface LeaderEntry {
  employeeId: string;
  name: string;
  count?: number;
  days?: number;
  rate?: number;
}

export interface CompanyAnalytics {
  period: string;
  from: string;
  to: string;
  trendTo?: string;
  timezone: string;
  workStart: string;
  workEnd: string;
  workDays: string[];
  graceMinutes: number;
  summary: {
    totalMembers: number;
    attendancePct: number;
    onTimePct: number;
    scheduledDays: number;
    present: number;
    absent: number;
    leave: number;
    late: number;
    onTime: number;
    overtime: number;
  };
  statusBreakdown: { name: string; value: number }[];
  punctualityBreakdown: { name: string; value: number }[];
  trend: {
    key: string;
    label: string;
    weekday?: string;
    isWorkingDay?: boolean;
    present: number;
    absent: number;
    leave: number;
    late: number;
  }[];
  attendancePctByEmployee: {
    employeeId: string;
    name: string;
    pct: number;
    present: number;
    scheduled: number;
  }[];
  leaderboards: {
    onTime: LeaderEntry[];
    late: LeaderEntry[];
    overtime: LeaderEntry[];
    leave: LeaderEntry[];
    absent: LeaderEntry[];
  };
}

export interface AdminUsageAnalytics {
  timezone: string;
  from: string;
  to: string;
  summary: {
    totalCompanies: number;
    activeCompanies: number;
    totalUsers: number;
    activeUsers: number;
    clientUsers: number;
    memberUsers: number;
    totalMembers: number;
    employeeMembers: number;
    studentMembers: number;
    activeMembersThisMonth: number;
    attendanceRecords: number;
    leaveRequests: number;
  };
  trend: {
    key: string;
    label: string;
    companies: number;
    users: number;
    members: number;
    attendance: number;
    leaveRequests: number;
  }[];
  userFlow: { name: string; value: number }[];
  roleBreakdown: { name: string; value: number }[];
  planBreakdown: { name: string; value: number }[];
  memberTypeBreakdown: { name: string; value: number }[];
  leaveStatusBreakdown: { name: string; value: number }[];
  topCompanies: {
    companyId: string;
    name: string;
    plan: string;
    members: number;
    activeThisMonth: boolean;
  }[];
  companyDirectory?: {
    companyId: string;
    name: string;
    plan: string;
    members: number;
    activeThisMonth: boolean;
  }[];
  employeeDirectory?: {
    employeeId: string;
    name: string;
    companyId: string;
    companyName: string;
    memberType: string;
    position: string | null;
    status: string;
  }[];
}

export const useCompanyAnalytics = (params: CompanyAnalyticsParams | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    params ? [`${API_URLS.ANALYTICS}/company`, params] : null,
    () => analyticsRepository.getCompanyAnalytics(params as CompanyAnalyticsParams),
    { revalidateOnFocus: false },
  );

  return {
    data: data?.data as CompanyAnalytics | undefined,
    error,
    isLoading,
    mutate,
  };
};

export const useAdminUsageAnalytics = (enabled: boolean) => {
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `${API_URLS.ANALYTICS}/admin-usage` : null,
    () => analyticsRepository.getAdminUsageAnalytics(),
    { revalidateOnFocus: false },
  );

  return {
    data: data?.data as AdminUsageAnalytics | undefined,
    error,
    isLoading,
    mutate,
  };
};
