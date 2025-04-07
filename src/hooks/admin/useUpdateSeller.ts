import { adminService } from '../../services';
import { Seller } from '@/types/event';
import { ModifySellerResponse } from '@/types/admin';

export const useUpdateSeller = () => {
  const updateSeller = async (sellerToUpdate: Seller): Promise<ModifySellerResponse> => {
    let response: ModifySellerResponse = {
      success: false,
      sellerError: undefined,
    };
    response = await adminService.updateSeller(sellerToUpdate);
    return response;
  };

  return { updateSeller };
};
