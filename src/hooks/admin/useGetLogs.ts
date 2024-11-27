import { LogResponse } from '@/types/user';
import { authService } from '../../services';

export const useGetLogs = () => {
  const getAllLogs = async (): Promise<LogResponse> => {
    let response: LogResponse = {
      logs: undefined,
      errorMessage: undefined,
    };
    response = await authService.getLogs();
    return response;
  };

  const getAllCronLogs = async (): Promise<LogResponse> => {
    let response: LogResponse = {
      logs: undefined,
      errorMessage: undefined,
    };
    response = await authService.getCronLogs();
    return response;
  };

  return { getAllLogs, getAllCronLogs };
};
