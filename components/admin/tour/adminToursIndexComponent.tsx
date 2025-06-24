import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setAdminEvents,
  setAdminSellerId,
  setAdminTour,
  setAllSellers,
  setReloadTours,
  setTours,
} from '@/lib/adminSelectionSlice';
import { Button, Col, Row } from 'react-bootstrap';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import { GetEventsResponse, GetSellersResponse, GetToursResponse, Tour } from '@/types/event';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import moment from 'moment';
import router from 'next/router';
import { useGetTours } from '@/hooks/admin/useGetTours';
import { toast } from 'react-toastify';
import { useGetAdminSellerEvents } from '@/hooks/admin/useGetAdminSellerEvents';

export default function AdminToursIndex() {
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const { getSellers } = useGetSellers();
  const { getTours } = useGetTours();
  const { getAdminSellerEvents } = useGetAdminSellerEvents();
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
        getTours(adminSelection.sellerId).then((response: GetToursResponse) => {
          if (!response.tourError) {
            if (response.tours) {
              dispatch(setTours(response.tours));
            }            
            if (currentAdminSelection.sellerId) {
              getAdminSellerEvents([currentAdminSelection.sellerId])
              .then((response: GetEventsResponse) => {
                if (response.events && !response.eventError) {
                  const filteredEvents = response.events.filter(x => !x.isDeleted);
                  if (filteredEvents) {
                    dispatch(setAdminEvents(filteredEvents));
                  }                  
                }
                dispatch(setIsLoading(false));
                setTableLoading(false);
              });
            } else {
              dispatch(setIsLoading(false));
              setTableLoading(false);
            }            
          } else {
            dispatch(setIsLoading(false));
            setTableLoading(false);
          }          
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
  }, [dispatch, getSellers, currentAdminSelection, getTours, tableLoading, getAdminSellerEvents]);

  const updateSeller = (sellerId: number) => {
    const updateSellerId = sellerId && !isNaN(sellerId) ? sellerId : undefined;
    dispatch(setAdminSellerId(updateSellerId));
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
    if (!currentAdminSelection.sellerId) {
      toast.error('Must select a seller first');
      return;
    } else if (!currentAdminSelection.events || currentAdminSelection.events.length == 0) {
      toast.error('No future events to add to a tour');
      return;
    }

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
        </Col>
      </Row>
      <AdminSellerSelect
        id="refresh"
        Sellers={currentAdminSelection.allSellers}
        SellerId={currentAdminSelection.sellerId}
        OnSellerChange={(sellerId: number) => updateSeller(sellerId)}
        Countries={currentAdminSelection.countries}
      />        
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
            <Column flexGrow={1}>
              <HeaderCell># of shows</HeaderCell>
              <Cell>
                {(rowData: Tour) => rowData.events ? rowData.events.length : 0}
              </Cell>
            </Column>
            <Column flexGrow={1} minWidth={100}>
              <HeaderCell>Announce Date</HeaderCell>
              <Cell>
                {(rowData: Tour) => rowData.announceDate ? moment(rowData.announceDate).format('M/DD/YYYY h:mm A') : ''}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>First show</HeaderCell>
              <Cell>
                {(rowData: Tour) => rowData.events && rowData.events.length > 0 
                  ? `${moment(rowData.events[0].eventDate).format('M/DD/YYYY')} (${rowData.events[0].venue?.city}, ${rowData.events[0].venue?.state})` 
                  : ''}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Last show</HeaderCell>
              <Cell>
              {(rowData: Tour) => rowData.events && rowData.events.length > 0 
                  ? `${moment(rowData.events[rowData.events.length-1].eventDate).format('M/DD/YYYY')} (${rowData.events[rowData.events.length-1].venue?.city}, ${rowData.events[rowData.events.length-1].venue?.state})` 
                  : ''}
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
          <Button onClick={addTour}>Add</Button>
        </Col>
      </Row>
    </div>
  );
}
