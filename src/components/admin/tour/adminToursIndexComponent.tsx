'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Row, Table } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetAdminSellerEvents } from '@/hooks/admin/useGetAdminSellerEvents';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useGetTours } from '@/hooks/admin/useGetTours';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import {
  setAdminEvents,
  setAdminSellerId,
  setAdminTour,
  setAllSellers,
  setCountries,
  setReloadCountries,
  setReloadTours,
  setTours,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { Tour } from '@/types/event';
import {
  GetCountriesResponse,
  GetEventsResponse,
  GetSellersResponse,
  GetToursResponse,
} from '@/types/responses';

import AdminSellerSelect from '../common/adminSellerSelectComponent';

export default function AdminToursIndex() {
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const { getSellers } = useGetSellers();
  const { getTours } = useGetTours();
  const { getAdminSellerEvents } = useGetAdminSellerEvents();
  const { getAllCountries } = useGetAllCountries();
  const dispatch = useDispatch();
  const [tableLoading, setTableLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadCountries) {
        dispatch(setReloadCountries(false));
        dispatch(setIsLoading(true));
        void getAllCountries().then((response: GetCountriesResponse) => {
          if (response.countries && !response.error) {
            dispatch(setCountries(response.countries));
          } else {
            toast.error(response.error);
            dispatch(setIsLoading(false));
          }
        });
      } else if (currentAdminSelection.allSellers === undefined) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        dispatch(setAdminSellerId(undefined));
        dispatch(setReloadTours(true));
        void getSellers().then((response: GetSellersResponse) => {
          dispatch(setAllSellers(response.sellers));
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.reloadTours) {
        dispatch(setReloadTours(false));
        const adminSelection = { ...currentAdminSelection };
        if (!adminSelection.sellerId) {
          setTableLoading(false);
          return;
        }
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getTours(adminSelection.sellerId).then((response: GetToursResponse) => {
          if (response.error) {
            dispatch(setIsLoading(false));
            setTableLoading(false);
          } else {
            if (response.tours) {
              dispatch(setTours(response.tours));
            }
            if (currentAdminSelection.sellerId) {
              void getAdminSellerEvents([currentAdminSelection.sellerId]).then(
                (resp: GetEventsResponse) => {
                  if (resp.events && !resp.error) {
                    const filteredEvents = resp.events.filter((x) => !x.isDeleted);
                    if (filteredEvents) {
                      dispatch(setAdminEvents(filteredEvents));
                    }
                  }
                  dispatch(setIsLoading(false));
                  setTableLoading(false);
                },
              );
            } else {
              dispatch(setIsLoading(false));
              setTableLoading(false);
            }
          }
        });
      } else if (currentAdminSelection.tours !== undefined && tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, getSellers, currentAdminSelection, getTours, tableLoading, getAdminSellerEvents]);

  const updateSeller = (sellerId: number | null) => {
    const updateSellerId = sellerId && !isNaN(sellerId) ? sellerId : undefined;
    dispatch(setAdminSellerId(updateSellerId));
    dispatch(setReloadTours(true));
  };

  const editTour = (tourId: number) => {
    if (
      !tourId ||
      isNaN(tourId) ||
      !currentAdminSelection.tours ||
      currentAdminSelection.tours.length === 0
    ) {
      return;
    }
    const tour = currentAdminSelection.tours.find((x) => x.tourId === tourId);
    if (!tour) {
      return;
    }
    dispatch(setAdminTour(tour));
    setTableLoading(true);
    router.push('/admin/tour/edit');
  };

  const addTour = () => {
    if (!currentAdminSelection.sellerId) {
      toast.error('Must select a seller first');
      return;
    } else if (!currentAdminSelection.events || currentAdminSelection.events.length === 0) {
      toast.error('No future events to add to a tour');
      return;
    }

    const seller = currentAdminSelection.allSellers?.find(
      (x) => x.sellerId === currentAdminSelection.sellerId,
    );

    if (!seller) {
      return;
    }

    const tour: Tour = {
      announceDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      events: [],
      isActive: true,
      sellers: [seller],
      tourId: 0,
      tourName: '',
    };
    dispatch(setAdminTour(tour));
    setTableLoading(true);
    router.push('/admin/tour/edit');
  };

  return (
    <>
      <PageHeader pageTitle="Tour Admin" />
      <div className="admin-container">
        <AdminSellerSelect
          Id="refresh"
          Sellers={currentAdminSelection.allSellers}
          SellerId={currentAdminSelection.sellerId}
          OnSellerChange={(sellerId: number | null) => updateSeller(sellerId)}
          Countries={currentAdminSelection.countries}
        />
        <Row>
          <Col xs={24}>
            <Table
              autoHeight={true}
              data={currentAdminSelection.tours}
              bordered
              cellBordered
              loading={tableLoading}
            >
              <Column flexGrow={3}>
                <HeaderCell>Tour Name</HeaderCell>
                <Cell>{(rowData: Tour) => rowData.tourName}</Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell># of shows</HeaderCell>
                <Cell>{(rowData: Tour) => (rowData.events ? rowData.events.length : 0)}</Cell>
              </Column>
              <Column flexGrow={1} minWidth={100}>
                <HeaderCell>Announce Date (in Pacific Time)</HeaderCell>
                <Cell>
                  {(rowData: Tour) =>
                    rowData.announceDate
                      ? moment(rowData.announceDate).format('M/DD/YYYY h:mm A')
                      : ''
                  }
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>First show</HeaderCell>
                <Cell>
                  {(rowData: Tour) =>
                    rowData.events && rowData.events.length > 0 && rowData.events[0]
                      ? `${moment(rowData.events[0].eventDate).format('M/DD/YYYY')} (${rowData.events[0].venue?.city}, ${rowData.events[0].venue?.state})`
                      : ''
                  }
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>Last show</HeaderCell>
                <Cell>
                  {(rowData: Tour) =>
                    rowData.events &&
                    rowData.events.length > 0 &&
                    rowData.events[rowData.events.length - 1]
                      ? `${moment(rowData.events[rowData.events.length - 1]?.eventDate).format('M/DD/YYYY')} (${rowData.events[rowData.events.length - 1]?.venue?.city}, ${rowData.events[rowData.events.length - 1]?.venue?.state})`
                      : ''
                  }
                </Cell>
              </Column>
              <Column flexGrow={2}>
                <HeaderCell>Status</HeaderCell>
                <Cell>{(rowData: Tour) => (rowData.isActive ? 'Active' : 'Inactive')}</Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>&nbsp;</HeaderCell>
                <Cell>
                  {(rowData: Tour) =>
                    rowData.tourId ? (
                      <a
                        href="#"
                        id={`${rowData.tourId}_tour`}
                        onClick={() => editTour(parseInt(`${rowData.tourId}`))}
                      >
                        Edit
                      </a>
                    ) : (
                      ''
                    )
                  }
                </Cell>
              </Column>
            </Table>
            <Button onClick={addTour}>Add</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}
