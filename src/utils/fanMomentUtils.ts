import { VipEvent } from '@/types/event';
import { FanMoment } from '@/types/public';

export const getFanMomentEventIds = (fanMoments: FanMoment[] | undefined): Set<number> => {
  const eventIds = (fanMoments ?? [])
    .map((fanMoment) => fanMoment.key.eventId)
    .filter((eventId): eventId is number => typeof eventId === 'number' && !isNaN(eventId));

  return new Set(eventIds);
};

export const filterEventsWithoutFanMomentFolders = (
  events: VipEvent[] | undefined,
  fanMoments: FanMoment[] | undefined,
): VipEvent[] => {
  const existingFanMomentEventIds = getFanMomentEventIds(fanMoments);

  return (events ?? []).filter((event) => !existingFanMomentEventIds.has(event.externalEventId));
};
