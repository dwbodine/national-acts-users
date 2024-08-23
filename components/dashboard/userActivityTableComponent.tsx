import { useGetActivityData } from "@/hooks/useGetActivityData";
import { resetDashboard, setFilterAdmins, setReloadActivities } from "@/lib/dashboardSelectionSlice";
import { RootState } from "@/lib/store";
import { GetActivityResponse, UserActivity } from "@/types/user";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "rsuite";
import ResetButton from "../common/resetButtonComponent";
import moment from "moment";
import { Col, FormCheck, Row } from "react-bootstrap";

export default function UserActivityTable() {
    const { getActivityData } = useGetActivityData();
    const dispatch = useDispatch();
    const currentDashboardSelection = useSelector((state: RootState) => state.dashboardSelecton);
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const { Column, HeaderCell, Cell } = Table;

    const onResetClick = () => {
        dispatch(
            resetDashboard()
        );
    };

    const onFilterClick = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilterAdmins(event.target.checked));
    }

    useEffect(() => {
        if (currentDashboardSelection.reloadActivities) {
            getActivityData(currentDashboardSelection.start, currentDashboardSelection.end, undefined, undefined, currentDashboardSelection.filterAdmins)
                .then((response: GetActivityResponse) => {
                    if (!response.logActivityError && response.activities) {
                        setActivities(response.activities);
                    }
                    dispatch(
                        setReloadActivities(false)
                    );
                });
        }
    }, [currentDashboardSelection, getActivityData, dispatch]);

    return (       
        <>
            <Row>
                <Col>
                    <h2>Current user activity</h2>
                </Col>
            </Row>
            <Row className="admin-filter-row">
                <Col xs={3} sm={3} md={2} lg={1}>
                    <ResetButton IsDisabled={false} OnResetClick={onResetClick} />
                </Col>
                <Col xs={9} sm={9} md={10} lg={11}>
                    <FormCheck checked={currentDashboardSelection.filterAdmins} onChange={onFilterClick} label="Filter out admins?" /> 
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table height={420} data={activities} bordered cellBordered>
                        <Column flexGrow={4}>
                            <HeaderCell>Time</HeaderCell>
                            <Cell>{rowData => moment(rowData.activityTime).format('MM/DD/YYYY hh:mm:ss A') }</Cell>
                        </Column>
                        <Column flexGrow={4}>
                            <HeaderCell>User</HeaderCell>
                            <Cell dataKey="username"></Cell>
                        </Column>
                        <Column flexGrow={4}>
                            <HeaderCell>Activity</HeaderCell>
                            <Cell dataKey="activityName"></Cell>
                        </Column>
                    </Table>         
                </Col>
            </Row>       
        </> 
    );
    
}