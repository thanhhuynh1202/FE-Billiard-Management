import { axiosClient } from "@/lib/http/axios-client";
import useSWR from "swr";

export const useAuth = () => {
  const { data, error, ...otherResult } = useSWR('/v1/profile', (url) => axiosClient.get(url));
  const isLoading = !data && !error;
  return {
    ...otherResult,
    data,
    error,
    isLoading,
  };
};
