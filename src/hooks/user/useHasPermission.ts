import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { EnumPermission, User } from '@/types/user';

export const useHasPermission = () => {
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const { seller } = currentReportSelection;
  const userHasPermission = (user: User, permission: EnumPermission) => {
    if (!user || user.userId === 0) {
      return false;
    } else if (user.isAdmin) {
      return true;
    } else if (!seller || seller.sellerId === 0) {
      return false;
    } else if (seller) {
      return seller.permissions?.find((x) => x === Number(permission)) !== undefined;
    }
    return false;
  };

  return { userHasPermission };
};
