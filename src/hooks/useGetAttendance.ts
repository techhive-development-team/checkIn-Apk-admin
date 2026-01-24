import useSWR from "swr";
import { API_URLS } from "../enum/urls";
import { attendanceRepository } from "../repositories/attendanceRepository";

export const useGetAttendance = (params?: {limit?: number; offset?: number }) =>{
    const key = params 
    ? [`${API_URLS.ATTENDANCE}`, params]
    :null;

    const { data, error, isLoading, mutate } = useSWR(
        key, 
        () => attendanceRepository.getAll(params)
    );

    return {
    data: data,
    error,
    isLoading,
    mutate,
    total: data?.meta?.total,
  };
}

export const useGetAttendanceById = (id: string) => {
    const { data, error, isLoading, mutate } = useSWR(
        id ? `${API_URLS.ATTENDANCE}/${id}` :null,
        () => attendanceRepository.getAttendanceById(id)
    ); 
    
    return {
    data,
    error,
    isLoading,
    mutate,
  };
}