import { ITicketData, ITicketSalesData, ITicketTypeData, VipEvent } from "@/types/event";
import moment from "moment";


export function getPurchaseDataFromEvents(events: VipEvent[]): ITicketSalesData[] {
    let map = new Map<string, ITicketSalesData>();
    events?.forEach((evt) => {
        evt.orders?.forEach((order) => {
            const key = moment(order.purchaseDate).format('YYYY-MM-DD');
            let salesData = map.get(key);
            if (!salesData) {
                const data: ITicketSalesData = {
                    PurchaseDate: moment(key).format('MM/DD/YYYY'),
                    Tickets: order.numTickets
                };
                map.set(key, data);
            } else {
                salesData.Tickets += order.numTickets;
                map.set(key, salesData);
            }
        });
    });

    let ticketSalesData: ITicketSalesData[] = [];
    if (map.size > 0) {
        var keys = Array.from(map.keys()).sort();
        var start = moment(keys[0]);
        var end = moment(keys[keys.length-1]);
        while (start.unix() <= end.unix()) {
            const key = start.format('YYYY-MM-DD');
            let salesData = map.get(key);
            if (!salesData) {
                const data: ITicketSalesData = {
                    PurchaseDate: moment(key).format('MM/DD/YYYY'),
                    Tickets: 0
                };
                ticketSalesData.push(data);
            } else {
                ticketSalesData.push(salesData);
            }
            start = start.add(1, 'days');
        }
    }

    return ticketSalesData;
};