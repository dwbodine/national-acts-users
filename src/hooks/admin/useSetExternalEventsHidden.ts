import { adminService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetExternalEventsHidden = () => {
  const setExternalEventsHidden = async (
    externalEventIdList: number[],
    isHidden: boolean,
  ): Promise<ModifyEventResponse> => {
    return await adminService.setExternalEventsHidden(externalEventIdList, isHidden);
  };

  return { setExternalEventsHidden };
};
