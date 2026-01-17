import useSWR from "swr";
import { API_URLS } from "../enum/urls";
import { employeeRepository } from "../repositories/employeeRepository";

export const useGetEmployee = (companyId: string, params?: { limit?: number; offset?: number }) => {
    const key = companyId 
    ? [`${API_URLS.EMPLOYEE}/${companyId}`, params] 
    :null;

    const { data, error, isLoading, mutate } = useSWR(
    key,
    () => employeeRepository.getAll(companyId, params)
  ); 
  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
    total: data?.meta?.total,
  };
}

export const useGetEmployeeById = (companyId: string, id: string) => {
    const {data, error, isLoading, mutate} = useSWR(
        companyId && id ? `${API_URLS.EMPLOYEE}/${companyId}/${id}` : null,
        () => employeeRepository.getEmployeeById(companyId, id)
    );

    return {
    data: data?.data,
    error,
    isLoading,
    mutate,
  };
}