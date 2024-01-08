import { axiosClient } from "@/lib/http/axios-client";

interface customerPayload {
    [x: string]: any
  }
  export const findAllCustomer = async (pageNumber: any, pageSize: any) => {
    const response = await axiosClient.get("http://localhost:8080/api/v1/customer",
    {
      params: {
        page: pageNumber, 
        size: pageSize,
      },
    })
    return response;
  }
  export const customerById = async (customerId: any) => {
    const response = await axiosClient.get(`http://localhost:8080/api/v1/customer/findbyid?customerId=${customerId}`);
    return response;
  }
  export const addCustomer = async (customerDetail: customerPayload) => {
    const response = await axiosClient.post("http://localhost:8080/api/v1/customer/cashier", JSON.stringify(customerDetail));
    return response;
  }
  export const deleteCustomer = async (deleteId: any) => {
    const response = await axiosClient.delete(`http://localhost:8080/api/v1/customer/cashier/${deleteId}`)
    return response;
  }
  export const updateCustomer = async (updId:any, customerDetail: customerPayload) => {
    const response = await axiosClient.put(`http://localhost:8080/api/v1/customer/cashier/${updId}`, JSON.stringify(customerDetail));
    return response;
  }
