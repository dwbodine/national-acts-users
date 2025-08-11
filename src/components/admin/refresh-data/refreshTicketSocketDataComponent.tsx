import { Button, Col, Row } from 'react-bootstrap';
import { GetRefreshHistoryResponse, GetSellersResponse, RefreshHistoryResponse } from '@/types/responses';
import {
  setAdminDates,
  setAdminSellerId,
  setAllSellers,
} from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import RefreshTicketSocketDataResults from './refreshTicketSocketDataResults';
import RefreshTicketSocketHistoryTable from './refreshTicketSocketHistoryTable';
import ReportDatePicker from '../../common/reportDatePicker';
import { RootState } from '@/lib/store';
import { TicketSocketRefreshHistory } from '@/types/event';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useGetRefreshHistory } from '@/hooks/admin/useGetRefreshHistory';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { useRefreshEventsFromTicketSocket } from '@/hooks/admin/useRefreshEventsFromTicketSocket';

export default function RefreshTicketSocketData() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const { getSellers } = useGetSellers();
  const { getRefreshHistory } = useGetRefreshHistory();
  const { refreshEventsFromTicketSocket } = useRefreshEventsFromTicketSocket();
  const dispatch = useDispatch();
  const [updateResults, setUpdateResults] = useState<
    TicketSocketRefreshHistory | undefined
  >(undefined);
  const [history, setHistory] = useState<TicketSocketRefreshHistory[] | undefined>(
    undefined,
  );

  useEffect(() => {
    if (currentAdminSelection.allSellers === undefined) {
      dispatch(setIsLoading(true));
      dispatch(setAdminSellerId(undefined));
      getSellers().then((response: GetSellersResponse) => {
        dispatch(setAllSellers(response.sellers));
        dispatch(setIsLoading(false));
      });
    } else if (history === undefined) {
      dispatch(setIsLoading(true));
      getRefreshHistory().then((response: GetRefreshHistoryResponse) => {
        setHistory(response.history);
        dispatch(setIsLoading(false));
      });
    }
  }, [
    dispatch,
    getSellers,
    getRefreshHistory,
    updateResults,
    history,
    currentAdminSelection,
  ]);

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
    refreshEventsFromTicketSocket(
      adminSelection.sellerId,
      adminSelection.start,
      adminSelection.end,
    ).then((response: RefreshHistoryResponse) => {
      setUpdateResults(response.results);
      setHistory(undefined);
      dispatch(setIsLoading(false));
    });
  };

  return (
    <div className="admin-container">
      <Row className="refresh-results-header">
        <Col xl={4} lg={12} className="refresh-results-header-col">
          <h3>Refresh TicketSocket Data</h3>
        </Col>
      </Row>
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
          <Button onClick={submitReset}>Reset</Button> <AdminListHomeButton />
        </Col>
        <Col xl={8} lg={12}>
          <RefreshTicketSocketDataResults UpdateResults={updateResults} />
        </Col>
      </Row>
      <Row>
        <Col>
          <RefreshTicketSocketHistoryTable History={history} />
        </Col>
      </Row>
    </div>
  );
}
