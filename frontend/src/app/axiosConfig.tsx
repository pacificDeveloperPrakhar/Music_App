import axios from "axios";
import {devUrl} from "./server_config"
const axiosInstance = axios.create({
    baseURL: devUrl, // Base URL for the backend server
    headers: {
        
        "Content-Type": "application/json",
      },
      withCredentials:true
});
export const axiosInstanceForMultipart = axios.create({
  baseURL: devUrl, // Base URL for the backend server
    withCredentials:true
});

export default axiosInstance
