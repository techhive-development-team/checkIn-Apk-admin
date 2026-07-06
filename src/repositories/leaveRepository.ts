import { API_URLS } from "../enum/urls";
import { client } from "./client";

const getAll = async (params?: {
  limit?: number;
  offset?: number;
  fromDate?: string;
  toDate?: string;
  employeeId?: string;
  status?: "PENDING" | "APPROVED" | "DENIED";
  memberType?: "EMPLOYEE" | "STUDENT";
}) => {
  const sanitizedParams = Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
  const query = new URLSearchParams(sanitizedParams as any).toString();

  const response = await client.exec(
    `${API_URLS.LEAVE}?${query}`,
    {
      method: "get",
    }
  );
  return response;
};

const getLeaveById = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.LEAVE}/${id}`,
    {
      method: "get",
    }
  );
  return response;
};

const createLeave = async (data: any) => {
  const response = await client.exec(
    `${API_URLS.LEAVE}`,
    {
      method: "post",
      body: JSON.stringify(data),
    }
  );
  return response;
};

const updateLeave = async (id: string, data: any) => {
  const response = await client.exec(
    `${API_URLS.LEAVE}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
  return response;
};

const deleteLeave = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.LEAVE}/${id}`,
    {
      method: "delete",
    }
  );
  return response;
};

export const leaveRequestRepository = {
  getAll,
  getLeaveById,
  createLeave,
  updateLeave,
  deleteLeave,
};