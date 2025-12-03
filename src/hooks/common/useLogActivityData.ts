import { userService } from '@/services';
import { UserActivityType } from '@/types/user';

export const useLogActivityData = () => {
  const logActivityData = async (
    activityType: UserActivityType,
    activityData: string | undefined = undefined,
    token: string | undefined = undefined,
  ) => {
    if (Number(activityType) <= 0) {
      return false;
    }
    const response = await userService.logUserActivity(activityType, activityData, token);
    return response && response.statusCode === 200;
  };

  return { logActivityData };
};
