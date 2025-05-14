import { adminService } from '../../services';
import { GetTicketSocketAccountsResponse } from '@/types/admin';

export const useGetTicketSocketAccounts = () => {
  const getTicketSocketAccounts = async (): Promise<GetTicketSocketAccountsResponse> => {
    let response: GetTicketSocketAccountsResponse = {
      accounts: [],
      accountError: undefined,
    };
    response = await adminService.getTicketSocketAccounts();
    return response;
  };

  return { getTicketSocketAccounts };
};
