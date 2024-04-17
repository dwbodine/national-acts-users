import Cookies from 'js-cookie';
import { authRoutes, protectedRoutes } from "../src/router/routes";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckAuth() {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {   
    if (pathName) {
      const authTokenCookie = Cookies.get("authToken");
      
      if (protectedRoutes.includes(pathName) && !authTokenCookie) {
          Cookies.remove("authToken");
          router.push('/login');
          Cookies.remove("authToken");
      }
  
      if (authRoutes.includes(pathName) && authTokenCookie) {
          router.push('/');
      }
    }
    
  }, [router, pathName]);  

  return (<></>);
}