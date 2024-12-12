import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setFocusControl, setExpandedRow, setExpandedEvent } from '@/lib/adminEventsSelectionSlice';
import { VipEvent } from '@/types/event';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { IconButton } from 'rsuite';
import WeekView from './weekViewComponent';
import { Table } from 'rsuite';
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import setFocusToControl from '@/utils/setFocusToControl';
import EventDataExpanded from '../../common/eventDataExpandedComponent';
import { setIsLoading } from '@/lib/globalSelectionSlice';

export default function AllEventsWeek() {
  const { Column, HeaderCell, Cell } = Table;
  const rowKey = 'ticketSocketEventId';
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const dispatch = useDispatch();
  const expandedRowKey = currentReportSelection.expandedRow ?? undefined;
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const { getLocation } = useGetLocation();
  const { getEventStatusSlug, getEventStatusText } = useGetEventStatus();

  const [vipEvents, setVipEvents] = useState<VipEvent[] | undefined>(undefined);

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
          (expandedRowKey === props.rowData[rowKey]) ? (
            <CollaspedOutlineIcon />
          ) : (
            <ExpandOutlineIcon />
          )
        }
      />
    </Cell>
  );

  const renderRowExpanded = () => {
    return (
      <EventDataExpanded />
    );
  };

  const handleExpanded = (rowData: VipEvent | undefined) => {
    if (!rowData) {
      return;
    }

    let newExpandedRowKey = expandedRowKey;
    let newExpandedEvent: VipEvent | undefined = rowData;
    let focusControlId = '';
    if (expandedRowKey === rowData[rowKey]) {
      newExpandedRowKey = undefined;
      newExpandedEvent = undefined;
    } else {
      newExpandedRowKey = rowData[rowKey];
      focusControlId = `expandedRow_${newExpandedRowKey}`;
    }

    dispatch(
      setExpandedRow(newExpandedRowKey)
    );

    dispatch(
      setExpandedEvent(newExpandedEvent)
    );

    dispatch(
      setFocusControl(focusControlId)
    );

    if (focusControlId == '') {
      window.scrollTo({ behavior: 'smooth', top: 0, left: 0 });
    }
  };


  useEffect(() => {
    if (currentReportSelection.currentEvents != undefined) {
      setVipEvents(currentReportSelection.currentEvents);
      dispatch (
        setIsLoading(false)
      );
      if (
        currentReportSelection.focusControl &&
        currentReportSelection.focusControl != ''
      ) {
        const focusControl: string = currentReportSelection.focusControl;
        setTimeout(() => {
          setFocusToControl(focusControl);
        }, 50);
        dispatch(setFocusControl(''));
      }
    }
  }, [
    currentReportSelection,
    dispatch,
    windowSizeJson,
  ]);

  const startOfWeek = currentReportSelection.start ? moment.unix(currentReportSelection.start).format('YYYY-MM-DD') : undefined;

  return (
    (vipEvents != undefined) ?
    <>
      <Row>
        <WeekView StartOfWeek={startOfWeek} Events={vipEvents} Notes={currentReportSelection?.notes} />
      </Row>
      <Row>
        <Col>
          <Table
            shouldUpdateScroll={false} // Prevent the scrollbar from scrolling to the top after the table content area height changes.
            autoHeight={true}
            data={vipEvents}
            rowKey={rowKey}
            expandedRowKeys={expandedRowKey ? [expandedRowKey] : []}
            rowExpandedHeight={260}
            renderRowExpanded={renderRowExpanded}
            rowClassName={(rowData: VipEvent) => {
              return (rowData && rowData.ticketSocketEventId == expandedRowKey) ? 'highlighted' : getEventStatusSlug(rowData);
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
              <ExpandCell dataKey="id" expandedrowkeys={expandedRowKey ? [expandedRowKey] : []} onChange={handleExpanded} rowData={undefined} />
            </Column>
          </Table>
        </Col>
      </Row>
    </> : 
    <Row>
      <Col>No data returned</Col>
    </Row>
  );
}
