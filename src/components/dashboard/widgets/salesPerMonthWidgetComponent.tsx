'use client';

import moment from 'moment';
import { ReactElement } from 'react';
import { Col, Row } from 'rsuite';

import TwoColumnStatRow from '@/components/common/widgets/TwoColumnStatRow';
import { SalesPerMonthWidgetProps } from '@/types/props';

export default function SalesPerMonthWidget(props: SalesPerMonthWidgetProps) {
  const salesPerMonth = props.SalesPerMonth;
  const selectedYear = props.SelectedYear;

  const salesRows: ReactElement[] = [];
  const currentYear = selectedYear ? selectedYear : moment().year();

  if (salesPerMonth !== undefined) {
    for (let i = 0; i < 12; i += 1) {
      const monthName = moment([currentYear, i, 1]).format('MMMM');
      const monthVal = salesPerMonth.find((x) => x.key === i + 1)?.value ?? 0;
      const key = `salePerMonth${i}`;
      salesRows.push(<TwoColumnStatRow key={key} label={monthName} value={monthVal} isCurrency />);
    }
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">Sales Per Month {currentYear}</Col>
        </Row>
        {salesRows}
      </Col>
    </Row>
  );
}
