import { ITicketEventSalesData, ITicketSalesData, ITicketSellerSalesData, Order } from "@/types/event";
import { IDashboardData } from "@/types/user";
import { eventService } from "../services";
import moment from "moment";


export function getDashboardDataFromOrders(orders: Order[]): IDashboardData {
    let totalTickets: number = 0;
    let totalTicketRevenue: number = 0;
    let totalRevenue: number = 0;
    let totalServiceFees: number = 0;
    let totalPurchases: number = orders.length;

    let map = new Map<string, ITicketSalesData>();
    
    orders.forEach((order) => {
        totalTickets += order.numTickets;
        totalTicketRevenue += order.revenueUsd;
        totalServiceFees += order.serviceFeesUsd ?? 0;
        totalRevenue += (order.revenueUsd + (order.serviceFeesUsd ?? 0));

        const key = moment(order.purchaseDate).format('YYYY-MM-DD');
        const sellerName = `${order.sellerName}`;
        let location = eventService.getLocationInfoFromOrder(order);
        if (location && location.trim() != '') {
            location += ' ';
        }
        const purchaseDate = `${order.eventTitle} (${moment(order.eventDate).format('M/D/YYYY')})`;

        const esd: ITicketEventSalesData = {
            EventId: order.ticketSocketEventId,
            SellerName: sellerName,
            PurchaseDate: purchaseDate,
            Purchases: 1,
            Tickets: order.numTickets,
            Revenue: order.revenueUsd,
            ServiceFees: order.serviceFeesUsd ?? 0,
            TotalRevenue: (order.revenueUsd + (order.serviceFeesUsd ?? 0))
        };

        let salesData = map.get(key);
        if (!salesData) {
            const data: ITicketSalesData = {
                PurchaseDate: moment(key).format('M/D/YYYY'),
                Tickets: order.numTickets,
                Purchases: 1,
                Revenue: order.revenueUsd,
                ServiceFees: order.serviceFeesUsd ?? 0,
                TotalRevenue: (order.revenueUsd + (order.serviceFeesUsd ?? 0)),
                children: [{
                    SellerName: sellerName,
                    PurchaseDate: `${sellerName} (${moment(order.purchaseDate).format('M/D/YYYY')})`,
                    Purchases: 1,
                    Tickets: order.numTickets,
                    Revenue: order.revenueUsd,
                    ServiceFees: order.serviceFeesUsd ?? 0,
                    TotalRevenue: (order.revenueUsd + (order.serviceFeesUsd ?? 0)),
                    children: [esd]
                }]  
            };
            map.set(key, data);
        } else {
            salesData.Tickets += order.numTickets;
            salesData.Revenue += order.revenueUsd;
            salesData.ServiceFees += order.serviceFeesUsd ?? 0;
            salesData.Purchases += 1;
            salesData.TotalRevenue += (order.revenueUsd + (order.serviceFeesUsd ?? 0));
            if (salesData.children) {
                if (salesData.children.find(x => x.SellerName == esd.SellerName)) {
                    let sellerSalesData = salesData.children.map((seller) => {
                        if (seller.SellerName == esd.SellerName) {
                            seller.Tickets += order.numTickets;
                            seller.Revenue += order.revenueUsd;
                            seller.ServiceFees += order.serviceFees ?? 0;
                            seller.Purchases += 1;
                            seller.TotalRevenue += (order.revenueUsd + (order.serviceFeesUsd ?? 0));
                            if (seller.children) {
                                if (seller.children.find(x => x.EventId == order.ticketSocketEventId && x.SellerName == sellerName)) {
                                    let eventSalesData = seller.children.map((evt) => {
                                        if (evt.SellerName == esd.SellerName && evt.EventId == esd.EventId) {
                                            evt.Tickets += order.numTickets;
                                            evt.Revenue += order.revenueUsd;
                                            evt.ServiceFees += order.serviceFees ?? 0;
                                            evt.Purchases += 1;
                                            evt.TotalRevenue += (order.revenueUsd + (order.serviceFeesUsd ?? 0));
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
                        PurchaseDate: `${sellerName} (${moment(order.purchaseDate).format('M/D/YYYY')})`,
                        Purchases: 1,
                        Tickets: order.numTickets,
                        Revenue: order.revenueUsd,
                        ServiceFees: order.serviceFeesUsd ?? 0,
                        TotalRevenue: (order.revenueUsd + (order.serviceFeesUsd ?? 0)),
                        children: [esd]
                    });
                }
            } else {
                salesData.children = [{
                    SellerName: sellerName,
                    PurchaseDate: `${sellerName} (${moment(order.purchaseDate).format('M/D/YYYY')})`,
                    Purchases: 1, 
                    Tickets: order.numTickets,
                    Revenue: order.revenueUsd,
                    ServiceFees: order.serviceFeesUsd ?? 0,
                    TotalRevenue: (order.revenueUsd + (order.serviceFeesUsd ?? 0)),
                    children: [esd]
                }];
            }
            map.set(key, salesData);
        }
    });    

    let ticketSalesData: ITicketSalesData[] = [];
    if (map.size > 0) {
        var keys = Array.from(map.keys()).sort();
        var start = moment(keys[0]);
        var end = moment(keys[keys.length-1]);
        while (end.unix() >= start.unix()) {
            const key = end.format('YYYY-MM-DD');
            let salesData = map.get(key);
            if (!salesData) {
                const data: ITicketSalesData = {
                    PurchaseDate: moment(key).format('MM/DD/YYYY'),
                    Purchases: 0,
                    Tickets: 0,
                    Revenue: 0,
                    ServiceFees: 0,
                    TotalRevenue: 0,
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
    
    const dashboardData: IDashboardData = {
        ticketSalesData: ticketSalesData,
        tickets: totalTickets,
        revenue: totalTicketRevenue,
        serviceFees: totalServiceFees,
        purchases: totalPurchases,
        totalRevenue: totalRevenue,
        orders: orders
    };

    return dashboardData; 
};