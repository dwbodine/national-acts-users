import CurrentEvents from "../components/currentEventsComponent";
import AdminBar from "../components/adminBarComponent";
import Container from 'react-bootstrap/Container';
import CheckAuth from "../components/checkAuthComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Home() {

  const { user } = useCurrentUser();

  return (
    <>
    <CheckAuth />
    <Container fluid hidden={!user?.isAuthenticated}>
        <AdminBar />   
        <CurrentEvents />
    </Container>
    </>
  );
}
