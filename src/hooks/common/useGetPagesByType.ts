import { GetPagesResponse } from '@/types/responses';

import { publicService } from '../../services';

export const useGetPagesByType = () => {
  const getPagesByType = async (pageTypeId: number): Promise<GetPagesResponse> =>
    await publicService.getPagesByType(pageTypeId);

  return { getPagesByType };
};
