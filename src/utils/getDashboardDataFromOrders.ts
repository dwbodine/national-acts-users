import { ITicketEventSalesData, ITicketSalesData, ITicketSellerSalesData, Order } from "@/types/event";
import { AdminDashboardSelection, IDailyOrderData, IDashboardData, IDashboardTotals, ITopSeller } from "@/types/user";
import { eventService } from "../services";
import moment from "moment";


export function getDashboardDataFromOrders(currentDashboardSelection: AdminDashboardSelection, totals: IDashboardTotals): IDashboardData {
    let totalTickets: number = 0;
    let totalTicketRevenue: number = 0;
    let totalTicketsRefunded: number = 0;
    let totalRevenue: number = 0;
    let monthlyPurchases: number = 0;
    let monthlyTickets: number = 0;
    let monthlyTicketsRefunded: number = 0;
    let monthlyTicketRevenue: number = 0;
    let monthlyServiceFeeRevenue: number = 0;
    let monthlyTotalRevenue: number = 0;
    let totalServiceFees: number = 0;
    let totalPurchases: number = 0;
    let topSellersMap = new Map<number, ITopSeller>();
    let topSellingLocationsMap = new Map<string, ITopSeller>();

    const startDate = moment.unix(currentDashboardSelection.start);
    const endEnd = moment.unix(currentDashboardSelection.end);

    const startOfMonth = moment().startOf('month').startOf('day');
    const endOfMonth = moment().endOf('month').endOf('day');

    let orderMap = new Map<string, ITicketSalesData>();
    let totalsByAccountMap = new Map<number, ITicketSalesData>();
    let salesPerMonthMap = new Map<number, number>();
    let salesPerDayMonthMap = new Map<number, number>();
    let salesPerDayYearMap = new Map<number, number>();

    if (totals.dailyOrderData && totals.dailyOrderData.length > 0) {
        totals.dailyOrderData.forEach((dailyOrderData: IDailyOrderData) => {
            const purchaseDate = moment(dailyOrderData.purchaseDate);

            let accountOrderData: ITicketSalesData | undefined = totalsByAccountMap.get(dailyOrderData.ticketSocketId);
            if (!accountOrderData) {
                accountOrderData = {
                    PurchaseDate: '',
                    Purchases: dailyOrderData.orders,
                    Tickets: dailyOrderData.tickets,
                    TicketsRefunded: dailyOrderData.ticketsRefunded,
                    Revenue: dailyOrderData.ticketRevenueUsd,
                    ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                    TotalRevenue: dailyOrderData.totalRevenueUsd
                };
            } else {
                accountOrderData.Purchases += dailyOrderData.orders;
                accountOrderData.Tickets += dailyOrderData.tickets;
                accountOrderData.TicketsRefunded = (accountOrderData.TicketsRefunded ?? 0) + dailyOrderData.ticketsRefunded ?? 0;
                accountOrderData.Revenue += dailyOrderData.ticketRevenueUsd;
                accountOrderData.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
                accountOrderData.TotalRevenue += dailyOrderData.totalRevenueUsd;
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

            if (purchaseDate >= startOfMonth && purchaseDate <= endOfMonth) {
                let salesPerDayMonth = salesPerDayMonthMap.get(purchaseDayOfWeek);
                if (salesPerDayMonth == undefined) {
                    salesPerDayMonthMap.set(purchaseDayOfWeek, dailyOrderData.totalRevenueUsd);
                } else {
                    salesPerDayMonth += dailyOrderData.totalRevenueUsd;
                    salesPerDayMonthMap.set(purchaseDayOfWeek, salesPerDayMonth);
                }
                
                monthlyPurchases += dailyOrderData.orders;
                monthlyTickets += dailyOrderData.tickets;
                monthlyTicketsRefunded += dailyOrderData.ticketsRefunded;
                monthlyTicketRevenue += dailyOrderData.ticketRevenueUsd;
                monthlyServiceFeeRevenue += dailyOrderData.serviceFeesRevenueUsd;
                monthlyTotalRevenue += dailyOrderData.totalRevenueUsd;
            }
            
            if (purchaseDate >= startDate && purchaseDate <= endEnd) {
                totalPurchases += dailyOrderData.orders;
                totalTickets += dailyOrderData.tickets;
                totalTicketRevenue += dailyOrderData.ticketRevenueUsd;
                totalServiceFees += dailyOrderData.serviceFeesRevenueUsd;
                totalRevenue += dailyOrderData.totalRevenueUsd;
                totalTicketsRefunded += dailyOrderData.ticketsRefunded;
        
                if (dailyOrderData.sellerId) {
                    var topSeller = topSellersMap.get(dailyOrderData.sellerId);
                    if (topSeller) {
                        topSeller.revenueUsd += dailyOrderData.totalRevenueUsd;
                    } else {
                        topSeller = {
                            sellerId: dailyOrderData.sellerId, 
                            sellerName: dailyOrderData.sellerName ?? '', 
                            revenueUsd: dailyOrderData.totalRevenueUsd
                        };
                    }
                    topSellersMap.set(dailyOrderData.sellerId, topSeller)
                }        
        
                const key = moment(dailyOrderData.purchaseDate).format('YYYY-MM-DD');
                const sellerName = `${dailyOrderData.sellerName}`;
                let location = eventService.getLocationInfoFromDailyOrderData(dailyOrderData)?.trim();
                if (location) {
                    var topLocation = topSellingLocationsMap.get(location);
                    if (topLocation) {
                        topLocation.revenueUsd += dailyOrderData.totalRevenueUsd;
                    } else {
                        topLocation = {
                            sellerId: 0,
                            sellerName: location,
                            revenueUsd: dailyOrderData.totalRevenueUsd
                        };
                    }
                    topSellingLocationsMap.set(location, topLocation);
                }
                const purchaseDate = `${dailyOrderData.eventTitle} (${moment(dailyOrderData.eventDate).format('M/D/YYYY')})`;
        
                const esd: ITicketEventSalesData = {
                    EventId: dailyOrderData.ticketSocketEventId,
                    SellerName: sellerName,
                    PurchaseDate: purchaseDate,
                    Purchases: dailyOrderData.orders,
                    Tickets: dailyOrderData.tickets,
                    Revenue: dailyOrderData.ticketRevenueUsd,
                    ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                    TotalRevenue: dailyOrderData.totalRevenueUsd
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
                        children: [{
                            SellerName: sellerName,
                            PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
                            Purchases: dailyOrderData.orders,
                            Tickets: dailyOrderData.tickets,
                            Revenue: dailyOrderData.ticketRevenueUsd,
                            ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                            TotalRevenue: dailyOrderData.totalRevenueUsd,
                            children: [esd]
                        }]  
                    };
                    orderMap.set(key, data);
                } else {
                    salesData.Tickets += dailyOrderData.tickets;
                    salesData.Revenue += dailyOrderData.ticketRevenueUsd;
                    salesData.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
                    salesData.Purchases += dailyOrderData.orders;
                    salesData.TotalRevenue += dailyOrderData.totalRevenueUsd;
                    if (salesData.children) {
                        if (salesData.children.find(x => x.SellerName == esd.SellerName)) {
                            let sellerSalesData = salesData.children.map((seller) => {
                                if (seller.SellerName == esd.SellerName) {
                                    seller.Tickets += dailyOrderData.tickets;
                                    seller.Revenue += dailyOrderData.ticketRevenueUsd;
                                    seller.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
                                    seller.Purchases += 1;
                                    seller.TotalRevenue += dailyOrderData.totalRevenueUsd;
                                    if (seller.children) {
                                        if (seller.children.find(x => x.EventId == dailyOrderData.ticketSocketEventId && x.SellerName == sellerName)) {
                                            let eventSalesData = seller.children.map((evt) => {
                                                if (evt.SellerName == esd.SellerName && evt.EventId == esd.EventId) {
                                                    evt.Tickets += dailyOrderData.tickets;
                                                    evt.Revenue += dailyOrderData.ticketRevenueUsd;
                                                    evt.ServiceFees += dailyOrderData.serviceFeesRevenueUsd;
                                                    evt.Purchases += 1;
                                                    evt.TotalRevenue += dailyOrderData.totalRevenueUsd;
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
                                children: [esd]
                            });
                        }
                    } else {
                        salesData.children = [{
                            SellerName: sellerName,
                            PurchaseDate: `${sellerName} (${moment(dailyOrderData.purchaseDate).format('M/D/YYYY')})`,
                            Purchases: dailyOrderData.orders, 
                            Tickets: dailyOrderData.tickets,
                            Revenue: dailyOrderData.ticketRevenueUsd,
                            ServiceFees: dailyOrderData.serviceFeesRevenueUsd,
                            TotalRevenue: dailyOrderData.totalRevenueUsd,
                            children: [esd]
                        }];
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
        let end = moment(keys[keys.length-1]);
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
                    TicketsRefunded: 0,
                    children: []
                };
                ticketSalesData.push(data);
            } else {
                if (salesData.children && salesData.children.length > 0) {
                    salesData.children.sort((a,b) => (a.SellerName > b.SellerName) ? 1 : ((b.SellerName > a.SellerName) ? -1 : 0));
                }
                ticketSalesData.push(salesData);
            }
            end = end.add(-1, 'days');
        }
    }

    let topSellerValuesArray: ITopSeller[] = Array.from(topSellersMap.values())
    topSellerValuesArray.sort((a, b) => a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0)
    const topSellers = (topSellerValuesArray.length > 10) ? topSellerValuesArray.slice(0, 10) : topSellerValuesArray;

    let topLocationValuesArray: ITopSeller[] = Array.from(topSellingLocationsMap.values())
    topLocationValuesArray.sort((a, b) => a.revenueUsd > b.revenueUsd ? -1 : a.revenueUsd < b.revenueUsd ? 1 : 0)
    const topLocations = (topLocationValuesArray.length > 10) ? topLocationValuesArray.slice(0, 10) : topLocationValuesArray;

    const totalDays = totals.dayOfYear;
    const perDiemTotalRevenue = totals.totalRevenueUsd / totalDays;

    const percentMonthlyGoal = monthlyTotalRevenue / totals.monthlyRevenueGoal;
    const percentYearlyGoal = totals.totalRevenueUsd / totals.yearlyRevenueGoal;

    const remainingDaysInMonth = totals.daysInMonth - totals.day;
    const projectedMonthTotalRevenue = monthlyTotalRevenue + (perDiemTotalRevenue * remainingDaysInMonth);

    const remainingDaysInYear = totals.totalDaysInYear - totals.dayOfYear;
    const projectedYearTotalRevenue = totals.totalRevenueUsd + (perDiemTotalRevenue * remainingDaysInYear);
    
    const dashboardData: IDashboardData = {
        ticketSalesData: ticketSalesData,
        tickets: totalTickets,
        ticketsRefunded: totalTicketsRefunded,
        revenue: totalTicketRevenue,
        serviceFees: totalServiceFees,
        purchases: totalPurchases,
        totalRevenue: totalRevenue,
        topSellers: topSellers, 
        topLocations: topLocations,
        percentMonthlyGoal: percentMonthlyGoal,
        percentYearlyGoal: percentYearlyGoal,
        projectedMonthTotalRevenue: projectedMonthTotalRevenue,
        projectedYearTotalRevenue: projectedYearTotalRevenue,
        totals: totals,
        monthToDatePurchases: monthlyPurchases,
        monthToDateTickets: monthlyTickets,
        monthToDateRevenue: monthlyTicketRevenue,
        monthToDateTicketsRefunded: monthlyTicketsRefunded,
        monthToDateServiceFees: monthlyServiceFeeRevenue,
        monthToDateTotalRevenue: monthlyTotalRevenue,
        salesPerMonth: salesPerMonthMap,
        salesPerDayMonth: salesPerDayMonthMap,
        salesPerDayYear: salesPerDayYearMap, 
        totalsByAccount: totalsByAccountMap
    };

    return dashboardData; 
};