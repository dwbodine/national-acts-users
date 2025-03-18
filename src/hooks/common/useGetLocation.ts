import { Venue } from '@/types/event';
import { eventService } from '../../services';
import { ExternalVenue } from '@/types/admin';

export const useGetLocation = () => {
  const getLocation = (venue: Venue): string => {
    return eventService.getLocationInfoFromVenue(venue);
  };

  const getExternalVenueLocation = (venue: ExternalVenue): string => {
    return eventService.getAddressFromExternalVenue(venue);
  };

  return { getLocation, getExternalVenueLocation };
};
