'use client';

import moment from 'moment';
import { useEffect, useState } from 'react';
import { Col, DatePicker, Row } from 'rsuite';

import { MINIMUM_UNIX_TIMESTAMP } from '@/constants';
import { ReportDatePickerProps } from '@/types/props';

export default function ReportDatePicker(props: ReportDatePickerProps) {
  const labelColWidth = props.LabelColumnWidth ?? 2;
  const onChange = props.OnChange;
  const onStartClear = props.OnStartClear;
  const onEndClear = props.OnEndClear;
  const isDisabled = props.Disabled ?? false;
  const [start, setStart] = useState<number | undefined>();
  const [end, setEnd] = useState<number | undefined>();

  useEffect(() => {
    setStart(props.Start);
    setEnd(props.End);
  }, [props.Start, props.End]);

  const onStartChange = (date: Date | null) => {
    if (!date) {
      return;
    }
    const startDate = moment(date).startOf('day');
    let newStart = startDate.unix();
    if (newStart < MINIMUM_UNIX_TIMESTAMP) {
      newStart = MINIMUM_UNIX_TIMESTAMP;
    }

    setStart(newStart);
    if (onChange && end && newStart <= end) {
      onChange(newStart, end);
    }
  };

  const onEndChange = (date: Date | null) => {
    if (!date) {
      return;
    }
    const endDate = moment(date).endOf('day');
    let newEnd = endDate.unix();
    if (newEnd < MINIMUM_UNIX_TIMESTAMP) {
      newEnd = MINIMUM_UNIX_TIMESTAMP;
    }
    setEnd(newEnd);
    if (onChange && start && start <= newEnd) {
      onChange(start, newEnd);
    }
  };

  const onCleanStart = () => {
    setStart(undefined);
    if (onStartClear) {
      onStartClear();
    }
  };

  const onCleanEnd = () => {
    setEnd(undefined);
    if (onEndClear) {
      onEndClear();
    }
  };

  const startDate = start ? moment.unix(start).toDate() : null;
  const endDate = end ? moment.unix(end).toDate() : null;

  return (
    <>
      <Row className="admin-select">
        <Col xs={labelColWidth}>
          <span className="admin-report-datepicker-label">Start date:</span>
        </Col>
        <Col>
          <DatePicker
            id="startDate"
            format="M/d/yyyy"
            onSelect={onStartChange}
            value={startDate}
            oneTap
            cleanable
            onClean={onCleanStart}
            disabled={isDisabled}
          />
        </Col>
      </Row>
      <Row className="admin-select">
        <Col xs={labelColWidth}>
          <span className="admin-report-datepicker-label">End date:</span>
        </Col>
        <Col>
          <DatePicker
            id="endDate"
            format="M/d/yyyy"
            onSelect={onEndChange}
            value={endDate}
            oneTap
            cleanable
            onClean={onCleanEnd}
            disabled={isDisabled}
          />
        </Col>
      </Row>
    </>
  );
}
