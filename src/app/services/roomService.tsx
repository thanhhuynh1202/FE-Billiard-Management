import { axiosClient } from "@/lib/http/axios-client";

interface roomPayload {
  [x: string]: any;
}
export const findAll = async () => {
  const response = await axiosClient.get("http://localhost:8080/api/v1/room");
  return response;
};
export const findAllInPage = async (pageNumber: any, pageSize: any) => {
  try {
    const response = await axiosClient.get(
      "http://localhost:8080/api/v1/room",
      {
        params: {
          page: pageNumber, 
          size: pageSize,
        },
      }
    );
    return response; 
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; 
  }
};
export const roomById = async (roomId: any) => {
  const response = await axiosClient.get(
    `http://localhost:8080/api/v1/room/findbyid?roomId=${roomId}`
  );
  return response;
};
export const roomByAreaId = async (areaId: any) => {
  const response = await axiosClient.get(
    `http://localhost:8080/api/v1/room/findbyarea?areaId=${areaId}`
  );
  return response;
};
export const addRoom = async (roomDetail: roomPayload) => {
  const response = await axiosClient.post(
    "http://localhost:8080/api/v1/room/manager",
    JSON.stringify(roomDetail)
  );
  return response;
};
export const deleteRoom = async (deleteId: any) => {
  const response = await axiosClient.delete(
    `http://localhost:8080/api/v1/room/manager/${deleteId}`
  );
  return response;
};
export const updateRoom = async (updId: any, roomDetail: roomPayload) => {
  const response = await axiosClient.put(
    `http://localhost:8080/api/v1/room/manager/${updId}`,
    JSON.stringify(roomDetail)
  );
  return response;
};
