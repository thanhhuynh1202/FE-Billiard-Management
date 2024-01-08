import { axiosClient } from "@/lib/http/axios-client";

// interface orderDetailPayload {
//     [x: string]: any
//   }
export const findAllByOrderId = async (orderId: any) => {
  const response = await axiosClient.get(
    `http://localhost:8080/api/v1/invoice?order=${orderId}`
  );
  return response;
};

export const findOrderDetailByDate = async (from: any, to: any) => {
  const response = await axiosClient.get(
    `http://localhost:8080/api/v1/report`,
    {
      params: {
        from: from, // adjust the parameter name based on your backend API
        to: to,
      },
    }
  );
  return response;
};
