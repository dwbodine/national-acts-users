import { ActivePageKey } from "@/constants";
import { setReloadAdminEvents } from "@/lib/adminEventsSelectionSlice";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { setReloadEvents } from "@/lib/reportSelectionSlice";
import { AdminTabsProps } from "@/types/props";
import router from "next/router";
import { Col, Container, Row } from "react-bootstrap";
import { RingLoader } from 'react-spinners';
import { useDispatch } from "react-redux";
import { Button, ButtonGroup } from "rsuite";
import { JSX } from "react";


export default function AdminTabsMobile(props: AdminTabsProps) {
  const activeKey = props.ActiveKey;
  const isLoading = props.IsLoading;
  const notAdmin = props.NotAdmin;
  const dispatch = useDispatch();

  const allTabsTop: ActivePageKey[] = [ActivePageKey.Dashboard, ActivePageKey.Events, ActivePageKey.SalesOverview];
  const allTabsBottom: ActivePageKey[] = [ActivePageKey.Admin, ActivePageKey.Reports, ActivePageKey.Users];

  const onSelectTab = (eventKey: string | number | undefined) => {
    let key: ActivePageKey = activeKey;
    if (eventKey != undefined) {
      key = parseInt(eventKey as string);
    }
    dispatch(setIsLoading(true));
    switch (key) {
      case ActivePageKey.Dashboard:
        router.push('/dashboard/');
        break;
      case ActivePageKey.Admin:
        router.push('/admin/');
        break;
      case ActivePageKey.SalesOverview:
        dispatch(setIsLoading(true));
        dispatch(setReloadEvents(true));
        router.push('/sellers/');
        break;
      case ActivePageKey.Reports:
        router.push('/reports/');
        break;
      case ActivePageKey.Users:
        router.push('/users');
        break;
      case ActivePageKey.Events:
        dispatch(setReloadAdminEvents(true));
        router.push('/events/');
        break;
      default:
        break;
    }
  };

  let activeComponent: JSX.Element | undefined;
  switch (activeKey) {
    case ActivePageKey.Dashboard:
      activeComponent = props.DashboardComponent;
      break;
    case ActivePageKey.Events:
      activeComponent = props.EventsComponent;
      break;
    case ActivePageKey.Admin:
      activeComponent = props.AdminComponent;
      break;
    case ActivePageKey.Reports:
      activeComponent = props.ReportComponent;
      break;
    case ActivePageKey.Users:
      activeComponent = props.UsersComponent;
      break;
    default:
      activeComponent = props.SalesComponent;
      break;
  }

  const getTabViewText = (key: ActivePageKey) => {
    let text = '';
    switch (key) {
      case ActivePageKey.Dashboard:
        text = "HOME";
        break;
      case ActivePageKey.Events:
        text = "EVENTS";
        break;
      case ActivePageKey.Admin:
        text = "ADMIN";
        break;
      case ActivePageKey.Reports:
        text = "REPORTS";
        break;
      case ActivePageKey.Users:
        text = "USERS";
        break;
      default:
        text = "SALES OVERVIEW";
        break;
    }
    return text;
  };

  return (
    <>
      <Row>
        <ButtonGroup
          hidden={notAdmin}
          justified
        >
          {allTabsTop.map(key => (
            <Button appearance="subtle" key={key} active={key.valueOf() == activeKey?.valueOf()} onClick={() => onSelectTab(key)}>
              {getTabViewText(key)}
            </Button>
          ))}
        </ButtonGroup>
        <ButtonGroup
          hidden={notAdmin}
          justified
        >
          {allTabsBottom.map(key => (
            <Button appearance="subtle" key={key} active={key.valueOf() == activeKey?.valueOf()} onClick={() => onSelectTab(key)}>
              {getTabViewText(key)}
            </Button>
          ))}
        </ButtonGroup>
      </Row>
      <Row>
        <Col>
          <Container fluid hidden={!isLoading || !activeComponent}>
            <Row>
              <Col className="spinner-container">
                <RingLoader size={150} color="#d12610" />
              </Col>
            </Row>
          </Container>
          <Container
            className="tab-container"
            fluid
            hidden={isLoading || !activeComponent}
          >
            {activeComponent}
          </Container>
        </Col>
      </Row>
    </>
  )
}