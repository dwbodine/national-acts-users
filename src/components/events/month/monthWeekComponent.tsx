'use client';

import { Row } from 'rsuite';

import { MonthWeekProps } from '@/types/props';

export default function MonthWeek(props: MonthWeekProps) {
  const weekDays = props.WeekDays;

  return (
    <Row>
      <div className="month-week-grid">
        {weekDays?.map((weekDay, i) => (
          <div key={i} className="month-day">
            <div className="month-day-inner">{weekDay}</div>
          </div>
        ))}
      </div>
    </Row>
  );
}
