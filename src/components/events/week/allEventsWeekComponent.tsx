"use client";

import { Col, Row } from 'react-bootstrap';
import { IconButton, Table } from 'rsuite';
import { Note, VipEvent } from '@/types/event';
import { getEventStatusSlug, getEventStatusText } from '@/utils/eventUtils';
import { setExpandedEvent, setExpandedRow, setFocusControl } from '@/lib/adminEventsSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import EventDataExpanded from '../../common/eventDataExpandedComponent';
import { ExpandCellProps } from '@/types/props';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import type { RootState } from '@/lib/store';
import WeekView from './weekViewComponent';
import moment from 'moment';
import setFocusToControl from '@/utils/setFocusToControl';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useWindowSize } from '@/hooks/common/useWindowSize';

export default function AllEventsWeek() {
  const { Column, HeaderCell, Cell } = Table;
  const rowKey = 'ticketSocketEventId';
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const dispatch = useDispatch();
  const expandedRowKey = currentReportSelection.expandedRow ?? undefined;
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const { getLocation } = useGetLocation();

  const [vipEvents, setVipEvents] = useState<VipEvent[] | undefined>(undefined);
  const [notes, setNotes] = useState<Note[] | undefined>(undefined);

  const handleExpanded = (rowData: VipEvent | undefined) => {
    if (!rowData) {
      return;
    }

    let newExpandedRowKey = expandedRowKey;
    let newExpandedEvent: VipEvent | undefined = rowData;
    let focusControlId = '';
    if (newExpandedRowKey === rowData[rowKey]) {
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

    if (focusControlId === '') {
      window.scrollTo({ behavior: 'smooth', left: 0, top: 0 });
    }
  };

  const ExpandCell = (props: ExpandCellProps) => (
    <Cell {...props} style={{ padding: 5 }}>
      <IconButton
        appearance="subtle"
        onClick={() => handleExpanded(props.rowData)}
        icon={
          (expandedRowKey === props.rowData?.externalEventId) ? (
            <CollaspedOutlineIcon />
          ) : (
            <ExpandOutlineIcon />
          )
        }
      />
    </Cell>
  );

  const renderRowExpanded = () => <EventDataExpanded />

  useEffect(() => {
    if (currentReportSelection.currentEvents !== undefined && currentReportSelection.notes !== undefined) {
      setVipEvents(currentReportSelection.currentEvents);
      setNotes(currentReportSelection.notes);
      dispatch(
        setIsLoading(false)
      );
      if (
        currentReportSelection.focusControl &&
        currentReportSelection.focusControl !== ''
      ) {
        const { focusControl } = currentReportSelection;
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

  const startOfWeek = currentReportSelection.start ? moment.unix(currentReportSelection.start) : undefined;

  return (
    (vipEvents === undefined) ?
      <Row>
        <Col>No data returned</Col>
      </Row> :
      <>
        <Row>
          <WeekView StartOfWeek={startOfWeek?.format('MM/DD/YYYY')} Events={vipEvents} Notes={notes} />
        </Row>
        <Row>
          <Col>
            <Table
              // Prevent the scrollbar from scrolling to the top after the table content area height changes.
              shouldUpdateScroll={false}
              autoHeight={true}
              data={vipEvents}
              rowKey={rowKey}
              expandedRowKeys={expandedRowKey ? [expandedRowKey] : []}
              rowExpandedHeight={260}
              renderRowExpanded={renderRowExpanded}
              rowClassName={(evt: VipEvent) => {
                if (evt && evt.externalEventId === expandedRowKey) {
                  handleExpanded(evt);
                  return 'highlighted';
                } else if (evt) {
                  return getEventStatusSlug(evt);
                }
                return '';
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
                <ExpandCell dataKey="id" expandedrowkeys={expandedRowKey ? [expandedRowKey] : []} rowData={undefined} />
              </Column>
            </Table>
          </Col>
        </Row>
      </>
  );
}
