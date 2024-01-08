import { axiosClient } from "@/lib/http/axios-client";

interface roomPayload {
    [x: string]: any
  }
  export const findAllRoomProduct = async (roomId: any) => {
    const response = await axiosClient.get(`http://localhost:8080/api/v1/roomproducts?roomId=${roomId}`)
    return response;
  }
//   export const roomById = async (roomId: any) => {
//     const response = await axiosClient.get(`http://localhost:8080/api/v1/rooms/findbyid?roomId=${roomId}`);
//     return response;
//   }
//   export const roomByAreaId = async (areaId: any) => {
//     const response = await axiosClient.get(`http://localhost:8080/api/v1/rooms/findbyarea?areaId=${areaId}`);
//     return response;
//   }
  export const addRoomProduct = async (roomProduct: roomPayload) => {
    const response = await axiosClient.post("http://localhost:8080/api/v1/roomproducts", JSON.stringify(roomProduct));
    return response;
  }
  export const deleteRoomProduct = async (deleteId: any) => {
    const response = await axiosClient.delete(`http://localhost:8080/api/v1/roomproducts/deletebyid/${deleteId}`);
    return response;
  }
  export const deleteAllByRoom = async (deleteId: any) => {
    const response = await axiosClient.delete(`http://localhost:8080/api/v1/roomproducts/deletebyroomid/${deleteId}`);
    return response;
  }
  export const updateRoomProduct = async (updId:any,roomProduct: roomPayload) => {
    const response = await axiosClient.put(`http://localhost:8080/api/v1/roomproducts/${updId}`, JSON.stringify(roomProduct));
    return response;
}
