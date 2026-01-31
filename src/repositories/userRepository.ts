import { API_URLS } from "../enum/urls";
import type { UserCreateForm } from "../pages/User/UserValidationSchema";
import { client } from "./client";

const getAll = async (params?: { limit?: number; offset?: number }) => {
  const query = new URLSearchParams(params as any).toString();
  const response = await client.exec(
    `${API_URLS.USER}?${query}`,
    {
      method: "get",
    }
  );
  return response;
};

const createUser = async (data: UserCreateForm) => {
  const response = await client.exec(
    API_URLS.USER,
    {
      method: "post",
      body: JSON.stringify(data)
    }
  )
  return response
}

const deleteUser = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.USER}/${id}`,
    {
      method: "delete",
    }
  );

  return response;
};

const getUserById = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.USER}/${id}`,
    {
      method: "get",
    }
  );

  return response;
};

const updateUser = async (id: string, data: any) => {
  const response = await client.exec(
    `${API_URLS.USER}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );

  return response;
};

export const userRepository = { getAll, createUser, deleteUser, getUserById, updateUser }
