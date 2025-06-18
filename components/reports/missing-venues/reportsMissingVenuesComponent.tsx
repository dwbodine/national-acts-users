import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import ReportsListHomeButton from '../reportsListHomeButton';
import { GetEventsResponse, Venue, VipEvent } from '@/types/event';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useGetMissingVenueEvents } from '@/hooks/report/useGetMissingVenueEvents';
import { Table } from 'rsuite';
import moment from 'moment';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { setReloadReportData } from '@/lib/adminReportsSelectionSlice';
import { resetAdmin } from '@/lib/adminSelectionSlice';
import { Button } from 'react-bootstrap';
import { DEFAULT_COUNTRY_ID } from '@/constants';

export default function ReportsMissingVenues() {
  const { Column, HeaderCell, Cell } = Table;
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const currentAdminReportSelection = useSelector(
    (state: RootState) => state.adminReportSelection,
  );
  const dispatch = useDispatch();
  const { getMissingVenueEvents } = useGetMissingVenueEvents();
  const { getLocation } = useGetLocation();
  const [events, setEvents] = useState<VipEvent[] | undefined>(undefined);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminReportSelection.reloadData) {
        dispatch(setReloadReportData(false));
        dispatch(setIsLoading(true));
        getMissingVenueEvents().then((response: GetEventsResponse) => {
          setEvents(response.events);
          dispatch(setIsLoading(false));
        })
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminReportSelection, globalSelection.isLoading, dispatch, getMissingVenueEvents]);

  const editEvent = (eventId: number) => {
      dispatch(resetAdmin());
      window.open(`/admin/events/edit?id=${eventId}`)
  };

  const getVenueInformation = (venue: Venue): string => {
    let location = `${venue.name}, ${venue.address1}`;
    if (venue.address2 && venue.address2.trim() != '') {
      location += `, ${venue.address2}`;
    }
    location += `, ${venue.city}`;
    if (venue.state && venue.state.trim() != '') {
      location += `, ${venue.state}`;
    }
    if (venue.postalCode && venue.postalCode.trim() != '') {
      location += ` ${venue.postalCode}`;
    }
    if (
      venue.country && venue.country.countryName && 
      venue.country.countryId != DEFAULT_COUNTRY_ID
    ) {
      location += ', ' + venue.country.countryName;
    }
    return location;
  };

  const refresh = () => {
    dispatch(setReloadReportData(true));
  }

  return (
    <div className="admin-container">
      <h3>Missing Venue Report</h3>
      <ReportsListHomeButton /><Button onClick={refresh}>Refresh</Button>
      <div className='mt-4'>Total events missing venues: {events?.length ?? 0}</div>
      <Table
            autoHeight={true}
            data={events}
            bordered
            cellBordered
          >
        <Column flexGrow={1} minWidth={100}>
          <HeaderCell>Date</HeaderCell>
          <Cell>
            {(rowData: VipEvent) => moment(rowData.eventDate).format('MM/DD/YYYY')}
          </Cell>
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Title</HeaderCell>
          <Cell>{(rowData: VipEvent) => rowData.title}</Cell>
        </Column>
        <Column flexGrow={3}>
          <HeaderCell>Venue (from TicketSocket data)</HeaderCell>
          <Cell>
            {(rowData: VipEvent) => (rowData.venue ? getVenueInformation(rowData.venue) : '')}
          </Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell> </HeaderCell>
          <Cell>
            {(rowData: VipEvent) =>
                <a
                  href="#"
                  id={`${rowData.externalEventId}_event`}
                  onClick={() => editEvent(parseInt(`${rowData.externalEventId}`))}
                >
                  Edit
                </a>
                }
          </Cell>
        </Column>
      </Table>

      
      
    </div>
  );
}
