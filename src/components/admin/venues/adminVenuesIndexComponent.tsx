'use client';

import { Button, Col, Input, Row } from 'rsuite';
import {
  GetExternalVenuesResponse,
  ModifyExternalVenueResponse,
} from '@/types/responses';
import { Pagination, Table } from 'rsuite';
import React, { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import {
  setAdminVenue,
  setReloadVenues,
  setVenueSearchTerm,
  setVenues,
} from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import AdminListHomeButton from '../adminListHomeButton';
import { ExternalVenue } from '@/types/admin';
import { RootState } from '@/lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useDeleteVenue } from '@/hooks/admin/useDeleteVenue';
import { useGetAllVenues } from '@/hooks/admin/useGetAllVenues';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useRouter } from 'next/navigation';

export default function AdminVenuesIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllVenues } = useGetAllVenues();
  const { deleteVenue } = useDeleteVenue();
  const { getExternalVenueLocation } = useGetLocation();
  const { Column, HeaderCell, Cell } = Table;
  const [tableLoading, setTableLoading] = useState(true);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(
    currentAdminSelection.venueSearchTerm,
  );
  const router = useRouter();

  const searchVenues = useCallback(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setTableLoading(false);
      return;
    }
    dispatch(setReloadVenues(false));
    dispatch(setIsLoading(true));
    setTableLoading(true);
    void getAllVenues(searchTerm).then((response: GetExternalVenuesResponse) => {
      if (!response.error && response.venues) {
        dispatch(setVenues(response.venues));
      } else {
        toast.error(response.error);
      }
      dispatch(setVenueSearchTerm(searchTerm));
      dispatch(setIsLoading(false));
      setTimeout(() => {
        setTableLoading(false);
      }, 300);
    });
  }, [dispatch, getAllVenues, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        currentAdminSelection.reloadVenues &&
        currentAdminSelection.venueSearchTerm &&
        currentAdminSelection.venueSearchTerm.length >= 3
      ) {
        searchVenues();
      } else {
        dispatch(setReloadVenues(false));
        setTableLoading(false);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchVenues, currentAdminSelection, searchTerm, dispatch]);

  const editVenue = (venueId: number) => {
    if (!venueId || isNaN(venueId)) {
      return;
    }
    const venue = currentAdminSelection.venues?.find((x) => x.venueId === venueId);
    if (venue) {
      dispatch(setAdminVenue(venue));
      setIsLoading(true);
      router.push('/admin/venues/edit');
    }
  };

  const addVenue = () => {
    const venue: ExternalVenue = {
      address: '',
      city: '',
      venue: '',
      venueId: 0,
    };

    dispatch(setAdminVenue(venue));
    setIsLoading(true);
    router.push('/admin/venues/edit');
  };

  const deleteSelectedVenue = (venueId: number) => {
    if (!venueId || isNaN(venueId)) {
      return;
    }
    const venue = currentAdminSelection.venues?.find((x) => x.venueId === venueId);
    if (venue) {
      void deleteVenue(venue.venueId).then((response: ModifyExternalVenueResponse) => {
        if (response.success) {
          dispatch(setAdminVenue(undefined));
          dispatch(setVenueSearchTerm(''));
          toast.success('Venue deleted successfully');
          dispatch(setReloadVenues(true));
        } else {
          toast.error(response.error);
        }
      });
    }
  };

  const handleChangeLimit = (dataKey: React.SetStateAction<number>) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = currentAdminSelection.venues?.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  const clearVenues = () => {
    dispatch(setVenueSearchTerm(undefined));
    dispatch(setVenues(undefined));
    setSearchTerm('');
  };

  const submitOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchVenues();
    }
  };

  return (
    <div className="admin-container">
      <Row>
        <Col>
          <h3>External Event Venues Admin</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={addVenue}>Add</Button>
          <AdminListHomeButton />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <Input
            value={searchTerm ?? ''}
            onChange={setSearchTerm}
            onKeyDown={submitOnEnter}
            className="form-control search-text-input no-print"
            placeholder="Search for venues by name or address..."
          />
        </Col>
        <Col>
          <Button onClick={searchVenues}>Search</Button>
          <Button onClick={clearVenues}>Clear</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            height={500}
            data={data}
            bordered
            cellBordered
            loading={tableLoading}
            wordWrap={true}
          >
            <Column flexGrow={2}>
              <HeaderCell>Venue</HeaderCell>
              <Cell className="admin-click-cell">
                {(rowData) => {
                  const venue = rowData as ExternalVenue;
                  return (
                    <div
                      id={venue.venueId.toString()}
                      onClick={() => editVenue(parseInt(`${venue.venueId}`))}
                    >
                      {venue.venue}
                    </div>
                  );
                }}
              </Cell>
            </Column>
            <Column flexGrow={4}>
              <HeaderCell>Address</HeaderCell>
              <Cell className="admin-click-cell">
                {(rowData: ExternalVenue) => {
                  return (
                    <div
                      id={rowData.venueId.toString()}
                      onClick={() => editVenue(parseInt(`${rowData.venueId}`))}
                    >
                      {getExternalVenueLocation(rowData)}
                    </div>
                  );
                }}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell> </HeaderCell>
              <Cell>
                {(rowData: ExternalVenue) => {
                  return rowData.hasEvents ? (
                    ''
                  ) : (
                    <a
                      className="admin-command-link"
                      id={rowData.venueId.toString()}
                      onClick={() => deleteSelectedVenue(parseInt(`${rowData.venueId}`))}
                    >
                      Delete
                    </a>
                  );
                }}
              </Cell>
            </Column>
          </Table>
          <div style={{ padding: 20 }}>
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={5}
              size="xs"
              layout={['total', '-', 'limit', '|', 'pager', 'skip']}
              total={currentAdminSelection.venues?.length ?? 0}
              limitOptions={[10, 30, 50]}
              limit={limit}
              activePage={page}
              onChangePage={setPage}
              onChangeLimit={handleChangeLimit}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
