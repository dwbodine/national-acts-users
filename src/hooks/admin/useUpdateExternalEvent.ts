import { VipEvent } from '@/types/event';
import { adminService } from '../../services';
import { ModifyExternalEventResponse } from '@/types/admin';

export const useUpdateExternalEvent = () => {
  const updateExternalEvent = async (
    sellerId: number,
    eventToUpdate: VipEvent,
  ): Promise<ModifyExternalEventResponse> => {
    let response: ModifyExternalEventResponse = {
      success: false,
      eventError: undefined,
    };
    response = await adminService.updateExternalEvent(sellerId, eventToUpdate);
    return response;
  };

  return { updateExternalEvent };
};
