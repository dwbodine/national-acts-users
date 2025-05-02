import { adminService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetExternalEventsCancelled = () => {
  const setExternalEventsCancelled = async (
    externalEventIdList: number[],
    isCancelled: boolean,
  ): Promise<ModifyEventResponse> => {
    return await adminService.setExternalEventsCancelled(
      externalEventIdList,
      isCancelled,
    );
  };

  return { setExternalEventsCancelled };
};
