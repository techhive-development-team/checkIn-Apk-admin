import { baseUrl } from "../enum/urls";
import { useAuthStore } from "../stores/authStore";

const exec = async (endPoint: RequestInfo, config?: RequestInit) => {
  const token = useAuthStore.getState().token;
  const headers: HeadersInit = {
    "content-type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(`${baseUrl}${endPoint}`, {
    ...config,
    headers: {
      ...headers,
      ...config?.headers,
    },
  });

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("spreadsheetml")) {
    if (!response.ok) throw await response.json();
    return await response.blob(); 
  }

  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
};

export const client = { exec };
