'use client';

import toThousands from './toThousands';

const Highlight = ({ value, unit }: { value: string; unit: string }) => (
  <span>
    <span className="highlight">{value}</span> {unit}{' '}
  </span>
);

export default function highlightValue(value: number, fixed?: number) {
  if (value === 0) {
    return '0';
  } else if (value > 0 && value < 1000) {
    return '< 1k';
  } else if (value >= 1000 && value < 1000000) {
    return <Highlight value={toThousands(value / 1000, fixed)} unit="k" />;
  } else if (value >= 1000000 && value < 1000000000) {
    return <Highlight value={toThousands(value / 1000000, fixed)} unit="M" />;
  } else if (value >= 1000000000) {
    return <Highlight value={toThousands(value / 1000000000, fixed)} unit="B" />;
  }
  return '--';
}
