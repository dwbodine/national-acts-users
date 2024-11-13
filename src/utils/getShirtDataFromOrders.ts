import {
  IShirtData,
  IShirtSizeData,
  ITicketData,
  ITicketTypeData,
  Order,
  VipEvent,
} from '@/types/event';
import moment from 'moment';

export function getShirtDataFromOrders(orders: Order[]): IShirtData | undefined {
  const map = new Map<string, IShirtSizeData[]>();
  let shirtSizes: string[] = [];
  orders.forEach((order: Order) => {
    const key = moment(order.purchaseDate).format('MM/DD/YYYY');
    if (order.shirts && order.shirts.length > 0) {
      order.shirts.forEach((shirt) => {
        if (!shirtSizes.find((x) => x == shirt)) {
          shirtSizes.push(shirt);
        }
        const collection = map.get(key);
        if (!collection) {
          const data: IShirtSizeData = {
            ShirtSize: shirt,
            Number: 1,
          };
          map.set(key, [data]);
        } else {
          const indexToUpdate = collection.findIndex((item) => item.ShirtSize === shirt);
          if (indexToUpdate >= 0) {
            let item = collection[indexToUpdate];
            item.Number += 1;
            collection[indexToUpdate] = item;
          } else {
            collection.push({
              ShirtSize: shirt,
              Number: 1,
            });
          }
        }
      });
    } else {
      map.set(key, []);
    }
  });
  shirtSizes.sort();
  return {
    ShirtSizes: shirtSizes,
    ShirtData: map,
  };
}
