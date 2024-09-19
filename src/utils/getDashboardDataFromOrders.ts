import { ITicketEventSalesData, ITicketSalesData, ITicketSellerSalesData, Order } from "@/types/event";
import { AdminDashboardSelection, IDailyOrderData, IDashboardData, IDashboardTotals, ITopSeller } from "@/types/user";
import { eventService } from "../services";
import moment from "moment";


export function getDashboardDataFromOrders(currentDashboardSelection: AdminDashboardSelection, totals: IDashboardTotals): IDashboardData {
    let totalTickets: number = 0;
    let totalTicketRevenue: number = 0;
    let totalTicketsRefunded: number = 0;
    let totalRevenue: number = 0;
    let monthlyRevenue: number = 0;
    let totalServiceFees: number = 0;
    let totalPurchases: number = 0;
    let topSellersMap = new Map<number, ITopSeller>();

    const startDate = moment.unix(currentDashboardSelection.start);
    const endEnd = moment.unix(currentDashboardSelection.end);

    const startOfMonth = moment().startOf('month').startOf('day');
    const endOfMonth = moment().endOf('month').endOf('day');

    let orderMap = new Map<string, ITicketSalesData>();

    if (totals.dailyOrderData && totals.dailyOrderData.length > 0) {
        totals.dailyOrderData.forEach((dailyOrderData: IDailyOrderData) => {
            const purchaseDate = moment(dailyOrderData.purchaseDate);

            if (purchaseDate >= startOfMonth && purchaseDate <= endOfMonth) {
                monthlyRevenue += dailyOrderData.totalRevenueUsd;
            }
            
            if (purchaseDate >= startDate && purchaseDate <= endEnd) {
                totalPurchases += 1;
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
                let location = eventService.getLocationInfoFromDailyOrderData(dailyOrderData);
                if (location && location.trim() != '') {
                    location += ' ';
                }
                const purchaseDate = `${dailyOrderData.eventTitle} (${moment(dailyOrderData.eventDate).format('M/D/YYYY')})`;
        
                const esd: ITicketEventSalesData = {
                    EventId: dailyOrderData.ticketSocketEventId,
                    SellerName: sellerName,
                    PurchaseDate: purchaseDate,
                    Purchases: 1,
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
                            Purchases: 1,
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
                    salesData.Purchases += 1;
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
                                Purchases: 1,
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
                            Purchases: 1, 
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
        var keys = Array.from(orderMap.keys()).sort();
        var start = moment(keys[0]);
        var end = moment(keys[keys.length-1]);
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
    const topSellers = (topSellerValuesArray.length > 5) ? topSellerValuesArray.slice(0, 5) : topSellerValuesArray;

    const totalDays = totals.dayOfYear;
    //const perDiemTicketSales = totals.ticketRevenueUsd / totalDays;
    //const perDiemServiceFees = totals.serviceFeesRevenueUsd / totalDays;
    const perDiemTotalRevenue = totals.totalRevenueUsd / totalDays;

    const percentMonthlyGoal = monthlyRevenue / totals.monthlyRevenueGoal;
    const percentYearlyGoal = totals.totalRevenueUsd / totals.yearlyRevenueGoal;

    const remainingDaysInMonth = totals.daysInMonth - totals.day;
    const projectedMonthTotalRevenue = monthlyRevenue + (perDiemTotalRevenue * remainingDaysInMonth);

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
        percentMonthlyGoal: percentMonthlyGoal,
        percentYearlyGoal: percentYearlyGoal,
        projectedMonthTotalRevenue: projectedMonthTotalRevenue,
        projectedYearTotalRevenue: projectedYearTotalRevenue,
        totals: totals
    };

    return dashboardData; 
};