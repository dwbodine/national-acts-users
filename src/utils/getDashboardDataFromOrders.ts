import {
  AdminDashboardSelection,
  IAverageDailyData,
  IDailyOrderData,
  IDashboardData,
  IDashboardTotals,
  ISalesData,
  ITopSeller,
  ITopSellingLocation,
  ITotalsByAccount,
} from '@/types/user';
import { ITicketEventSalesData, ITicketSalesData } from '@/types/event';
import { getLocationInfoFromDailyOrderData } from './eventUtils';
import moment from 'moment';

export default function getDashboardDataFromOrders(
  currentDashboardSelection: AdminDashboardSelection,
  totals: IDashboardTotals,
): IDashboardData {
  let totalTickets: number = 0;
  let totalTicketRevenue: number = 0;
  let totalTicketsRefunded: number = 0;
  let totalTicketRevenueRefunded: number = 0;
  let totalServiceFeeRevenueRefunded: number = 0;
  let totalRevenue: number = 0;
  let monthlyPurchases: number = 0;
  let monthlyTickets: number = 0;
  let monthlyTicketsRefunded: number = 0;
  let monthlyTicketRevenue: number = 0;
  let monthlyTicketRevenueRefunded: number = 0;
  let monthlyTicketServiceFeeRevenueRefunded: number = 0;
  let monthlyServiceFeeRevenue: number = 0;
  let monthlyTotalRevenue: number = 0;
  let totalServiceFees: number = 0;
  let totalPurchases: number = 0;
  const topSellersMap = new Map<number, ITopSeller>();
  const topSellingLocationsMap = new Map<string, ITopSellingLocation>();
  const topSellingVenuesMap = new Map<string, ITopSellingLocation>();

  const startDate = moment.unix(currentDashboardSelection.start).startOf('day');
  const endEnd = moment.unix(currentDashboardSelection.end).endOf('day');

  const startOfMonth = moment().startOf('month').startOf('day');
  const endOfMonth = moment().endOf('month').endOf('day');

  const orderMap = new Map<string, ITicketSalesData>();
  const totalsByAccountMap = new Map<number, ITicketSalesData>();
  const salesPerMonthMap = new Map<number, number>();
  const salesPerDayMonthMap = new Map<number, number>();
  const salesPerDayYearMap = new Map<number, number>();

  if (totals.dailyOrderData && totals.dailyOrderData.length > 0) {
    // Loop through daily order data to compile stats
    totals.dailyOrderData.forEach((dailyOrderData: IDailyOrderData) => {
      // Purchase date for this iteration
      const dailyOrderPurchaseDate = moment(dailyOrderData.purchaseDate);

      // Get stats per TicketSocket account (keyed by ticketSocketId)
      let accountOrderData: ITicketSalesData | undefined = totalsByAccountMap.get(
        dailyOrderData.ticketSocketId,
      );
      if (accountOrderData === undefined) {
        accountOrderData = {
          PurchaseDate: '',
          Purchases: dailyOrderData.orders,
          Revenue: dailyOrderData.ticketRevenueUsd,
          RevenueChargedBack: dailyOrderData.revenueChargedBack ?? 0,
          RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
          ServiceFeeRevenueChargedBack: dailyOrderData.serviceFeeRevenueChargedBack ?? 0,
          ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
          ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
          Tickets: dailyOrderData.tickets ?? 0,
          TicketsChargedBack: dailyOrderData.numTicketsChargedBack ?? 0,
          TicketsRefunded: dailyOrderData.numTicketsRefunded ?? 0,
          TotalRevenue: dailyOrderData.totalRevenueUsd,
        };
      } else {
        accountOrderData.Purchases += dailyOrderData.orders;
        accountOrderData.Tickets += dailyOrderData.tickets;
        accountOrderData.TicketsRefunded =
          (accountOrderData.TicketsRefunded ?? 0) +
          (dailyOrderData.numTicketsRefunded ?? 0);
        accountOrderData.Revenue += dailyOrderData.ticketRevenueUsd;
        accountOrderData.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
        accountOrderData.TotalRevenue += dailyOrderData.totalRevenueUsd;
        accountOrderData.RevenueRefunded =
          (accountOrderData.RevenueRefunded ?? 0) + (dailyOrderData.revenueRefunded ?? 0);
        accountOrderData.ServiceFeeRevenueRefunded =
          (accountOrderData.ServiceFeeRevenueRefunded ?? 0) +
          (dailyOrderData.serviceFeeRevenueRefunded ?? 0);
        accountOrderData.TicketsChargedBack =
          (accountOrderData.TicketsChargedBack ?? 0) +
          (dailyOrderData.numTicketsChargedBack ?? 0);
        accountOrderData.RevenueChargedBack =
          (accountOrderData.RevenueChargedBack ?? 0) +
          (dailyOrderData.revenueChargedBack ?? 0);
        accountOrderData.ServiceFeeRevenueChargedBack =
          (accountOrderData.ServiceFeeRevenueChargedBack ?? 0) +
          (dailyOrderData.serviceFeeRevenueChargedBack ?? 0);
      }
      totalsByAccountMap.set(dailyOrderData.ticketSocketId, accountOrderData);

      // Get stats for sales per month
      const purchaseMonth = parseInt(dailyOrderPurchaseDate.format('M'));
      let salesPerMonth = salesPerMonthMap.get(purchaseMonth);
      if (salesPerMonth === undefined) {
        salesPerMonthMap.set(purchaseMonth, dailyOrderData.totalRevenueUsd);
      } else {
        salesPerMonth += dailyOrderData.totalRevenueUsd;
        salesPerMonthMap.set(purchaseMonth, salesPerMonth);
      }

      // Get stats for sales per day of week
      const purchaseDayOfWeek = parseInt(dailyOrderPurchaseDate.format('d'));
      let salesPerDayYear = salesPerDayYearMap.get(purchaseDayOfWeek);
      if (salesPerDayYear === undefined) {
        salesPerDayYearMap.set(purchaseDayOfWeek, dailyOrderData.totalRevenueUsd);
      } else {
        salesPerDayYear += dailyOrderData.totalRevenueUsd;
        salesPerDayYearMap.set(purchaseDayOfWeek, salesPerDayYear);
      }

      // Compile data for current month
      if (
        dailyOrderPurchaseDate.valueOf() >= startOfMonth.valueOf() &&
        dailyOrderPurchaseDate.valueOf() <= endOfMonth.valueOf()
      ) {
        let salesPerDayMonth = salesPerDayMonthMap.get(purchaseDayOfWeek);
        if (salesPerDayMonth === undefined) {
          salesPerDayMonthMap.set(purchaseDayOfWeek, dailyOrderData.totalRevenueUsd);
        } else {
          salesPerDayMonth += dailyOrderData.totalRevenueUsd;
          salesPerDayMonthMap.set(purchaseDayOfWeek, salesPerDayMonth);
        }

        monthlyPurchases += dailyOrderData.orders;
        monthlyTickets += dailyOrderData.tickets;
        monthlyTicketsRefunded += dailyOrderData.numTicketsRefunded ?? 0;
        monthlyTicketRevenue += dailyOrderData.ticketRevenueUsd;
        monthlyServiceFeeRevenue += dailyOrderData.serviceFeesRevenueUsd;
        monthlyTotalRevenue += dailyOrderData.totalRevenueUsd;
        monthlyTicketRevenueRefunded += dailyOrderData.revenueRefunded ?? 0;
        monthlyTicketServiceFeeRevenueRefunded +=
          dailyOrderData.serviceFeeRevenueRefunded ?? 0;
      }

      // Compile data for current selected date range
      if (
        dailyOrderPurchaseDate.valueOf() >= startDate.valueOf() &&
        dailyOrderPurchaseDate.valueOf() <= endEnd.valueOf()
      ) {
        // Totals for current time period
        totalPurchases += dailyOrderData.orders;
        totalTickets += dailyOrderData.tickets;
        totalTicketRevenue += dailyOrderData.ticketRevenueUsd;
        totalServiceFees += dailyOrderData.serviceFeesRevenueUsd;
        totalRevenue += dailyOrderData.totalRevenueUsd;
        totalTicketsRefunded += dailyOrderData.numTicketsRefunded ?? 0;
        totalTicketRevenueRefunded += dailyOrderData.revenueRefunded ?? 0;
        totalServiceFeeRevenueRefunded += dailyOrderData.serviceFeeRevenueRefunded ?? 0;

        // Compile data for top sellers for current time period
        if (dailyOrderData.sellerId) {
          let topSeller = topSellersMap.get(dailyOrderData.sellerId);
          if (topSeller) {
            topSeller.revenueUsd += dailyOrderData.totalRevenueUsd;
          } else {
            topSeller = {
              revenueUsd: dailyOrderData.totalRevenueUsd,
              sellerId: dailyOrderData.sellerId,
              sellerName: dailyOrderData.sellerName ?? '',
            };
          }
          topSellersMap.set(dailyOrderData.sellerId, topSeller);
        }

        // Compile data per venue for selected time period
        const location = getLocationInfoFromDailyOrderData(dailyOrderData)?.trim();

        if (location && dailyOrderData.zip && dailyOrderData.venue) {
          let topVenue = topSellingVenuesMap.get(dailyOrderData.zip);
          if (topVenue) {
            topVenue.revenueUsd += dailyOrderData.totalRevenueUsd;
          } else {
            topVenue = {
              location: dailyOrderData.venue,
              revenueUsd: dailyOrderData.totalRevenueUsd,
              tooltip: `${dailyOrderData.venue} (${location} ${dailyOrderData.zip})`,
            };
          }
          topSellingVenuesMap.set(dailyOrderData.zip, topVenue);
        }

        // Compile data per location for selected time period
        if (location) {
          let topCity = topSellingLocationsMap.get(location);
          if (topCity) {
            topCity.revenueUsd += dailyOrderData.totalRevenueUsd;
          } else {
            topCity = {
              location,
              revenueUsd: dailyOrderData.totalRevenueUsd,
              tooltip: '',
            };
          }
          topSellingLocationsMap.set(location, topCity);
        }

        // START - complile data for dashboard ticket sales drill-down table
        const sellerName = `${dailyOrderData.sellerName}`;
        const purchaseDate = `${dailyOrderData.eventTitle} (${moment(dailyOrderData.eventDate).format('M/D/YYYY')})`;

        const esd: ITicketEventSalesData = {
          EventId: dailyOrderData.ticketSocketEventId,
          PurchaseDate: purchaseDate,
          Purchases: dailyOrderData.orders,
          Revenue: dailyOrderData.ticketRevenueUsd,
          RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
          SellerName: sellerName,
          ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
          ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
          Tickets: dailyOrderData.tickets,
          TotalRevenue: dailyOrderData.totalRevenueUsd,
        };

        // Set key and see if we already have a map entry for it
        const key = moment(dailyOrderData.purchaseDate).format('YYYY-MM-DD');
        const salesData = orderMap.get(key);

        // Create new entry
        if (salesData === undefined) {
          const data: ITicketSalesData = {
            PurchaseDate: moment(key).format('M/D/YYYY'),
            Purchases: dailyOrderData.orders,
            Revenue: dailyOrderData.ticketRevenueUsd,
            RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
            ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
            ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
            Tickets: dailyOrderData.tickets,
            TotalRevenue: dailyOrderData.totalRevenueUsd,
            children: [
              {
                PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
                Purchases: dailyOrderData.orders,
                Revenue: dailyOrderData.ticketRevenueUsd,
                RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
                SellerName: sellerName,
                ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
                ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                Tickets: dailyOrderData.tickets,
                TotalRevenue: dailyOrderData.totalRevenueUsd,
                children: [esd],
              },
            ],
          };
          orderMap.set(key, data);
        } else {
          // Update existing entry
          salesData.Tickets += dailyOrderData.tickets;
          salesData.Revenue += dailyOrderData.ticketRevenueUsd;
          salesData.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
          salesData.Purchases += dailyOrderData.orders;
          salesData.TotalRevenue += dailyOrderData.totalRevenueUsd;
          salesData.RevenueRefunded =
            (salesData.RevenueRefunded ?? 0) + (dailyOrderData.revenueRefunded ?? 0);
          salesData.ServiceFeeRevenueRefunded =
            (salesData.ServiceFeeRevenueRefunded ?? 0) +
            (dailyOrderData.serviceFeeRevenueRefunded ?? 0);
          if (salesData.children) {
            if (salesData.children.find((x) => x.SellerName === esd.SellerName)) {
              const sellerSalesData = salesData.children.map((seller) => {
                if (seller.SellerName === esd.SellerName) {
                  seller.Tickets += dailyOrderData.tickets;
                  seller.Revenue += dailyOrderData.ticketRevenueUsd;
                  seller.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
                  seller.Purchases += dailyOrderData.orders;
                  seller.TotalRevenue += dailyOrderData.totalRevenueUsd;
                  seller.RevenueRefunded =
                    (seller.RevenueRefunded ?? 0) + (dailyOrderData.revenueRefunded ?? 0);
                  seller.ServiceFeeRevenueRefunded =
                    (seller.ServiceFeeRevenueRefunded ?? 0) +
                    (dailyOrderData.serviceFeeRevenueRefunded ?? 0);
                  if (seller.children) {
                    if (
                      seller.children.find(
                        (x) =>
                          x.EventId === dailyOrderData.ticketSocketEventId &&
                          x.SellerName === sellerName,
                      )
                    ) {
                      const eventSalesData = seller.children.map((evt) => {
                        if (
                          evt.SellerName === esd.SellerName &&
                          evt.EventId === esd.EventId
                        ) {
                          evt.Tickets += dailyOrderData.tickets;
                          evt.Revenue += dailyOrderData.ticketRevenueUsd;
                          evt.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
                          evt.Purchases += dailyOrderData.orders;
                          evt.TotalRevenue += dailyOrderData.totalRevenueUsd;
                          evt.RevenueRefunded =
                            (evt.RevenueRefunded ?? 0) +
                            (dailyOrderData.revenueRefunded ?? 0);
                          evt.ServiceFeeRevenueRefunded =
                            (evt.ServiceFeeRevenueRefunded ?? 0) +
                            (dailyOrderData.serviceFeeRevenueRefunded ?? 0);
                        }
                        return evt;
                      });
                      seller.children = eventSalesData;
                    } else {
                      seller.children.push(esd);
                    }
                  } else {
                    seller.children = [esd];
                  }
                }
                return seller;
              });
              salesData.children = sellerSalesData;
            } else {
              salesData.children.push({
                PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
                Purchases: dailyOrderData.orders,
                Revenue: dailyOrderData.ticketRevenueUsd,
                RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
                SellerName: sellerName,
                ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
                ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                Tickets: dailyOrderData.tickets,
                TotalRevenue: dailyOrderData.totalRevenueUsd,
                children: [esd],
              });
            }
          } else {
            salesData.children = [
              {
                PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
                Purchases: dailyOrderData.orders,
                Revenue: dailyOrderData.ticketRevenueUsd,
                RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
                SellerName: sellerName,
                ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
                ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                Tickets: dailyOrderData.tickets,
                TotalRevenue: dailyOrderData.totalRevenueUsd,
                children: [esd],
              },
            ];
          }
          orderMap.set(key, salesData);
        }
        // END - complile data for dashboard ticket sales drill-down table
      }
    });
  }
  // End loop

  // Data for Ticket Sales chart
  const ticketSalesData: ITicketSalesData[] = [];
  if (orderMap.size > 0) {
    const keys = Array.from(orderMap.keys()).sort();
    const start = moment(keys[0]);
    let end = moment(keys[keys.length - 1]);
    while (end.unix() >= start.unix()) {
      const key = end.format('YYYY-MM-DD');
      const salesData = orderMap.get(key);
      if (salesData === undefined) {
        const data: ITicketSalesData = {
          PurchaseDate: moment(key).format('MM/DD/YYYY'),
          Purchases: 0,
          Revenue: 0,
          ServiceFees: 0,
          Tickets: 0,
          TotalRevenue: 0,
          children: [],
        };
        ticketSalesData.push(data);
      } else {
        if (salesData.children && salesData.children.length > 0) {
          salesData.children.sort((a, b) =>
            a.SellerName > b.SellerName ? 1 : b.SellerName > a.SellerName ? -1 : 0,
          );
        }
        ticketSalesData.push(salesData);
      }
      end = end.add(-1, 'days');
    }
  }

  // Roll up data for month
  const salesByMonth: ISalesData[] = [];
  if (salesPerMonthMap.size > 0) {
    const keys = Array.from(salesPerMonthMap.keys()).sort();
    keys.forEach((key) => {
      salesByMonth.push({
        key,
        value: salesPerMonthMap.get(key) ?? 0,
      });
    });
  }

  // Roll up daily data for month
  const salesPerDayMonth: ISalesData[] = [];
  if (salesPerDayMonthMap.size > 0) {
    const keys = Array.from(salesPerDayMonthMap.keys()).sort();
    keys.forEach((key) => {
      salesPerDayMonth.push({
        key,
        value: salesPerDayMonthMap.get(key) ?? 0,
      });
    });
  }

  // Roll up daily data per year
  const salesPerDayYear: ISalesData[] = [];
  if (salesPerDayYearMap.size > 0) {
    const keys = Array.from(salesPerDayYearMap.keys()).sort();
    keys.forEach((key) => {
      salesPerDayYear.push({
        key,
        value: salesPerDayYearMap.get(key) ?? 0,
      });
    });
  }

  // Get totals by TicketSocket account
  const totalsByAccount: ITotalsByAccount[] = [];
  if (totalsByAccountMap.size > 0) {
    const keys = Array.from(totalsByAccountMap.keys()).sort();
    keys.forEach((key) => {
      totalsByAccount.push({
        ticketSocketId: key,
        totals: totalsByAccountMap.get(key),
      });
    });
  }

  // Get top-selling customers
  const topSellerValuesArray: ITopSeller[] = Array.from(topSellersMap.values());
  topSellerValuesArray.sort((a, b) =>
    a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0,
  );
  const topSellers =
    topSellerValuesArray.length > 10
      ? topSellerValuesArray.slice(0, 10)
      : topSellerValuesArray;

  // Get top-selling locations
  const topLocationValuesArray: ITopSellingLocation[] = Array.from(
    topSellingLocationsMap.values(),
  );
  topLocationValuesArray.sort((a, b) =>
    a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0,
  );
  const topLocations =
    topLocationValuesArray.length > 10
      ? topLocationValuesArray.slice(0, 10)
      : topLocationValuesArray;

  // Get top-selling venues
  const topVenueValuesArray: ITopSellingLocation[] = Array.from(
    topSellingVenuesMap.values(),
  );
  topVenueValuesArray.sort((a, b) =>
    a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0,
  );
  const topVenues =
    topVenueValuesArray.length > 10
      ? topVenueValuesArray.slice(0, 10)
      : topVenueValuesArray;

  // Compute averages for month
  const averageDailyTransactionsPerMonth = monthlyPurchases / totals.day;
  const averageDailyTicketsPerMonth = monthlyTickets / totals.day;
  const averageDailyTicketRevenuePerMonth = monthlyTicketRevenue / totals.day;
  const averageDailyServiceFeesPerMonth = monthlyServiceFeeRevenue / totals.day;
  const averageDailyTotalRevenuePerMonth = monthlyTotalRevenue / totals.day;
  const averageDailyRefundsPerMonth = monthlyTicketsRefunded / totals.day;
  const averageDailyRevenueRefundedPerMonth = monthlyTicketRevenueRefunded / totals.day;
  const averageDailyServiceFeeRevenueRefundedPerMonth =
    monthlyTicketServiceFeeRevenueRefunded / totals.day;
  const monthToDatePricePerTicket = monthlyTicketRevenue / monthlyTickets;
  const monthToDateServiceFeePerTicket = monthlyServiceFeeRevenue / monthlyTickets;

  const monthlyAverages: IAverageDailyData = {
    refunds: averageDailyRefundsPerMonth,
    revenueRefunded: averageDailyRevenueRefundedPerMonth,
    serviceFeeRevenueRefunded: averageDailyServiceFeeRevenueRefundedPerMonth,
    serviceFees: averageDailyServiceFeesPerMonth,
    ticketRevenue: averageDailyTicketRevenuePerMonth,
    tickets: averageDailyTicketsPerMonth,
    totalRevenue: averageDailyTotalRevenuePerMonth,
    transactions: averageDailyTransactionsPerMonth,
  };

  // Compute averages per year
  const averageDailyTransactionsPerYear = totals.orders / totals.dayOfYear;
  const averageDailyTicketsPerYear = totals.tickets / totals.dayOfYear;
  const averageDailyTicketRevenuePerYear = totals.ticketRevenueUsd / totals.dayOfYear;
  const averageDailyServiceFeesPerYear = totals.serviceFeesRevenueUsd / totals.dayOfYear;
  const averageDailyTotalRevenuePerYear = totals.totalRevenueUsd / totals.dayOfYear;
  const averageDailyRefundsPerYear = (totals.numTicketsRefunded ?? 0) / totals.dayOfYear;
  const averageDailyRevenueRefundedPerYear =
    (totals.revenueRefunded ?? 0) / totals.dayOfYear;
  const averageDailyServiceFeeRevenueRefundedPerYear =
    (totals.serviceFeeRevenueRefunded ?? 0) / totals.dayOfYear;

  const yearlyAverages: IAverageDailyData = {
    refunds: averageDailyRefundsPerYear,
    revenueRefunded: averageDailyRevenueRefundedPerYear,
    serviceFeeRevenueRefunded: averageDailyServiceFeeRevenueRefundedPerYear,
    serviceFees: averageDailyServiceFeesPerYear,
    ticketRevenue: averageDailyTicketRevenuePerYear,
    tickets: averageDailyTicketsPerYear,
    totalRevenue: averageDailyTotalRevenuePerYear,
    transactions: averageDailyTransactionsPerYear,
  };

  // Compute percent of month/year goals
  const percentMonthlyGoal = monthlyTotalRevenue / totals.monthlyRevenueGoal;
  const percentYearlyGoal = totals.totalRevenueUsd / totals.yearlyRevenueGoal;

  // Compute projected month/year revenue
  const remainingDaysInMonth = totals.daysInMonth - totals.day;
  const projectedMonthTotalRevenue =
    monthlyTotalRevenue + averageDailyTotalRevenuePerMonth * remainingDaysInMonth;

  const remainingDaysInYear = totals.totalDaysInYear - totals.dayOfYear;
  const projectedYearTotalRevenue =
    totals.totalRevenueUsd + averageDailyTotalRevenuePerYear * remainingDaysInYear;

  // Add to object for use in dashboard
  const dashboardData: IDashboardData = {
    monthToDatePricePerTicket,
    monthToDatePurchases: monthlyPurchases,
    monthToDateRevenue: monthlyTicketRevenue,
    monthToDateRevenueRefunded: monthlyTicketRevenueRefunded,
    monthToDateServiceFeePerTicket,
    monthToDateServiceFees: monthlyServiceFeeRevenue,
    monthToDateServiceFeesRefunded: monthlyTicketServiceFeeRevenueRefunded,
    monthToDateTickets: monthlyTickets,
    monthToDateTicketsRefunded: monthlyTicketsRefunded,
    monthToDateTotalRevenue: monthlyTotalRevenue,
    monthlyAverages,
    percentMonthlyGoal,
    percentYearlyGoal,
    projectedMonthTotalRevenue,
    projectedYearTotalRevenue,
    purchases: totalPurchases,
    revenue: totalTicketRevenue,
    revenueRefunded: totalTicketRevenueRefunded,
    salesPerDayMonth,
    salesPerDayYear,
    salesPerMonth: salesByMonth,
    serviceFeeRevenueRefunded: totalServiceFeeRevenueRefunded,
    serviceFees: totalServiceFees,
    ticketSalesData,
    tickets: totalTickets,
    ticketsRefunded: totalTicketsRefunded,
    topLocations,
    topSellers,
    topVenues,
    totalRevenue,
    totals,
    totalsByAccount,
    yearlyAverages,
  };

  return dashboardData;
}
