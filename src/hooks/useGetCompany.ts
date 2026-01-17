import useSWR from "swr";
import { API_URLS } from "../enum/urls";
import { companyRepository } from "../repositories/companyRepository";

export const useGetCompany = (params?: { limit?: number; offset?: number }) => {
  const key = params
    ? [`${API_URLS.COMPANY}`, params]
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => companyRepository.getAll(params)
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
    total: data?.meta?.total,
  };
};

export const useGetCompanyById = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `${API_URLS.COMPANY}/${id}` : null,
    () => companyRepository.getCompanyById(id)
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
  };
};
