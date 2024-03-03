
import SelectSeller from "../components/selectSellerComponent";
import DateRangeSelector from "../components/dateRangeSelectorComponent";
import InactiveCheck from "../components/inactiveCheckComponent";
import DeletedCheck from "../components/deletedCheckComponent";
import { useSelector } from "react-redux";
import type { RootState } from '../src/lib/store';
import { useLogout } from "../src/hooks/useLogout";

export default function AdminBar() {    
    const { logout } = useLogout();
    const currentUser = useSelector((state: RootState) => state.user);

    return (
        <>
            <DateRangeSelector />
            {currentUser.showInactiveEvents ? <InactiveCheck /> : ''}
            {currentUser.isAdmin ? <DeletedCheck /> : ''}                
            <SelectSeller /> 
        </>
    );
}