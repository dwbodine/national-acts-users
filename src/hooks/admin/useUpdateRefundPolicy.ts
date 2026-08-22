import { RefundPolicy } from '@/types/public';
import { ModifyRefundPolicyResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useUpdateRefundPolicy = () => {
  const updateRefundPolicy = async (
    refundPolicyToUpdate: RefundPolicy,
  ): Promise<ModifyRefundPolicyResponse> =>
    await adminService.updateRefundPolicy(refundPolicyToUpdate);

  return { updateRefundPolicy };
};
