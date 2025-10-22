import api from "./axiosInstance";
import { getCookie } from "@utils/authFlow";

const authApi = {
  login: (email, password) =>
    api.post("/auth/login", { email, password, userRole: "HOST" }),
  refreshToken: () =>
    api.post("/auth/refresh", { refreshToken: getCookie("refresh-token") }),
  logout: () =>
    api.post("/auth/logout", { refreshToken: getCookie("refresh-token") }),
  getMyProfile: () => api.get("/host/my", { isAuth: true }),
};

export default authApi;
