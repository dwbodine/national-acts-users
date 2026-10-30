import { Order } from '@/types/event';

export const eventOrderFeeColumns = [
  ['partnerProcessingFee', 'TS PF (USD)'],
  ['stripeProcessingFee', 'Processing (USD)'],
  ['insurance', 'Insurance (USD)'],
  ['radarFee', 'Radar (USD)'],
  ['netServiceFees', 'Net SF (USD)'],
] as const;

export default function getEventOrderFees(orders?: Order[]) {
  return eventOrderFeeColumns.map(([field, label]) => {
    const amounts = orders?.map((order) => order[field]);
    const known =
      amounts?.length && amounts.every((value) => value != null && Number.isFinite(Number(value)));
    return {
      field,
      label,
      display: known
        ? `$${amounts.reduce<number>((total, value) => total + Number(value), 0).toFixed(2)}`
        : '',
    };
  });
}
