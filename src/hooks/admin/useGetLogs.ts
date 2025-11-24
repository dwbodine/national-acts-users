import { LogResponse } from '@/types/responses';
import { authService } from '../../services';

export const useGetLogs = () => {
  const getAllCronLogs = async (): Promise<LogResponse> => await authService.getCronLogs();

  const getAllLogs = async (): Promise<LogResponse> => await authService.getLogs();

  return { getAllCronLogs, getAllLogs };
};
