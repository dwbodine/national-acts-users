import { UserSellerResponse } from '@/types/user';
import { userService } from '../../services';

export const useGetUserSeller = () => {
  const getUserSellerFromEventId = async (
    eventId: number,
    userId: number,
  ): Promise<UserSellerResponse> => {
    let response: UserSellerResponse = {
      userSeller: undefined,
      userSellerError: undefined,
    };
    if (eventId > 0 && userId > 0) {
      response = await userService.getUserSellerFromEventId(eventId, userId);
    }
    return response;
  };

  return { getUserSellerFromEventId };
};
