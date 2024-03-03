import { useRouter } from "next/router";
import { useLogout } from "../src/hooks/useLogout";
import { useSelector } from "react-redux";
import type { RootState } from '../src/lib/store';
import 'rsuite/dist/rsuite.min.css';
import CurrentEvents from "../components/currentEventsComponent";
import AdminBar from "../components/adminBarComponent";
import { useEffect } from "react";

export default function Home() {
  const { logout } = useLogout();
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!currentUser || !currentUser.isAuthenticated) {
      logout();
      router.push("/login");
    }
  });  
  
  return (
    <>
        <AdminBar />               
        <CurrentEvents />
    </>
  );
}
