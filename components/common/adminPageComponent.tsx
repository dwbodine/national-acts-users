import { ActivePageKey } from "@/constants";
import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import router from "next/router";
import { useEffect } from "react";
import { Tabs } from "rsuite";
import CheckAuth from "./checkAuthComponent";
import NavBar from "./navBarComponent";
import { Col, Container, Row } from "react-bootstrap";
import { useLogActivityData } from "@/hooks/common/useLogActivityData";
import { UserActivityType } from "@/types/user";
import { CirclesWithBar } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setIsLoading } from "@/lib/globalSelectionSlice";


export default function AdminPage(props: any) {
  const { user } = useCurrentUser();
  const dispatch = useDispatch();
  const { logActivityData } = useLogActivityData();
  const activeKey = props.activeKey as ActivePageKey;
  const title = props.title as string;
  const userActivity = props.userActivity as UserActivityType | undefined;
  const globalSettings = useSelector((state: RootState) => state.globalSelection);
  const isLoading = globalSettings.isLoading;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user && user.isAuthenticated) {
        if (!user.isAdmin) {
          router.push('/logout/');
        } else {
          document.title = title;
          if (userActivity) {
            logActivityData(userActivity);
          }
        }
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, title, logActivityData, userActivity, isLoading]);

  const onSelectTab = (eventKey: string | undefined) => {
    const key: ActivePageKey = eventKey ? parseInt(eventKey) : activeKey;
    dispatch(
      setIsLoading(true)
    );
    switch (key) {
      case ActivePageKey.Dashboard:
        router.push('/dashboard/');
        break;
      case ActivePageKey.Admin:
        router.push('/admin/');
        break;
      case ActivePageKey.SalesOverview:
        router.push('/sellers/');
        break;
      case ActivePageKey.Reports:
        router.push('/reports/');
        break;
      case ActivePageKey.Users:
        router.push('/users');
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
        <Tabs hidden={notAdmin} defaultActiveKey={activeKey.toString()} onSelect={onSelectTab} className="admin-tabs">
          <Tabs.Tab eventKey={ActivePageKey.Dashboard.toString()} title="HOME">
            <Container fluid hidden={!isLoading || !props.dashboardComponent}>
              <Row>
                <Col className="spinner-container">
                  <CirclesWithBar height="100" width="100" color="#d12610" />
                </Col>
              </Row>
            </Container>
            <Container className="tab-container" fluid hidden={isLoading || !props.dashboardComponent}>
              {props.dashboardComponent}
            </Container>
          </Tabs.Tab>
          <Tabs.Tab eventKey={ActivePageKey.SalesOverview.toString()} title="SALES OVERVIEW">
            <Container fluid hidden={!isLoading || !props.salesComponent}>
              <Row>
                <Col className="spinner-container">
                  <CirclesWithBar height="100" width="100" color="#d12610" />
                </Col>
              </Row>
            </Container>
            <Container className="tab-container" fluid hidden={isLoading || !props.salesComponent}>
              {props.salesComponent}
            </Container>
          </Tabs.Tab>
          <Tabs.Tab eventKey={ActivePageKey.Admin.toString()} title="ADMIN">
            <Container fluid hidden={!isLoading || !props.adminComponent}>
              <Row>
                <Col className="spinner-container">
                  <CirclesWithBar height="100" width="100" color="#d12610" />
                </Col>
              </Row>
            </Container>
            <Container className="tab-container" fluid hidden={isLoading || !props.adminComponent}>
              {props.adminComponent}
            </Container>
          </Tabs.Tab>
          <Tabs.Tab eventKey={ActivePageKey.Reports.toString()} title="REPORTS">
            <Container fluid hidden={!isLoading || !props.reportComponent}>
              <Row>
                <Col className="spinner-container">
                  <CirclesWithBar height="100" width="100" color="#d12610" />
                </Col>
              </Row>
            </Container>
            <Container className="tab-container" fluid hidden={isLoading || !props.reportComponent}>
              {props.reportComponent}
            </Container>
          </Tabs.Tab>
          <Tabs.Tab eventKey={ActivePageKey.Users.toString()} title="USERS">
            <Container fluid hidden={!isLoading || !props.usersComponent}>
              <Row>
                <Col className="spinner-container">
                  <CirclesWithBar height="100" width="100" color="#d12610" />
                </Col>
              </Row>
            </Container>
            <Container className="tab-container" fluid hidden={isLoading || !props.usersComponent}>
              {props.usersComponent}
            </Container>
          </Tabs.Tab>
        </Tabs>
      </Container>
    </>
  );
}