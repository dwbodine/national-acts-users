import { useEffect, useState } from 'react';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setAdminEvent,
  setAdminEvents,
  setAdminOrder,
  setReloadEvents,
} from '@/lib/adminSelectionSlice';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { GetEventsResponse, Order } from '@/types/event';
import router from 'next/router';
import moment from 'moment';
import { useGetOrderStatus } from '@/hooks/common/useGetOrderStatus';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useGetAdminEvents } from '@/hooks/admin/useGetAdminEvents';
import { useGetEventById } from '@/hooks/common/useGetEventById';
import { useSetOrdersInactive } from '@/hooks/order/useSetOrdersInactive';
import { useSetOrdersDeleted } from '@/hooks/order/useSetOrdersDeleted';

export default function AdminOrdersIndex(props: any) {
  const id: number | undefined = props.Id as number;
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const [tableLoading, setTableLoading] = useState(true);
  const dispatch = useDispatch();
  const { getLocation } = useGetLocation();
  const { getOrderStatusSlug, getOrderStatusText } = useGetOrderStatus();
  const { getEventStatusText } = useGetEventStatus();
  const { getAdminEvents } = useGetAdminEvents();
  const { getEventById } = useGetEventById();
  const { setOrdersInactive } = useSetOrdersInactive();
  const { setOrdersDeleted } = useSetOrdersDeleted();
  const [ orderIdList, setOrderIdList ] = useState<number[]>([]);
  const allOrderIds: number[] = currentAdminSelection.selectedEvent?.orders?.map(o => {return o.ticketSocketOrderId}) ?? [];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.selectedEvent == undefined && id != undefined) {
        getEventById(id)
          .then((response) => {
            setOrderIdList([]);
            if (response.event && !response.eventError) {
              dispatch(
                setAdminEvent(response.event)
              );
            }
          })
      } else if (currentAdminSelection.reloadEvents) {
        dispatch(setReloadEvents(false));
        setOrderIdList([]);
        let adminSelection = { ...currentAdminSelection };
        let selectedEventId = adminSelection.selectedEvent?.ticketSocketEventId;
        if (!adminSelection.sellerId || !selectedEventId) {
          setTableLoading(false);
          return;
        }
        setTableLoading(true);
        dispatch(setIsLoading(true));
        getAdminEvents(adminSelection).then((response: GetEventsResponse) => {
          if (response.events && !response.eventError) {
            dispatch(setAdminEvents(response.events));
            const currentEvent = response.events.find(
              (x) => x.ticketSocketEventId == selectedEventId,
            );
            if (currentEvent) {
              dispatch(setAdminEvent(currentEvent));
            }
          }
          dispatch(setIsLoading(false));
        });
      } else if (tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, tableLoading, dispatch, getAdminEvents, getEventById, id]);

  const viewOrder = (ticketSocketOrderId: number) => {
    if (
      !ticketSocketOrderId ||
      isNaN(ticketSocketOrderId) ||
      !currentAdminSelection.selectedEvent ||
      !currentAdminSelection.selectedEvent.orders
    ) {
      return;
    }
    const order = currentAdminSelection.selectedEvent.orders.find(
      (x) => x.ticketSocketOrderId == ticketSocketOrderId,
    );
    if (!order) {
      return;
    }
    dispatch(setAdminOrder(order));
    setTableLoading(true);
    let path = '/admin/events/orders/edit/';
    if (id) {
      path += `?id=${order.ticketSocketOrderId}`;
    }
    router.push(path);        
  };

  const goBack = () => {
    if (!id) {
      dispatch(setAdminEvent(undefined));
      router.push('/admin/events/');
    } else {
      router.push(`/admin/events/edit/?id=${id}`);
    }    
  };

  const updateOrderIdList = (ticketSocketOrderId: number, addToList: boolean) => {
    let idList: number[] = orderIdList ? [ ...orderIdList ] : [];
    if (!addToList && idList.includes(ticketSocketOrderId)) {
      idList = idList.filter(id => id != ticketSocketOrderId);
    } else if (addToList && !idList.includes(ticketSocketOrderId)) {
      idList.push(ticketSocketOrderId);
    }
    setOrderIdList(idList);
  };

  const selectAllOrders = (addToList: boolean) => {
    if (!allOrderIds) {
      return;
    }
    if (addToList) {
      setOrderIdList(allOrderIds);
    } else {
      setOrderIdList([]);
    }
  };

  const location =
    currentAdminSelection.selectedEvent?.venue != undefined
      ? getLocation(currentAdminSelection.selectedEvent.venue)
      : '';

  return (
    <div className="admin-container">
      <Row className="admin-event-info">
        <Col>
          <Button onClick={goBack}>Back</Button>{' '}
        </Col>
      </Row>
      <Row className="form-group">
        <Col className="form-header">
          <h3> {currentAdminSelection.selectedEvent?.title}</h3>
          <span className="title">Date:</span>{' '}
          {moment(currentAdminSelection.selectedEvent?.eventDate).format('MM/DD/YYYY')}
          <br />
          <span className="title">Venue:</span>{' '}
          {currentAdminSelection.selectedEvent?.venue?.name}
          <br />
          <span className="title">Location:</span> {location}
          <br />
          <span className="title">Status:</span>{' '}
          {getEventStatusText(currentAdminSelection.selectedEvent)}
          <br />
        </Col>
      </Row>
      <Row>
        <Col>
          <h5>Orders</h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            autoHeight={true}
            data={currentAdminSelection.selectedEvent?.orders}
            bordered
            cellBordered
            loading={tableLoading}
            rowClassName={(rowData: Order) => {
              return getOrderStatusSlug(rowData);
            }}
          >
            <Column width={50}>
            <HeaderCell>
                <FormCheck 
                    id={`oId_selectAll`}
                    checked={allOrderIds.length > 0 && (orderIdList.length == allOrderIds.length)}
                    onChange={(e) => selectAllOrders(e.currentTarget.checked)}
                  />
              </HeaderCell>
              <Cell>
                {(rowData: Order) => 
                  <FormCheck 
                    id={`oId_${rowData.ticketSocketOrderId}`}
                    checked={orderIdList.includes(rowData.ticketSocketOrderId)}
                    onChange={(e) => updateOrderIdList(rowData.ticketSocketOrderId, e.currentTarget.checked)}
                  />
                }
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Purchase Date</HeaderCell>
              <Cell>
                {(rowData: Order) => moment(rowData.purchaseDate).format('MM/DD/YYYY')}
              </Cell>
            </Column>
            <Column flexGrow={3}>
              <HeaderCell>Purchaser Name</HeaderCell>
              <Cell>
                {(rowData: Order) =>
                  `${rowData.purchaserLastName}, ${rowData.purchaserFirstName}`
                }
              </Cell>
            </Column>
            <Column flexGrow={3}>
              <HeaderCell># of Tickets</HeaderCell>
              <Cell>
                {(rowData: Order) => (rowData.numTickets ? rowData.numTickets : '')}
              </Cell>
            </Column>
            <Column flexGrow={3}>
              <HeaderCell>Order Status</HeaderCell>
              <Cell>{(rowData: Order) => getOrderStatusText(rowData as Order)}</Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>&nbsp;</HeaderCell>
              <Cell>
                {(rowData: Order) =>
                  rowData.ticketSocketOrderId ? (
                    <a
                      href="#"
                      id={rowData.ticketSocketOrderId.toString()}
                      onClick={() => viewOrder(parseInt(`${rowData.ticketSocketOrderId}`))}
                    >
                      Edit
                    </a>
                  ) : (
                    'Edit'
                  )
                }
              </Cell>
            </Column>
          </Table>
        </Col>
      </Row>
    </div>
  );
}
