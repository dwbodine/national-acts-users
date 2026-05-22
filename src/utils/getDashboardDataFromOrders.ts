import moment from 'moment';

import { ITicketEventSalesData, ITicketSalesData } from '@/types/event';
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

import { getLocationInfoFromDailyOrderData, getPacificMoment } from './eventUtils';

export default function getDashboardDataFromOrders(
  currentDashboardSelection: AdminDashboardSelection,
  totals: IDashboardTotals,
): IDashboardData {
  let totalTickets: number = 0;
  let totalTicketRevenueUsd: number = 0;
  let totalTicketsRefunded: number = 0;
  let totalTicketsChargedBack: number = 0;
  let totalTicketRevenueRefundedUsd: number = 0;
  let totalTicketRevenueChargedBackUsd: number = 0;
  let totalServiceFeeRevenueRefundedUsd: number = 0;
  let totalServiceFeeRevenueChargedBackUsd: number = 0;
  let totalRevenueUsd: number = 0;
  let monthlyPurchases: number = 0;
  let monthlyTickets: number = 0;
  let monthlyTicketsRefunded: number = 0;
  let monthlyTicketsChargedBack: number = 0;
  let monthlyTicketRevenueUsd: number = 0;
  let monthlyTicketRevenueRefundedUsd: number = 0;
  let monthlyTicketRevenueChargedBackUsd: number = 0;
  let monthlyTicketServiceFeeRevenueRefundedUsd: number = 0;
  let monthlyTicketServiceFeeRevenueChargedBackUsd: number = 0;
  let monthlyServiceFeeRevenueUsd: number = 0;
  let monthlyTotalRevenueUsd: number = 0;
  let totalServiceFeesUsd: number = 0;
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
  let lastUpdatedUtc: moment.Moment = moment.utc(0);

  if (totals.dailyOrderData && totals.dailyOrderData.length > 0) {
    // Loop through daily order data to compile stats
    totals.dailyOrderData.forEach((dailyOrderData: IDailyOrderData) => {
      // Purchase date for this iteration
      const dailyOrderPurchaseDate = moment(dailyOrderData.purchaseDate);

      const dailyOrderLastUpdatedUtc = moment.utc(dailyOrderData.lastUpdate);

      if (dailyOrderLastUpdatedUtc.unix() > lastUpdatedUtc.unix()) {
        lastUpdatedUtc = dailyOrderLastUpdatedUtc;
      }

      // Get stats per TicketSocket account (keyed by ticketSocketId and stored in USD)
      let accountOrderData: ITicketSalesData | undefined = totalsByAccountMap.get(
        dailyOrderData.ticketSocketId,
      );
      if (accountOrderData === undefined) {
        accountOrderData = {
          PurchaseDate: '',
          Purchases: dailyOrderData.orders,
          RevenueChargedBackUsd: dailyOrderData.revenueChargedBackUsd ?? 0,
          RevenueRefundedUsd: dailyOrderData.revenueRefundedUsd ?? 0,
          RevenueUsd: dailyOrderData.ticketRevenueUsd,
          ServiceFeeRevenueChargedBackUsd: dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0,
          ServiceFeeRevenueRefundedUsd: dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0,
          ServiceFeesUsd: dailyOrderData.serviceFeesRevenueUsd,
          Tickets: dailyOrderData.tickets ?? 0,
          TicketsChargedBack: dailyOrderData.numTicketsChargedBack ?? 0,
          TicketsRefunded: dailyOrderData.numTicketsRefunded ?? 0,
          TotalRevenueUsd: dailyOrderData.totalRevenueUsd,
        };
      } else {
        accountOrderData.Purchases += dailyOrderData.orders;
        accountOrderData.Tickets += dailyOrderData.tickets;
        accountOrderData.TicketsRefunded += dailyOrderData.numTicketsRefunded ?? 0;
        accountOrderData.RevenueUsd += dailyOrderData.ticketRevenueUsd;
        accountOrderData.ServiceFeesUsd += dailyOrderData.serviceFeesRevenueUsd;
        accountOrderData.TotalRevenueUsd += dailyOrderData.totalRevenueUsd;
        accountOrderData.RevenueRefundedUsd += dailyOrderData.revenueRefundedUsd ?? 0;
        accountOrderData.ServiceFeeRevenueRefundedUsd +=
          dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0;
        accountOrderData.TicketsChargedBack += dailyOrderData.numTicketsChargedBack ?? 0;
        accountOrderData.RevenueChargedBackUsd += dailyOrderData.revenueChargedBackUsd ?? 0;
        accountOrderData.ServiceFeeRevenueChargedBackUsd +=
          dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0;
      }
      totalsByAccountMap.set(dailyOrderData.ticketSocketId, accountOrderData);

      // Get stats for sales per month in USD
      const purchaseMonth = parseInt(dailyOrderPurchaseDate.format('M'));
      let salesPerMonth = salesPerMonthMap.get(purchaseMonth);
      if (salesPerMonth === undefined) {
        salesPerMonthMap.set(purchaseMonth, dailyOrderData.totalRevenueUsd);
      } else {
        salesPerMonth += dailyOrderData.totalRevenueUsd;
        salesPerMonthMap.set(purchaseMonth, salesPerMonth);
      }

      // Get stats for sales per day of week in USD
      const purchaseDayOfWeek = parseInt(dailyOrderPurchaseDate.format('d'));
      let salesPerDayYear = salesPerDayYearMap.get(purchaseDayOfWeek);
      if (salesPerDayYear === undefined) {
        salesPerDayYearMap.set(purchaseDayOfWeek, dailyOrderData.totalRevenueUsd);
      } else {
        salesPerDayYear += dailyOrderData.totalRevenueUsd;
        salesPerDayYearMap.set(purchaseDayOfWeek, salesPerDayYear);
      }

      // Compile data for current month in USD
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
        monthlyTicketsChargedBack += dailyOrderData.numTicketsChargedBack ?? 0;
        monthlyTicketRevenueUsd += dailyOrderData.ticketRevenueUsd;
        monthlyServiceFeeRevenueUsd += dailyOrderData.serviceFeesRevenueUsd;
        monthlyTotalRevenueUsd += dailyOrderData.totalRevenueUsd;
        monthlyTicketRevenueRefundedUsd += dailyOrderData.revenueRefundedUsd ?? 0;
        monthlyTicketRevenueChargedBackUsd += dailyOrderData.revenueChargedBackUsd ?? 0;
        monthlyTicketServiceFeeRevenueRefundedUsd +=
          dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0;
        monthlyTicketServiceFeeRevenueChargedBackUsd +=
          dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0;
      }

      // Compile data for current selected date range in USD
      if (
        dailyOrderPurchaseDate.valueOf() >= startDate.valueOf() &&
        dailyOrderPurchaseDate.valueOf() <= endEnd.valueOf()
      ) {
        // Totals for current time period
        totalPurchases += dailyOrderData.orders;
        totalTickets += dailyOrderData.tickets;
        totalTicketRevenueUsd += dailyOrderData.ticketRevenueUsd;
        totalServiceFeesUsd += dailyOrderData.serviceFeesRevenueUsd;
        totalRevenueUsd += dailyOrderData.totalRevenueUsd;
        totalTicketsRefunded += dailyOrderData.numTicketsRefunded ?? 0;
        totalTicketsChargedBack += dailyOrderData.numTicketsChargedBack ?? 0;
        totalTicketRevenueRefundedUsd += dailyOrderData.revenueRefundedUsd ?? 0;
        totalTicketRevenueChargedBackUsd += dailyOrderData.revenueChargedBackUsd ?? 0;
        totalServiceFeeRevenueRefundedUsd += dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0;
        totalServiceFeeRevenueChargedBackUsd += dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0;

        // Compile data for top sellers for current time period in USD
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

        // Compile data per venue for selected time period in USD
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

        // Compile data per location for selected time period in USD
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
          CurrencySymbol: dailyOrderData.currencySymbol ?? '$',
          EventId: dailyOrderData.ticketSocketEventId,
          ExchangeRate: dailyOrderData.exchangeRate ?? 1,
          PurchaseDate: purchaseDate,
          Purchases: dailyOrderData.orders,
          Revenue: dailyOrderData.ticketRevenue,
          RevenueChargedBack: dailyOrderData.revenueChargedBack ?? 0,
          RevenueChargedBackUsd: dailyOrderData.revenueChargedBackUsd ?? 0,
          RevenueRefunded: dailyOrderData.revenueRefunded ?? 0,
          RevenueRefundedUsd: dailyOrderData.revenueRefundedUsd ?? 0,
          RevenueUsd: dailyOrderData.ticketRevenueUsd,
          SellerName: sellerName,
          ServiceFeeRevenueChargedBack: dailyOrderData.serviceFeeRevenueChargedBack ?? 0,
          ServiceFeeRevenueChargedBackUsd: dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0,
          ServiceFeeRevenueRefunded: dailyOrderData.serviceFeeRevenueRefunded ?? 0,
          ServiceFeeRevenueRefundedUsd: dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0,
          ServiceFees: dailyOrderData.serviceFeesRevenue,
          ServiceFeesUsd: dailyOrderData.serviceFeesRevenueUsd,
          Tickets: dailyOrderData.tickets,
          TicketsChargedBack: dailyOrderData.numTicketsChargedBack ?? 0,
          TicketsRefunded: dailyOrderData.numTicketsRefunded ?? 0,
          TotalRevenue: dailyOrderData.totalRevenue,
          TotalRevenueUsd: dailyOrderData.totalRevenueUsd,
        };

        // Set key and see if we already have a map entry for it
        const key = moment(dailyOrderData.purchaseDate).format('YYYY-MM-DD');
        const salesData = orderMap.get(key);

        // Create new entry
        if (salesData === undefined) {
          const data: ITicketSalesData = {
            PurchaseDate: moment(key).format('M/D/YYYY'),
            Purchases: dailyOrderData.orders,
            RevenueChargedBackUsd: dailyOrderData.revenueChargedBackUsd ?? 0,
            RevenueRefundedUsd: dailyOrderData.revenueRefunded ?? 0,
            RevenueUsd: dailyOrderData.ticketRevenueUsd,
            ServiceFeeRevenueChargedBackUsd: dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0,
            ServiceFeeRevenueRefundedUsd: dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0,
            ServiceFeesUsd: dailyOrderData.serviceFeesRevenueUsd,
            Tickets: dailyOrderData.tickets,
            TicketsChargedBack: dailyOrderData.numTicketsChargedBack ?? 0,
            TicketsRefunded: dailyOrderData.numTicketsRefunded ?? 0,
            TotalRevenueUsd: dailyOrderData.totalRevenueUsd,
            children: [
              {
                PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
                Purchases: dailyOrderData.orders,
                RevenueChargedBackUsd: dailyOrderData.revenueChargedBackUsd ?? 0,
                RevenueRefundedUsd: dailyOrderData.revenueRefundedUsd ?? 0,
                RevenueUsd: dailyOrderData.ticketRevenueUsd,
                SellerName: sellerName,
                ServiceFeeRevenueChargedBackUsd:
                  dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0,
                ServiceFeeRevenueRefundedUsd: dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0,
                ServiceFeesUsd: dailyOrderData.serviceFeesRevenueUsd,
                Tickets: dailyOrderData.tickets,
                TicketsChargedBack: dailyOrderData.numTicketsChargedBack ?? 0,
                TicketsRefunded: dailyOrderData.numTicketsRefunded ?? 0,
                TotalRevenueUsd: dailyOrderData.totalRevenueUsd,
                children: [esd],
              },
            ],
          };
          orderMap.set(key, data);
        } else {
          // Update existing entry
          salesData.Tickets += dailyOrderData.tickets;
          salesData.RevenueUsd += dailyOrderData.ticketRevenueUsd;
          salesData.ServiceFeesUsd += dailyOrderData.serviceFeesRevenueUsd;
          salesData.Purchases += dailyOrderData.orders;
          salesData.TotalRevenueUsd += dailyOrderData.totalRevenueUsd;
          salesData.RevenueRefundedUsd += dailyOrderData.revenueRefundedUsd ?? 0;
          salesData.RevenueChargedBackUsd += dailyOrderData.revenueChargedBackUsd ?? 0;
          salesData.ServiceFeeRevenueRefundedUsd +=
            dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0;
          salesData.ServiceFeeRevenueChargedBackUsd +=
            dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0;

          const salesChildren = salesData.children ?? [];
          if (salesChildren?.find((x) => x.SellerName === esd.SellerName)) {
            const sellerSalesData = salesChildren.map((seller) => {
              if (seller.SellerName === esd.SellerName) {
                seller.Tickets += dailyOrderData.tickets;
                seller.RevenueUsd += dailyOrderData.ticketRevenueUsd;
                seller.ServiceFeesUsd += dailyOrderData.serviceFeesRevenueUsd;
                seller.Purchases += dailyOrderData.orders;
                seller.TotalRevenueUsd += dailyOrderData.totalRevenueUsd;
                seller.RevenueRefundedUsd += dailyOrderData.revenueRefundedUsd ?? 0;
                seller.RevenueChargedBackUsd += dailyOrderData.revenueChargedBackUsd ?? 0;
                seller.ServiceFeeRevenueRefundedUsd +=
                  dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0;
                seller.ServiceFeeRevenueChargedBackUsd +=
                  dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0;

                const sellerChildren = seller.children ?? [];
                if (
                  sellerChildren.find(
                    (x) =>
                      x.EventId === dailyOrderData.ticketSocketEventId &&
                      x.SellerName === sellerName,
                  )
                ) {
                  const eventSalesData = sellerChildren.map((evt) => {
                    if (evt.SellerName === esd.SellerName && evt.EventId === esd.EventId) {
                      evt.Tickets += dailyOrderData.tickets;
                      evt.Revenue += dailyOrderData.ticketRevenue;
                      evt.RevenueUsd += dailyOrderData.ticketRevenueUsd;
                      evt.ServiceFees += dailyOrderData.serviceFeesRevenue;
                      evt.ServiceFeesUsd += dailyOrderData.serviceFeesRevenueUsd;
                      evt.Purchases += dailyOrderData.orders;
                      evt.TotalRevenue += dailyOrderData.totalRevenue;
                      evt.TotalRevenueUsd += dailyOrderData.totalRevenueUsd;
                      evt.RevenueRefunded += dailyOrderData.revenueRefunded ?? 0;
                      evt.RevenueRefundedUsd += dailyOrderData.revenueRefundedUsd ?? 0;
                      evt.RevenueChargedBack += dailyOrderData.revenueChargedBack ?? 0;
                      evt.RevenueChargedBackUsd += dailyOrderData.revenueChargedBackUsd ?? 0;
                      evt.ServiceFeeRevenueRefunded +=
                        dailyOrderData.serviceFeeRevenueRefunded ?? 0;
                      evt.ServiceFeeRevenueRefundedUsd +=
                        dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0;
                      evt.ServiceFeeRevenueChargedBack +=
                        dailyOrderData.serviceFeeRevenueChargedBack ?? 0;
                      evt.ServiceFeeRevenueChargedBackUsd +=
                        dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0;
                    }
                    return evt;
                  });
                  seller.children = eventSalesData;
                } else {
                  sellerChildren.push(esd);
                  seller.children = sellerChildren;
                }
              }
              return seller;
            });
            salesData.children = sellerSalesData;
          } else {
            salesChildren.push({
              PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
              Purchases: dailyOrderData.orders,
              RevenueChargedBackUsd: dailyOrderData.revenueChargedBackUsd ?? 0,
              RevenueRefundedUsd: dailyOrderData.revenueRefundedUsd ?? 0,
              RevenueUsd: dailyOrderData.ticketRevenueUsd,
              SellerName: sellerName,
              ServiceFeeRevenueChargedBackUsd: dailyOrderData.serviceFeeRevenueChargedBackUsd ?? 0,
              ServiceFeeRevenueRefundedUsd: dailyOrderData.serviceFeeRevenueRefundedUsd ?? 0,
              ServiceFeesUsd: dailyOrderData.serviceFeesRevenueUsd,
              Tickets: dailyOrderData.tickets,
              TicketsChargedBack: dailyOrderData.numTicketsChargedBack ?? 0,
              TicketsRefunded: dailyOrderData.numTicketsRefunded ?? 0,
              TotalRevenueUsd: dailyOrderData.totalRevenueUsd,
              children: [esd],
            });
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
          RevenueChargedBackUsd: 0,
          RevenueRefundedUsd: 0,
          RevenueUsd: 0,
          ServiceFeeRevenueChargedBackUsd: 0,
          ServiceFeeRevenueRefundedUsd: 0,
          ServiceFeesUsd: 0,
          Tickets: 0,
          TicketsChargedBack: 0,
          TicketsRefunded: 0,
          TotalRevenueUsd: 0,
          children: [],
        };
        ticketSalesData.push(data);
      } else {
        salesData.children = [...(salesData.children ?? [])].sort((a, b) =>
          a.SellerName.localeCompare(b.SellerName),
        );
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
        value: salesPerMonthMap.get(key)!,
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
        value: salesPerDayMonthMap.get(key)!,
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
        value: salesPerDayYearMap.get(key)!,
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
    topSellerValuesArray.length > 10 ? topSellerValuesArray.slice(0, 10) : topSellerValuesArray;

  // Get top-selling locations
  const topLocationValuesArray: ITopSellingLocation[] = Array.from(topSellingLocationsMap.values());
  topLocationValuesArray.sort((a, b) =>
    a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0,
  );
  const topLocations =
    topLocationValuesArray.length > 10
      ? topLocationValuesArray.slice(0, 10)
      : topLocationValuesArray;

  // Get top-selling venues
  const topVenueValuesArray: ITopSellingLocation[] = Array.from(topSellingVenuesMap.values());
  topVenueValuesArray.sort((a, b) =>
    a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0,
  );
  const topVenues =
    topVenueValuesArray.length > 10 ? topVenueValuesArray.slice(0, 10) : topVenueValuesArray;

  // Compute averages for month
  const averageDailyTransactionsPerMonth = monthlyPurchases / totals.day;
  const averageDailyTicketsPerMonth = monthlyTickets / totals.day;
  const averageDailyTicketRevenuePerMonthUsd = monthlyTicketRevenueUsd / totals.day;
  const averageDailyServiceFeesPerMonthUsd = monthlyServiceFeeRevenueUsd / totals.day;
  const averageDailyTotalRevenuePerMonthUsd = monthlyTotalRevenueUsd / totals.day;
  const averageDailyRefundsPerMonth = monthlyTicketsRefunded / totals.day;
  const averageDailyChargeBacksPerMonth = monthlyTicketsChargedBack / totals.day;
  const averageDailyRevenueRefundedPerMonthUsd = monthlyTicketRevenueRefundedUsd / totals.day;
  const averageDailyRevenueChargedBackPerMonthUsd = monthlyTicketRevenueChargedBackUsd / totals.day;
  const averageDailyServiceFeeRevenueRefundedPerMonthUsd =
    monthlyTicketServiceFeeRevenueRefundedUsd / totals.day;
  const averageDailyServiceFeeRevenueChargedBackPerMonthUsd =
    monthlyTicketServiceFeeRevenueChargedBackUsd / totals.day;
  const monthToDatePricePerTicketUsd = monthlyTicketRevenueUsd / monthlyTickets;
  const monthToDateServiceFeePerTicketUsd = monthlyServiceFeeRevenueUsd / monthlyTickets;

  const monthlyAverages: IAverageDailyData = {
    chargebacks: averageDailyChargeBacksPerMonth,
    refunds: averageDailyRefundsPerMonth,
    revenueChargedBackUsd: averageDailyRevenueChargedBackPerMonthUsd,
    revenueRefundedUsd: averageDailyRevenueRefundedPerMonthUsd,
    serviceFeeRevenueChargedBackUsd: averageDailyServiceFeeRevenueChargedBackPerMonthUsd,
    serviceFeeRevenueRefundedUsd: averageDailyServiceFeeRevenueRefundedPerMonthUsd,
    serviceFeesUsd: averageDailyServiceFeesPerMonthUsd,
    ticketRevenueUsd: averageDailyTicketRevenuePerMonthUsd,
    tickets: averageDailyTicketsPerMonth,
    totalRevenueUsd: averageDailyTotalRevenuePerMonthUsd,
    transactions: averageDailyTransactionsPerMonth,
  };

  // Compute averages per year
  const averageDailyTransactionsPerYear = totals.orders / totals.dayOfYear;
  const averageDailyTicketsPerYear = totals.tickets / totals.dayOfYear;
  const averageDailyTicketRevenuePerYearUsd = totals.ticketRevenueUsd / totals.dayOfYear;
  const averageDailyServiceFeesPerYearUsd = totals.serviceFeesRevenueUsd / totals.dayOfYear;
  const averageDailyTotalRevenuePerYearUsd = totals.totalRevenueUsd / totals.dayOfYear;
  const averageDailyChargebacksPerYear = (totals.numTicketsChargedBack ?? 0) / totals.dayOfYear;
  const averageDailyRefundsPerYear = (totals.numTicketsRefunded ?? 0) / totals.dayOfYear;
  const averageDailyRevenueRefundedPerYearUsd = (totals.revenueRefundedUsd ?? 0) / totals.dayOfYear;
  const averageDailyRevenueChargedBackPerYearUsd =
    (totals.revenueChargedBackUsd ?? 0) / totals.dayOfYear;
  const averageDailyServiceFeeRevenueRefundedPerYearUsd =
    (totals.serviceFeeRevenueRefundedUsd ?? 0) / totals.dayOfYear;
  const averageDailyServiceFeeRevenueChargedbackPerYearUsd =
    (totals.serviceFeeRevenueChargedBackUsd ?? 0) / totals.dayOfYear;

  const yearlyAverages: IAverageDailyData = {
    chargebacks: averageDailyChargebacksPerYear,
    refunds: averageDailyRefundsPerYear,
    revenueChargedBackUsd: averageDailyRevenueChargedBackPerYearUsd,
    revenueRefundedUsd: averageDailyRevenueRefundedPerYearUsd,
    serviceFeeRevenueChargedBackUsd: averageDailyServiceFeeRevenueChargedbackPerYearUsd,
    serviceFeeRevenueRefundedUsd: averageDailyServiceFeeRevenueRefundedPerYearUsd,
    serviceFeesUsd: averageDailyServiceFeesPerYearUsd,
    ticketRevenueUsd: averageDailyTicketRevenuePerYearUsd,
    tickets: averageDailyTicketsPerYear,
    totalRevenueUsd: averageDailyTotalRevenuePerYearUsd,
    transactions: averageDailyTransactionsPerYear,
  };

  // Compute percent of month/year goals
  const percentMonthlyGoal = monthlyTotalRevenueUsd / totals.monthlyRevenueGoal;
  const percentYearlyGoal = totals.totalRevenueUsd / totals.yearlyRevenueGoal;

  // Compute projected month/year revenue
  const remainingDaysInMonth = totals.daysInMonth - totals.day;
  const projectedMonthTotalRevenueUsd =
    monthlyTotalRevenueUsd + averageDailyTotalRevenuePerMonthUsd * remainingDaysInMonth;

  const remainingDaysInYear = totals.totalDaysInYear - totals.dayOfYear;
  const projectedYearTotalRevenueUsd =
    totals.totalRevenueUsd + averageDailyTotalRevenuePerYearUsd * remainingDaysInYear;

  const pacificLastUpdated = getPacificMoment(lastUpdatedUtc);
  const lastUpdated = pacificLastUpdated.format('M/DD/YYYY h:mm A zz');

  // Add to object for use in dashboard
  const dashboardData: IDashboardData = {
    monthToDatePricePerTicketUsd,
    monthToDatePurchases: monthlyPurchases,
    monthToDateRevenueChargedBackUsd: monthlyTicketRevenueChargedBackUsd,
    monthToDateRevenueRefundedUsd: monthlyTicketRevenueRefundedUsd,
    monthToDateRevenueUsd: monthlyTicketRevenueUsd,
    monthToDateServiceFeePerTicketUsd,
    monthToDateServiceFeesChargedBackUsd: monthlyTicketServiceFeeRevenueChargedBackUsd,
    monthToDateServiceFeesRefundedUsd: monthlyTicketServiceFeeRevenueRefundedUsd,
    monthToDateServiceFeesUsd: monthlyServiceFeeRevenueUsd,
    monthToDateTickets: monthlyTickets,
    monthToDateTicketsChargedBack: monthlyTicketsChargedBack,
    monthToDateTicketsRefunded: monthlyTicketsRefunded,
    monthToDateTotalRevenueUsd: monthlyTotalRevenueUsd,
    monthlyAverages,
    orders: [],
    percentMonthlyGoal,
    percentYearlyGoal,
    projectedMonthTotalRevenueUsd,
    projectedYearTotalRevenueUsd,
    purchases: totalPurchases,
    revenueChargedBackUsd: totalTicketRevenueChargedBackUsd,
    revenueRefundedUsd: totalTicketRevenueRefundedUsd,
    revenueUsd: totalTicketRevenueUsd,
    salesPerDayMonth,
    salesPerDayYear,
    salesPerMonth: salesByMonth,
    serviceFeeRevenueChargedBackUsd: totalServiceFeeRevenueChargedBackUsd,
    serviceFeeRevenueRefundedUsd: totalServiceFeeRevenueRefundedUsd,
    serviceFeesUsd: totalServiceFeesUsd,
    ticketSalesData,
    tickets: totalTickets,
    ticketsChargedBack: totalTicketsChargedBack,
    ticketsRefunded: totalTicketsRefunded,
    topLocations,
    topSellers,
    topVenues,
    totalRevenueUsd,
    totals,
    totalsByAccount,
    yearlyAverages,
    lastUpdated,
  };

  return dashboardData;
}
