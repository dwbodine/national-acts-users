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
import { FaArrowTurnDown } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../../common/confirmationDialogComponent';

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

  const [ selectedAction, setSelectedAction ] = useState('');
  const [orderIdList, setOrderIdList] = useState<number[]>([]);
  const allOrderIds: number[] = currentAdminSelection.selectedEvent?.orders?.map(o => { return o.ticketSocketOrderId }) ?? [];

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
    let idList: number[] = orderIdList ? [...orderIdList] : [];
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

  const bulkEditConfirm = () => {
    if (orderIdList.length == 0 || !selectedAction) {
      return;
    }

    let message = '';
    switch (selectedAction) {
      case "inactive":
        message = `You are about to deactivate ${orderIdList.length} orders`;
        break;
      case "active":
        message = `You are about to activate ${orderIdList.length} orders`;
        break;
      case "delete":
        message = `You are about to delete ${orderIdList.length} orders`;
        break;
      case "undelete":
        message = `You are about to undelete ${orderIdList.length} orders`;
        break;
    }

    if (!message) {
      return;
    }

    const toastId = toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={handleBulkEdit}
        OnCancel={() => {
          toast.dismiss();
        }}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  const handleBulkEdit = () => {
    toast.dismiss();
    if (orderIdList.length == 0 || !selectedAction) {
      return;
    }

    switch (selectedAction) {
      case "inactive":
        deactivateOrders(false);
        break;
      case "active":
        deactivateOrders(true);
        break;
      case "delete":
        deleteOrders(true);
        break;
      case "undelete":
        deleteOrders(false);
        break;
    }
  };

  const deactivateOrders = (isActive: boolean) => {
    if (orderIdList.length == 0) {
      return;
    }
    setOrdersInactive(orderIdList, isActive)
      .then((response) => {
        if (response.success && !response.orderError) {
          const successMessage = isActive ? "Orders activated successfully" : "Orders deactivated successfully";
          toast.success(successMessage);
          setOrderIdList([]);
          setSelectedAction('');
          dispatch(setReloadEvents(true));
        } else {
          let errorMessage = response.orderError;
          if (!errorMessage) {
            errorMessage = isActive ? 'Unexpected error occurred while activating orders' : 'Unexpected error occurred while deactivating orders';
          }
          toast.error(errorMessage);
        }
      });
  };

  const deleteOrders = (setDeleted: boolean) => {
    if (orderIdList.length == 0) {
      return;
    }
    setOrdersDeleted(orderIdList, setDeleted)
      .then((response) => {
        if (response.success && !response.orderError) {
          const successMessage = setDeleted ? "Orders deleted successfully" : "Orders undeleted successfully";
          toast.success(successMessage);
          setOrderIdList([]);
          setSelectedAction('');
          dispatch(setReloadEvents(true));
        } else {
          let errorMessage = response.orderError;
          if (!errorMessage) {
            errorMessage = setDeleted ? 'Unexpected error occurred while deleting orders' : 'Unexpected error occurred while undeleting orders';
          }
          toast.error(errorMessage);
        }
      });
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
      <Row hidden={allOrderIds.length == 0}>
        <Col className="bulk-arrow-row">
          <div><FaArrowTurnDown className="bulk-arrow" /></div>
          <div>With selected:</div>
          <div>
            <select onChange={(e) => setSelectedAction(e.currentTarget.value)} className="bulk-select" defaultValue={selectedAction}>
              <option value="">-- Select One --</option>
              <option value="inactive">Deactivate</option>
              <option value="active">Activate</option>
              <option value="delete">Delete</option>
              <option value="undelete">Undelete</option>
            </select>
          </div>
          <div>
            <Button onClick={bulkEditConfirm}>Update</Button>
          </div>
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
