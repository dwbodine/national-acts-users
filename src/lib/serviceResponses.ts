import { AxiosError } from 'axios';

export const getArrayData = <T>(data: unknown): T[] => {
  return Array.isArray(data) ? (data as T[]) : [];
};

export const getErrorMessage = (err: AxiosError, fallback: string): string => {
  return err.message ?? fallback;
};

export const getObjectData = <T extends object>(data: unknown): T => {
  return data === undefined ? ({} as T) : (data as T);
};

export const getOptionalData = <T>(data: unknown): T | undefined => {
  return data === undefined ? undefined : (data as T);
};

export const getStatusCode = (err: AxiosError): number => {
  return err.response?.status ?? 500;
};
