import { adminService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetExternalEventsInactive = () => {
  const setExternalEventsInactive = async (
    externalEventIdList: number[],
    isActive: boolean,
  ): Promise<ModifyEventResponse> => {
    return await adminService.setExternalEventsInactive(externalEventIdList, isActive);
  };

  return { setExternalEventsInactive };
};
