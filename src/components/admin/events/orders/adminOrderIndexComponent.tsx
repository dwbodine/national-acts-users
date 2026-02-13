'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaArrowTurnDown } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Checkbox, Col, Row, SelectPicker, Table } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetAdminEvents } from '@/hooks/admin/useGetAdminEvents';
import { useGetEventById } from '@/hooks/common/useGetEventById';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useSetOrdersDeleted } from '@/hooks/order/useSetOrdersDeleted';
import { useSetOrdersInactive } from '@/hooks/order/useSetOrdersInactive';
import { setAdminEvents } from '@/lib/adminDataSelectionSlice';
import {
  setAdminEvent,
  setAdminOrder,
  setAdminTour,
  setReloadEvents,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { Order } from '@/types/event';
import { EditProps } from '@/types/props';
import { GetEventResponse, GetEventsResponse, ModifyOrderResponse } from '@/types/responses';
import { getEventStatusText, getOrderStatusSlug, getOrderStatusText } from '@/utils/eventUtils';

import ConfirmationDialog from '../../../common/confirmationDialogComponent';

export default function AdminOrdersIndex(props: EditProps) {
  const id: number | undefined = props.Id as number;
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const [tableLoading, setTableLoading] = useState(true);
  const dispatch = useDispatch();
  const { getLocation } = useGetLocation();
  const { getAdminEvents } = useGetAdminEvents();
  const { getEventById } = useGetEventById();
  const { setOrdersInactive } = useSetOrdersInactive();
  const { setOrdersDeleted } = useSetOrdersDeleted();
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [orderIdList, setOrderIdList] = useState<number[]>([]);
  const allOrderIds: number[] =
    currentAdminSelection.selectedEvent?.orders?.map((o) => o.ticketSocketOrderId) ?? [];

  const loadEventById = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(setIsLoading(true));
    void getEventById(id).then((response: GetEventResponse) => {
      setOrderIdList([]);
      if (response.event && !response.error) {
        dispatch(setAdminEvent(response.event));
      }
      dispatch(setIsLoading(false));
    });
  }, [dispatch, getEventById, id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.selectedEvent === undefined && id !== undefined) {
        loadEventById();
      } else if (currentAdminSelection.reloadEvents) {
        dispatch(setReloadEvents(false));
        setOrderIdList([]);
        const adminSelection = { ...currentAdminSelection };
        const selectedEventId = adminSelection.selectedEvent?.externalEventId;
        if (!adminSelection.sellerId || !selectedEventId) {
          setTableLoading(false);
          return;
        }
        dispatch(setAdminTour(undefined));
        setTableLoading(true);
        dispatch(setIsLoading(true));
        void getAdminEvents(adminSelection).then((response: GetEventsResponse) => {
          if (response.events && !response.error) {
            dispatch(setAdminEvents(response.events));
            dispatch(setAdminEvent(undefined));
            dispatch(setAdminOrder(undefined));
            dispatch(setReloadEvents(false));
            const currentEvent = response.events.find((x) => x.externalEventId === selectedEventId);
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
  }, [
    currentAdminSelection,
    tableLoading,
    dispatch,
    getAdminEvents,
    loadEventById,
    id,
    globalSelection,
  ]);

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
      (x) => x.ticketSocketOrderId === ticketSocketOrderId,
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
    if (id) {
      router.push(`/admin/events/edit/?id=${id}`);
    } else {
      dispatch(setAdminEvent(undefined));
      router.push('/admin/events');
    }
  };

  const updateOrderIdList = (ticketSocketOrderId: number, addToList: boolean) => {
    let idList: number[] = orderIdList ? [...orderIdList] : [];
    if (!addToList && idList.includes(ticketSocketOrderId)) {
      idList = idList.filter((i) => i !== ticketSocketOrderId);
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

  const deactivateOrders = (isActive: boolean) => {
    if (orderIdList.length === 0) {
      return;
    }
    void setOrdersInactive(orderIdList, isActive).then((response: ModifyOrderResponse) => {
      if (response.success && !response.error) {
        const successMessage = isActive
          ? 'Orders activated successfully'
          : 'Orders deactivated successfully';
        toast.success(successMessage);
        setOrderIdList([]);
        setSelectedAction(null);
        dispatch(setReloadEvents(true));
      } else {
        let errorMessage = response.error;
        if (!errorMessage) {
          errorMessage = isActive
            ? 'Unexpected error occurred while activating orders'
            : 'Unexpected error occurred while deactivating orders';
        }
        toast.error(errorMessage);
      }
    });
  };

  const deleteOrders = (setDeleted: boolean) => {
    if (orderIdList.length === 0) {
      return;
    }
    void setOrdersDeleted(orderIdList, setDeleted).then((response: ModifyOrderResponse) => {
      if (response.success && !response.error) {
        const successMessage = setDeleted
          ? 'Orders deleted successfully'
          : 'Orders undeleted successfully';
        toast.success(successMessage);
        setOrderIdList([]);
        setSelectedAction(null);
        dispatch(setReloadEvents(true));
      } else {
        let errorMessage = response.error;
        if (!errorMessage) {
          errorMessage = setDeleted
            ? 'Unexpected error occurred while deleting orders'
            : 'Unexpected error occurred while undeleting orders';
        }
        toast.error(errorMessage);
      }
    });
  };

  const handleBulkEdit = () => {
    toast.dismiss();
    if (orderIdList.length === 0 || !selectedAction) {
      return;
    }

    switch (selectedAction) {
      case 'inactive':
        deactivateOrders(false);
        break;
      case 'active':
        deactivateOrders(true);
        break;
      case 'delete':
        deleteOrders(true);
        break;
      case 'undelete':
        deleteOrders(false);
        break;
      default:
        break;
    }
  };

  const bulkEditConfirm = () => {
    if (orderIdList.length === 0 || !selectedAction) {
      return;
    }

    let message = '';
    switch (selectedAction) {
      case 'inactive':
        message = `You are about to deactivate ${orderIdList.length} orders`;
        break;
      case 'active':
        message = `You are about to activate ${orderIdList.length} orders`;
        break;
      case 'delete':
        message = `You are about to delete ${orderIdList.length} orders`;
        break;
      case 'undelete':
        message = `You are about to undelete ${orderIdList.length} orders`;
        break;
      default:
        break;
    }

    if (!message) {
      return;
    }

    toast.warning(
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
        autoClose: false,
        closeOnClick: false,
        position: 'top-center',
      },
    );
  };

  const location = currentAdminSelection.selectedEvent?.venue
    ? getLocation(currentAdminSelection.selectedEvent.venue)
    : '';

  const actions = [
    {
      label: 'Deactivate',
      value: 'inactive',
    },
    {
      label: 'Deactivate',
      value: 'inactive',
    },
    {
      label: 'Delete',
      value: 'delete',
    },
    {
      label: 'Undelete',
      value: 'undelete',
    },
  ];

  const actionList: ItemDataType<string>[] = actions.map((action) => ({
    label: action.label,
    value: action.value,
  }));

  const pageHeader = currentAdminSelection.selectedEvent
    ? `Edit Orders for ${currentAdminSelection.selectedEvent.title}`
    : `Edit Orders`;

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <div className="admin-container">
        <Row className="admin-event-info">
          <Col>
            <Button onClick={goBack}>Back</Button>{' '}
          </Col>
        </Row>
        <Row>
          <Col className="form-header">
            <h3> {currentAdminSelection.selectedEvent?.title}</h3>
            <span className="title">Date:</span>{' '}
            {moment(currentAdminSelection.selectedEvent?.eventDate).format('MM/DD/YYYY')}
            <br />
            <span className="title">Venue:</span> {currentAdminSelection.selectedEvent?.venue?.name}
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
        <Row hidden={allOrderIds.length === 0}>
          <Col className="bulk-arrow-row">
            <div>
              <FaArrowTurnDown className="bulk-arrow" />
            </div>
            <div>With selected:</div>
            <div>
              <SelectPicker
                className="bulk-select"
                value={selectedAction}
                data={actionList}
                size="lg"
                onChange={(a) => setSelectedAction(a)}
                cleanable={true}
                menuAutoWidth={true}
                onClean={() => setSelectedAction(null)}
              />
            </div>
            <div>
              <Button onClick={bulkEditConfirm}>Update</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Table
              autoHeight={true}
              data={currentAdminSelection.selectedEvent?.orders}
              bordered
              cellBordered
              loading={tableLoading}
              rowClassName={(rowData: Order) => getOrderStatusSlug(rowData)}
            >
              <Column width={50}>
                <HeaderCell>
                  <Checkbox
                    id={`oId_selectAll`}
                    checked={allOrderIds.length > 0 && orderIdList.length === allOrderIds.length}
                    onChange={(_, checked) => selectAllOrders(checked)}
                  />
                </HeaderCell>
                <Cell>
                  {(rowData: Order) => (
                    <Checkbox
                      id={`oId_${rowData.ticketSocketOrderId}`}
                      checked={orderIdList.includes(rowData.ticketSocketOrderId)}
                      onChange={(_, checked) =>
                        updateOrderIdList(rowData.ticketSocketOrderId, checked)
                      }
                    />
                  )}
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>Purchase Date</HeaderCell>
                <Cell>{(rowData: Order) => moment(rowData.purchaseDate).format('MM/DD/YYYY')}</Cell>
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
                <Cell>{(rowData: Order) => (rowData.numTickets ? rowData.numTickets : '')}</Cell>
              </Column>
              <Column flexGrow={3}>
                <HeaderCell>Order Status</HeaderCell>
                <Cell>{(rowData: Order) => getOrderStatusText(rowData)}</Cell>
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
    </>
  );
}
