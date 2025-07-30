import { EnumPermission, User } from '@/types/user';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';

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
      return seller.permissions?.find((x) => x === permission) !== undefined;
    }
    return false;
  };

  return { userHasPermission };
};
