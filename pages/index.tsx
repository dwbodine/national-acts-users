import CurrentEvents from "../components/sales/events/currentEventsComponent";
import AdminBar from "../components/sales/events/salesBarComponent";
import Container from 'react-bootstrap/Container';
import CheckAuth from "../components/common/checkAuthComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Tabs } from "rsuite";
import NavBar from "../components/common/navBarComponent";
import Dashboard from "../components/dashboard/dashboardComponent";
import { useEffect, useState } from "react";
import AdminIndex from "../components/admin/adminIndexComponent";
import ReportsIndex from "../components/reports/reportsIndexComponent";
import { UserActivityType } from "@/types/user";
import { useLogActivityData } from "@/hooks/useLogActivityData";

export default function Home() {
  const { user } = useCurrentUser();
  const isAdmin = user.isAdmin;
  const [activeKey, setActiveKey] = useState("1");
  const { logActivityData } = useLogActivityData();

  useEffect(() => {
    if (user && user.isAuthenticated) {
      let activityType: UserActivityType;
      switch (activeKey) {
        case "2":
          activityType = UserActivityType.AccessSalesOverView;
          document.title = "Client Portal - Sales Overview";
          break;
        case "3": 
          activityType = UserActivityType.AccessAdmin;
          document.title = "Client Portal - Admin";
          break;
        case "4":
          activityType = UserActivityType.AccessReports;
          document.title = "Client Portal - Reports";
          break;
        default:
          activityType = UserActivityType.AccessDashboard;
          document.title = "Client Portal - Home";
          break;
      }
      logActivityData(activityType);
    }    
  }, [activeKey, user, logActivityData]);

  const onSelectTab = (eventKey: string | undefined) => {
    const key = eventKey || "1";
    setActiveKey(key);
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
