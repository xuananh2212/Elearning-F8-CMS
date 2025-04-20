import axios from "axios";
import qs from "qs";
import { BASE_API_URL } from "./env.config";
export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      encodeDotInKeys: true,
      arrayFormat: "indices",
      allowDots: true,
    });
  },
});
console.log("BASE_API_URL:", BASE_API_URL);
