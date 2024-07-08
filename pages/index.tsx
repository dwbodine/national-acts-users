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
import { useEffect, useState } from "react";


export default function Home() {
  const { user } = useCurrentUser();
  const isAdmin = (user.role == UserRole.Admin);
  const [activeKey, setActiveKey] = useState("1");

  useEffect(() => {
    switch (activeKey) {
      case "2":
        document.title = "Client Portal - Sales Overview";
        break;
      case "3": 
        document.title = "Client Portal - Admin";
        break;
      default:
        document.title = "Client Portal - Home";
        break;
    }
  }, [activeKey]);

  const onSelectTab = (eventKey: string | undefined) => {
    setActiveKey(eventKey || "1");
  };

  return (
    <>
      <CheckAuth />
      <NavBar />
      <Container fluid hidden={!user.isAuthenticated} className="vipContainer">
        { isAdmin ? 
          <>
          <Tabs defaultActiveKey="1" onSelect={onSelectTab}>
            <Tabs.Tab eventKey="1" title="HOME">
              <Dashboard />
            </Tabs.Tab>
            <Tabs.Tab eventKey="2" title="SALES OVERVIEW">
              <AdminBar />   
              <CurrentEvents />
            </Tabs.Tab>
            <Tabs.Tab eventKey="3" title="ADMIN">
              Admin functions will go here - only admins can see this
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
