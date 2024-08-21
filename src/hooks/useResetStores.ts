import { useDispatch } from "react-redux";
import { resetAdmin } from "@/lib/adminSelectionSlice";
import { resetAll } from "@/lib/reportSelectionSlice";
import { resetDashboard } from "@/lib/dashboardSelectionSlice";

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
  };

  return { resetStores };
};