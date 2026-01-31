import useSWR from "swr";
import { API_URLS } from "../enum/urls";
import { userRepository } from "../repositories/userRepository";

export const useGetUserById = (userId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? [`${API_URLS.USER}/${userId}`] : null, 
    () => userRepository.getUserById(userId!)
  );

  return { 
    data: data?.data,
    error,
    isLoading, 
    mutate
  }; 
};
