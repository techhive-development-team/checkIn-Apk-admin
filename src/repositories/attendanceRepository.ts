import { API_URLS } from "../enum/urls";
import { client } from "./client";

const getBrowserTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Yangon";

const getAll = async (params?: {
  limit?: number;
  offset?: number;
  fromDate?: string;
  toDate?: string;
  employeeId?: string;
  memberType?: "EMPLOYEE" | "STUDENT";
  timezone?: string;
}) => {
    const timezone = params?.timezone || getBrowserTimezone();
    const sanitizedParams = Object.fromEntries(
      Object.entries({ ...(params ?? {}), timezone }).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    );
    const query = new URLSearchParams(sanitizedParams as any).toString();

    const response = await client.exec(
        `${API_URLS.ATTENDANCE}?${query}`,
        {
            method: "get",
        }
    );
    return response;
}

const exportFile = async (timezone?: string) => {
  try {
    const resolvedTimezone = timezone || getBrowserTimezone();
    const query = new URLSearchParams({ timezone: resolvedTimezone }).toString();
    const blob = await client.exec(`${API_URLS.ATTENDANCE}/export?${query}`, {
      method: "get",
    });

    if (!(blob instanceof Blob)) {
      throw new Error("Response was not a file");
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance.xlsx";
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

const getAttendanceById = async (id: string) => {
    const response = await client.exec(
        `${API_URLS.ATTENDANCE}/${id}`,
        {  
            method: "get",
        }
    );
    return response;
}

const updateAttendance = async (id: string, data: any) => {
    const response = await client.exec(
        `${API_URLS.ATTENDANCE}/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(data)
        }
    );
    return response;
}

const deleteAttendance = async (id: string) => {
    const response = await client.exec (
        `${API_URLS.ATTENDANCE}/${id}`,
        {
            method: "delete",
        }
    );
    return response;
}

export const attendanceRepository = {
    getAll,
    getAttendanceById,
    exportFile,
    updateAttendance,
    deleteAttendance
}