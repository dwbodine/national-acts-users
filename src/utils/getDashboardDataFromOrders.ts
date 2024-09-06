import { ITicketEventSalesData, ITicketSalesData, Order } from "@/types/event";
import { IDashboardData } from "@/types/user";
import moment from "moment";


export function getDashboardDataFromOrders(orders: Order[]): IDashboardData {
    let totalTickets: number = 0;
    let totalRevenue: number = 0;
    let totalShirts: number | undefined = undefined;

    let map = new Map<string, ITicketSalesData>();
    
    orders.forEach((order) => {
        totalTickets += order.numTickets;
        totalRevenue += order.revenueUsd;
        if (order.totalShirts) {
            if (!totalShirts) {
                totalShirts = 0;
            }
            totalShirts += order.totalShirts;
        }         

        const key = moment(order.purchaseDate).format('YYYY-MM-DD');
        const esd: ITicketEventSalesData = {
            EventId: order.ticketSocketEventId,
            PurchaseDate: `${moment(order.eventDate).format('M/D/YYYY')} - ${order.eventTitle}`,
            Tickets: order.numTickets,
            Revenue: order.revenueUsd
        };

        let salesData = map.get(key);
        if (!salesData) {
            const data: ITicketSalesData = {
                PurchaseDate: moment(key).format('M/D/YYYY'),
                Tickets: order.numTickets,
                Revenue: order.revenueUsd,
                children: [esd]  
            };
            map.set(key, data);
        } else {
            salesData.Tickets += order.numTickets;
            salesData.Revenue += order.revenueUsd;
            if (salesData.children) {
                if (salesData.children.find(x => x.EventId == esd.EventId)) {
                    let eventSalesData = salesData.children.map((item) => {
                        if (item.EventId == esd.EventId) {
                            item.Tickets += order.numTickets;
                            item.Revenue += order.revenueUsd;
                        }
                        return item;
                    });
                    salesData.children = eventSalesData;
                } else {
                    salesData.children.push(esd);
                }
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
                    Tickets: 0,
                    Revenue: 0,
                    children: []
                };
                ticketSalesData.push(data);
            } else {
                ticketSalesData.push(salesData);
            }
            end = end.add(-1, 'days');
        }
    }
    
    const dashboardData: IDashboardData = {
        ticketSalesData: ticketSalesData,
        tickets: totalTickets,
        revenue: totalRevenue,
        shirts: totalShirts,
        orders: orders
    };

    return dashboardData; 
};