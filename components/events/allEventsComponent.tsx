import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import { setAdminEvents, setReloadAdminEvents, setExpandedRows } from '@/lib/adminEventsSelectionSlice';
import { VipEvent } from '@/types/event';
import { useEffect } from 'react';
import moment from 'moment';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import router from 'next/router';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useGetAllEvents } from '@/hooks/event/useGetAllEvents';
import { IconButton } from 'rsuite';
import WeekView from './calendar/weekViewComponent';
import { Table } from 'rsuite';
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';

export default function AllEvents() {
  const { Column, HeaderCell, Cell } = Table;
  const rowKey = 'ticketSocketEventId';
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const isLoading = globalSelection.isLoading;
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const { getAllEvents } = useGetAllEvents();
  const dispatch = useDispatch();
  const expandedRowKeys = currentReportSelection.expandedRows ?? [];
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const { getLocation } = useGetLocation();
  const { getEventStatusSlug, getEventStatusText } = useGetEventStatus();

  let vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;

  const ExpandCell = (props: any) => (
    <Cell {...props} style={{ padding: 5 }}>
      <IconButton
        appearance="subtle"
        onClick={() => {
          if (props.onChange != undefined) {
            props.onChange(props.rowData);
          }
        }}
        icon={
          expandedRowKeys.some(key => key === props.rowData[rowKey]) ? (
            <CollaspedOutlineIcon />
          ) : (
            <ExpandOutlineIcon />
          )
        }
      />
    </Cell>
  );

  const renderRowExpanded = (rowData: VipEvent | undefined) => {
    return (
      <div className="expanded-event-row">
        <p>{rowData?.title}</p>
      </div>
    );
  };

  const handleExpanded = (rowData: VipEvent | undefined) => {
    let open = false;
    const nextExpandedRowKeys = [];

    expandedRowKeys.forEach(key => {
      if (rowData && key === rowData[rowKey]) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });

    if (!open && rowData) {
      nextExpandedRowKeys.push(rowData[rowKey]);
    }

    dispatch(
      setExpandedRows(nextExpandedRowKeys)
    );
  };


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentReportSelection.reloadEvents) {
        dispatch(setReloadAdminEvents(false));
        dispatch(setIsLoading(true));
        getAllEvents(currentReportSelection?.start ?? 0, currentReportSelection?.end ?? 0).then((response) => {
          if (!response.eventError && response.events) {
            dispatch(setAdminEvents(response.events));
          } else if (response.statusCode == 401 || response.statusCode == 422) {
            router.push('/logout/');
          } else {
            dispatch(setAdminEvents([]));
          }
          dispatch(setIsLoading(false));
        });
      }
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    currentReportSelection,
    dispatch,
    getAllEvents,
    windowSizeJson,
    isLoading
  ]);

  const startOfWeek = currentReportSelection.start ? moment.unix(currentReportSelection.start).format('YYYY-MM-DD') : undefined;

  return (
    <>
      <Row>
        <WeekView StartOfWeek={startOfWeek} Events={vipEvents} />
      </Row>
      <Row>
        <Col>
          <Table
            shouldUpdateScroll={false} // Prevent the scrollbar from scrolling to the top after the table content area height changes.
            autoHeight={true}
            data={vipEvents}
            rowKey={rowKey}
            expandedRowKeys={expandedRowKeys}
            rowExpandedHeight={260}
            renderRowExpanded={renderRowExpanded}
            rowClassName={(rowData: VipEvent) => {
              return getEventStatusSlug(rowData);
            }}
          >
            <Column flexGrow={1} minWidth={100}>
              <HeaderCell>Date</HeaderCell>
              <Cell>
                {(rowData: VipEvent) => moment(rowData.eventDate).format('MM/DD/YYYY')}
              </Cell>
            </Column>
            <Column flexGrow={3}>
              <HeaderCell>Title</HeaderCell>
              <Cell>{(rowData: VipEvent) => rowData.title}</Cell>
            </Column>
            <Column flexGrow={2}>
              <HeaderCell>Venue</HeaderCell>
              <Cell>
                {(rowData: VipEvent) => (rowData.venue ? rowData.venue.name : '')}
              </Cell>
            </Column>
            <Column flexGrow={3}>
              <HeaderCell>Location</HeaderCell>
              <Cell>
                {(rowData: VipEvent) => (rowData.venue ? getLocation(rowData.venue) : '')}
              </Cell>
            </Column>
            <Column flexGrow={2}>
              <HeaderCell>Event Status</HeaderCell>
              <Cell>
                {(rowData: VipEvent) => getEventStatusText(rowData as VipEvent)}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Tickets sold</HeaderCell>
              <Cell>{(rowData: VipEvent) => rowData.totalTickets}</Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Revenue</HeaderCell>
              <Cell>{(rowData: VipEvent) => rowData.totalRevenue?.toFixed(2)}</Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Service Fees</HeaderCell>
              <Cell>{(rowData: VipEvent) => rowData.totalServiceFees?.toFixed(2)}</Cell>
            </Column>
            <Column width={70} align="center">
              <HeaderCell>&nbsp;</HeaderCell>
              <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} rowData={undefined} />
            </Column>
          </Table>
        </Col>
      </Row>
    </>
  );
}
