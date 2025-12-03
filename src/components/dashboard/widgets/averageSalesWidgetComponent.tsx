'use client';

import moment from 'moment';

import { AverageSalesWidgetProps } from '@/types/props';

export default function AverageSalesWidget(props: AverageSalesWidgetProps) {
  const monthlyAverages = props.MonthlyAverages;
  const yearlyAverages = props.YearlyAverages;
  const selectedYear = props.SelectedYear;
  const currentYear = moment().year();

  return monthlyAverages && yearlyAverages ? (
    <div className="sales-stat-block-table">
      <div className="sales-stat-block-title">
        Average Daily Sales {selectedYear === currentYear ? '' : selectedYear}
      </div>
      <table className="average-sales-data-table">
        <thead>
          <tr hidden={selectedYear !== currentYear}>
            <th>&nbsp;</th>
            <th className="sales-stat-block-subtitle sales-stat-block-value">Month</th>
            <th className="sales-stat-block-subtitle sales-stat-block-value">Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="sales-stat-block-name">Transactions:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              {monthlyAverages?.transactions?.toFixed(2) ?? '0'}
            </td>
            <td className="sales-stat-block-value">
              {yearlyAverages?.transactions?.toFixed(2) ?? '0'}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Tickets:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              {monthlyAverages?.tickets?.toFixed(2) ?? '0'}
            </td>
            <td className="sales-stat-block-value">{yearlyAverages?.tickets?.toFixed(2) ?? '0'}</td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Refunds:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              {monthlyAverages?.refunds?.toFixed(2) ?? '0'}
            </td>
            <td className="sales-stat-block-value">{yearlyAverages?.refunds?.toFixed(2) ?? '0'}</td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Ticket Revenue:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              ${monthlyAverages?.ticketRevenueUsd?.toFixed(2) ?? '0.00'}
            </td>
            <td className="sales-stat-block-value">
              ${yearlyAverages?.ticketRevenueUsd?.toFixed(2) ?? '0.00'}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Service Fees:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              ${monthlyAverages?.serviceFeesUsd?.toFixed(2) ?? '0.00'}
            </td>
            <td className="sales-stat-block-value">
              ${yearlyAverages?.serviceFeesUsd?.toFixed(2) ?? '0.00'}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Revenue Refunded:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              ${monthlyAverages?.revenueRefundedUsd?.toFixed(2) ?? '0.00'}
            </td>
            <td className="sales-stat-block-value">
              ${yearlyAverages?.revenueRefundedUsd?.toFixed(2) ?? '0.00'}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">S.Fees Refunded:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              ${monthlyAverages?.serviceFeeRevenueRefundedUsd?.toFixed(2) ?? '0.00'}
            </td>
            <td className="sales-stat-block-value">
              ${yearlyAverages?.serviceFeeRevenueRefundedUsd?.toFixed(2) ?? '0.00'}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Total Revenue:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              ${monthlyAverages?.totalRevenueUsd?.toFixed(2) ?? '0.00'}
            </td>
            <td className="sales-stat-block-value">
              ${yearlyAverages?.totalRevenueUsd?.toFixed(2) ?? '0.00'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    ''
  );
}
