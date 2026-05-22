import { User } from '@/types/user';

export const useCurrentUser = () => {
  const getUser = () => {
    let user: User | undefined = undefined;
    try {
      const currentUserStr = localStorage.getItem('currentUser') || undefined;
      if (currentUserStr) {
        user = JSON.parse(currentUserStr) as User;
      }
    } catch {
      user = undefined;
    }

    return user;
  };

  return { getUser };
};
