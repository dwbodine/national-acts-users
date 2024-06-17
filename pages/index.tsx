import CurrentEvents from "../components/currentEventsComponent";
import AdminBar from "../components/adminBarComponent";
import Container from 'react-bootstrap/Container';
import CheckAuth from "../components/checkAuthComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Tabs } from "rsuite";
import 'rsuite/Tabs/styles/index.css';
import NavBar from "../components/navBarComponent";
import Dashboard from "../components/dashboardComponent";
import { UserRole } from "@/types/user";


export default function Home() {
  const { user } = useCurrentUser();
  const isAdmin = (user.role == UserRole.Admin);

  return (
    <>
      <CheckAuth />
      <NavBar />
      <Container fluid hidden={!user.isAuthenticated} className="vipContainer">
        { isAdmin ? 
          <>
          <Tabs defaultActiveKey="1">
            <Tabs.Tab eventKey="1" title="ADMIN DASHBOARD">
              <Dashboard />
            </Tabs.Tab>
            <Tabs.Tab eventKey="2" title="SALES OVERVIEW">
              <AdminBar />   
              <CurrentEvents />
            </Tabs.Tab>
          </Tabs>
          </>
          :
          <>
          <div style={{"height": "5px"}}>&nbsp;</div>
          <AdminBar />   
          <CurrentEvents />
          </>
        }
      </Container>
    </>
  );
}
