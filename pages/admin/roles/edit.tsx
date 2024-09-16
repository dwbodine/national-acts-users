import Container from 'react-bootstrap/Container';
import CheckAuth from "../../../components/common/checkAuthComponent";
import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { Tabs } from "rsuite";
import NavBar from "../../../components/common/navBarComponent";
import { useEffect } from "react";
import { UserActivityType } from "@/types/user";
import { useLogActivityData } from "@/hooks/common/useLogActivityData";
import router from 'next/router';
import { ActivePageKey } from '@/constants';
import AdminRoleEdit from '../../../components/admin/roles/adminRoleEditComponent';

export default function AdminRolesEdit() {
  const { user } = useCurrentUser();
  const activeKey = ActivePageKey.Admin;
  const { logActivityData } = useLogActivityData();

  useEffect(() => {
    if (user && user.isAuthenticated) {
      if (!user.isAdmin) {
        router.push('/logout/');
      } else {
        document.title = "Client Portal - Admin";
        logActivityData(UserActivityType.AccessAdmin);
      }      
    }    
  }, [user, logActivityData]);

  const onSelectTab = (eventKey: string | undefined) => {
    const key: ActivePageKey = eventKey ? parseInt(eventKey) : activeKey;
    switch (key) {
      case ActivePageKey.Reports:
        router.push('/reports/');
        break;
      case ActivePageKey.SalesOverview:
        router.push('/sellers/');
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
            </Tabs.Tab>
            <Tabs.Tab eventKey={ActivePageKey.Admin.toString()} title="ADMIN">
              <AdminRoleEdit />
            </Tabs.Tab>
            <Tabs.Tab eventKey={ActivePageKey.Reports.toString()} title="REPORTS">
            </Tabs.Tab>
          </Tabs>
      </Container>
    </>
  );
}
