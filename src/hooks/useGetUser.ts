import useSWR from "swr";
import { API_URLS } from "../enum/urls";
import { userRepository } from "../repositories/userRepository";

export const useGetUser = (params?: { limit?: number; offset?: number }) => {
  const key = params
    ? [`${API_URLS.USER}`, params]
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => userRepository.getAll(params)
  );

  return {
    data: data?.data?.data,
    error,
    isLoading,
    mutate,
    total: data?.data?.meta?.total,
  };
};