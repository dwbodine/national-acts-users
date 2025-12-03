'use client';

import { ReactElement } from 'react';
import { Col, Row } from 'rsuite';

import { TopSellingLocationsWidgetProps } from '@/types/props';

export default function TopSellingLocationsWidget(props: TopSellingLocationsWidgetProps) {
  const topSellers = props.TopSellingLocations;
  const dateRange = props.DateRange;
  const title = props.Title;

  const sellerRows: ReactElement[] = [];
  if (topSellers && topSellers.length > 0) {
    topSellers.forEach((seller, i) => {
      const key = `top10${i}`;
      if (seller.tooltip) {
        sellerRows.push(
          <Row key={key}>
            <Col className="sales-stat-block-name-tooltip" title={seller.tooltip}>
              {i + 1}. {seller.location}
            </Col>
            <Col className="sales-stat-block-value">${seller.revenueUsd.toFixed(2)}</Col>
          </Row>,
        );
      } else {
        sellerRows.push(
          <Row key={key}>
            <Col className="sales-stat-block-name">
              {i + 1}. {seller.location}
            </Col>
            <Col className="sales-stat-block-value">${seller.revenueUsd.toFixed(2)}</Col>
          </Row>,
        );
      }
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
