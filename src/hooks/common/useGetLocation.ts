import { ExternalVenue } from '@/types/admin';
import { Venue } from '@/types/event';
import { getAddressFromExternalVenue, getLocationInfoFromVenue } from '@/utils/eventUtils';

export const useGetLocation = () => {
  const getExternalVenueLocation = (venue: ExternalVenue): string =>
    getAddressFromExternalVenue(venue);

  const getLocation = (venue: Venue): string => getLocationInfoFromVenue(venue);

  return { getExternalVenueLocation, getLocation };
};
