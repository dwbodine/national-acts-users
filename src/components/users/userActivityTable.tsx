'use client';

import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Col, Container, Row, Table } from 'rsuite';

import { useGetActivityData } from '@/hooks/user/useGetActivityData';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import {
  setCurrentActivities,
  setFilterAdmins,
  setReloadActivities,
  setUserActivityDateRange,
} from '@/lib/userActivitySelectionSlice';
import { GetActivityResponse } from '@/types/responses';
import { UserActivity } from '@/types/user';

export default function UserActivityTable() {
  const { getActivityData } = useGetActivityData();
  const dispatch = useDispatch();
  const currentUserActivitySelection = useSelector(
    (state: RootState) => state.userActivitySelection,
  );
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);

  const onFilterClick = (checked: boolean) => {
    dispatch(setFilterAdmins(checked));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        currentUserActivitySelection.start === undefined ||
        currentUserActivitySelection.end === undefined
      ) {
        const userActivitySelection = { ...currentUserActivitySelection };
        userActivitySelection.start = moment().startOf('month').unix();
        userActivitySelection.end = moment().endOf('day').unix();
        dispatch(setUserActivityDateRange(userActivitySelection));
      } else if (
        currentUserActivitySelection.start &&
        currentUserActivitySelection.end &&
        currentUserActivitySelection.reloadActivities
      ) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getActivityData(
          currentUserActivitySelection.start,
          currentUserActivitySelection.end,
          undefined,
          undefined,
          currentUserActivitySelection.filterAdmins,
        ).then((response: GetActivityResponse) => {
          if (!response.error && response.activities) {
            dispatch(setCurrentActivities(response.activities));
          }
          dispatch(setReloadActivities(false));
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (tableLoading) {
        dispatch(setIsLoading(false));
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentUserActivitySelection, getActivityData, dispatch, tableLoading]);

  return (
    <div className="admin-container">
      <Container className="fluid">
        <Row className="admin-filter-row">
          <Col>
            <Checkbox
              checked={currentUserActivitySelection.filterAdmins}
              onChange={(_, checked) => onFilterClick(checked)}
            >
              Filter out admins?
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              height={500}
              data={currentUserActivitySelection.currentActivities}
              bordered
              cellBordered
              loading={tableLoading}
            >
              <Column flexGrow={4}>
                <HeaderCell>Time</HeaderCell>
                <Cell>
                  {(rowData: UserActivity) =>
                    moment(rowData.timestamp).format('MM/DD/YYYY hh:mm:ss A')
                  }
                </Cell>
              </Column>
              <Column flexGrow={4}>
                <HeaderCell>User</HeaderCell>
                <Cell dataKey="fullName"></Cell>
              </Column>
              <Column flexGrow={4}>
                <HeaderCell>Email</HeaderCell>
                <Cell dataKey="username"></Cell>
              </Column>
              <Column flexGrow={4}>
                <HeaderCell>Seller</HeaderCell>
                <Cell dataKey="sellerName"></Cell>
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
