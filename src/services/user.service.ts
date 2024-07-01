import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from './utils/fetch.utils';
import { UserPictureAndName } from './../interfaces/user.interface';

const getUserPictureAndNameById = async (id: string): Promise<UserPictureAndName> => {
  return fetchWithCredentials(`/users/user/id/${id}`);
};

export const useUserPictureAndNameById = (
  id: string,
  options?: Omit<UseQueryOptions<UserPictureAndName, Error, UserPictureAndName>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['userPictureAndName', id],
    queryFn: () => getUserPictureAndNameById(id),
    ...options,
    enabled: !!id && options?.enabled !== false,
  });
};
const getUserPictureAndNameByEmail = async (email: string): Promise<UserPictureAndName> => {
    return fetchWithCredentials(`/users/user/email/${email}`);
  };
  
  export const useUserPictureAndNameByEmail = (
    email: string,
    options?: Omit<UseQueryOptions<UserPictureAndName, Error, UserPictureAndName>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery({
      queryKey: ['getUserPictureAndNameByEmail', email],
      queryFn: () => getUserPictureAndNameByEmail(email),
      ...options,
      enabled: !!email && options?.enabled !== false,
    });
  };
