import { adminService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetExternalEventsDeleted = () => {
  const setExternalEventsDeleted = async (
    externalEventIdList: number[],
  ): Promise<ModifyEventResponse> => {
    return await adminService.setExternalEventsDeleted(externalEventIdList);
  };

  return { setExternalEventsDeleted };
};
