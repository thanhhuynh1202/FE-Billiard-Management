// file nay se la file cau hinh axios instance, tu nay ve sau moi api se duoc dung axios instance nay de call api thay vi cu import axios o moi noi

import { getStorage } from "@/utils/storage";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

interface Subscribers {
  resolve: (value: any) => void,
  reject: (reason?: any) => void
}

let isCallingRefreshToken = false;
let subscribers: Subscribers[] = []; 
/**
 *
 * @param {any} error
 * @param {string | null} token
 */
const subscribersHandler = (error: any, token = null) => {
  if (!subscribers.length) return;

  subscribers.forEach(({ resolve, reject }) => {
    if (!error) {
      resolve(token);
    } else {
      reject(error);
    }
  }); 

  subscribers = [];
};

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 30000, 
    headers: { 'Content-Type': 'application/json'}
  });

axiosClient.interceptors.request.use((config) => {
    const token = getStorage('access_token');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';

    return config;
  },  (error) => {
    return Promise.reject(error);
  });

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const originalRequest = error.config;
    const statusCode = error.response.status;
    const hasErrorRetry = originalRequest._retry;

    if (statusCode === 401 && !hasErrorRetry) {
      if (isCallingRefreshToken) {
        return (
          new Promise(function (resolve, reject) {
            subscribers.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            })
        );
      }
      originalRequest._retry = true;
      isCallingRefreshToken = true;

      // Lấy refresh token từ local (Chuyển sang cookie bởi local không check được trong Server)
      // const refresh_token = localStorage.getItem("refreshToken");
      const refresh_token = getCookie("refreshToken")

      return new Promise(function (resolve, reject) {
        /**
         * Call refresh token để lấy access token mới, truyền refreshToken dưới dạng params.
         * http://localhost:3000/refresh_token?refresh_token=xxx.xxx.xxx
         */
        axios
          .post("http://localhost:3000/refresh_token", null, { params: { refresh_token }})
          .then(({ data }) => {
            const { accessToken, refreshToken } = data;
           
            setCookie("accessToken", accessToken);

            setCookie("refreshToken", refreshToken);
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            subscribersHandler(null, data.accessToken);
            resolve(axios(originalRequest));
          })

          .catch((err) => {
            subscribersHandler(err, null);
            reject(err);
          })
          .finally(() => {
            isCallingRefreshToken = false;
          });
      });
    }

    // các error khác ngoài 401 unauthorized
    return Promise.reject(error);
  }
);

export { axiosClient }