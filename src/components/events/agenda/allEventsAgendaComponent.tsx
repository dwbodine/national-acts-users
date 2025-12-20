'use client';

import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'rsuite';

import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { VipEvent } from '@/types/event';
import setFocusToControl from '@/utils/setFocusToControl';

import AgendaView from './agendaViewComponent';

export default function AllEventsAgenda() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const [vipEvents, setVipEvents] = useState<VipEvent[] | undefined>(undefined);

  useEffect(() => {
    if (
      currentReportSelection.currentEvents !== undefined &&
      currentReportSelection.notes !== undefined
    ) {
      setVipEvents(currentReportSelection.currentEvents);
      dispatch(setIsLoading(false));
      if (currentReportSelection.focusControl && currentReportSelection.focusControl !== '') {
        const { focusControl } = currentReportSelection;
        setTimeout(() => {
          setFocusToControl(focusControl);
        }, 50);
      }
    }
  }, [dispatch, currentReportSelection]);

  const startOfMonth = currentReportSelection.start
    ? moment.unix(currentReportSelection.start)
    : undefined;
  const endOfMonth = currentReportSelection.end
    ? moment.unix(currentReportSelection.end)
    : undefined;

  return vipEvents === undefined ? (
    <Row>
      <Col xs={24}>No data returned</Col>
    </Row>
  ) : (
    <Row>
      <Col xs={24}>
        <AgendaView
          StartOfMonth={startOfMonth?.format('MM/DD/YYYY')}
          EndOfMonth={endOfMonth?.format('MM/DD/YYYY')}
          Events={vipEvents}
          Notes={currentReportSelection?.notes}
        />
      </Col>
    </Row>
  );
}
