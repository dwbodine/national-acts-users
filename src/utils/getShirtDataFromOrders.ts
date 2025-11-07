import { IShirtData, IShirtSizeData, Order } from '@/types/event';
import moment from 'moment';

export default function getShirtDataFromOrders(orders: Order[]): IShirtData | undefined {
  const map = new Map<string, IShirtSizeData[]>();
  const shirtSizes: string[] = [];
  orders.forEach((order: Order) => {
    const key = moment(order.purchaseDate).format('MM/DD/YYYY');
    if ((order.totalShirts ?? 0) > 0) {
      order.tickets?.forEach((ticket) => {
        if (ticket.shirtSize) {
          if (!shirtSizes.find((x) => x === ticket.shirtSize)) {
            shirtSizes.push(ticket.shirtSize);
          }
          const collection = map.get(key);
          if (collection === undefined) {
            const data: IShirtSizeData = {
              Number: 1,
              ShirtSize: ticket.shirtSize,
            };
            map.set(key, [data]);
          } else {
            const indexToUpdate = collection.findIndex(
              (item) => item.ShirtSize === ticket.shirtSize,
            );
            if (indexToUpdate >= 0) {
              const item = collection[indexToUpdate];
              if (item) {
                item.Number += 1;
                collection[indexToUpdate] = item;
              }
            } else {
              collection.push({
                Number: 1,
                ShirtSize: ticket.shirtSize,
              });
            }
          }
        }
      });
    } else {
      map.set(key, []);
    }
  });
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
