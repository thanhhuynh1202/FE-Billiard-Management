import { axiosClient } from "@/lib/http/axios-client";
export const onGetHistory = async () => {
  const response = await axiosClient.get(
    "http://localhost:8080/api/v1/history"
  );
  return response;
};
