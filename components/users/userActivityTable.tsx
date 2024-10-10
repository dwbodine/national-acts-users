import { useGetActivityData } from "@/hooks/user/useGetActivityData";
import { setCurrentActivities, setFilterAdmins, setReloadActivities } from "@/lib/userActivitySelectionSlice";
import { RootState } from "@/lib/store";
import { GetActivityResponse, UserActivity } from "@/types/user";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "rsuite";
import moment from "moment";
import { Col, Container, FormCheck, Row } from "react-bootstrap";
import { CirclesWithBar } from "react-loader-spinner";
import { setIsLoading } from "@/lib/globalSelectionSlice";

export default function UserActivityTable() {
    const { getActivityData } = useGetActivityData();
    const dispatch = useDispatch();
    const currentUserActivitySelection = useSelector((state: RootState) => state.userActivitySelection);
    const { Column, HeaderCell, Cell } = Table;
    const [tableLoading, setTableLoading] = useState(true);

    const onFilterClick = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilterAdmins(event.target.checked));
    }

    useEffect(() => {
        if (currentUserActivitySelection.reloadActivities) {
            setTableLoading(true);
            dispatch(
                setIsLoading(true)
            );
            getActivityData(currentUserActivitySelection.start, currentUserActivitySelection.end, undefined, undefined, currentUserActivitySelection.filterAdmins)
                .then((response: GetActivityResponse) => {
                    if (!response.logActivityError && response.activities) {
                        dispatch(
                            setCurrentActivities(response.activities)
                        );
                    }
                    dispatch(
                        setReloadActivities(false)
                    );
                    dispatch(
                        setIsLoading(false)
                    );
                    setTableLoading(false);
                });
        } else if (tableLoading) {
            dispatch(
                setIsLoading(false)
            );
            setTimeout(() => {
                setTableLoading(false);
            }, 300);
        }
    }, [currentUserActivitySelection, getActivityData, dispatch, tableLoading]);

    return (     
        <div className="admin-container">
            <Container fluid>
                <Row>
                    <Col>
                        <h3>Current user activity</h3>
                    </Col>
                </Row>
                <Row className="admin-filter-row">
                    <Col>
                        <FormCheck checked={currentUserActivitySelection.filterAdmins} onChange={onFilterClick} label="Filter out admins?" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table height={500} data={currentUserActivitySelection.currentActivities} bordered cellBordered loading={tableLoading}>
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
            </Container>
        </div>  
    );
    
}