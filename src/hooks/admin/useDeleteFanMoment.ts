import { FanMoment } from '@/types/public';
import { ModifyFanMomentResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useDeleteFanMoment = () => {
  const deleteFanMoment = async (fanMoment: FanMoment): Promise<ModifyFanMomentResponse> =>
    await adminService.deleteFanMomment(fanMoment);

  return { deleteFanMoment };
};
