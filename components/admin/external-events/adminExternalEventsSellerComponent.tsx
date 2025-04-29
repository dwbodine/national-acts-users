import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setAdminEvent,
  setAdminEvents,
  setAdminSellerId,
  setReloadEvents,
  setReloadVenues,
  setTicketSocketEventsOnly,
} from '@/lib/adminSelectionSlice';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { Seller, VipEvent } from '@/types/event';
import moment from 'moment';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import router from 'next/router';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { FaArrowTurnDown } from 'react-icons/fa6';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import { toast } from 'react-toastify';
import { useGetExternalEvents } from '@/hooks/admin/useGetExternalEvents';
import { GetExternalEventsResponse } from '@/types/admin';
import { useSetExternalEventsInactive } from '@/hooks/admin/useSetExternalEventsInactive';
import { useSetExternalEventsHidden } from '@/hooks/admin/useSetExternalEventsHidden';
import { useSetExternalEventsCancelled } from '@/hooks/admin/useSetExternalEventsCancelled';
import { useSetExternalEventsDeleted } from '@/hooks/admin/useSetExternalEventsDeleted';
import { setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';

export default function AdminExternalEventsSeller() {
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const { getExternalEvents } = useGetExternalEvents();
  const { getEventStatusSlug } = useGetEventStatus();
  const dispatch = useDispatch();
  const [tableLoading, setTableLoading] = useState(true);
  const { setExternalEventsInactive } = useSetExternalEventsInactive();
  const { setExternalEventsHidden } = useSetExternalEventsHidden();
  const { setExternalEventsCancelled } = useSetExternalEventsCancelled();
  const { setExternalEventsDeleted } = useSetExternalEventsDeleted();

  const [selectedAction, setSelectedAction] = useState('');
  const [eventIdList, setEventIdList] = useState<number[]>([]);
  const allEventIds: number[] = currentAdminSelection.events?.map(evt => { return evt.externalEventId ?? 0 }).filter(x => x > 0) ?? [];
  const currentSeller: Seller | undefined = currentAdminSelection.allSellers?.find(x => x.sellerId == currentAdminSelection.sellerId);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadEvents) {
        setEventIdList([]);
        setSelectedAction('');
        dispatch(setReloadEvents(false));
        let adminSelection = { ...currentAdminSelection };
        let sellerId: number = 0;
        if (!adminSelection.sellerId) {
          setTableLoading(false);
          return;
        } else {
          sellerId = adminSelection.sellerId;
        }

        setTableLoading(true);
        dispatch(setIsLoading(true));
        getExternalEvents(sellerId).then((response: GetExternalEventsResponse) => {
          if (response.events && !response.eventError) {
            dispatch(setAdminEvents(response.events));
          }
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.events != undefined && tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, currentAdminSelection, getExternalEvents, tableLoading]);

  const editEvent = (externalEventId: number) => {
    if (
      !externalEventId ||
      isNaN(externalEventId) ||
      !currentAdminSelection.events ||
      currentAdminSelection.events.length == 0
    ) {
      return;
    }
    const vipEvent = currentAdminSelection.events.find(
      (x) => x.externalEventId == externalEventId,
    );
    if (!vipEvent) {
      return;
    }
    dispatch(setReloadAdminEvents(false));
    dispatch(setTicketSocketEventsOnly(undefined));
    dispatch(setReloadVenues(true));
    dispatch(setAdminEvent(vipEvent));
    setTableLoading(true);
    router.push('/admin/external-events/edit/');
  };

  const addEvent = () => {
    if (
      !currentAdminSelection.sellerId
    ) {
      return;
    }
    const vipEvent: VipEvent = {
      ticketSocketEventId: 0,
      eventId: 0,
      externalEventId: 0,
      isExternal: true,
      title: '',
      eventDate: '',
      isActive: true,
      isDeleted: false,
      sellerId: currentAdminSelection.sellerId,
      disableLinkButton: false,
      disableLinkReason: undefined,
      disableVipLinkButton: false,
      disableVipLinkReason: undefined,
      externalUrl: undefined,
      externalVipLink: undefined,
      announceDate: undefined,
    };
    dispatch(setReloadAdminEvents(false));
    dispatch(setReloadVenues(true));
    dispatch(setAdminEvent(vipEvent));
    setTableLoading(true);
    router.push('/admin/external-events/edit/');
  };

  const updateEventIdList = (externalEventId: number | undefined, addToList: boolean) => {
    if (!externalEventId) {
      return;
    }
    let idList: number[] = eventIdList ? [...eventIdList] : [];
    if (!addToList && idList.includes(externalEventId)) {
      idList = idList.filter(id => id != externalEventId);
    } else if (addToList && !idList.includes(externalEventId)) {
      idList.push(externalEventId);
    }
    setEventIdList(idList);
  };

  const selectAllEvents = (addToList: boolean) => {
    if (!allEventIds) {
      return;
    }
    if (addToList) {
      setEventIdList(allEventIds);
    } else {
      setEventIdList([]);
    }
  };

  const bulkEditConfirm = () => {
    if (eventIdList.length == 0 || !selectedAction) {
      return;
    }

    let message = '';
    switch (selectedAction) {
      case "inactive":
        message = `You are about to deactivate ${eventIdList.length} events`;
        break;
      case "active":
        message = `You are about to activate ${eventIdList.length} events`;
        break;
      case "delete":
        message = `You are about to delete ${eventIdList.length} events - NOTE: THIS CANNOT BE UNDONE`;
        break;
      case "cancel":
        message = `You are about to cancel ${eventIdList.length} events`;
        break;
      case "uncancel":
        message = `You are about to un-cancel ${eventIdList.length} events`;
        break;
      case "hidden":
        message = `You are about to hide ${eventIdList.length} events`;
        break;
      case "unhide":
        message = `You are about to unhide ${eventIdList.length} events`;
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
    if (eventIdList.length == 0 || !selectedAction) {
      return;
    }

    switch (selectedAction) {
      case "inactive":
        deactivateEvents(false);
        break;
      case "active":
        deactivateEvents(true);
        break;
      case "delete":
        deleteEvents();
        break;
      case "cancel":
        cancelEvents(true);
        break;
      case "uncancel":
        cancelEvents(false);
        break;
      case "hidden":
        hideEvents(true);
        break;
      case "unhide":
        hideEvents(false);
        break;
    }
  };

  const deactivateEvents = (isActive: boolean) => {
    if (eventIdList.length == 0) {
      return;
    }
    setExternalEventsInactive(eventIdList, isActive)
      .then((response) => {
        if (response.success && !response.eventError) {
          const successMessage = isActive ? "Events activated successfully" : "Events deactivated successfully";
          toast.success(successMessage);
          setEventIdList([]);
          setSelectedAction('');
          dispatch(setReloadEvents(true));
        } else {
          let errorMessage = response.eventError;
          if (!errorMessage) {
            errorMessage = isActive ? 'Unexpected error occurred while activating events' : 'Unexpected error occurred while deactivating events';
          }
          toast.error(errorMessage);
        }
      });
  };

  const deleteEvents = () => {
    if (eventIdList.length == 0) {
      return;
    }
    setExternalEventsDeleted(eventIdList)
      .then((response) => {
        if (response.success && !response.eventError) {
          toast.success("Events deleted successfully");
          setEventIdList([]);
          setSelectedAction('');
          dispatch(setReloadEvents(true));
        } else {
          let errorMessage = response.eventError;
          if (!errorMessage) {
            errorMessage = 'Unexpected error occurred while deleting events';
          }
          toast.error(errorMessage);
        }
      });
  };

  const cancelEvents = (setCancelled: boolean) => {
    if (eventIdList.length == 0) {
      return;
    }
    setExternalEventsCancelled(eventIdList, setCancelled)
      .then((response) => {
        if (response.success && !response.eventError) {
          const successMessage = setCancelled ? "Events cancelled successfully" : "Events cancelled successfully";
          toast.success(successMessage);
          setEventIdList([]);
          setSelectedAction('');
          dispatch(setReloadEvents(true));
        } else {
          let errorMessage = response.eventError;
          if (!errorMessage) {
            errorMessage = setCancelled ? 'Unexpected error occurred while cancelling events' : 'Unexpected error occurred while cancelling events';
          }
          toast.error(errorMessage);
        }
      });
  };

  const hideEvents = (setHidden: boolean) => {
    if (eventIdList.length == 0) {
      return;
    }
    setExternalEventsHidden(eventIdList, setHidden)
      .then((response) => {
        if (response.success && !response.eventError) {
          const successMessage = setHidden ? "Events hidden successfully" : "Events unhidden successfully";
          toast.success(successMessage);
          setEventIdList([]);
          setSelectedAction('');
          dispatch(setReloadEvents(true));
        } else {
          let errorMessage = response.eventError;
          if (!errorMessage) {
            errorMessage = setHidden ? 'Unexpected error occurred while hiding events' : 'Unexpected error occurred while unhiding events';
          }
          toast.error(errorMessage);
        }
      });
  };

  const goBack = () => {
    router.push('/admin/external-events/');
    dispatch(setAdminSellerId(undefined));
  };

  return (
    <div className="admin-container">
      <Row className="refresh-results-header">
        <Col>
          <Button onClick={goBack}>Back</Button>
        </Col>
      </Row>
      <Row className="refresh-results-header">
        <Col>
          <h3>External Event Admin for {currentSeller?.name}</h3>
        </Col>
      </Row>
      <Row className="refresh-results-header">
        <Col><Button onClick={addEvent}>Add New External Event</Button></Col>
      </Row>
      <Row hidden={allEventIds.length == 0}>
        <Col className="bulk-arrow-row">
          <div><FaArrowTurnDown className="bulk-arrow" /></div>
          <div>With selected:</div>
          <div>
            <select onChange={(e) => setSelectedAction(e.currentTarget.value)} className="bulk-select" defaultValue={selectedAction}>
              <option value="">-- Select One --</option>
              <option value="inactive">Deactivate</option>
              <option value="active">Activate</option>
              <option value="delete">Delete</option>
              <option value="cancel">Cancel</option>
              <option value="uncancel">Un-Cancel</option>
              <option value="hidden">Hide</option>
              <option value="unhide">Unhide</option>
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
            data={currentAdminSelection.events}
            bordered
            cellBordered
            loading={tableLoading}
            rowClassName={(rowData: VipEvent) => {
              return getEventStatusSlug(rowData);
            }}
          >
            <Column width={50}>
              <HeaderCell>
                <FormCheck
                  id={`evtId_selectAll`}
                  checked={allEventIds.length > 0 && (eventIdList.length == allEventIds.length)}
                  onChange={(e) => selectAllEvents(e.currentTarget.checked)}
                />
              </HeaderCell>
              <Cell>
                {(rowData: VipEvent) =>
                  <FormCheck
                    id={`evtId_${rowData.externalEventId}`}
                    checked={rowData.externalEventId ? eventIdList.includes(rowData.externalEventId) : false}
                    onChange={(e) => updateEventIdList(rowData.externalEventId, e.currentTarget.checked)}
                  />
                }
              </Cell>
            </Column>
            <Column flexGrow={1} minWidth={100}>
              <HeaderCell>Date</HeaderCell>
              <Cell>
                {(rowData: VipEvent) => moment(rowData.eventDate).format('MM/DD/YYYY')}
              </Cell>
            </Column>
            <Column flexGrow={3}>
              <HeaderCell>Title</HeaderCell>
              <Cell>{(rowData: VipEvent) => rowData.title}</Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>&nbsp;</HeaderCell>
              <Cell>
                {(rowData: VipEvent) =>
                  rowData.externalEventId ? (
                    <a
                      href="#"
                      id={`${rowData.externalEventId}_event`}
                      onClick={() => editEvent(parseInt(`${rowData.externalEventId}`))}
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
        </Col>
      </Row>
    </div>
  );
}
