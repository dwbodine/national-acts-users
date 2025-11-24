import { GetPageTypesResponse } from '@/types/responses';
import { publicService } from '../../services';

export const useGetPageTypes = () => {
  const getPageTypes = async (
    sellerTypesOnly: boolean = false,
  ): Promise<GetPageTypesResponse> => await publicService.getPageTypes(sellerTypesOnly);

  return { getPageTypes };
};
