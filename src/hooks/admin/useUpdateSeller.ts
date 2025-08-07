import { ModifySellerResponse } from '@/types/responses';
import { Seller } from '@/types/event';
import { adminService } from '../../services';

export const useUpdateSeller = () => {
  const updateSeller = async (sellerToUpdate: Seller): Promise<ModifySellerResponse> =>
    await adminService.updateSeller(sellerToUpdate);

  return { updateSeller };
};
