import { useDispatch } from "react-redux";
import { resetAdmin } from "@/lib/adminSelectionSlice";
import { resetAll } from "@/lib/reportSelectionSlice";
import { resetDashboard } from "@/lib/dashboardSelectionSlice";
import { resetAdminReports } from "@/lib/adminReportsSelectionSlice";

export const useResetStores = () => {
  const dispatch = useDispatch();
  const resetStores = () => {
      dispatch(
        resetAll()
      );
      dispatch(
        resetDashboard()
      );
      dispatch(
        resetAdmin()
      );
      dispatch(
        resetAdminReports()
      );
  };

  return { resetStores };
};