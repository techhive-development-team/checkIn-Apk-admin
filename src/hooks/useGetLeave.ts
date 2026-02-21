import useSWR from "swr";
import { API_URLS } from "../enum/urls";
import { leaveRequestRepository } from "../repositories/leaveRepository";

export const useGetLeave = (params?: { limit?: number; offset?: number }) => {
    const key = params
    ? [`${API_URLS.LEAVE}`, params]
    :null;

    const { data, error, isLoading, mutate } = useSWR(
        key,
        () => leaveRequestRepository.getAll(params)
    );
    return {
    data: data?.data?.data,
    error,
    isLoading,
    mutate,
    total: data?.data?.meta?.total,
  };
}

export const useGetLeaveById = (id: string) => {
    const { data, error, isLoading, mutate } = useSWR (
        id? `${API_URLS.LEAVE}/${id}` : null,
        () => leaveRequestRepository.getLeaveById(id)
    );

    return {
    data: data?.data,
    error,
    isLoading,
    mutate,
  };
}