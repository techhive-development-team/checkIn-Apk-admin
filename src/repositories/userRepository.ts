import { API_URLS } from "../enum/urls";
import { client } from "./client";

const getUserById = async (userId: string) => {

  const response = await client.exec(`${API_URLS.USER}/${userId}`, {
    method: "get",
  });
  
  return response;
};

const updateUser = async (userId: string, data:any) => {
  const response = await client.exec(
    `${API_URLS.USER}/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
  return response;
}

export const userRepository = {
  getUserById,
  updateUser,
};


