import Cookies from 'js-cookie';
import { authRoutes, protectedRoutes, publicRoutes } from "../../src/router/routes";
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
          console.log(`Redirecting to login from ${pathName}`);
          if (pathName != "/") {
            let returnPath = `${pathName}`;
            const searchParams = new URLSearchParams(window.location.search);
            if (searchParams && searchParams.size > 0) {
              returnPath += "?";
              const keys = Array.from(searchParams.keys());
              keys.forEach((key, index) => {
                if (index > 0) {
                  returnPath += "&";
                }
                returnPath += `${key}=${searchParams.get(key)}`;
              });
            }
            router.push(`/login/?returnPath=${encodeURI(returnPath)}`);
          } else {
            router.push('/login/');
          }
          
          Cookies.remove("authToken");
      } else if (authRoutes.includes(pathName) || publicRoutes.includes(pathName)) {
        router.push(pathName);
      }
    }
    
  }, [router, pathName]);  

  return (<></>);
}