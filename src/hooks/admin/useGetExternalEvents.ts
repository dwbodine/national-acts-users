import { adminService } from '../../services';
import { GetExternalEventsResponse } from '@/types/admin';

export const useGetExternalEvents = () => {
  const getExternalEvents = async (
    sellerId: number,
  ): Promise<GetExternalEventsResponse> => {
    let response: GetExternalEventsResponse = {
      events: [],
      eventError: undefined,
    };
    response = await adminService.getExternalEvents(sellerId);
    return response;
  };

  return { getExternalEvents };
};
