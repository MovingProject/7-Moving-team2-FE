import { DriverUser, UserData } from "@/types/card";

export const isDriverUser = (user: UserData | undefined | null): user is DriverUser => {
  if (!user) {
    return false;
  }
  return user.role === "DRIVER";
};
