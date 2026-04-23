import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import formatValue from './formatValue';
import highlightValue from './highlightValue';
import toThousands from './toThousands';

describe('formatting utils', () => {
  it('formats large numbers with thousands separators', () => {
    expect(toThousands(1234567)).toBe('1,234,567');
    expect(toThousands(1234.56, 1)).toBe('1,234.6');
  });

  it('formats values into k, M, B, and INF buckets', () => {
    expect(formatValue(0)).toBe('0');
    expect(formatValue(500)).toBe('< 1k');
    expect(formatValue(12500)).toBe('13 k');
    expect(formatValue(2500000)).toBe('3 M');
    expect(formatValue(3000000000)).toBe('3 B');
    expect(formatValue(1000000000000)).toBe('INF.');
    expect(formatValue(-1)).toBe('--');
  });

  it('renders highlighted values for large numbers', () => {
    render(<div>{highlightValue(12500, 1)}</div>);

    expect(screen.getByText('12.5')).toHaveClass('highlight');
    expect(screen.getByText('k')).toBeInTheDocument();
  });

  it('returns simple strings for small highlighted values', () => {
    expect(highlightValue(0)).toBe('0');
    expect(highlightValue(999)).toBe('< 1k');
  });
});
