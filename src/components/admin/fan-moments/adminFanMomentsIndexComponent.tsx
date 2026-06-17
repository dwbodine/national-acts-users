'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Row, Table } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useGetFanMoments } from '@/hooks/common/useGetFanMoments';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { setFanMoments } from '@/lib/adminDataSelectionSlice';
import {
  setAdminDates,
  setAdminSellerId,
  setAllSellers,
  setCountries,
  setFanFilter,
  setReloadCountries,
  setReloadFanMoments,
  setReloadSellers,
  setSelectedFanMoment,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { FanMomentFilter } from '@/types/props';
import { FanMoment } from '@/types/public';
import { GetCountriesResponse, GetFanMomentsResponse, GetSellersResponse } from '@/types/responses';
import { AdminSelection } from '@/types/user';

import ReportDatePicker from '../../common/reportDatePickerControl';
import AdminSellerSelect from '../common/adminSellerSelectComponent';

export default function AdminFanMomentsIndex() {
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const { getSellers } = useGetSellers();
  const { getFanMoments } = useGetFanMoments();
  const dispatch = useDispatch();
  const [tableLoading, setTableLoading] = useState(false);
  const fanMomentsRequestInFlight = useRef(false);
  const currentAdminSelectionRef = useRef(currentAdminSelection);
  const { getAllCountries } = useGetAllCountries();
  const router = useRouter();
  const reloadCountries = currentAdminSelection.reloadCountries;
  const reloadSellers = currentAdminSelection.reloadSellers;
  const reloadFanMoments = currentAdminSelection.reloadFanMoments;
  const selectedSellerId = currentAdminSelection.sellerId;

  useEffect(() => {
    currentAdminSelectionRef.current = currentAdminSelection;
  }, [currentAdminSelection]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (reloadCountries) {
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
      } else if (reloadSellers) {
        dispatch(setReloadSellers(false));
        if (!globalSelection.isLoading) {
          dispatch(setIsLoading(true));
        }
        void getSellers().then((response: GetSellersResponse) => {
          if (response.sellers && !response.error) {
            dispatch(setAllSellers(response.sellers));
          } else {
            toast.error(response.error);
            dispatch(setIsLoading(false));
          }
          dispatch(setReloadFanMoments(true));
        });
      } else if (reloadFanMoments && !fanMomentsRequestInFlight.current) {
        dispatch(setReloadFanMoments(false));
        const adminSelection = { ...currentAdminSelectionRef.current };
        const sellerId: number = selectedSellerId ?? 0;
        if (sellerId === 0) {
          setTableLoading(false);
          dispatch(setIsLoading(false));
          return;
        }

        fanMomentsRequestInFlight.current = true;
        setTableLoading(true);
        if (!globalSelection.isLoading) {
          dispatch(setIsLoading(true));
        }

        const filter: FanMomentFilter = adminSelection.fanFilter
          ? { ...adminSelection.fanFilter }
          : {};
        filter.sellerId = sellerId;
        dispatch(setFanFilter(filter));

        void getFanMoments(filter)
          .then((response: GetFanMomentsResponse) => {
            if (response.fanMoments && !response.error) {
              dispatch(setFanMoments(response.fanMoments));

              if (response.fanMoments?.length > 0) {
                const [firstMoment] = response.fanMoments;
                const lastMoment = response.fanMoments[response.fanMoments.length - 1];
                if (firstMoment && lastMoment) {
                  const start = moment(firstMoment.key.momentDate).unix();
                  const end = moment(lastMoment.key.momentDate).unix();
                  const selection: AdminSelection = {
                    ...adminSelection,
                    end,
                    start,
                  };
                  dispatch(setAdminDates(selection));
                }
              }
            } else {
              toast.error(response.error);
            }
          })
          .finally(() => {
            fanMomentsRequestInFlight.current = false;
            dispatch(setIsLoading(false));
            setTableLoading(false);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    dispatch,
    getAllCountries,
    getFanMoments,
    getSellers,
    globalSelection.isLoading,
    reloadCountries,
    reloadFanMoments,
    reloadSellers,
    selectedSellerId,
  ]);

  const updateSeller = (sellerId: number | null) => {
    if (!sellerId || isNaN(sellerId)) {
      return;
    }
    dispatch(setAdminSellerId(sellerId));
    const filter: FanMomentFilter = currentAdminSelection.fanFilter
      ? { ...currentAdminSelection.fanFilter }
      : {};
    filter.sellerId = sellerId;
    dispatch(setFanFilter(filter));
    onDateChange(undefined, undefined);
  };

  const onDateChange = (newStart: number | undefined, newEnd: number | undefined) => {
    const adminSelection = { ...currentAdminSelection };
    adminSelection.start = newStart;
    adminSelection.end = newEnd;
    const filter: FanMomentFilter = adminSelection.fanFilter ? { ...adminSelection.fanFilter } : {};
    filter.startDate = newStart;
    filter.endDate = newEnd;
    dispatch(setAdminDates(adminSelection));
    dispatch(setFanFilter(filter));
    dispatch(setReloadFanMoments(true));
  };

  const onEndClear = () => {
    onDateChange(currentAdminSelection.start, undefined);
  };

  const onStartClear = () => {
    onDateChange(undefined, currentAdminSelection.end);
  };

  const addMoment = () => {
    if (!currentAdminSelection.sellerId) {
      return;
    }

    const fanMoment: FanMoment = {
      key: {
        momentDate: moment().format('YYYY-MM-DD'),
        sellerId: currentAdminSelection.sellerId,
        eventId: currentAdminSelection.selectedEvent?.externalEventId,
      },
      images: [],
    };

    dispatch(setSelectedFanMoment(fanMoment));
    dispatch(setReloadFanMoments(true));
    router.push('/admin/fan-moments/edit');
  };

  const editMoment = (eventId: number) => {
    if (
      !eventId ||
      isNaN(eventId) ||
      !currentAdminDataSelection.fanMoments ||
      currentAdminDataSelection.fanMoments.length === 0
    ) {
      return;
    }
    const fanMoment: FanMoment | undefined = currentAdminDataSelection.fanMoments.find(
      (x) => x.key.eventId === eventId,
    );
    if (!fanMoment) {
      return;
    }
    dispatch(setSelectedFanMoment(fanMoment));
    router.push('/admin/fan-moments/edit');
  };

  const refrehshData = () => {
    const filter: FanMomentFilter = currentAdminSelection.fanFilter
      ? { ...currentAdminSelection.fanFilter }
      : {};
    filter.startDate = undefined;
    filter.endDate = undefined;
    filter.eventId = undefined;
    dispatch(setFanFilter(filter));
    dispatch(setReloadFanMoments(true));
  };

  const sellectedSellerId = currentAdminSelection.sellerId;

  return (
    <>
      <PageHeader pageTitle="Manage Events" />
      <div className="admin-container">
        <Row>
          <Col>
            <Button hidden={sellectedSellerId === undefined} onClick={addMoment}>
              Add New Event
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <AdminSellerSelect
              Id="refresh"
              Sellers={currentAdminSelection.allSellers}
              SellerId={currentAdminSelection.sellerId}
              OnSellerChange={(sellerId: number | null) => updateSeller(sellerId)}
              Countries={currentAdminSelection.countries}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <ReportDatePicker
              OnChange={onDateChange}
              OnStartClear={onStartClear}
              OnEndClear={onEndClear}
              Start={currentAdminSelection.start}
              End={currentAdminSelection.end}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Button onClick={() => refrehshData()}>Refresh</Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Table
              autoHeight={true}
              data={currentAdminDataSelection.fanMoments}
              bordered
              cellBordered
              loading={tableLoading}
              locale={{ emptyMessage: 'No events found' }}
            >
              <Column flexGrow={1} minWidth={100}>
                <HeaderCell>Date</HeaderCell>
                <Cell>
                  {(rowData: FanMoment) => moment(rowData.key.momentDate).format('MM/DD/YYYY')}
                </Cell>
              </Column>
              <Column flexGrow={3}>
                <HeaderCell>Event</HeaderCell>
                <Cell>{(rowData: FanMoment) => rowData.key.eventTitle}</Cell>
              </Column>
              <Column flexGrow={2}>
                <HeaderCell>Location</HeaderCell>
                <Cell>{(rowData: FanMoment) => rowData.key.eventLocation}</Cell>
              </Column>
              <Column flexGrow={3}>
                <HeaderCell>Images</HeaderCell>
                <Cell>{(rowData: FanMoment) => (rowData.images ? rowData.images.length : 0)}</Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>&nbsp;</HeaderCell>
                <Cell>
                  {(rowData: FanMoment) => (
                    <a
                      href="#"
                      id={`${rowData.key.eventId}_event`}
                      onClick={() => editMoment(parseInt(`${rowData.key.eventId}`))}
                    >
                      Edit
                    </a>
                  )}
                </Cell>
              </Column>
            </Table>
          </Col>
        </Row>
      </div>
    </>
  );
}
