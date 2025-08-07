import { AdminSelection } from '@/types/user';
import { GetEventsResponse } from '@/types/responses';
import { eventService } from '../../services';

export const useGetAdminEvents = () => {
  const getAdminEvents = async (
    reportSelection: AdminSelection,
  ): Promise<GetEventsResponse> => await eventService.getAdminEvents(reportSelection);

  return { getAdminEvents };
};
