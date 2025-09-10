"use client";

import { useEffect, useState } from 'react';
import ClientSellersComponent from '@/components/sales/events/clientSellersComponent';
import { User } from '@/types/user';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loggedInNonAdmin, setLoggedInNonAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      const currentUser = getUser();
      setUser(currentUser);
    }

    if (user && user.isAuthenticated) {
      if (user.isAdmin) {
        router.push('/dashboard');
      } else {
        setLoggedInNonAdmin(true);
      }
    }
  }, [router, getUser, user]);



  return (
    loggedInNonAdmin ? <ClientSellersComponent /> : <></>
  );
}
