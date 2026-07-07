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
