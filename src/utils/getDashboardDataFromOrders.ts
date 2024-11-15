import {
  ITicketEventSalesData,
  ITicketSalesData,
  ITicketSellerSalesData,
  Order,
} from '@/types/event';
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
import { eventService } from '../services';
import moment from 'moment';

export function getDashboardDataFromOrders(
  currentDashboardSelection: AdminDashboardSelection,
  totals: IDashboardTotals,
): IDashboardData {
  let totalTickets: number = 0;
  let totalTicketRevenue: number = 0;
  let totalTicketsRefunded: number = 0;
  let totalTicketRevenueRefunded: number = 0;
  let totalServiceFeeRevenueRefunded: number = 0;
  let totalTicketsChargedBack: number = 0;
  let totalTicketRevenueChargedBack: number = 0;
  let totalServiceFeeRevenueChargedBack: number = 0;
  let totalRevenue: number = 0;
  let monthlyPurchases: number = 0;
  let monthlyTickets: number = 0;
  let monthlyTicketsRefunded: number = 0;
  let monthlyTicketRevenue: number = 0;
  let monthlyTicketRevenueRefunded: number = 0;
  let monthlyTicketServiceFeeRevenueRefunded: number = 0;
  let monthlyTicketsChargedBack: number = 0;
  let monthlyTicketRevenueChargedBack: number = 0;
  let monthlyServiceFeeRevenueChargedBack: number = 0;
  let monthlyServiceFeeRevenue: number = 0;
  let monthlyTotalRevenue: number = 0;
  let totalServiceFees: number = 0;
  let totalPurchases: number = 0;
  let topSellersMap = new Map<number, ITopSeller>();
  let topSellingLocationsMap = new Map<string, ITopSellingLocation>();
  let topSellingVenuesMap = new Map<string, ITopSellingLocation>();

  const startDate = moment.unix(currentDashboardSelection.start);
  const endEnd = moment.unix(currentDashboardSelection.end);

  const currentDateMomentstr = undefined;

  const startOfMonth = moment(currentDateMomentstr).startOf('month').startOf('day');
  const endOfMonth = moment(currentDateMomentstr).endOf('month').endOf('day');

  let orderMap = new Map<string, ITicketSalesData>();
  let totalsByAccountMap = new Map<number, ITicketSalesData>();
  let salesPerMonthMap = new Map<number, number>();
  let salesPerDayMonthMap = new Map<number, number>();
  let salesPerDayYearMap = new Map<number, number>();

  if (totals.dailyOrderData && totals.dailyOrderData.length > 0) {
    totals.dailyOrderData.forEach((dailyOrderData: IDailyOrderData) => {
      const purchaseDate = moment(dailyOrderData.purchaseDate);

      let accountOrderData: ITicketSalesData | undefined = totalsByAccountMap.get(
        dailyOrderData.ticketSocketId,
      );
      if (!accountOrderData) {
        accountOrderData = {
          PurchaseDate: '',
          Purchases: dailyOrderData.orders,
          Tickets: dailyOrderData.tickets,
          TicketsRefunded: dailyOrderData.numTicketsRefunded ?? 0,
          Revenue: dailyOrderData.ticketRevenueUsd,
          ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
          TotalRevenue: dailyOrderData.totalRevenueUsd,
          RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
          ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
          TicketsChargedBack: dailyOrderData.numTicketsChargedBack ?? 0,
          RevenueChargedBack: dailyOrderData.revenueChargedBack ?? 0,
          ServiceFeeRevenueChargedBack: dailyOrderData.serviceFeeRevenueChargedBack ?? 0,
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

      const purchaseMonth = parseInt(purchaseDate.format('M'));
      let salesPerMonth = salesPerMonthMap.get(purchaseMonth);
      if (!salesPerMonth) {
        salesPerMonthMap.set(purchaseMonth, dailyOrderData.totalRevenueUsd);
      } else {
        salesPerMonth += dailyOrderData.totalRevenueUsd;
        salesPerMonthMap.set(purchaseMonth, salesPerMonth);
      }

      const purchaseDayOfWeek = parseInt(purchaseDate.format('d'));
      let salesPerDayYear = salesPerDayYearMap.get(purchaseDayOfWeek);
      if (salesPerDayYear == undefined) {
        salesPerDayYearMap.set(purchaseDayOfWeek, dailyOrderData.totalRevenueUsd);
      } else {
        salesPerDayYear += dailyOrderData.totalRevenueUsd;
        salesPerDayYearMap.set(purchaseDayOfWeek, salesPerDayYear);
      }

      if (
        purchaseDate.valueOf() >= startOfMonth.valueOf() &&
        purchaseDate.valueOf() <= endOfMonth.valueOf()
      ) {
        let salesPerDayMonth = salesPerDayMonthMap.get(purchaseDayOfWeek);
        if (salesPerDayMonth == undefined) {
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
        monthlyTicketsChargedBack += dailyOrderData.numTicketsChargedBack ?? 0;
        monthlyTicketRevenueChargedBack += dailyOrderData.revenueChargedBack ?? 0;
        monthlyServiceFeeRevenueChargedBack +=
          dailyOrderData.serviceFeeRevenueChargedBack ?? 0;
      }

      if (
        purchaseDate.valueOf() >= startDate.valueOf() &&
        purchaseDate.valueOf() <= endEnd.valueOf()
      ) {
        totalPurchases += dailyOrderData.orders;
        totalTickets += dailyOrderData.tickets;
        totalTicketRevenue += dailyOrderData.ticketRevenueUsd;
        totalServiceFees += dailyOrderData.serviceFeesRevenueUsd;
        totalRevenue += dailyOrderData.totalRevenueUsd;
        totalTicketsRefunded += dailyOrderData.numTicketsRefunded ?? 0;
        totalTicketRevenueRefunded += dailyOrderData.revenueRefunded ?? 0;
        totalServiceFeeRevenueRefunded += dailyOrderData.serviceFeeRevenueRefunded ?? 0;
        totalTicketsChargedBack += dailyOrderData.numTicketsChargedBack ?? 0;
        totalTicketRevenueChargedBack += dailyOrderData.revenueChargedBack ?? 0;
        totalServiceFeeRevenueChargedBack +=
          dailyOrderData.serviceFeeRevenueChargedBack ?? 0;

        if (dailyOrderData.sellerId) {
          var topSeller = topSellersMap.get(dailyOrderData.sellerId);
          if (topSeller) {
            topSeller.revenueUsd += dailyOrderData.totalRevenueUsd;
          } else {
            topSeller = {
              sellerId: dailyOrderData.sellerId,
              sellerName: dailyOrderData.sellerName ?? '',
              revenueUsd: dailyOrderData.totalRevenueUsd,
            };
          }
          topSellersMap.set(dailyOrderData.sellerId, topSeller);
        }

        const key = moment(dailyOrderData.purchaseDate).format('YYYY-MM-DD');
        const sellerName = `${dailyOrderData.sellerName}`;
        const purchaseDate = `${dailyOrderData.eventTitle} (${moment(dailyOrderData.eventDate).format('M/D/YYYY')})`;
        let location = eventService
          .getLocationInfoFromDailyOrderData(dailyOrderData)
          ?.trim();

        if (location && dailyOrderData.zip && dailyOrderData.venue) {
          var topVenue = topSellingVenuesMap.get(dailyOrderData.zip);
          if (topVenue) {
            topVenue.revenueUsd += dailyOrderData.totalRevenueUsd;
          } else {
            topVenue = {
              tooltip: `${dailyOrderData.venue} (${location} ${dailyOrderData.zip})`,
              location: dailyOrderData.venue,
              revenueUsd: dailyOrderData.totalRevenueUsd,
            };
          }
          topSellingVenuesMap.set(dailyOrderData.zip, topVenue);
        }

        if (location) {
          var topCity = topSellingLocationsMap.get(location);
          if (topCity) {
            topCity.revenueUsd += dailyOrderData.totalRevenueUsd;
          } else {
            topCity = {
              tooltip: '',
              location: location,
              revenueUsd: dailyOrderData.totalRevenueUsd,
            };
          }
          topSellingLocationsMap.set(location, topCity);
        }

        const esd: ITicketEventSalesData = {
          EventId: dailyOrderData.ticketSocketEventId,
          SellerName: sellerName,
          PurchaseDate: purchaseDate,
          Purchases: dailyOrderData.orders,
          Tickets: dailyOrderData.tickets,
          Revenue: dailyOrderData.ticketRevenueUsd,
          ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
          TotalRevenue: dailyOrderData.totalRevenueUsd,
          RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
          ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
        };

        let salesData = orderMap.get(key);
        if (!salesData) {
          const data: ITicketSalesData = {
            PurchaseDate: moment(key).format('M/D/YYYY'),
            Tickets: dailyOrderData.tickets,
            Purchases: 1,
            Revenue: dailyOrderData.ticketRevenueUsd,
            ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
            TotalRevenue: dailyOrderData.totalRevenueUsd,
            RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
            ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
            children: [
              {
                SellerName: sellerName,
                PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
                Purchases: dailyOrderData.orders,
                Tickets: dailyOrderData.tickets,
                Revenue: dailyOrderData.ticketRevenueUsd,
                ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                TotalRevenue: dailyOrderData.totalRevenueUsd,
                RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
                ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
                children: [esd],
              },
            ],
          };
          orderMap.set(key, data);
        } else {
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
            if (salesData.children.find((x) => x.SellerName == esd.SellerName)) {
              let sellerSalesData = salesData.children.map((seller) => {
                if (seller.SellerName == esd.SellerName) {
                  seller.Tickets += dailyOrderData.tickets;
                  seller.Revenue += dailyOrderData.ticketRevenueUsd;
                  seller.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
                  seller.Purchases += 1;
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
                          x.EventId == dailyOrderData.ticketSocketEventId &&
                          x.SellerName == sellerName,
                      )
                    ) {
                      let eventSalesData = seller.children.map((evt) => {
                        if (
                          evt.SellerName == esd.SellerName &&
                          evt.EventId == esd.EventId
                        ) {
                          evt.Tickets += dailyOrderData.tickets;
                          evt.Revenue += dailyOrderData.ticketRevenueUsd;
                          evt.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
                          evt.Purchases += 1;
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
                SellerName: sellerName,
                PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
                Purchases: dailyOrderData.orders,
                Tickets: dailyOrderData.tickets,
                Revenue: dailyOrderData.ticketRevenueUsd,
                ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                TotalRevenue: dailyOrderData.totalRevenueUsd,
                RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
                ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
                children: [esd],
              });
            }
          } else {
            salesData.children = [
              {
                SellerName: sellerName,
                PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
                Purchases: dailyOrderData.orders,
                Tickets: dailyOrderData.tickets,
                Revenue: dailyOrderData.ticketRevenueUsd,
                ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                TotalRevenue: dailyOrderData.totalRevenueUsd,
                RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
                ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
                children: [esd],
              },
            ];
          }
          orderMap.set(key, salesData);
        }
      }
    });
  }

  let ticketSalesData: ITicketSalesData[] = [];
  if (orderMap.size > 0) {
    const keys = Array.from(orderMap.keys()).sort();
    const start = moment(keys[0]);
    let end = moment(keys[keys.length - 1]);
    while (end.unix() >= start.unix()) {
      const key = end.format('YYYY-MM-DD');
      let salesData = orderMap.get(key);
      if (!salesData) {
        const data: ITicketSalesData = {
          PurchaseDate: moment(key).format('MM/DD/YYYY'),
          Purchases: 0,
          Tickets: 0,
          Revenue: 0,
          ServiceFees: 0,
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

  let salesByMonth: ISalesData[] = [];
  if (salesPerMonthMap.size > 0) {
    const keys = Array.from(salesPerMonthMap.keys()).sort();
    keys.forEach((key) => {
      salesByMonth.push({
        key: key,
        value: salesPerMonthMap.get(key) ?? 0,
      });
    });
  }

  let salesPerDayMonth: ISalesData[] = [];
  if (salesPerDayMonthMap.size > 0) {
    const keys = Array.from(salesPerDayMonthMap.keys()).sort();
    keys.forEach((key) => {
      salesPerDayMonth.push({
        key: key,
        value: salesPerDayMonthMap.get(key) ?? 0,
      });
    });
  }

  let salesPerDayYear: ISalesData[] = [];
  if (salesPerDayYearMap.size > 0) {
    const keys = Array.from(salesPerDayYearMap.keys()).sort();
    keys.forEach((key) => {
      salesPerDayYear.push({
        key: key,
        value: salesPerDayYearMap.get(key) ?? 0,
      });
    });
  }

  let totalsByAccount: ITotalsByAccount[] = [];
  if (totalsByAccountMap.size > 0) {
    const keys = Array.from(totalsByAccountMap.keys()).sort();
    keys.forEach((key) => {
      totalsByAccount.push({
        ticketSocketId: key,
        totals: totalsByAccountMap.get(key),
      });
    });
  }

  let topSellerValuesArray: ITopSeller[] = Array.from(topSellersMap.values());
  topSellerValuesArray.sort((a, b) =>
    a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0,
  );
  const topSellers =
    topSellerValuesArray.length > 10
      ? topSellerValuesArray.slice(0, 10)
      : topSellerValuesArray;

  let topLocationValuesArray: ITopSellingLocation[] = Array.from(
    topSellingLocationsMap.values(),
  );
  topLocationValuesArray.sort((a, b) =>
    a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0,
  );
  const topLocations =
    topLocationValuesArray.length > 10
      ? topLocationValuesArray.slice(0, 10)
      : topLocationValuesArray;

  let topVenueValuesArray: ITopSellingLocation[] = Array.from(
    topSellingVenuesMap.values(),
  );
  topVenueValuesArray.sort((a, b) =>
    a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0,
  );
  const topVenues =
    topVenueValuesArray.length > 10
      ? topVenueValuesArray.slice(0, 10)
      : topVenueValuesArray;

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
    transactions: averageDailyTransactionsPerMonth,
    tickets: averageDailyTicketsPerMonth,
    ticketRevenue: averageDailyTicketRevenuePerMonth,
    serviceFees: averageDailyServiceFeesPerMonth,
    totalRevenue: averageDailyTotalRevenuePerMonth,
    refunds: averageDailyRefundsPerMonth,
    revenueRefunded: averageDailyRevenueRefundedPerMonth,
    serviceFeeRevenueRefunded: averageDailyServiceFeeRevenueRefundedPerMonth,
  };

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
    transactions: averageDailyTransactionsPerYear,
    tickets: averageDailyTicketsPerYear,
    ticketRevenue: averageDailyTicketRevenuePerYear,
    serviceFees: averageDailyServiceFeesPerYear,
    totalRevenue: averageDailyTotalRevenuePerYear,
    refunds: averageDailyRefundsPerYear,
    revenueRefunded: averageDailyRevenueRefundedPerYear,
    serviceFeeRevenueRefunded: averageDailyServiceFeeRevenueRefundedPerYear,
  };

  const percentMonthlyGoal = monthlyTotalRevenue / totals.monthlyRevenueGoal;
  const percentYearlyGoal = totals.totalRevenueUsd / totals.yearlyRevenueGoal;

  const remainingDaysInMonth = totals.daysInMonth - totals.day;
  const projectedMonthTotalRevenue =
    monthlyTotalRevenue + averageDailyTotalRevenuePerMonth * remainingDaysInMonth;

  const remainingDaysInYear = totals.totalDaysInYear - totals.dayOfYear;
  const projectedYearTotalRevenue =
    totals.totalRevenueUsd + averageDailyTotalRevenuePerYear * remainingDaysInYear;

  const dashboardData: IDashboardData = {
    ticketSalesData: ticketSalesData,
    tickets: totalTickets,
    ticketsRefunded: totalTicketsRefunded,
    revenue: totalTicketRevenue,
    revenueRefunded: totalTicketRevenueRefunded,
    serviceFeeRevenueRefunded: totalServiceFeeRevenueRefunded,
    serviceFees: totalServiceFees,
    purchases: totalPurchases,
    totalRevenue: totalRevenue,
    topSellers: topSellers,
    topLocations: topLocations,
    topVenues: topVenues,
    percentMonthlyGoal: percentMonthlyGoal,
    percentYearlyGoal: percentYearlyGoal,
    projectedMonthTotalRevenue: projectedMonthTotalRevenue,
    projectedYearTotalRevenue: projectedYearTotalRevenue,
    totals: totals,
    monthToDatePurchases: monthlyPurchases,
    monthToDateTickets: monthlyTickets,
    monthToDateRevenue: monthlyTicketRevenue,
    monthToDateTicketsRefunded: monthlyTicketsRefunded,
    monthToDateRevenueRefunded: monthlyTicketRevenueRefunded,
    monthToDateServiceFeesRefunded: monthlyTicketServiceFeeRevenueRefunded,
    monthToDateServiceFees: monthlyServiceFeeRevenue,
    monthToDateTotalRevenue: monthlyTotalRevenue,
    salesPerMonth: salesByMonth,
    salesPerDayMonth: salesPerDayMonth,
    salesPerDayYear: salesPerDayYear,
    totalsByAccount: totalsByAccount,
    monthlyAverages: monthlyAverages,
    yearlyAverages: yearlyAverages,
    monthToDatePricePerTicket: monthToDatePricePerTicket,
    monthToDateServiceFeePerTicket: monthToDateServiceFeePerTicket,
  };

  return dashboardData;
}
