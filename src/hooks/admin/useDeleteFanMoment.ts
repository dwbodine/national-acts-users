import { FanMomentKey } from '@/types/public';
import { ModifyFanMomentResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useDeleteFanMoment = () => {
  const deleteFanMoment = async (fanMomentKey: FanMomentKey): Promise<ModifyFanMomentResponse> =>
    await adminService.deleteFanMomment(fanMomentKey);

  return { deleteFanMoment };
};
