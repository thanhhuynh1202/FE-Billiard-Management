import { axiosClient } from "@/lib/http/axios-client";

interface unitPayload {
  [x: string]: any;
}
export const findAllUnit = async () => {
  const response = await axiosClient.get("http://localhost:8080/api/v1/unit");
  return response;
};
export const unitById = async (unitId: any) => {
  const response = await axiosClient.get(
    `http://localhost:8080/api/v1/unit/findbyid?unitId=${unitId}`
  );
  return response;
};
export const addUnit = async (unitDetail: unitPayload) => {
  const response = await axiosClient.post(
    "http://localhost:8080/api/v1/unit/manager",
    JSON.stringify(unitDetail)
  );
  return response;
};
export const deleteUnit = async (deleteId: any) => {
  const response = await axiosClient.delete(
    `http://localhost:8080/api/v1/unit/manager/${deleteId}`
  );
  return response;
};
export const updateUnit = async (updId: any, unitDetail: unitPayload) => {
  const response = await axiosClient.put(
    `http://localhost:8080/api/v1/unit/manager/${updId}`,
    JSON.stringify(unitDetail)
  );
  return response;
};
