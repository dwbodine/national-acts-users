import { AdminDashboardSelection } from '@/types/user';
import { GetDashboardOrdersResponse } from '@/types/event';
import { eventService } from '../../services';

export const useGetDashboardData = () => {
  const getDashboardData = async (
    currentDashboardSelection: AdminDashboardSelection,
  ): Promise<GetDashboardOrdersResponse> => await eventService.getDashboardOrderData(currentDashboardSelection);

  return { getDashboardData };
};
