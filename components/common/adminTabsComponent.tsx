import { ActivePageKey } from "@/constants";
import { setReloadAdminEvents } from "@/lib/adminEventsSelectionSlice";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { setReloadEvents } from "@/lib/reportSelectionSlice";
import { AdminTabsProps } from "@/types/props";
import router from "next/router";
import { Col, Container, Row } from "react-bootstrap";
import { CirclesWithBar } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { Tabs } from "rsuite";


export default function AdminTabs(props: AdminTabsProps) {
    const activeKey = props.ActiveKey;
    const isLoading = props.IsLoading;
    const notAdmin = props.NotAdmin;
    const dispatch = useDispatch();

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

    return (
        <>
            <Row>
                <Col>
                    <Tabs
                        hidden={notAdmin}
                        defaultActiveKey={activeKey.toString()}
                        onSelect={onSelectTab}
                        className="admin-tabs"
                    >
                        <Tabs.Tab eventKey={ActivePageKey.Dashboard.toString()} title="HOME">
                            {activeKey == ActivePageKey.Dashboard && (
                                <>
                                    <Container fluid hidden={!isLoading || !props.DashboardComponent}>
                                        <Row>
                                            <Col className="spinner-container">
                                                <CirclesWithBar height="100" width="100" color="#d12610" />
                                            </Col>
                                        </Row>
                                    </Container>
                                    <Container
                                        className="tab-container"
                                        fluid
                                        hidden={isLoading || !props.DashboardComponent}
                                    >
                                        {props.DashboardComponent}
                                    </Container>
                                </>
                            )}
                        </Tabs.Tab>
                        <Tabs.Tab eventKey={ActivePageKey.Events.toString()} title="EVENTS">
                            {activeKey == ActivePageKey.Events && (
                                <>
                                    <Container fluid hidden={!isLoading || !props.EventsComponent}>
                                        <Row>
                                            <Col className="spinner-container">
                                                <CirclesWithBar height="100" width="100" color="#d12610" />
                                            </Col>
                                        </Row>
                                    </Container>
                                    <Container
                                        className="tab-container"
                                        fluid
                                        hidden={isLoading || !props.EventsComponent}
                                    >
                                        {props.EventsComponent}
                                    </Container>
                                </>
                            )}
                        </Tabs.Tab>
                        <Tabs.Tab
                            eventKey={ActivePageKey.SalesOverview.toString()}
                            title="SALES OVERVIEW"
                        >
                            {activeKey == ActivePageKey.SalesOverview && (
                                <>
                                    <Container fluid hidden={!isLoading || !props.SalesComponent}>
                                        <Row>
                                            <Col className="spinner-container">
                                                <CirclesWithBar height="100" width="100" color="#d12610" />
                                            </Col>
                                        </Row>
                                    </Container>
                                    <Container
                                        className="tab-container"
                                        fluid
                                        hidden={isLoading || !props.SalesComponent}
                                    >
                                        {props.SalesComponent}
                                    </Container>
                                </>
                            )}
                        </Tabs.Tab>
                        <Tabs.Tab eventKey={ActivePageKey.Admin.toString()} title="ADMIN">
                            {activeKey == ActivePageKey.Admin && (
                                <>
                                    <Container fluid hidden={!isLoading || !props.AdminComponent}>
                                        <Row>
                                            <Col className="spinner-container">
                                                <CirclesWithBar height="100" width="100" color="#d12610" />
                                            </Col>
                                        </Row>
                                    </Container>
                                    <Container
                                        className="tab-container"
                                        fluid
                                        hidden={isLoading || !props.AdminComponent}
                                    >
                                        {props.AdminComponent}
                                    </Container>
                                </>
                            )}
                        </Tabs.Tab>
                        <Tabs.Tab eventKey={ActivePageKey.Reports.toString()} title="REPORTS">
                            {activeKey == ActivePageKey.Reports && (
                                <>
                                    <Container fluid hidden={!isLoading || !props.ReportComponent}>
                                        <Row>
                                            <Col className="spinner-container">
                                                <CirclesWithBar height="100" width="100" color="#d12610" />
                                            </Col>
                                        </Row>
                                    </Container>
                                    <Container
                                        className="tab-container"
                                        fluid
                                        hidden={isLoading || !props.ReportComponent}
                                    >
                                        {props.ReportComponent}
                                    </Container>
                                </>
                            )}
                        </Tabs.Tab>
                        <Tabs.Tab eventKey={ActivePageKey.Users.toString()} title="USERS">
                            {activeKey == ActivePageKey.Users && (
                                <>
                                    <Container fluid hidden={!isLoading || !props.UsersComponent}>
                                        <Row>
                                            <Col className="spinner-container">
                                                <CirclesWithBar height="100" width="100" color="#d12610" />
                                            </Col>
                                        </Row>
                                    </Container>
                                    <Container
                                        className="tab-container"
                                        fluid
                                        hidden={isLoading || !props.UsersComponent}
                                    >
                                        {props.UsersComponent}
                                    </Container>
                                </>
                            )}
                        </Tabs.Tab>
                    </Tabs>
                </Col>
            </Row>
        </>
    )
}