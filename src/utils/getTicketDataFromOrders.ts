import { ITicketData, ITicketTypeData, Order, TicketType, VipEvent } from "@/types/event";
import moment from "moment";


export function getTicketDataFromOrders(orders: Order[], evt: VipEvent | undefined): ITicketData {
    const map = new Map<string, ITicketTypeData[]>();
    let ticketTypes: TicketType[] = [];

    if (!evt) {
        return {
            TicketTypes: ticketTypes,
            TicketData: map
        }
    }    
    const key = moment(evt.eventDate).format('MM/DD/YYYY');
    let eventHasTicketTypes: boolean = evt.hasTicketTypeData ?? false;
    if (eventHasTicketTypes) {
        evt.ticketTypes?.forEach((ticketType) => {
            if (!ticketTypes.find(x => x.ticketTypeName.toLowerCase() == ticketType.ticketTypeName.toLowerCase())) {
                ticketTypes.push(ticketType);
            }                
        });
    }
    orders.forEach((order) => {
        order.tickets?.forEach((ticket) => {
            if (ticket.isActive) {
                if (!eventHasTicketTypes && !ticketTypes.find(x => x.ticketTypeName == ticket.ticketType)) {
                    ticketTypes.push({
                        eventId: evt.ticketSocketEventId,
                        ticketTypeId: 0,
                        ticketTypeName: ticket.ticketType,
                        totalAvailable: 0,
                        isActive: true
                    });
                }
                const collection = map.get(key);
                if (!collection) {
                    const data: ITicketTypeData = {
                        TicketType: ticket.ticketType,
                        Number: 1
                    };
                    map.set(key, [data]);
                } else {
                    const indexToUpdate = collection.findIndex(item => item.TicketType === ticket.ticketType);
                    if (indexToUpdate >= 0) {
                        let item = collection[indexToUpdate];
                        item.Number += 1;
                        collection[indexToUpdate] = item;
                    } else {
                        collection.push({
                            TicketType: ticket.ticketType,
                            Number: 1
                        });
                    }
                }
            }            
        })
    })
    ticketTypes.sort();
    return {
        TicketTypes: ticketTypes,
        TicketData: map
    };
};