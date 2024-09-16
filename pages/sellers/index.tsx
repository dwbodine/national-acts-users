import CurrentEvents from "../../components/sales/events/currentEventsComponent";
import AdminBar from "../../components/sales/events/salesBarComponent";
import Container from 'react-bootstrap/Container';
import CheckAuth from "../../components/common/checkAuthComponent";
import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { Tabs } from "rsuite";
import NavBar from "../../components/common/navBarComponent";
import { useEffect } from "react";
import { UserActivityType } from "@/types/user";
import { useLogActivityData } from "@/hooks/common/useLogActivityData";
import router from "next/router";
import { ActivePageKey } from "@/constants";

export default function Home() {
  const { user } = useCurrentUser();
  const isAdmin = user.isAdmin;
  const activeKey: ActivePageKey = ActivePageKey.SalesOverview;
  const { logActivityData } = useLogActivityData();

  useEffect(() => {
    if (user && user.isAuthenticated) {
      if (!user.isAdmin) {
        router.push('/logout/');
      } else {
        document.title = "Client Portal - Sales Overview";
        logActivityData(UserActivityType.AccessSalesOverView);
      }      
    }    
  }, [user, logActivityData]);

  const onSelectTab = (eventKey: string | undefined) => {
    const key: ActivePageKey = eventKey ? parseInt(eventKey) : activeKey;
    switch (key) {
      case ActivePageKey.Reports:
        router.push('/reports/');
        break;
      case ActivePageKey.Admin:
        router.push('/admin/');
        break;
      case ActivePageKey.Dashboard:
        router.push('/dashboard/');
        break;
      default:
        break;
    }
  };

  const notAdmin = !user || !user.isAuthenticated || !user.isAdmin;

  return (
    <>
      <CheckAuth />
      <NavBar hidden={notAdmin} />
      <Container fluid hidden={notAdmin} className="vipContainer">
          <Tabs defaultActiveKey={activeKey.toString()} onSelect={onSelectTab} className="admin-tabs">
            <Tabs.Tab eventKey={ActivePageKey.Dashboard.toString()} title="HOME">
            </Tabs.Tab>
            <Tabs.Tab eventKey={ActivePageKey.SalesOverview.toString()} title="SALES OVERVIEW">
              <AdminBar />   
              <CurrentEvents />
            </Tabs.Tab>
            <Tabs.Tab eventKey={ActivePageKey.Admin.toString()} title="ADMIN">
            </Tabs.Tab>
            <Tabs.Tab eventKey={ActivePageKey.Reports.toString()} title="REPORTS">
            </Tabs.Tab>
          </Tabs>
      </Container>
    </>
  );
}
