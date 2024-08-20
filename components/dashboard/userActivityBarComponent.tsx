import { useGetActivityData } from "@/hooks/useGetActivityData";
import { setReloadActivities } from "@/lib/dashboardSelectionSlice";
import { RootState } from "@/lib/store";
import { GetActivityResponse, UserActivity } from "@/types/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "rsuite";
import ResetButton from "../common/resetButtonComponent";

export default function UserActivityTable() {
    const { getActivityData } = useGetActivityData();
    const dispatch = useDispatch();
    const currentDashboardSelection = useSelector((state: RootState) => state.dashboardSelecton);
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const { Column, HeaderCell, Cell } = Table;

    const onResetClick = () => {
        dispatch(
            setReloadActivities(true)
        );
    };

    useEffect(() => {
        if (currentDashboardSelection.reloadActivities) {
            getActivityData(currentDashboardSelection.start, currentDashboardSelection.end)
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
            <h2>Current user activity</h2>
            <ResetButton IsDisabled={false} OnResetClick={onResetClick} />
            <Table height={420} data={activities} bordered cellBordered>
                <Column flexGrow={4}>
                    <HeaderCell>Time</HeaderCell>
                    <Cell dataKey="activityTime"></Cell>
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
        </> 
    );
    
}