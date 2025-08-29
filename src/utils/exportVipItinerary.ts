import { UserSeller } from '@/types/user';
import { VipEvent } from '@/types/event';
import { getEventStatusText } from './eventUtils';
import moment from 'moment';

const exportVipItineraryToHtml = (
  events: VipEvent[],
  title: string,
  sellerHomePage: string,
  isAdmin: boolean,
): Promise<string> => {
  let htmlString = `<div class="pdf-header">`;
  htmlString += `<h1>${title}</h1><p>`;
  if (sellerHomePage) {
    htmlString += `Your homepage for all of your VIPs is located here: <a href="${sellerHomePage}" target="_blank">${sellerHomePage}</a><br />`;
  }
  htmlString += `<div class="pdf-body">`;
  htmlString += `<table class="pdf-table">`;
  htmlString += `<tr><th>Date</th><th>Venue</th><th>City / State</th><th>Full Address</th><th class="pdf-link-column">Ticket Link</th><th class="pdf-link-column">VIP Link</th><th>VIP Link Status</th><th>VIP Link in BandsInTown</th></tr>`;
  events.forEach((evt) => {
    if (evt.isDeleted === false) {
      htmlString += `<tr><td>${moment(evt.eventDate).format('MM/DD/YYYY')}</td>`;
      htmlString += `<td>${evt.venue?.name}</td>`;
      let cityState = `${evt.venue?.city}`;
      if (evt.venue?.state) {
        cityState += `, ${evt.venue?.state}`;
      }
      htmlString += `<td>${cityState}</td>`;
      let fullAddress = `${evt.venue?.address1}, ${cityState} ${evt.venue?.postalCode}`;
      if (
        evt.venue?.country &&
        evt.venue.country.countryName !== 'USA' &&
        evt.venue.country.countryName !== 'US' &&
        evt.venue.country.countryName !== 'United State'
      ) {
        fullAddress += ` ${evt.venue.country.countryName}`;
      }
      htmlString += `<td>${fullAddress}</td>`;
      if (evt.externalUrl) {
        htmlString += `<td class="pdf-link-column"><a title="Ticket Link" href="${evt.externalUrl}" target="_blank">${evt.externalUrl}</a></td>`;
      } else {
        htmlString += `<td class="pdf-link-column">n/a</td>`;
      }
      if (evt.ticketSocketUrl) {
        htmlString += `<td class="pdf-link-column"><a title="VIP Link" href="${evt.ticketSocketUrl}" target="_blank">${evt.ticketSocketUrl}</a></td>`;
      } else {
        htmlString += `<td class="pdf-link-column">n/a</td>`;
      }
      let linkStatus = getEventStatusText(evt, isAdmin);
      if (!evt.ticketSocketUrl) {
        linkStatus = 'NO VIP';
      } else if (linkStatus === 'Active') {
        linkStatus = 'Live';
      }
      htmlString += `<td>${linkStatus}</td>`;
      htmlString += `<td>${evt.isAddedToBandsInTown ? 'Yes' : 'Not Yet'}</td></tr>`;
    }
  });
  htmlString += `</table>`;
  htmlString += `</div>`;
  return Promise.resolve(htmlString);
};

const exportVipItineraryToCSV = (
  events: VipEvent[],
  seller: UserSeller,
  isAdmin: boolean,
): Promise<string> => {
  let csvString = '';
  if (seller && events.length > 0) {
    csvString +=
      '"Date","Venue","City / State","Full Address","Ticket Link","VIP Link","VIP Link Status","VIP Link in BandsInTown"\n';
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
        csvString += `"${evt.isAddedToBandsInTown ? 'Yes' : 'Not Yet'}"\n`;
      }
    });
  }
  return Promise.resolve(csvString);
};

export { exportVipItineraryToHtml, exportVipItineraryToCSV };
