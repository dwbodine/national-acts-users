import { RootState } from "@/lib/store";
import { Permission, User } from "@/types/user";
import { useSelector } from "react-redux";

export const useHasPermission = () => {
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const userHasPermission = (user: User, permission: Permission) => {    
    if (user.isAdmin) {
        return true;
    } else {
        const seller = currentReportSelection.seller;
        if (seller) {
            return (seller.permissions?.find(x => x == permission) != undefined);
        } else {
            return false;
        }
    }    
  };

  return { userHasPermission };
};