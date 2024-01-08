import { axiosClient } from "@/lib/http/axios-client";
import { saveStorage } from "@/utils/storage";

interface LoginPayload {
  [x: string]: any
}

export const login = async (loginDetail: LoginPayload) => {    
    const response = await axiosClient.post("http://localhost:8080/api/v1/auth/login", JSON.stringify(loginDetail));
    // @ts-ignore 
    if (response.tokenType === "Bearer") {
      // @ts-ignore 
      saveStorage('access_token', response.accessToken);
    } else{
      console.log(response);
    }
    return response;
 };

 export const resetPassword = async (userDetail: LoginPayload) => {
  const response = await axiosClient.post("http://localhost:8080/api/v1/auth/reset-password", JSON.stringify(userDetail));
  return response;
}
