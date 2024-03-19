import CurrentEvents from "../components/currentEventsComponent";
import AdminBar from "../components/adminBarComponent";
import Container from 'react-bootstrap/Container';
import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store";

export default function Home() {
  return (
    <Container fluid>
        <AdminBar />   
        <CurrentEvents />
    </Container>
  );
}
