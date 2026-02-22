'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Row } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useGetRefreshHistory } from '@/hooks/admin/useGetRefreshHistory';
import { useRefreshEventsFromTicketSocket } from '@/hooks/admin/useRefreshEventsFromTicketSocket';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import {
  setAdminDates,
  setAdminSellerId,
  setAllSellers,
  setCountries,
  setReloadCountries,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { TicketSocketRefreshHistory } from '@/types/event';
import {
  GetCountriesResponse,
  GetRefreshHistoryResponse,
  GetSellersResponse,
  RefreshHistoryResponse,
} from '@/types/responses';

import ReportDatePicker from '../../common/reportDatePickerControl';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import RefreshTicketSocketDataResults from './refreshTicketSocketDataResults';
import RefreshTicketSocketHistoryTable from './refreshTicketSocketHistoryTable';

export default function RefreshTicketSocketData() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const { getSellers } = useGetSellers();
  const { getRefreshHistory } = useGetRefreshHistory();
  const { refreshEventsFromTicketSocket } = useRefreshEventsFromTicketSocket();
  const { getAllCountries } = useGetAllCountries();
  const dispatch = useDispatch();
  const [updateResults, setUpdateResults] = useState<TicketSocketRefreshHistory | undefined>(
    undefined,
  );
  const [history, setHistory] = useState<TicketSocketRefreshHistory[] | undefined>(undefined);

  useEffect(() => {
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
      dispatch(setIsLoading(true));
      dispatch(setAdminSellerId(undefined));
      void getSellers().then((response: GetSellersResponse) => {
        dispatch(setAllSellers(response.sellers));
        dispatch(setIsLoading(false));
      });
    } else if (history === undefined) {
      dispatch(setIsLoading(true));
      void getRefreshHistory().then((response: GetRefreshHistoryResponse) => {
        setHistory(response.history);
        dispatch(setIsLoading(false));
      });
    }
  }, [dispatch, getSellers, getRefreshHistory, updateResults, history, currentAdminSelection]);

  const updateSeller = (sellerId: number | null) => {
    if (!sellerId || isNaN(sellerId)) {
      return;
    }
    dispatch(setAdminSellerId(sellerId));
  };

  const onDateChange = (newStart: number, newEnd: number) => {
    const adminSelection = { ...currentAdminSelection };
    adminSelection.start = newStart;
    adminSelection.end = newEnd;
    dispatch(setAdminDates(adminSelection));
  };

  const submitReset = () => {
    const adminSelection = { ...currentAdminSelection };
    if (!adminSelection.sellerId) {
      toast.warning('Must select a seller');
      return;
    }
    dispatch(setIsLoading(true));
    void refreshEventsFromTicketSocket(
      adminSelection.sellerId,
      adminSelection.start,
      adminSelection.end,
    )
      .then((response: RefreshHistoryResponse) => {
        if (response.results && !response.error) {
          setUpdateResults(response.results);
          void getRefreshHistory()
            .then((response: GetRefreshHistoryResponse) => {
              if (response.history && !response.error) {
                setHistory(response.history);
              } else {
                toast.error(response.error);
              }
              dispatch(setIsLoading(false));
            })
            .catch(() => {
              toast.error('Error fetching refresh history');
              dispatch(setIsLoading(false));
            });
        } else {
          toast.error(response.error);
          dispatch(setIsLoading(false));
        }
      })
      .catch(() => {
        toast.error('Error fetching refresh results');
        dispatch(setIsLoading(false));
      });
  };

  return (
    <>
      <PageHeader pageTitle="Refresh TicketSocket Data" />
      <div className="admin-container">
        <Row className="admin-refresh-header-row">
          <Col md={12} sm={24}>
            <AdminSellerSelect
              Id="refresh"
              Sellers={currentAdminSelection.allSellers}
              SellerId={currentAdminSelection.sellerId}
              OnSellerChange={(sellerId: number | null) => updateSeller(sellerId)}
              Countries={currentAdminSelection.countries}
            />
            <ReportDatePicker
              OnChange={onDateChange}
              Start={currentAdminSelection.start}
              End={currentAdminSelection.end}
            />
            <Row>
              <Col>
                <Button onClick={submitReset}>Reset</Button>
              </Col>
            </Row>
          </Col>
          <Col md={12} sm={24}>
            <RefreshTicketSocketDataResults UpdateResults={updateResults} />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <RefreshTicketSocketHistoryTable History={history} />
          </Col>
        </Row>
      </div>
    </>
  );
}
