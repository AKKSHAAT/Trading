import api from "./axios";
import { UserInfoResponse, UserPortfolio } from "@/app/shared/types/user-types";

export const fetchUserInfo = async (): Promise<UserInfoResponse> =>
  api.get("/user/info");

export const fetchPortfolio = async (userId: string): Promise<UserPortfolio> =>
  api.get(`/user/${userId}/portfolio`);
