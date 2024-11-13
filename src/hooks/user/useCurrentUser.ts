import { User } from '@/types/user';

export const useCurrentUser = () => {
  const getUser = () => {
    let user: User | undefined = undefined;
    let currentUserStr: string | undefined = undefined;
    try {
      currentUserStr = localStorage.getItem('currentUser') || undefined;
    } catch (e) {
      currentUserStr = undefined;
    }
    if (currentUserStr) {
      user = JSON.parse(currentUserStr) as User;
    }
    return user;
  };

  return { getUser };
};
