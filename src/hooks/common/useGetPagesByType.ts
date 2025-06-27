import { GetPagesResponse } from '@/types/admin';
import { publicService } from '../../services';

export const useGetPagesByType = () => {
  const getPagesByType = async (pageTypeId: number): Promise<GetPagesResponse> => {
    let response: GetPagesResponse = {
      pages: undefined,
      pageError: undefined,
    };
    response = await publicService.getPagesByType(pageTypeId);
    return response;
  };

  return { getPagesByType };
};
