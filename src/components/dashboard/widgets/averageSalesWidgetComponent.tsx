"use client";

import { AverageSalesWidgetProps } from '@/types/props';
import moment from 'moment';

export default function AverageSalesWidget(props: AverageSalesWidgetProps) {
  const monthlyAverages = props.MonthlyAverages;
  const yearlyAverages = props.YearlyAverages;
  const selectedYear = props.SelectedYear;
  const currentYear = moment().year();

  return monthlyAverages && yearlyAverages ? (
    <div className="sales-stat-block-table">
      <div className="sales-stat-block-title">Average Daily Sales {(selectedYear === currentYear) ? '' : selectedYear}</div>
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
            <td hidden={selectedYear !== currentYear}  className="sales-stat-block-value">
              {monthlyAverages?.transactions?.toFixed(2)}
            </td>
            <td className="sales-stat-block-value">
              {yearlyAverages?.transactions?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Tickets:</td>
            <td hidden={selectedYear !== currentYear}  className="sales-stat-block-value">
              {monthlyAverages?.tickets?.toFixed(2)}
            </td>
            <td className="sales-stat-block-value">
              {yearlyAverages?.tickets?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Refunds:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              {monthlyAverages?.refunds?.toFixed(2)}
            </td>
            <td className="sales-stat-block-value">
              {yearlyAverages?.refunds?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Ticket Revenue:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              {monthlyAverages?.ticketRevenue?.toFixed(2)}
            </td>
            <td className="sales-stat-block-value">
              {yearlyAverages?.ticketRevenue?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Service Fees:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              {monthlyAverages?.serviceFees?.toFixed(2)}
            </td>
            <td className="sales-stat-block-value">
              {yearlyAverages?.serviceFees?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Revenue Refunded:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              {monthlyAverages?.revenueRefunded?.toFixed(2)}
            </td>
            <td className="sales-stat-block-value">
              {yearlyAverages?.revenueRefunded?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">S.Fees Refunded:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              {monthlyAverages?.serviceFeeRevenueRefunded?.toFixed(2)}
            </td>
            <td className="sales-stat-block-value">
              {yearlyAverages?.serviceFeeRevenueRefunded?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="sales-stat-block-name">Total Revenue:</td>
            <td hidden={selectedYear !== currentYear} className="sales-stat-block-value">
              {monthlyAverages?.totalRevenue?.toFixed(2)}
            </td>
            <td className="sales-stat-block-value">
              {yearlyAverages?.totalRevenue?.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    ''
  );
}
