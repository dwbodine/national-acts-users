import { useEffect, useMemo, useState } from 'react';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setAdminEvent,
  setAdminEvents,
  setAdminOrder,
  setAdminOrders,
  setAdminTour,
  setReloadEvents,
} from '@/lib/adminSelectionSlice';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { GetEventsResponse, GetOrdersResponse, Order } from '@/types/event';
import router from 'next/router';
import moment from 'moment';
import { useGetOrderStatus } from '@/hooks/common/useGetOrderStatus';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useGetAdminEvents } from '@/hooks/admin/useGetAdminEvents';
import { useGetEventById } from '@/hooks/common/useGetEventById';
import { useSetOrdersInactive } from '@/hooks/order/useSetOrdersInactive';
import { useSetOrdersDeleted } from '@/hooks/order/useSetOrdersDeleted';
import { FaArrowTurnDown } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../../common/confirmationDialogComponent';
import { useGetOrderById } from '@/hooks/common/useGetOrderById';
import { useSearchOrders } from '@/hooks/admin/useSearchOrders';

export default function AdminOrdersSearch(props: any) {
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const [tableLoading, setTableLoading] = useState(true);
  const dispatch = useDispatch();
  const { searchOrders } = useSearchOrders();
  const { getOrderStatusSlug, getOrderStatusText } = useGetOrderStatus();
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [tableLoading]);

  const searchAllOrders = () => {
    if (!searchTerm) {
      return;
    }
    if (searchTerm.length < 3) {
      toast.warn("Need to enter at least three characters to search");
      return;
    }
    dispatch(setIsLoading(true));
    setTableLoading(true);
    searchOrders(searchTerm).then((response: GetOrdersResponse) => {
      if (!response.orderError) {
        dispatch(setAdminOrders(response.orders));
      } else {
        toast.error(response.orderError);
        dispatch(setAdminOrders(undefined));
      }
      setTableLoading(false);
      dispatch(setIsLoading(false));
    });
  };

  const viewOrder = (ticketSocketOrderId: number) => {
    if (
      !ticketSocketOrderId ||
      isNaN(ticketSocketOrderId) ||
      !currentAdminSelection.orders
    ) {
      return;
    }
    const order = currentAdminSelection.orders.find(
      (x) => x.ticketSocketOrderId == ticketSocketOrderId,
    );
    if (!order) {
      return;
    }

    window.open(`/admin/events/orders/edit/?id=${order.ticketSocketOrderId}`)
  };

  const goBack = () => {
    dispatch(setAdminOrders(undefined));
    router.push('/admin/');    
  };

  const numOrders = currentAdminSelection.orders?.length ?? 0;

  return (
    <div className="admin-container">
      <Row className="admin-event-info">
        <Col>
          <Button onClick={goBack}>Back</Button>{' '}
        </Col>
      </Row>
      <Row>
        <Col>
          <h5>Search Orders</h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-text-input no-print"
            placeholder="Search for orders by purchaser name, email, order ID, event title or seller name..."
          />
          <Button disabled={!searchTerm || searchTerm.length < 3} onClick={searchAllOrders}>Search</Button>
          <div hidden={numOrders == 0} className="success">{numOrders} order(s) found</div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            autoHeight={true}
            data={currentAdminSelection.orders}
            bordered
            cellBordered
            loading={tableLoading}
            rowClassName={(rowData: Order) => {
              return getOrderStatusSlug(rowData);
            }}
          >
            <Column flexGrow={3}>
              <HeaderCell>Purchaser Name</HeaderCell>
              <Cell>
                {(rowData: Order) =>
                  `${rowData.purchaserLastName}, ${rowData.purchaserFirstName}`
                }
              </Cell>
            </Column>
            <Column flexGrow={2}>
              <HeaderCell>Email</HeaderCell>
              <Cell>
                {(rowData: Order) =>
                  `${rowData.email}`
                }
              </Cell>
            </Column>
            <Column flexGrow={3}>
              <HeaderCell>Event / Date</HeaderCell>
              <Cell>
                {(rowData: Order) =>
                  `${rowData.eventTitle} / ${moment(rowData.eventDate).format('MM/DD/YYYY')}`
                }
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Purchase Date</HeaderCell>
              <Cell>
                {(rowData: Order) => moment(rowData.purchaseDate).format('MM/DD/YYYY')}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Ticket Socket OrderId</HeaderCell>
              <Cell>
                {(rowData: Order) => (rowData.orderId ? rowData.orderId : '')}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell># of Tickets</HeaderCell>
              <Cell>
                {(rowData: Order) => (rowData.numTickets ? rowData.numTickets : '')}
              </Cell>
            </Column>
            <Column flexGrow={2}>
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
