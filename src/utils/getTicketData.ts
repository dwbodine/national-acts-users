import { ITicketData, ITicketTypeData, VipEvent } from "@/types/event";
import moment from "moment";


export function getTicketDataFromEvents(events: VipEvent[]): ITicketData {
    const map = new Map<string, ITicketTypeData[]>();
    let ticketTypes: string[] = [];
    events?.forEach((evt) => {
        const key = moment(evt.eventDate).format('MM/DD/YYYY');
        let eventHasTickets: boolean = false;
        evt.orders?.forEach((order) => {
            order.tickets?.forEach((ticket) => {
                if (ticket.isActive) {
                    eventHasTickets = true; 
                    if (!ticketTypes.find(x => x == ticket.ticketType)) {
                        ticketTypes.push(ticket.ticketType);
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
        if (!eventHasTickets) {
            map.set(key, []);
        }
    });
    ticketTypes.sort();
    return {
        TicketTypes: ticketTypes,
        TicketData: map
    };
};