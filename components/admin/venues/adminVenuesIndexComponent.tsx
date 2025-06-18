import { useEffect, useMemo, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setAdminVenue, setReloadVenues, setVenues } from '@/lib/adminSelectionSlice';
import router from 'next/router';
import debouce from 'lodash.debounce';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import React from 'react';
import { useGetAllVenues } from '@/hooks/admin/useGetAllVenues';
import { ExternalVenue, GetExternalVenuesResponse, ModifyExternalVenueResponse } from '@/types/admin';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useDeleteVenue } from '@/hooks/admin/useDeleteVenue';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

export default function AdminVenuesIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllVenues } = useGetAllVenues();
  const { deleteVenue } = useDeleteVenue();
  const { getExternalVenueLocation } = useGetLocation();
  const { Column, HeaderCell, Cell } = Table;
  const [searchTerm, setSearchTerm] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  const debouncedResults = useMemo(() => {
    return debouce(setSearchTerm, 250);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadVenues) {
        dispatch(setReloadVenues(false));
        dispatch(setIsLoading(true));
        setTableLoading(true);
        getAllVenues().then((response: GetExternalVenuesResponse) => {
          if (!response.venueError && response.venues) {
            dispatch(setIsLoading(false));
            dispatch(setVenues(response.venues));            
            setTimeout(() => {              
              setTableLoading(false);  
            }, 300);
          } else {
            setTableLoading(false);  
          }          
        });
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
      debouncedResults.cancel();
    };
  }, [getAllVenues, dispatch, currentAdminSelection, debouncedResults, tableLoading]);

  const editVenue = (venueId: number) => {
    if (!venueId || isNaN(venueId)) {
      return;
    }
    let venue = currentAdminSelection.venues?.find((x) => x.venueId == venueId);
    if (venue) {
      dispatch(setAdminVenue(venue));
      setIsLoading(true);
      router.push('/admin/venues/edit');
    }
  };

  const addVenue = () => {
    let venue: ExternalVenue = {
      venueId: 0,
      venue: '',
      address: '',
      city: '',
    };
    
    dispatch(setAdminVenue(venue));
    setIsLoading(true);
    router.push('/admin/venues/edit');    
  };

  const deleteSelectedVenue = (venueId: number) => {
    if (!venueId || isNaN(venueId)) {
      return;
    }
    let venue = currentAdminSelection.venues?.find((x) => x.venueId == venueId);
    if (venue) {
      deleteVenue(venue.venueId).then((response: ModifyExternalVenueResponse) => {
        if (response.success) {
          dispatch(setAdminVenue(undefined));
          setSearchTerm('');
          toast.success('Venue deleted successfully');
          dispatch(setReloadVenues(true));
        } else {
          toast.error(response.venueError);
        }
      });
    }
  };

  const filterVenues = (venues: ExternalVenue[] | undefined) => {
    let filteredVenues: ExternalVenue[] | undefined = venues;
    if (searchTerm && searchTerm.length >= 2 && venues && venues.length > 0) {
      const srch = searchTerm.toLowerCase();
      filteredVenues = venues.filter((venue) => {
        return (
          venue.venue?.toLowerCase().includes(srch) ||
          venue.address?.toLowerCase().includes(srch) ||
          venue.city?.toLowerCase().includes(srch) ||
          venue.state?.toLowerCase().includes(srch) ||
          venue.country?.countryName?.toLowerCase().includes(srch)
        );
      });
    }
    return filteredVenues;
  };

  const filteredVenues = filterVenues(currentAdminSelection.venues);

  return (
    <div className="admin-container">
      <h3>External Event Venues Admin</h3>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control search-text-input no-print"
        placeholder="Search for venues by name or address..."
        hidden={currentAdminSelection.venues == undefined}
      />
      <Button onClick={addVenue}>Add</Button>
      <Table
        height={500}
        data={filteredVenues}
        bordered
        cellBordered
        loading={tableLoading}
        wordWrap={true}
      >
        <Column flexGrow={2}>
          <HeaderCell>Venue</HeaderCell>
          <Cell className="admin-click-cell">
            {(rowData) => {
              return (
                <div id={rowData.venueId} onClick={() => editVenue(parseInt(`${rowData.venueId}`))}>
                  {rowData.venue}
                </div>
              );
            }}
          </Cell>
        </Column>
        <Column flexGrow={4}>
          <HeaderCell>Address</HeaderCell>
          <Cell className="admin-click-cell">
            {(rowData) => {
              let venue = rowData as ExternalVenue;
              return (
                <div id={rowData.venueId} onClick={() => editVenue(parseInt(`${rowData.venueId}`))}>
                  {getExternalVenueLocation(venue)}
                </div>
              );
            }}
          </Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell> </HeaderCell>
          <Cell>
            {(rowData) => {
              return !rowData.hasEvents ?
                (
                  <a className="admin-command-link" id={rowData.venueId} onClick={() => deleteSelectedVenue(parseInt(`${rowData.venueId}`))}>
                    Delete
                  </a>
                ) : ''
            }}
          </Cell>
        </Column>
      </Table>
      <AdminListHomeButton />
    </div>
  );
}
