import { GetTicketSocketAccountsResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useGetTicketSocketAccounts = () => {
  const getTicketSocketAccounts = async (): Promise<GetTicketSocketAccountsResponse> =>
    await adminService.getTicketSocketAccounts();

  return { getTicketSocketAccounts };
};
