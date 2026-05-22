import { describe, expect, it } from 'vitest';

import {
  getArrayData,
  getErrorMessage,
  getObjectData,
  getOptionalData,
  getStatusCode,
} from './serviceResponses';

describe('serviceResponses', () => {
  it('normalizes array payloads', () => {
    const rows = [{ id: 1 }];

    expect(getArrayData<(typeof rows)[number]>(rows)).toBe(rows);
    expect(getArrayData('not an array')).toEqual([]);
  });

  it('normalizes object and optional payloads', () => {
    const row = { id: 1 };

    expect(getObjectData<typeof row>(row)).toBe(row);
    expect(getObjectData<typeof row>(undefined)).toEqual({});
    expect(getOptionalData<typeof row>(row)).toBe(row);
    expect(getOptionalData<typeof row>(undefined)).toBeUndefined();
  });

  it('reads axios error details with fallbacks', () => {
    const withStatus = {
      message: 'Request failed',
      response: { status: 409 },
    };
    const withoutStatus = {
      message: undefined,
      response: undefined,
    };

    expect(getErrorMessage(withStatus as never, 'Fallback')).toBe('Request failed');
    expect(getErrorMessage(withoutStatus as never, 'Fallback')).toBe('Fallback');
    expect(getStatusCode(withStatus as never)).toBe(409);
    expect(getStatusCode(withoutStatus as never)).toBe(500);
  });
});
