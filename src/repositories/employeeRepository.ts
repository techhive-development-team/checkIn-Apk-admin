import { API_URLS } from "../enum/urls";
import { client } from "./client";

const getAll = async (
  companyId: string,
  params?: { limit?: number; offset?: number }) => {
  const query = new URLSearchParams(params as any).toString();

  const response = await client.exec(
    `${API_URLS.EMPLOYEE}/${companyId}?${query}`,
    { method: "get", }
  );
  return response;
};

const createEmployee = async (companyId: string, data: any) => {
  const response = await client.exec(`${API_URLS.EMPLOYEE}/${companyId}`, {
    method: "post",
    body: JSON.stringify(data),
  });

  return response;
};

const getEmployeeById = async (companyId: string, employeeId: string) => {
  const response = await client.exec(
    `${API_URLS.EMPLOYEE}/${companyId}/${employeeId}`,
    {
      method: "get",
    }
  );

  return response;
};

const updateEmployee = async (
  companyId: string,
  employeeId: string,
  data: any
) => {
  const response = await client.exec(
    `${API_URLS.EMPLOYEE}/${companyId}/${employeeId}`,
    {
      method: "patch",
      body: JSON.stringify(data),
    }
  );

  return response;
};

const deleteEmployee = async (companyId: string, employeeId: string) => {
  const response = await client.exec(
    `${API_URLS.EMPLOYEE}/${companyId}/${employeeId}`,
    {
      method: "delete",
    }
  );

  return response;
};

export const employeeRepository = {
  getAll,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
