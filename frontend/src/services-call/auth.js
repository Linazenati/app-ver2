import api from "./api";

const serviceCall = {}

serviceCall.login = (credentials) => api.post("/auth/login", credentials);

serviceCall.logout = () => api.post("/auth/logout");

serviceCall.register = (data) => api.post("/auth/register",data);

serviceCall.getCurrentUser = (userId) => api.get("/auth/me", userId);

export default serviceCall;