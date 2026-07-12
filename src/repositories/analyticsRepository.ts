import { API_URLS } from "../enum/urls";
import { client } from "./client";

const getBrowserTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Yangon";

export type AnalyticsPeriod = "weekly" | "monthly" | "yearly";

export interface CompanyAnalyticsParams {
  period: AnalyticsPeriod;
  timezone?: string;
  companyId?: string;
  anchorDate?: string;
  workStart?: string;
  workEnd?: string;
  workDays?: string[];
  grace?: number;
}

const getCompanyAnalytics = async (params: CompanyAnalyticsParams) => {
  const query = new URLSearchParams();
  query.set("period", params.period);
  query.set("timezone", params.timezone || getBrowserTimezone());
  if (params.companyId) query.set("companyId", params.companyId);
  if (params.anchorDate) query.set("anchorDate", params.anchorDate);
  if (params.workStart) query.set("workStart", params.workStart);
  if (params.workEnd) query.set("workEnd", params.workEnd);
  if (params.workDays && params.workDays.length > 0)
    query.set("workDays", params.workDays.join(","));
  if (params.grace !== undefined) query.set("grace", String(params.grace));

  const response = await client.exec(
    `${API_URLS.ANALYTICS}/company?${query.toString()}`,
    { method: "get" },
  );
  return response;
};

const getAdminUsageAnalytics = async () => {
  const query = new URLSearchParams();
  query.set("timezone", getBrowserTimezone());

  const response = await client.exec(
    `${API_URLS.ANALYTICS}/admin-usage?${query.toString()}`,
    { method: "get" },
  );
  return response;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const exportAdminEmployeeDirectory = async (params?: {
  companyId?: string;
  search?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.companyId) query.set("companyId", params.companyId);
  if (params?.search?.trim()) query.set("search", params.search.trim());

  const suffix = query.toString() ? `?${query.toString()}` : "";
  const blob = await client.exec(
    `${API_URLS.ANALYTICS}/admin-employees/export${suffix}`,
    { method: "get" },
  );

  if (!(blob instanceof Blob)) {
    throw new Error("Response was not a file");
  }

  downloadBlob(blob, "employee-directory.xlsx");
};

export const analyticsRepository = {
  getCompanyAnalytics,
  getAdminUsageAnalytics,
  exportAdminEmployeeDirectory,
};
