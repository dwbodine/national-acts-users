import { Button, Col, Row } from 'react-bootstrap';
import AdminListHomeButton from '../adminListHomeButton';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import { useEffect, useState } from 'react';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import {
  GetRefreshHistoryResponse,
  GetSellersResponse,
  RefreshHistoryResponse,
  Seller,
  TicketSocketRefreshHistory,
} from '@/types/event';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import ReportDatePicker from '../../common/reportDatePIcker';
import { RootState } from '@/lib/store';
import {
  setAdminDates,
  setAdminSellerId,
  setAllSellers,
} from '@/lib/adminSelectionSlice';
import RefreshTicketSocketDataResults from './refreshTicketSocketDataResults';
import RefreshTicketSocketHistoryTable from './refreshTicketSocketHistoryTable';
import { useGetRefreshHistory } from '@/hooks/admin/useGetRefreshHistory';
import { useRefreshEventsFromTicketSocket } from '@/hooks/admin/useRefreshEventsFromTicketSocket';
import { AdminSelection } from '@/types/user';
import { DiPerl } from 'react-icons/di';
import { toast } from 'react-toastify';

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
    if (currentAdminSelection.allSellers == undefined) {
      dispatch(setIsLoading(true));
      dispatch(setAdminSellerId(undefined));
      getSellers().then((response: GetSellersResponse) => {
        dispatch(setAllSellers(response.sellers));
        dispatch(setIsLoading(false));
      });
    } else if (history == undefined) {
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

  const updateSeller = (sellerId: number) => {
    if (!sellerId || isNaN(sellerId)) {
      return;
    }
    dispatch(setAdminSellerId(sellerId));
  };

  const onDateChange = (newStart: number, newEnd: number) => {
    let adminSelection = { ...currentAdminSelection };
    adminSelection.start = newStart;
    adminSelection.end = newEnd;
    dispatch(setAdminDates(adminSelection));
  };

  const submitReset = () => {
    let adminSelection = { ...currentAdminSelection };
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
        id="refresh"
        Sellers={currentAdminSelection.allSellers}
        SellerId={currentAdminSelection.sellerId}
        OnSellerChange={(sellerId: number) => updateSeller(sellerId)}
        Countries={currentAdminSelection.countries}
      />
      <ReportDatePicker
        onChange={onDateChange}
        start={currentAdminSelection.start}
        end={currentAdminSelection.end}
      />
      <Row>
        <Col>
          <Button onClick={submitReset}>Reset</Button> <AdminListHomeButton />
        </Col>
        <Col xl={8} lg={12}>
          <RefreshTicketSocketDataResults updateResults={updateResults} />
        </Col>
      </Row>
      <Row>
        <Col>
          <RefreshTicketSocketHistoryTable history={history} />
        </Col>
      </Row>
    </div>
  );
}
