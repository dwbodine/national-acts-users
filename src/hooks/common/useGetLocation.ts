import { Venue } from "@/types/event";
import { eventService } from "../../services";

export const useGetLocation = () => {
  const getLocation = (venue: Venue): string => {
    return eventService.getLocationInfoFromVenue(venue);    
  };

  return { getLocation };
};