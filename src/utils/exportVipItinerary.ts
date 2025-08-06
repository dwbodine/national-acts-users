import { UserSeller } from '@/types/user';
import { VipEvent } from '@/types/event';
import { getEventStatusText } from './eventUtils';
import moment from 'moment';

const exportVipItineraryToPdf = (
  events: VipEvent[],
  seller: UserSeller,
  sellerHomePage: string,
  isAdmin: boolean,
): Promise<void> => {
  const p = Promise.resolve();
  return p;
};

const exportVipItineraryToCSV = (
  events: VipEvent[],
  seller: UserSeller,
  isAdmin: boolean,
): Promise<string> => {
  let csvString = '';
  if (seller && events.length > 0) {
    csvString +=
      '"Date","Venue","City/State","Full Address","Ticket Link","VIP Link","VIP Link Status","VIP Link in BandsInTown"\n';
    events.forEach((evt) => {
      if (evt.isDeleted === false) {
        csvString += `"${moment(evt.eventDate).format('MM/DD/YYYY')}",`;
        csvString += `"${evt.venue?.name}",`;
        let cityState = `${evt.venue?.city}`;
        if (evt.venue?.state) {
          cityState += `, ${evt.venue?.state}`;
        }
        csvString += `"${cityState}",`;
        let fullAddress = `${evt.venue?.address1}, ${cityState} ${evt.venue?.postalCode}`;
        if (
          evt.venue?.country &&
          evt.venue.country.countryName !== 'USA' &&
          evt.venue.country.countryName !== 'US' &&
          evt.venue.country.countryName !== 'United State'
        ) {
          fullAddress += ` ${evt.venue.country.countryName}`;
        }
        csvString += `"${fullAddress}",`;
        csvString += `"${evt.externalUrl ?? 'n/a'}",`;
        csvString += `"${evt.ticketSocketUrl ?? 'n/a'}",`;
        let linkStatus = getEventStatusText(evt, isAdmin);
        if (!evt.ticketSocketUrl) {
          linkStatus = 'NO VIP';
        } else if (linkStatus === 'Active') {
          linkStatus = 'Live';
        }
        csvString += `"${linkStatus}",`;
        csvString += `"${evt.isAddedToBandsInTown ? 'Yes' : 'No'}"\n`;
      }
    });
  }
  return Promise.resolve(csvString);
};

export { exportVipItineraryToPdf, exportVipItineraryToCSV };
