import { API_URLS } from "../enum/urls";
import { client } from "./client";

const getAll = async (params?: { limit?: number; offset?: number }) => {
    const query = new URLSearchParams(params as any).toString();

    const response = await client.exec(
        `${API_URLS.ATTENDANCE}?${query}`,
        {
            method: "get",
        }
    );
    return response;
}

const exportFile = async () => {
  try {
    const blob = await client.exec(`${API_URLS.ATTENDANCE}/export`, {
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
            method: "patch",
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