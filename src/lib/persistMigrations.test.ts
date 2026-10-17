import { createMigrate } from 'redux-persist';
import { describe, expect, it } from 'vitest';

import { discardLegacySelections } from './persistMigrations';

describe('ticket partner persistence migration', () => {
  const legacy = {
    _persist: { version: -1, rehydrated: true },
    globalSelection: { isLoading: false },
    adminSelection: { selectedOrder: { ticketSocketOrderId: 123 } },
    reportSelection: { currentEvents: [{ externalEventId: 456 }] },
  };
  const migrate = createMigrate({ 1: discardLegacySelections });

  it('drops old selections while retaining global state without mutating the saved input', async () => {
    const result = await migrate(legacy, 1);
    expect(result).toEqual({
      _persist: legacy._persist,
      globalSelection: legacy.globalSelection,
    });
    expect(legacy.adminSelection.selectedOrder.ticketSocketOrderId).toBe(123);
  });

  it('preserves new-contract selections on later reloads', async () => {
    const current = {
      ...legacy,
      _persist: { version: 1, rehydrated: true },
      adminSelection: { selectedOrder: { ticketPartnerOrderId: 789 } },
    };
    expect(await migrate(current, 1)).toBe(current);
  });

  it('handles browsers without saved state', async () => {
    expect(discardLegacySelections(undefined)).toBeUndefined();
    expect(await migrate(undefined, 1)).toBeUndefined();
  });
});
