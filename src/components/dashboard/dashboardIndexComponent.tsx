'use client';

import moment from 'moment';
import { ReactElement, useEffect, useState } from 'react';
import { FaDollarSign, FaMoneyBillAlt, FaTicketAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Table } from 'rsuite';

import { FULL_PAGE_CHART_BREAKPOINT } from '@/constants';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { useGetDashboardData } from '@/hooks/dashboard/useGetDashboardData';
import { setCurrentDashboardData, setReloadDashboardOrders } from '@/lib/dashboardSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { ITicketSalesData } from '@/types/event';
import { GetDashboardOrdersResponse } from '@/types/responses';
import { formatCurrencyAmount, getAccountNameFromTicketSocketId } from '@/utils/eventUtils';
import getDashboardDataFromOrders from '@/utils/getDashboardDataFromOrders';

import TicketSalesChart from '../common/ticketSalesChartComponent';
import DashboardBar from './dashboardBarComponent';
import AverageSalesWidget from './widgets/averageSalesWidgetComponent';
import MonthToDateWidget from './widgets/monthToDateWidgetComponent';
import RevenueGoalsWidget from './widgets/revenueGoalsWidgetComponent';
import SalesByAccountWidget from './widgets/salesByAccountWidgetComponent';
import SalesPerDayOfWeekWidget from './widgets/salesPerDayOfWeekWidgetComponent';
import SalesPerMonthWidget from './widgets/salesPerMonthWidgetComponent';
import TopSellersWidget from './widgets/topSellersWidgetComponent';
import TopSellingLocationsWidget from './widgets/topSellingLocationsWidgetComponent';
import YearToDateWidget from './widgets/yearToDateWidgetComponent';

export default function DashboardIndex() {
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const { isLoading } = globalSelection;
  const currentDashboardSelection = useSelector((state: RootState) => state.dashboardSelection);
  const [chartsHidden, setChartsHidden] = useState(true);
  const { Column, HeaderCell, Cell } = Table;

  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const { getDashboardData } = useGetDashboardData();
  const windowSizeJson = JSON.stringify(windowSize);
  const hideTicketChart = windowSize.width < FULL_PAGE_CHART_BREAKPOINT;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentDashboardSelection.reloadOrders) {
        dispatch(setReloadDashboardOrders(false));
        dispatch(setIsLoading(true));
        setChartsHidden(true);
        void getDashboardData(currentDashboardSelection).then(
          (response: GetDashboardOrdersResponse) => {
            if (response.totals && !response.error) {
              const dashData = getDashboardDataFromOrders(
                currentDashboardSelection,
                response.totals,
              );
              if (!dashData.orders) {
                dashData.orders = [];
              }
              dispatch(setCurrentDashboardData(dashData));
              dispatch(setIsLoading(false));
              setChartsHidden(false);
            } else {
              dispatch(setIsLoading(false));
              setChartsHidden(false);
            }
          },
        );
      } else if (chartsHidden && !isLoading) {
        setChartsHidden(false);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    currentDashboardSelection,
    dispatch,
    getDashboardData,
    windowSizeJson,
    chartsHidden,
    isLoading,
  ]);

  const currentYear = moment().year();
  const selectedYear = moment.unix(currentDashboardSelection.start).year();

  const totalTickets = currentDashboardSelection.currentDashboardData?.tickets ?? 0;
  const totalTicketsRefunded = currentDashboardSelection.currentDashboardData?.ticketsRefunded ?? 0;
  const totalTicketRevenueUsd = currentDashboardSelection.currentDashboardData?.revenueUsd ?? 0;
  const totalRevenueUsd = currentDashboardSelection.currentDashboardData?.totalRevenueUsd ?? 0;
  const totalServiceFeesUsd = currentDashboardSelection.currentDashboardData?.serviceFeesUsd ?? 0;
  const totalPurchases = currentDashboardSelection.currentDashboardData?.purchases ?? 0;
  const ticketSalesData =
    currentDashboardSelection.currentDashboardData?.ticketSalesData ?? undefined;
  const topSellers = currentDashboardSelection.currentDashboardData?.topSellers ?? undefined;
  const topLocations = currentDashboardSelection.currentDashboardData?.topLocations ?? undefined;
  const topVenues = currentDashboardSelection.currentDashboardData?.topVenues ?? undefined;
  const dateRange = `${moment.unix(currentDashboardSelection.start).format('MM/DD/YYYY')} - ${moment.unix(currentDashboardSelection.end).format('MM/DD/YYYY')}`;

  const chartSalesData: ITicketSalesData[] = [];
  if (ticketSalesData) {
    let j = 0;
    for (let i = ticketSalesData.length - 1; i >= 0; i -= 1) {
      const currentTicketSalesData = ticketSalesData[i];
      if (currentTicketSalesData) {
        chartSalesData[j] = currentTicketSalesData;
      }
      j += 1;
    }
  }

  const accountTotalWidgets: ReactElement[] = [];
  const accountTotals = currentDashboardSelection.currentDashboardData?.totalsByAccount;
  if (accountTotals && accountTotals.length > 0) {
    accountTotals.forEach((accountTotal, i) => {
      const aTotals = accountTotal.totals;
      const accountName = getAccountNameFromTicketSocketId(accountTotal.ticketSocketId);
      const key = `accountTotal${i}`;
      accountTotalWidgets.push(
        <Col key={key} xl={6} lg={8} md={12} sm={24} xs={24} className="stat-block-container">
          <SalesByAccountWidget
            SelectedYear={selectedYear}
            AccountName={accountName}
            AccountTotals={aTotals}
          />
        </Col>,
      );
    });
  }

  return (
    <>
      <DashboardBar />
      <Container className="fluid dashboard-container" hidden={isLoading}>
        <Row>
          <Col>
            <h3>Current Period</h3>
          </Col>
        </Row>
        <Row className="dashboard-widget-table">
          <Col lg={8} md={10} sm={12} xs={24} className="widget-stat-block-container">
            <div className="widget-stat-block">
              <FaDollarSign size="2em" />
              <div>Transactions:</div>
              <span>{totalPurchases}</span>
              <div className="second">
                <div>Total revenue:</div>
                <span>${totalRevenueUsd.toFixed(2)}</span>
              </div>
            </div>
          </Col>
          <Col lg={8} md={10} sm={12} xs={24} className="widget-stat-block-container">
            <div className="widget-stat-block">
              <FaTicketAlt size="2em" />
              <div>Tickets:</div>
              <span>{totalTickets}</span>
              <div className="second">
                <div>Refunds:</div>
                <span>{totalTicketsRefunded}</span>
              </div>
            </div>
          </Col>
          <Col lg={8} md={10} sm={12} xs={24} className="widget-stat-block-container">
            <div className="widget-stat-block">
              <FaMoneyBillAlt size="2em" />
              <div>Revenue:</div>
              <span>${totalTicketRevenueUsd.toFixed(2)}</span>
              <div className="second">
                <div>Service Fees:</div>
                <span>${totalServiceFeesUsd.toFixed(2)}</span>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Sales Stats</h3>
          </Col>
        </Row>
        <Row className="dashboard-sales-table">
          <Col xl={6} lg={8} md={12} sm={24} xs={24} className="stat-block-container">
            <TopSellersWidget TopSellers={topSellers} DateRange={dateRange} />
          </Col>
          <Col xl={6} lg={8} md={12} sm={24} xs={24} className="stat-block-container">
            <TopSellingLocationsWidget
              TopSellingLocations={topLocations}
              Title="Locations"
              DateRange={dateRange}
            />
          </Col>
          <Col xl={6} lg={8} md={12} sm={24} xs={24} className="stat-block-container">
            <TopSellingLocationsWidget
              TopSellingLocations={topVenues}
              Title="Venues"
              DateRange={dateRange}
            />
          </Col>
          <Col
            xl={6}
            lg={8}
            md={12}
            sm={24}
            xs={24}
            className="stat-block-container"
            hidden={selectedYear !== currentYear}
          >
            <MonthToDateWidget DashBoardData={currentDashboardSelection.currentDashboardData} />
          </Col>
          <Col
            xl={6}
            lg={8}
            md={12}
            sm={24}
            xs={24}
            className="stat-block-container"
            hidden={selectedYear !== currentYear}
          >
            <RevenueGoalsWidget
              PercentTitle="Monthly Goal"
              Amount={currentDashboardSelection.currentDashboardData?.monthToDateTotalRevenueUsd}
              TotalGoal={currentDashboardSelection.currentDashboardData?.totals?.monthlyRevenueGoal}
              PercentGoal={currentDashboardSelection.currentDashboardData?.percentMonthlyGoal}
            />
          </Col>
          <Col xl={6} lg={8} md={12} sm={24} xs={24} className="stat-block-container">
            <YearToDateWidget
              SelectedYear={selectedYear}
              Totals={currentDashboardSelection.currentDashboardData?.totals}
              ProjectedYearTotalRevenue={
                currentDashboardSelection.currentDashboardData?.projectedYearTotalRevenueUsd
              }
            />
          </Col>
          <Col xl={6} lg={8} md={12} sm={24} xs={24} className="stat-block-container">
            <RevenueGoalsWidget
              PercentTitle={`Yearly Goal ${selectedYear}`}
              Amount={currentDashboardSelection.currentDashboardData?.totals?.totalRevenueUsd}
              TotalGoal={currentDashboardSelection.currentDashboardData?.totals?.yearlyRevenueGoal}
              PercentGoal={currentDashboardSelection.currentDashboardData?.percentYearlyGoal}
            />
          </Col>
          <Col xl={6} lg={8} md={12} sm={24} xs={24} className="stat-block-container">
            <SalesPerMonthWidget
              SelectedYear={selectedYear}
              SalesPerMonth={currentDashboardSelection.currentDashboardData?.salesPerMonth}
            />
          </Col>
          <Col xl={6} lg={8} md={12} sm={24} xs={24} className="stat-block-container">
            <SalesPerDayOfWeekWidget
              SelectedYear={selectedYear}
              SalesPerDayMonth={currentDashboardSelection.currentDashboardData?.salesPerDayMonth}
              SalesPerDayYear={currentDashboardSelection.currentDashboardData?.salesPerDayYear}
            />
          </Col>
          <Col xl={6} lg={8} md={12} sm={24} xs={24} className="stat-block-container">
            <AverageSalesWidget
              SelectedYear={selectedYear}
              MonthlyAverages={currentDashboardSelection.currentDashboardData?.monthlyAverages}
              YearlyAverages={currentDashboardSelection.currentDashboardData?.yearlyAverages}
            />
          </Col>
          {accountTotalWidgets}
        </Row>
        <TicketSalesChart
          TicketSalesData={chartSalesData ?? []}
          ChartsHidden={chartsHidden}
          HideRevenue={false}
          HideMobile={hideTicketChart}
        />
        <Row>
          <Col xs={24}>
            <Table
              height={550}
              bordered
              cellBordered
              isTree
              rowKey="PurchaseDate"
              data={ticketSalesData}
              shouldUpdateScroll={false}
              rowHeight={55}
            >
              <Column flexGrow={2}>
                <HeaderCell>Date</HeaderCell>
                <Cell dataKey="PurchaseDate"></Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>Transactions</HeaderCell>
                <Cell dataKey="Purchases"></Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>Tickets Sold</HeaderCell>
                <Cell dataKey="Tickets"></Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>Ticket Revenue</HeaderCell>
                <Cell>
                  {(rowData: ITicketSalesData) =>
                    formatCurrencyAmount(undefined, rowData.RevenueUsd, undefined, undefined, true)
                  }
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>Revenue Refunded</HeaderCell>
                <Cell>
                  {(rowData: ITicketSalesData) =>
                    formatCurrencyAmount(
                      undefined,
                      rowData.RevenueRefundedUsd,
                      undefined,
                      undefined,
                      true,
                    )
                  }
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>Service Fees</HeaderCell>
                <Cell>
                  {(rowData: ITicketSalesData) =>
                    formatCurrencyAmount(
                      undefined,
                      rowData.ServiceFeesUsd,
                      undefined,
                      undefined,
                      true,
                    )
                  }
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>Service Fees Refunded</HeaderCell>
                <Cell>
                  {(rowData: ITicketSalesData) =>
                    formatCurrencyAmount(
                      undefined,
                      rowData.ServiceFeeRevenueRefundedUsd,
                      undefined,
                      undefined,
                      true,
                    )
                  }
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>Total Revenue</HeaderCell>
                <Cell>
                  {(rowData: ITicketSalesData) =>
                    formatCurrencyAmount(
                      undefined,
                      rowData.TotalRevenueUsd,
                      undefined,
                      undefined,
                      true,
                    )
                  }
                </Cell>
              </Column>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}
