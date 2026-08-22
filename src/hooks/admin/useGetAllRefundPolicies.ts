import { GetRefundPoliciesResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useGetAllRefundPolicies = () => {
  const getAllRefundPolicies = async (): Promise<GetRefundPoliciesResponse> =>
    await adminService.getAllRefundPolicies();

  return { getAllRefundPolicies };
};
