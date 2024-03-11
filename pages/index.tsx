import CurrentEvents from "../components/currentEventsComponent";
import AdminBar from "../components/adminBarComponent";
import Container from 'react-bootstrap/Container';


export default function Home() {
  return (
    <Container fluid>
        <AdminBar />   
        <CurrentEvents />
    </Container>
  );
}
