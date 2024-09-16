import Container from 'react-bootstrap/Container';
import CheckAuth from "../../components/common/checkAuthComponent";
import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { Tabs } from "rsuite";
import NavBar from "../../components/common/navBarComponent";
import { useEffect } from "react";
import { UserActivityType } from "@/types/user";
import { useLogActivityData } from "@/hooks/common/useLogActivityData";
import router from 'next/router';
import { useDispatch } from 'react-redux';
import { setReloadActivities } from '@/lib/dashboardSelectionSlice';
import DashboardIndex from '../../components/dashboard/dashboardIndexComponent';
import { ActivePageKey } from '@/constants';

export default function Dashboard() {
  const { user } = useCurrentUser();
  const dispatch = useDispatch();
  const activeKey = ActivePageKey.Dashboard;
  const { logActivityData } = useLogActivityData();

  useEffect(() => {
    if (user && user.isAuthenticated) {
      if (!user.isAdmin) {
        router.push('/logout/');
      } else {
        document.title = "Client Portal - Home";
        logActivityData(UserActivityType.AccessDashboard).then(() => {
          dispatch (
            setReloadActivities(true)
          );
        });
      }      
    }    
  }, [user, logActivityData, dispatch]);

  const onSelectTab = (eventKey: string | undefined) => {
    const key: ActivePageKey = eventKey ? parseInt(eventKey) : activeKey;
    switch (key) {
      case ActivePageKey.Reports:
        router.push('/reports/');
        break;
      case ActivePageKey.Admin:
        router.push('/admin/');
        break;
      case ActivePageKey.SalesOverview:
        router.push('/sellers/');
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
              <DashboardIndex />
            </Tabs.Tab>
            <Tabs.Tab eventKey={ActivePageKey.SalesOverview.toString()} title="SALES OVERVIEW">
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
