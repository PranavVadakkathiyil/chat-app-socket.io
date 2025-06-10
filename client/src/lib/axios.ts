import axios from "axios";
const axiosInstence = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  
});

export default axiosInstence;
