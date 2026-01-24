import { API_URLS } from "../enum/urls";
import { client } from "./client";

const getAll = async (params?: { limit?: number; offset?: number }) => {
  const query = new URLSearchParams(params as any).toString();

  const response = await client.exec(
    `${API_URLS.COMPANY}?${query}`,
    {
      method: "get",
    }
  );

  return response;
};

const createCompany = async (data: any) => {
  const response = await client.exec(
    API_URLS.COMPANY,
    {
      method: "post",
      body: JSON.stringify(data),
    }
  );

  return response;
};

const getCompanyById = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}`,
    {
      method: "get",
    }
  );

  return response;
};

const updateCompany = async (id: string, data: any) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );

  return response;
};

const deleteCompany = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}`,
    {
      method: "delete",
    }
  );

  return response;
};

export const companyRepository = {
  getAll,
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
