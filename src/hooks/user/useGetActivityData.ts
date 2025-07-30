import { GetActivityResponse, UserActivityType } from '@/types/user';
import { userService } from '@/services';

export const useGetActivityData = () => {
  const getActivityData = async (
    start: number,
    end: number,
    userId: number | undefined = undefined,
    activityType: UserActivityType | undefined = undefined,
    filterAdmins: boolean = false,
  ) => {
    let response: GetActivityResponse = {
      statusCode: 200,
    };
    if (start <= 0 || end <= 0 || start > end) {
      return response;
    }
    response = await userService.getUserActivity(
      start,
      end,
      userId,
      activityType,
      filterAdmins,
    );
    return response;
  };

  return { getActivityData };
};
