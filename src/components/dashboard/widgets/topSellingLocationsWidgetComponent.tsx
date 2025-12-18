'use client';

import { ReactElement } from 'react';
import { Col, Row } from 'rsuite';

import TwoColumnStatRow from '@/components/common/widgets/TwoColumnStatRow';
import { TopSellingLocationsWidgetProps } from '@/types/props';

export default function TopSellingLocationsWidget(props: TopSellingLocationsWidgetProps) {
  const topSellers = props.TopSellingLocations;
  const dateRange = props.DateRange;
  const title = props.Title;

  const sellerRows: ReactElement[] = [];
  if (topSellers && topSellers.length > 0) {
    topSellers.forEach((seller, i) => {
      const key = `top10${i}`;
      const label = `${i + 1}. ${seller.location}`;
      sellerRows.push(
        <TwoColumnStatRow
          key={key}
          label={label}
          value={seller.revenueUsd}
          isCurrency
          tooltip={seller.tooltip ? seller.tooltip : ''}
        />,
      );
    });
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title-no-margin">
            Top {topSellers?.length} Selling {title}
          </Col>
        </Row>
        <Row hidden={!dateRange}>
          <Col className="sales-stat-block-subtitle-no-margin">({dateRange})</Col>
        </Row>
        {sellerRows}
      </Col>
    </Row>
  );
}
