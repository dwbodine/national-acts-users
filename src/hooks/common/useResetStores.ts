import { resetAdmin } from '@/lib/adminSelectionSlice';
import { resetAdminReports } from '@/lib/adminReportsSelectionSlice';
import { resetAll } from '@/lib/reportSelectionSlice';
import { resetAllAdminEvents } from '@/lib/adminEventsSelectionSlice';
import { resetDashboard } from '@/lib/dashboardSelectionSlice';
import { resetGlobalSettings } from '@/lib/globalSelectionSlice';
import { resetUserActivity } from '@/lib/userActivitySelectionSlice';
import { useDispatch } from 'react-redux';

export const useResetStores = () => {
  const dispatch = useDispatch();
  const resetStores = () => {
    dispatch(resetAll());
    dispatch(resetDashboard());
    dispatch(resetAdmin());
    dispatch(resetAdminReports());
    dispatch(resetUserActivity());
    dispatch(resetGlobalSettings());
    dispatch(resetAllAdminEvents());
  };

  return { resetStores };
};
