import apiClient from "@/lib/apiClient";

export const signoutApi = () => {
  return apiClient.post("auth/signout");
};
