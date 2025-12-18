'use client';

import moment from 'moment';
import { Col, Row } from 'rsuite';

import ThreeColumnStatRow from '@/components/common/widgets/ThreeColumnStatRow';
import { AverageSalesWidgetProps } from '@/types/props';

export default function AverageSalesWidget(props: AverageSalesWidgetProps) {
  const monthlyAverages = props.MonthlyAverages;
  const yearlyAverages = props.YearlyAverages;
  const selectedYear = props.SelectedYear;
  const currentYear = moment().year();
  const isCurrentYear = selectedYear === currentYear;

  return monthlyAverages && yearlyAverages ? (
    <Row className="sales-stat-block">
      <Col>
        <div className="sales-stat-block-title">
          Average Daily Sales {selectedYear === currentYear ? '' : selectedYear}
        </div>
        <div className="average-sales-data-table">
          {/* Header Row */}
          {isCurrentYear && (
            <Row className="sales-stat-header">
              <Col xs={10}>&nbsp;</Col>
              <Col xs={7} className="sales-stat-block-subtitle sales-stat-block-value">
                Month
              </Col>
              <Col xs={7} className="sales-stat-block-subtitle sales-stat-block-value">
                Year
              </Col>
            </Row>
          )}

          {/* Data Body */}
          <ThreeColumnStatRow
            label="Transactions:"
            monthVal={monthlyAverages?.transactions}
            yearVal={yearlyAverages?.transactions}
            isCurrentYear
          />
          <ThreeColumnStatRow
            label="Tickets:"
            monthVal={monthlyAverages?.tickets}
            yearVal={yearlyAverages?.tickets}
            isCurrentYear
          />
          <ThreeColumnStatRow
            label="Refunds:"
            monthVal={monthlyAverages?.refunds}
            yearVal={yearlyAverages?.refunds}
            isCurrentYear
          />

          <ThreeColumnStatRow
            label="Ticket Revenue:"
            monthVal={monthlyAverages?.ticketRevenueUsd}
            yearVal={yearlyAverages?.ticketRevenueUsd}
            isCurrentYear
            isCurrency
          />
          <ThreeColumnStatRow
            label="Service Fees:"
            monthVal={monthlyAverages?.serviceFeesUsd}
            yearVal={yearlyAverages?.serviceFeesUsd}
            isCurrentYear
            isCurrency
          />
          <ThreeColumnStatRow
            label="Revenue Refunded:"
            monthVal={monthlyAverages?.revenueRefundedUsd}
            yearVal={yearlyAverages?.revenueRefundedUsd}
            isCurrentYear
            isCurrency
          />
          <ThreeColumnStatRow
            label="S.Fees Refunded:"
            monthVal={monthlyAverages?.serviceFeeRevenueRefundedUsd}
            yearVal={yearlyAverages?.serviceFeeRevenueRefundedUsd}
            isCurrentYear
            isCurrency
          />
          <ThreeColumnStatRow
            label="Total Revenue:"
            monthVal={monthlyAverages?.totalRevenueUsd}
            yearVal={yearlyAverages?.totalRevenueUsd}
            isCurrentYear
            isCurrency
          />
        </div>
      </Col>
    </Row>
  ) : (
    ''
  );
}
