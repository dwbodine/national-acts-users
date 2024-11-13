import {
  IShirtData,
  IShirtSizeData,
  ITicketData,
  ITicketTypeData,
  VipEvent,
} from '@/types/event';
import moment from 'moment';

export function getShirtDataFromEvents(events: VipEvent[]): IShirtData | undefined {
  const map = new Map<string, IShirtSizeData[]>();
  let shirtSizes: string[] = [];
  let eventsHaveShirtData: boolean = false;
  events?.forEach((evt: VipEvent) => {
    const key = moment(evt.eventDate).format('MM/DD/YYYY');
    if (evt.totalShirts > 0) {
      eventsHaveShirtData = true;
      evt.shirtSales?.forEach((shirt) => {
        if (!shirtSizes.find((x) => x == shirt.size)) {
          shirtSizes.push(shirt.size);
        }
        const collection = map.get(key);
        if (!collection) {
          const data: IShirtSizeData = {
            ShirtSize: shirt.size,
            Number: shirt.total ?? 0,
          };
          map.set(key, [data]);
        } else {
          const indexToUpdate = collection.findIndex(
            (item) => item.ShirtSize === shirt.size,
          );
          if (indexToUpdate >= 0) {
            let item = collection[indexToUpdate];
            item.Number += shirt.total ?? 0;
            collection[indexToUpdate] = item;
          } else {
            collection.push({
              ShirtSize: shirt.size,
              Number: shirt.total ?? 0,
            });
          }
        }
      });
    } else {
      map.set(key, []);
    }
  });
  if (eventsHaveShirtData) {
    shirtSizes.sort();
    return {
      ShirtSizes: shirtSizes,
      ShirtData: map,
    };
  } else {
    return undefined;
  }
}
