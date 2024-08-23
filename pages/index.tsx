import CurrentEvents from "../components/sales/events/currentEventsComponent";
import AdminBar from "../components/sales/events/salesBarComponent";
import Container from 'react-bootstrap/Container';
import CheckAuth from "../components/common/checkAuthComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NavBar from "../components/common/navBarComponent";
import { useEffect } from "react";
import { UserActivityType } from "@/types/user";
import { useLogActivityData } from "@/hooks/useLogActivityData";
import router from "next/router";

export default function Home() {
  const { user } = useCurrentUser();
  const { logActivityData } = useLogActivityData();

  useEffect(() => {
    if (user && user.isAuthenticated) {
      if (user.isAdmin) {
        router.push('/sellers/');
      } else {
        document.title = "Client Portal - Sales Overview";
        logActivityData(UserActivityType.AccessSalesOverView);
      }      
    }    
  }, [user, logActivityData]);

  return (
    (user && !user.isAdmin) ?
    <>
      <CheckAuth />
      <NavBar />
      <Container fluid hidden={!user.isAuthenticated} className="vipContainer">
          <AdminBar />   
          <CurrentEvents />
      </Container>
    </>
    : ''
  );
}
