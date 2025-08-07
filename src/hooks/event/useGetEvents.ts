import { GetEventsResponse } from '@/types/responses';
import { UserReportSelection } from '@/types/user';
import { eventService } from '../../services';

export const useGetEvents = () => {
  const getEvents = async (
    reportSelection: UserReportSelection,
  ): Promise<GetEventsResponse> => {
    let response: GetEventsResponse = {
      error: undefined,
      events: [],
    };
    if (reportSelection.seller.sellerId > 0) {
      if (reportSelection.reloadEvents) {
        response = await eventService.getEvents(reportSelection);
      } else {
        response.events = reportSelection.currentEvents;
      }
    }
    return response;
  };

  return { getEvents };
};
