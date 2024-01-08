import { axiosClient } from "@/lib/http/axios-client";
import { saveStorage } from "@/utils/storage";

interface userPayload{
  [x: string]: any
}
 export const findAllUser = async () => {
  const response = await axiosClient.get("http://localhost:8080/api/v1/user")
  return response;
}
export const userById = async (editId: any) => {
  const response = await axiosClient.get(`http://localhost:8080/api/v1/user/findbyid?userId=${editId}`);
  return response;
}
export const addUser = async (userDetail: userPayload) => {
  const response = await axiosClient.post("http://localhost:8080/api/v1/user/manager", JSON.stringify(userDetail));
  return response;
}
export const deleteUser = async (username: any) => {
  const response = await axiosClient.delete(`http://localhost:8080/api/v1/user/manager/${username}`)
  return response;
}
export const updateUser = async (username: any, userDetail: userPayload) => {
  const response = await axiosClient.put(`http://localhost:8080/api/v1/user/manager/${username}`, JSON.stringify(userDetail));
  return response;
}
