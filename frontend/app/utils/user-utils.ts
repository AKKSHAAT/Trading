import api from "./axios";

export const fetchUserInfo = async ()=> api.get("/user/info");
