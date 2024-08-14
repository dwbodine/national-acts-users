import CurrentEvents from "../components/currentEventsComponent";
import AdminBar from "../components/adminBarComponent";
import Container from 'react-bootstrap/Container';
import CheckAuth from "../components/checkAuthComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Tabs } from "rsuite";
import 'rsuite/Tabs/styles/index.css';
import NavBar from "../components/navBarComponent";
import Dashboard from "../components/dashboardComponent";
import { useEffect, useState } from "react";
import AdminIndex from "../components/admin/adminIndexComponent";
import ReportsIndex from "../components/reports/reportsIndexComponent";

export default function Home() {
  const { user } = useCurrentUser();
  const isAdmin = user.isAdmin;
  const [activeKey, setActiveKey] = useState("1");

  useEffect(() => {
    switch (activeKey) {
      case "2":
        document.title = "Client Portal - Sales Overview";
        break;
      case "3": 
        document.title = "Client Portal - Admin";
        break;
      case "4":
        document.title = "Client Portal - Reports";
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
          <Tabs defaultActiveKey="1" onSelect={onSelectTab} className="admin-tabs">
            <Tabs.Tab eventKey="1" title="HOME">
              <Dashboard />
            </Tabs.Tab>
            <Tabs.Tab eventKey="2" title="SALES OVERVIEW">
              <AdminBar />   
              <CurrentEvents />
            </Tabs.Tab>
            <Tabs.Tab eventKey="3" title="ADMIN">
              <AdminIndex />
            </Tabs.Tab>
            <Tabs.Tab eventKey="4" title="REPORTS">
              <ReportsIndex />
            </Tabs.Tab>
          </Tabs>
          </>
          :
          <>
          <AdminBar />   
          <CurrentEvents />
          </>
        }
      </Container>
    </>
  );
}
