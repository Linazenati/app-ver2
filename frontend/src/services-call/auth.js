import api from "./api";

const serviceCall = {}

serviceCall.login = (credentials) => api.post("/auth/login", credentials);

serviceCall.logout = () => api.post("/auth/logout");

serviceCall.register = (data) => api.post("/auth/register",data);

serviceCall.getCurrentUser = () => api.get("/auth/me");

export default serviceCall;