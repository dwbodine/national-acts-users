'use client';

import { Col, Row } from 'rsuite';
import { MonthWeekProps } from '@/types/props';

export default function MonthWeek(props: MonthWeekProps) {
  const weekDays = props.WeekDays;

  return (
    <Row>
      {weekDays?.map((weekDay, i) => (
        <Col className="month-day" key={i}>
          {weekDay}
        </Col>
      ))}
    </Row>
  );
}
