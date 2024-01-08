import { axiosClient } from "@/lib/http/axios-client";

interface categoryPayload {
    [x: string]: any
  }
  export const findAllCategory = async () => {
    const response = await axiosClient.get("http://localhost:8080/api/v1/category")
    return response;
  }
  export const categoryById = async (categoryId: any) => {
    const response = await axiosClient.get(`http://localhost:8080/api/v1/category/findbyid?categoryId=${categoryId}`);
    return response;
  }
  export const addCategory = async (categoryDetail: categoryPayload) => {
    const response = await axiosClient.post("http://localhost:8080/api/v1/category/manager", JSON.stringify(categoryDetail));
    return response;
  }
  export const deleteCategory = async (deleteId: any) => {
    const response = await axiosClient.delete(`http://localhost:8080/api/v1/category/manager/${deleteId}`)
    return response;
  }
  export const updateCategory = async (updId:any,categoryDetail: categoryPayload) => {
    const response = await axiosClient.put(`http://localhost:8080/api/v1/category/manager/${updId}`, JSON.stringify(categoryDetail));
    return response;
}
