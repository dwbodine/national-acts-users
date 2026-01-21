'use client';

import { ReactElement } from 'react';
import { Col, Row } from 'rsuite';

import TwoColumnStatRow from '@/components/common/widgets/TwoColumnStatRow';
import { TopSellersWidgetProps } from '@/types/props';

export default function TopSellersWidget(props: TopSellersWidgetProps) {
  const topSellers = props.TopSellers;
  const dateRange = props.DateRange;

  const sellerRows: ReactElement[] = [];
  if (topSellers && topSellers.length > 0) {
    topSellers.forEach((seller, i) => {
      const key = `topSeller${i}`;
      const label = `${i + 1}. ${seller.sellerName}`;
      sellerRows.push(
        <TwoColumnStatRow key={key} label={label} value={seller.revenueUsd} isCurrency />,
      );
    });
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title-no-margin">Top {topSellers?.length} Sellers</Col>
        </Row>
        <Row hidden={!dateRange}>
          <Col className="sales-stat-block-subtitle-no-margin">({dateRange})</Col>
        </Row>
        {sellerRows}
      </Col>
    </Row>
  );
}
