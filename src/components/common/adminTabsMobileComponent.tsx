"use client";

import { Button, ButtonGroup } from "rsuite";
import { Col, Container, Row } from "react-bootstrap";
import { ActivePageKey } from "@/constants";
import { AdminTabsProps } from "@/types/props";
import { RingLoader } from 'react-spinners';
import router from "next/router";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { setReloadAdminEvents } from "@/lib/adminEventsSelectionSlice";
import { setReloadEvents } from "@/lib/reportSelectionSlice";
import { useDispatch } from "react-redux";

export default function AdminTabsMobile(props: AdminTabsProps) {
  const activeKey = props.ActiveKey;
  const isLoading = props.IsLoading;
  const notAdmin = props.NotAdmin;
  const dispatch = useDispatch();

  const allTabsTop: ActivePageKey[] = [ActivePageKey.Dashboard, ActivePageKey.Events, ActivePageKey.SalesOverview];
  const allTabsBottom: ActivePageKey[] = [ActivePageKey.Admin, ActivePageKey.Reports, ActivePageKey.Users];

  const onSelectTab = (eventKey: string | number | undefined) => {
    let key: ActivePageKey = activeKey;
    if (eventKey !== undefined) {
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

  const getTabViewText = (key: ActivePageKey) => {
    switch (key) {
      case ActivePageKey.Dashboard:
        return "HOME";
        break;
      case ActivePageKey.Events:
        return "EVENTS";
        break;
      case ActivePageKey.Admin:
        return "ADMIN";
        break;
      case ActivePageKey.Reports:
        return "REPORTS";
        break;
      case ActivePageKey.Users:
        return "USERS";
        break;
      default:
        return "SALES OVERVIEW";
        break;
    }
  };

  const getActiveComponent = () => {
    switch (activeKey) {
      case ActivePageKey.Dashboard:
        return props.DashboardComponent;
        break;
      case ActivePageKey.Events:
        return props.EventsComponent;
        break;
      case ActivePageKey.Admin:
        return props.AdminComponent;
        break;
      case ActivePageKey.Reports:
        return props.ReportComponent;
        break;
      case ActivePageKey.Users:
        return props.UsersComponent;
        break;
      default:
        return props.SalesComponent;
        break;
    }
  };

  const activeComponent = getActiveComponent();

  return (
    <>
      <Row>
        <ButtonGroup
          hidden={notAdmin}
          justified
        >
          {allTabsTop.map(key => (
            <Button appearance="subtle" key={key} active={key.valueOf() === activeKey?.valueOf()} onClick={() => onSelectTab(key)}>
              {getTabViewText(key)}
            </Button>
          ))}
        </ButtonGroup>
        <ButtonGroup
          hidden={notAdmin}
          justified
        >
          {allTabsBottom.map(key => (
            <Button appearance="subtle" key={key} active={key.valueOf() === activeKey?.valueOf()} onClick={() => onSelectTab(key)}>
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