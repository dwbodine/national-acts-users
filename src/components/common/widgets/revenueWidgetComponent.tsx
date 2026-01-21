'use client';

import { FaMoneyBillAlt } from 'react-icons/fa';

import { RevenueWidgetProps } from '@/types/props';

export default function RevenueWidget(props: RevenueWidgetProps) {
  const totalRevenue = props.TotalRevenue ?? 0;
  const totalServiceFees = props.TotalServiceFees ?? 0;
  const hideServiceFees = props.HideServiceFees;

  return (
    <>
      <FaMoneyBillAlt size="2em" />
      <div className="widget-text-title">Revenue:</div>
      <span>${totalRevenue.toFixed(2)}</span>
      <div className="second" hidden={hideServiceFees}>
        <div>Service Fees:</div>
        <span>${(totalServiceFees ?? 0).toFixed(2)}</span>
      </div>
    </>
  );
}
