import { FanMoment } from '@/types/public';
import { ModifyFanMomentResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useUpdateFanMoment = () => {
  const updateFanMoment = async (fanMoment: FanMoment): Promise<ModifyFanMomentResponse> =>
    await adminService.updateFanMoment(fanMoment);

  return { updateFanMoment };
};
