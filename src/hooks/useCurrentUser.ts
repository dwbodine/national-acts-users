import { useEffect, useState } from "react";
import { User } from "../types/user";

export const useCurrentUser = () => {
  const [user, setUser] = useState<User>({
    userId: 0,
    isAdmin: false,
    username: '',
    isActive: false,
    selectedSellerId: 0,
    selectedHideRevenue: false,
    selectedHideServiceFees: false
  });

  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser') || undefined;
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr) as User;
      setUser(currentUser);
    } else {
      setUser({
        userId: 0,
        isAdmin: false,
        username: '',
        isActive: false,
        selectedSellerId: 0,
        selectedHideRevenue: false,
        selectedHideServiceFees: false
      });
    }
  }, [setUser]);

  return { user };
};
