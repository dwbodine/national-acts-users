import { RootState } from "@/lib/store";
import { Permission, User } from "@/types/user";
import { useSelector } from "react-redux";

export const useHasPermission = () => {
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const userHasPermission = (user: User, permission: Permission) => {    
    if (user.isAdmin) {
        return true;
    } else {
        let seller = undefined;
        if (currentReportSelection && currentReportSelection.seller && currentReportSelection.seller.sellerId > 0) {
            seller = currentReportSelection.seller;
        } else if (user.selectedSellerId && user.selectedSellerId > 0) {
            seller = user.sellers?.find(x => x.sellerId == user.selectedSellerId);
        }
        if (seller) {
            return (seller.permissions?.find(x => x == permission) != undefined);
        } else {
            return false;
        }
    }    
  };

  return { userHasPermission };
};