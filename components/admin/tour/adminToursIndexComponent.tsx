import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Modal, Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setAdminDates,
  setAdminEvent,
  setAdminEvents,
  setAdminSellerId,
  setAdminTour,
  setAllSellers,
  setReloadEvents,
  setReloadTours,
  setTours,
} from '@/lib/adminSelectionSlice';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import { GetEventsResponse, GetSellersResponse, GetToursResponse, Seller, Tour, VipEvent } from '@/types/event';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { useGetAdminEvents } from '@/hooks/admin/useGetAdminEvents';
import moment from 'moment';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import router from 'next/router';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { useSetEventsInactive } from '@/hooks/event/useSetEventsInactive';
import { useSetEventsDeleted } from '@/hooks/event/useSetEventsDeleted';
import { useSetEventsHidden } from '@/hooks/event/useSetEventsHidden';
import { FaArrowTurnDown } from 'react-icons/fa6';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import { toast } from 'react-toastify';
import { useGetTours } from '@/hooks/admin/useGetTours';

export default function AdminToursIndex() {
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const { getSellers } = useGetSellers();
  const { getTours } = useGetTours();
  const dispatch = useDispatch();
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.allSellers == undefined) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        dispatch(setAdminSellerId(undefined));
        dispatch(setReloadTours(true));
        getSellers().then((response: GetSellersResponse) => {
          dispatch(setAllSellers(response.sellers));
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.reloadTours) {
        dispatch(setReloadTours(false));
        let adminSelection = { ...currentAdminSelection };
        if (!adminSelection.sellerId) {
          setTableLoading(false);
          return;
        }
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getTours(adminSelection).then((response: GetToursResponse) => {
          if (response.tours && !response.tourError) {
            dispatch(setTours(response.tours));
          }
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.tours != undefined && tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, getSellers, currentAdminSelection, getTours, tableLoading]);

  const updateSeller = (sellerId: number) => {
    if (!sellerId || isNaN(sellerId)) {
      return;
    }
    dispatch(setAdminSellerId(sellerId));
    dispatch(setReloadTours(true));
  };

  const editTour = (tourId: number) => {
    if (
      !tourId ||
      isNaN(tourId) || 
      !currentAdminSelection.tours ||
      currentAdminSelection.tours.length == 0
    ) {
      return;
    }
    const tour = currentAdminSelection.tours.find(
      (x) => x.tourId == tourId,
    );
    if (!tour) {
      return;
    }
    dispatch(setAdminTour(tour));
    setTableLoading(true);
    router.push('/admin/tour/edit/');
  };

  const addTour = () => {
    const seller = currentAdminSelection.allSellers?.find(x => x.sellerId == currentAdminSelection.sellerId);

    if (!seller) {
      return;
    }

    const tour: Tour = {
      tourId: 0,
      tourName: '',
      announceDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      isActive: true,
      sellers: [seller],
      events: []
    };
    dispatch(setAdminTour(tour));
    setTableLoading(true);
    router.push('/admin/tour/edit');
  };

  return (
    <div className="admin-container">
      <Row className="refresh-results-header">
        <Col>
          <AdminListHomeButton />
        </Col>
      </Row>
      <Row className="refresh-results-header">
        <Col>
          <h3>Tour Admin</h3>
          <AdminSellerSelect
            id="refresh"
            Sellers={currentAdminSelection.allSellers}
            SellerId={currentAdminSelection.sellerId}
            OnSellerChange={(sellerId: number) => updateSeller(sellerId)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
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
            <Column flexGrow={1} minWidth={100}>
              <HeaderCell>Announce Date</HeaderCell>
              <Cell>
                {(rowData: Tour) => rowData.announceDate ? moment(rowData.announceDate).format('MM/DD/YYYY') : ''}
              </Cell>
            </Column>
            <Column flexGrow={2}>
              <HeaderCell>Status</HeaderCell>
              <Cell>
                {(rowData: Tour) => rowData.isActive ? "Active" : "Inactive"}
              </Cell>
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
          <Button disabled={!currentAdminSelection.sellerId} onClick={addTour}>Add</Button>
        </Col>
      </Row>
    </div>
  );
}
