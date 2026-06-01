import { FanMoment } from '@/types/public';
import { ModifyFanMomentResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useAddFanMoments = () => {
  const addFanMoments = async (fanMoment: FanMoment): Promise<ModifyFanMomentResponse> =>
    await adminService.addFanMomment(fanMoment);

  return { addFanMoments };
};
