import { AdminDashboardSelection } from '@/types/user';
import { GetDashboardOrdersResponse } from '@/types/responses';
import { eventService } from '../../services';

export const useGetDashboardData = () => {
  const getDashboardData = async (
    currentDashboardSelection: AdminDashboardSelection,
  ): Promise<GetDashboardOrdersResponse> =>
    await eventService.getDashboardOrderData(currentDashboardSelection);

  return { getDashboardData };
};
