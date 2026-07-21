'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Row, Table } from 'rsuite';

import ConfirmationDialog from '@/components/common/confirmationDialogComponent';
import PageHeader from '@/components/common/PageHeaderComponent';
import { useDeleteFanMoment } from '@/hooks/admin/useDeleteFanMoment';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useGetFanMoments } from '@/hooks/common/useGetFanMoments';
import { setFanMoments } from '@/lib/adminDataSelectionSlice';
import {
  setAdminDates,
  setFanFilter,
  setReloadFanMoments,
  setSelectedFanMoment,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { FanMomentFilter } from '@/types/props';
import { FanMoment } from '@/types/public';
import { GetFanMomentsResponse, ModifyFanMomentResponse } from '@/types/responses';
import { AdminSelection, EnumPermission, Permission } from '@/types/user';

import ReportDatePicker from '../common/reportDatePickerControl';
import SelectSeller from '../common/selectSellerComponent';

export default function AdminFanMomentsIndex() {
  const { Column, HeaderCell, Cell } = Table;
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const { getFanMoments } = useGetFanMoments();
  const { deleteFanMoment } = useDeleteFanMoment();
  const dispatch = useDispatch();
  const [tableLoading, setTableLoading] = useState(false);
  const fanMomentsRequestInFlight = useRef(false);
  const currentAdminSelectionRef = useRef(currentAdminSelection);
  const { getAllCountries } = useGetAllCountries();
  const router = useRouter();
  const reloadCountries = currentAdminSelection.reloadCountries;
  const reloadFanMoments = currentAdminSelection.reloadFanMoments;
  const selectedSellerId = currentReportSelection.seller?.sellerId;

  useEffect(() => {
    currentAdminSelectionRef.current = currentAdminSelection;
  }, [currentAdminSelection]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (reloadFanMoments && !fanMomentsRequestInFlight.current) {
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
    globalSelection.isLoading,
    reloadCountries,
    reloadFanMoments,
    selectedSellerId,
  ]);

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
    if (!currentReportSelection.seller?.sellerId) {
      return;
    }

    const fanMoment: FanMoment = {
      key: {
        momentDate: moment().format('YYYY-MM-DD'),
        sellerId: currentReportSelection.seller.sellerId,
        eventId: currentAdminSelection.selectedEvent?.externalEventId,
      },
      images: [],
    };

    dispatch(setSelectedFanMoment(fanMoment));
    dispatch(setReloadFanMoments(true));
    router.push('/fan-moments/edit');
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
    router.push('/fan-moments/edit');
  };

  const refreshData = () => {
    const filter: FanMomentFilter = currentAdminSelection.fanFilter
      ? { ...currentAdminSelection.fanFilter }
      : {};
    filter.startDate = undefined;
    filter.endDate = undefined;
    filter.eventId = undefined;
    dispatch(setFanFilter(filter));
    dispatch(setReloadFanMoments(true));
  };

  const confirmDelete = (eventId: number) => {
    const message =
      'By clicking Yes this gallery and all images will be permanently deleted from the server.';

    toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        ConfirmSureText="Are you sure you want to delete this fan moment gallery?"
        OnConfirm={() => deleteMoment(eventId)}
        OnCancel={() => {
          toast.dismiss();
        }}
      />,
      {
        autoClose: false,
        closeOnClick: false,
        position: 'top-center',
      },
    );
  };

  const deleteMoment = (eventId: number) => {
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
    if (
      !fanMoment ||
      !fanMoment.key ||
      !fanMoment.key.eventId ||
      !fanMoment.key.sellerId ||
      !fanMoment.key.momentDate
    ) {
      return;
    }

    toast.dismiss();

    dispatch(setIsLoading(true));

    void deleteFanMoment(fanMoment.key).then((response: ModifyFanMomentResponse) => {
      if (response.success) {
        dispatch(setReloadFanMoments(true));
        dispatch(setSelectedFanMoment(undefined));
        toast.success('Fan moment deleted successfully');
      } else {
        toast.error(response.error ?? 'Error occurred while deleting fan moment');
      }
      dispatch(setIsLoading(false));
    });
  };

  const sellectedSellerId = currentReportSelection.seller?.sellerId;

  const filterByPermissions: Permission[] = [{ permissionId: EnumPermission.UploadFanMoments }];

  return (
    <>
      <PageHeader pageTitle="Manage Fan Moments" />
      <div className="admin-container">
        <Row>
          <Col>
            <Button hidden={sellectedSellerId === undefined} onClick={addMoment}>
              Add Event Gallery
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <SelectSeller filterByPermissions={filterByPermissions} />
          </Col>
        </Row>
        <Row>
          <Col xs={24} hidden={sellectedSellerId === undefined}>
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
            <Button hidden={sellectedSellerId === undefined} onClick={() => refreshData()}>
              Refresh
            </Button>
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
                <HeaderCell>Venue</HeaderCell>
                <Cell>{(rowData: FanMoment) => rowData.key.eventLocation}</Cell>
              </Column>
              <Column flexGrow={3}>
                <HeaderCell># of Images</HeaderCell>
                <Cell>{(rowData: FanMoment) => (rowData.images ? rowData.images.length : 0)}</Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>&nbsp;</HeaderCell>
                <Cell>
                  {(rowData: FanMoment) => (
                    <a
                      href="#"
                      id={`${rowData.key.eventId}_edit_event`}
                      onClick={() => editMoment(parseInt(`${rowData.key.eventId}`))}
                    >
                      Edit
                    </a>
                  )}
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>&nbsp;</HeaderCell>
                <Cell>
                  {(rowData: FanMoment) => (
                    <a
                      href="#"
                      id={`${rowData.key.eventId}_delete_event`}
                      onClick={() => confirmDelete(parseInt(`${rowData.key.eventId}`))}
                    >
                      Delete
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
