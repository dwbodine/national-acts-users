import { useGetActivityData } from "@/hooks/useGetActivityData";
import { setCurrentLogins, setReloadActivities } from "@/lib/dashboardSelectionSlice";
import { RootState } from "@/lib/store";
import { GetActivityResponse, UserActivity, UserActivityType } from "@/types/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";

export default function UserActivityWidget() {
    const { getActivityData } = useGetActivityData();
    const dispatch = useDispatch();
    const currentDashboardSelection = useSelector((state: RootState) => state.dashboardSelecton);

    useEffect(() => {
        if (currentDashboardSelection.reloadActivities) {
            dispatch(
                setReloadActivities(false)
            );
            getActivityData(currentDashboardSelection.start, currentDashboardSelection.end, undefined, undefined, currentDashboardSelection.filterAdmins)
                .then((response: GetActivityResponse) => {
                    if (!response.logActivityError && response.activities) {
                        const logins = response.activities.filter(x => x.activityType == UserActivityType.Login);
                        const uniqueLogins = logins.reduce<UserActivity[]>((result, obj) => {
                            const username = obj.username ?? '';
                            if (!result.find(x => x.username == username)) {
                                result.push(obj);
                            }
                            return result;
                        }, []);
                        dispatch(
                            setCurrentLogins(uniqueLogins.length)
                        );
                    }                    
                });
        }
    }, [currentDashboardSelection, getActivityData, dispatch]);

    return (       
        <div> Unique user logins: {currentDashboardSelection.currentLogins ?? 0} </div>
    );
    
}