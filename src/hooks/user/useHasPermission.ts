import { RootState } from '@/lib/store';
import { EnumPermission, User } from '@/types/user';
import { useSelector } from 'react-redux';

export const useHasPermission = () => {
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const userHasPermission = (user: User, permission: EnumPermission) => {
    if (!user || user.userId == 0) {
      return false;
    } else if (user.isAdmin) {
      return true;
    } else if (
      !currentReportSelection ||
      !currentReportSelection.seller ||
      currentReportSelection.seller.sellerId == 0
    ) {
      return false;
    } else {
      const seller = currentReportSelection.seller;
      if (seller) {
        return seller.permissions?.find((x) => x == permission) != undefined;
      } else {
        return false;
      }
    }
  };

  return { userHasPermission };
};
