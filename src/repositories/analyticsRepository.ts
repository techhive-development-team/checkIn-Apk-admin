import { API_URLS } from "../enum/urls";
import { client } from "./client";

const getBrowserTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Yangon";

export type AnalyticsPeriod = "weekly" | "monthly" | "yearly";

export interface CompanyAnalyticsParams {
  period: AnalyticsPeriod;
  timezone?: string;
  companyId?: string;
<<<<<<< Updated upstream
=======
  anchorDate?: string;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  if (params.anchorDate) query.set("anchorDate", params.anchorDate);
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
export const analyticsRepository = {
  getCompanyAnalytics,
=======
const getAdminUsageAnalytics = async () => {
  const query = new URLSearchParams();
  query.set("timezone", getBrowserTimezone());

  const response = await client.exec(
    `${API_URLS.ANALYTICS}/admin-usage?${query.toString()}`,
    { method: "get" },
  );
  return response;
};

export const analyticsRepository = {
  getCompanyAnalytics,
  getAdminUsageAnalytics,
>>>>>>> Stashed changes
};
