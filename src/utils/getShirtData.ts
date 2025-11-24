import { IShirtData, IShirtSizeData, VipEvent } from '@/types/event';
import moment from 'moment';

export default function getShirtDataFromEvents(events: VipEvent[]): IShirtData | undefined {
  const map = new Map<string, IShirtSizeData[]>();
  const shirtSizes: string[] = [];
  let eventsHaveShirtData: boolean = false;
  events?.forEach((evt: VipEvent) => {
    const key = moment(evt.eventDate).format('MM/DD/YYYY');
    if ((evt.totalShirts ?? 0) > 0) {
      eventsHaveShirtData = true;
      evt.shirtSales?.forEach((shirt) => {
        if (!shirtSizes.find((x) => x === shirt.size)) {
          shirtSizes.push(shirt.size);
        }
        const collection = map.get(key);
        if (collection === undefined) {
          const data: IShirtSizeData = {
            Number: shirt.total ?? 0,
            ShirtSize: shirt.size,
          };
          map.set(key, [data]);
        } else {
          const indexToUpdate = collection.findIndex((item) => item.ShirtSize === shirt.size);
          if (indexToUpdate >= 0) {
            const item = collection[indexToUpdate];
            if (item) {
              item.Number += shirt.total ?? 0;
              collection[indexToUpdate] = item;
            }
          } else {
            collection.push({
              Number: shirt.total ?? 0,
              ShirtSize: shirt.size,
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
    const shirtSizeSorted: string[] = [];
    if (shirtSizes.find((x) => x === 'S')) {
      shirtSizeSorted.push('S');
    }
    if (shirtSizes.find((x) => x === 'M')) {
      shirtSizeSorted.push('M');
    }
    if (shirtSizes.find((x) => x === 'L')) {
      shirtSizeSorted.push('L');
    }
    shirtSizes.forEach((size) => {
      if (size !== 'S' && size !== 'M' && size !== 'L') {
        shirtSizeSorted.push(size);
      }
    });
    return {
      ShirtData: map,
      ShirtSizes: shirtSizeSorted,
    };
  }
  return undefined;
}
