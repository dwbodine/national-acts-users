import { useDispatch } from 'react-redux';

import { resetAdminData } from '@/lib/adminDataSelectionSlice';
import { resetAllAdminEvents } from '@/lib/adminEventsSelectionSlice';
import { resetAdminReports } from '@/lib/adminReportsSelectionSlice';
import { resetAdmin } from '@/lib/adminSelectionSlice';
import { resetDashboard } from '@/lib/dashboardSelectionSlice';
import { resetGlobalSettings } from '@/lib/globalSelectionSlice';
import { resetAll } from '@/lib/reportSelectionSlice';
import { resetUserActivity } from '@/lib/userActivitySelectionSlice';

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
    dispatch(resetAdminData());
  };

  return { resetStores };
};
