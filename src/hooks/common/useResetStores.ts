import { useDispatch } from 'react-redux';
import { resetAdmin } from '@/lib/adminSelectionSlice';
import { resetAll } from '@/lib/reportSelectionSlice';
import { resetDashboard } from '@/lib/dashboardSelectionSlice';
import { resetAdminReports } from '@/lib/adminReportsSelectionSlice';
import { resetUserActivity } from '@/lib/userActivitySelectionSlice';
import { resetGlobalSettings } from '@/lib/globalSelectionSlice';
import { resetAllAdminEvents } from '@/lib/adminEventsSelectionSlice';

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
