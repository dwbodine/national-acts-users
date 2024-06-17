import { useEffect, useState } from "react";
import { User, UserRole } from "../types/user";

export const useCurrentUser = () => {
  const [user, setUser] = useState<User>({
    userId: 0,
    role: UserRole.AccountManager,
    username: '',
    isActive: false,
    showInactiveEvents: false
  });

  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser') || '';
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr) as User;
      setUser(currentUser);
    } else {
      setUser({
        userId: 0,
        role: UserRole.AccountManager,
        username: '',
        isActive: false,
        showInactiveEvents: false
      });
    }
  }, [setUser]);

  return { user };
};
