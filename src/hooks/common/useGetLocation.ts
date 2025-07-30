import { ExternalVenue } from '@/types/admin';
import { Venue } from '@/types/event';
import { eventService } from '../../services';

export const useGetLocation = () => {
  const getExternalVenueLocation = (venue: ExternalVenue): string =>
    eventService.getAddressFromExternalVenue(venue);

  const getLocation = (venue: Venue): string =>
    eventService.getLocationInfoFromVenue(venue);

  return { getExternalVenueLocation, getLocation };
};
