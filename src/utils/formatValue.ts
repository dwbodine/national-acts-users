import toThousands from './toThousands';

export default function formatValue(value: number) {
  if (value === 0) {
    return '0';
  } else if (value > 0 && value < 1000) {
    return '< 1k';
  } else if (value >= 1000 && value < 1000000) {
    return `${toThousands(value / 1000)} k`;
  } else if (value >= 1000000 && value < 1000000000) {
    return `${toThousands(value / 1000000)} M`;
  } else if (value >= 1000000000 && value < 1000000000000) {
    return `${toThousands(value / 1000000000)} B`;
  } else if (value >= 1000000000000) {
    return 'INF.';
  }
  return '--';
}
