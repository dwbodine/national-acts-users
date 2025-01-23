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
  setAllSellers,
  setReloadEvents,
  setReloadTours,
  setTours,
} from '@/lib/adminSelectionSlice';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import ReportDatePicker from '../../common/reportDatePIcker';
import { GetEventsResponse, GetSellersResponse, GetToursResponse, Seller, VipEvent } from '@/types/event';
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

export default function AdminEventsIndex() {
  const { Column, HeaderCell, Cell } = Table;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const { getSellers } = useGetSellers();
  const { getAdminEvents } = useGetAdminEvents();
  const { getLocation } = useGetLocation();
  const { getEventStatusSlug, getEventStatusText } = useGetEventStatus();
  const dispatch = useDispatch();
  const [tableLoading, setTableLoading] = useState(true);
  const { setEventsInactive } = useSetEventsInactive();
  const { setEventsDeleted } = useSetEventsDeleted();
  const { setEventsHidden } = useSetEventsHidden();
  const { getTours } = useGetTours();

  const [ selectedAction, setSelectedAction ] = useState('');
  const [ eventIdList, setEventIdList ] = useState<number[]>([]);
  const [ tourId, setTourId ] = useState<number>(0);
  const allEventIds: number[] = currentAdminSelection.events?.map(evt => {return evt.ticketSocketEventId}) ?? [];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.allSellers == undefined) {
        setEventIdList([]);
        setSelectedAction('');
        setTableLoading(true);
        dispatch(setIsLoading(true));
        dispatch(setAdminSellerId(undefined));
        dispatch(setReloadEvents(true));
        getSellers().then((response: GetSellersResponse) => {
          dispatch(setAllSellers(response.sellers));
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.reloadEvents) {
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
        getAdminEvents(adminSelection).then((response: GetEventsResponse) => {
          if (response.events && !response.eventError) {
            dispatch(setAdminEvents(response.events));
            getTours(sellerId)
              .then((tourResponse: GetToursResponse) => {
                  if (!tourResponse.tourError && tourResponse.tours) {
                    dispatch(setTours(tourResponse.tours));
                  }
                  dispatch(setIsLoading(false));
                  setTableLoading(false);
              });
          } else {
            dispatch(setIsLoading(false));
            setTableLoading(false);
          }          
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
  }, [dispatch, getSellers, currentAdminSelection, getAdminEvents, tableLoading, getTours]);

  const updateSeller = (sellerId: number) => {
    if (!sellerId || isNaN(sellerId)) {
      return;
    }
    dispatch(setAdminSellerId(sellerId));
    setTourId(0);
    dispatch(setReloadTours(true));
    dispatch(setReloadEvents(true));
  };

  const onDateChange = (newStart: number | undefined, newEnd: number | undefined) => {
    let adminSelection = { ...currentAdminSelection };
    adminSelection.start = newStart;
    adminSelection.end = newEnd;
    dispatch(setAdminDates(adminSelection));
    dispatch(setReloadEvents(true));
  };

  const onStartClear = () => {
    onDateChange(undefined, currentAdminSelection.end);
  };

  const onEndClear = () => {
    onDateChange(currentAdminSelection.start, undefined);
  };

  const editEvent = (ticketSocketEventId: number) => {
    if (
      !ticketSocketEventId ||
      isNaN(ticketSocketEventId) || 
      !currentAdminSelection.events ||
      currentAdminSelection.events.length == 0
    ) {
      return;
    }
    const vipEvent = currentAdminSelection.events.find(
      (x) => x.ticketSocketEventId == ticketSocketEventId,
    );
    if (!vipEvent) {
      return;
    }
    dispatch(setAdminEvent(vipEvent));
    setTableLoading(true);
    router.push('/admin/events/edit/');
  };

  const viewOrders = (ticketSocketEventId: number) => {
    if (
      !ticketSocketEventId ||
      isNaN(ticketSocketEventId) || 
      !currentAdminSelection.events ||
      currentAdminSelection.events.length == 0
    ) {
      return;
    }
    const vipEvent = currentAdminSelection.events.find(
      (x) => x.ticketSocketEventId == ticketSocketEventId,
    );
    if (!vipEvent) {
      return;
    }
    dispatch(setAdminEvent(vipEvent));
    setTableLoading(true);
    router.push('/admin/events/orders/');
  };

  const updateEventIdList = (ticketSocketEventId: number, addToList: boolean) => {
    let idList: number[] = eventIdList ? [ ...eventIdList ] : [];
    if (!addToList && idList.includes(ticketSocketEventId)) {
      idList = idList.filter(id => id != ticketSocketEventId);
    } else if (addToList && !idList.includes(ticketSocketEventId)) {
      idList.push(ticketSocketEventId);
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
        message = `You are about to delete ${eventIdList.length} events`;
        break;
      case "undelete":
        message = `You are about to undelete ${eventIdList.length} events`;
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
        deleteEvents(true);
        break;
      case "undelete":
        deleteEvents(false);
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
    setEventsInactive(eventIdList, isActive)
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

  const deleteEvents = (setDeleted: boolean) => {
    if (eventIdList.length == 0) {
      return;
    }
    setEventsDeleted(eventIdList, setDeleted)
      .then((response) => {
        if (response.success && !response.eventError) {
          const successMessage = setDeleted ? "Events deleted successfully" : "Events undeleted successfully";
          toast.success(successMessage);
          setEventIdList([]);
          setSelectedAction('');
          dispatch(setReloadEvents(true));
        } else {
          let errorMessage = response.eventError;
          if (!errorMessage) {
            errorMessage = setDeleted ? 'Unexpected error occurred while deleting events' : 'Unexpected error occurred while undeleting events';
          }
          toast.error(errorMessage);
        }
      });
  };

  const hideEvents = (setHidden: boolean) => {
    if (eventIdList.length == 0) {
      return;
    }
    setEventsHidden(eventIdList, setHidden)
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

  const setSelectedTour = (tourIdStr: string) => {
    let selectedTourId = parseInt(tourIdStr);
    if (isNaN(selectedTourId) || selectedTourId <= 0) {
      selectedTourId = 0;
    }
    setTourId(selectedTourId);
  };

  let tourOptions: any[] = [];
  if (currentAdminSelection.tours && currentAdminSelection.tours.length > 0) {
    tourOptions.push(<option value="0"> -- Select One --</option>)
    currentAdminSelection.tours.forEach((tour) => {
      tourOptions.push(<option value={tour.tourId}>{tour.tourName}</option>);
    })
  }

  let filteredEvents = currentAdminSelection.events;
  if (tourId > 0 && currentAdminSelection.tours && filteredEvents && filteredEvents.length > 0) {
    const tour = currentAdminSelection.tours.find(x => x.tourId == tourId);
    if (tour && tour.events && tour.events.length > 0) {
      const tourEventIds = tour.events.map((x) => { return x.ticketSocketEventId });
      filteredEvents = filteredEvents.filter((x) => {
        return tourEventIds.includes(x.ticketSocketEventId);
      });
    }
  }

  return (
    <div className="admin-container">
      <Row className="refresh-results-header">
        <Col>
          <AdminListHomeButton />
        </Col>
      </Row>
      <Row className="refresh-results-header">
        <Col>
          <h3>Event Admin</h3>
          <ReportDatePicker
            onChange={onDateChange}
            onStartClear={onStartClear}
            onEndClear={onEndClear}
            start={currentAdminSelection.start}
            end={currentAdminSelection.end}
          />
          <AdminSellerSelect
            id="refresh"
            Sellers={currentAdminSelection.allSellers}
            SellerId={currentAdminSelection.sellerId}
            OnSellerChange={(sellerId: number) => updateSeller(sellerId)}
          />
          <div className="admin-select" hidden={(currentAdminSelection.tours?.length ?? 0) == 0}>
          <span className="admin-seller-select-label">
            Tour:
          </span>
            <select onChange={(e) => setSelectedTour(e.currentTarget.value)} defaultValue={tourId}>
              {tourOptions}
            </select>
          </div>
        </Col>
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
              <option value="undelete">Undelete</option>
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
            data={filteredEvents}
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
                    id={`evtId_${rowData.ticketSocketEventId}`}
                    checked={eventIdList.includes(rowData.ticketSocketEventId)}
                    onChange={(e) => updateEventIdList(rowData.ticketSocketEventId, e.currentTarget.checked)}
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
            <Column flexGrow={2}>
              <HeaderCell>Venue</HeaderCell>
              <Cell>
                {(rowData: VipEvent) => (rowData.venue ? rowData.venue.name : '')}
              </Cell>
            </Column>
            <Column flexGrow={3}>
              <HeaderCell>Location</HeaderCell>
              <Cell>
                {(rowData: VipEvent) => (rowData.venue ? getLocation(rowData.venue) : '')}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Tickets sold</HeaderCell>
              <Cell>{(rowData: VipEvent) => rowData.totalTickets}</Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Tickets comped</HeaderCell>
              <Cell>{(rowData: VipEvent) => rowData.numTicketsComped}</Cell>
            </Column>
            <Column flexGrow={2}>
              <HeaderCell>Event Status</HeaderCell>
              <Cell>
                {(rowData: VipEvent) => getEventStatusText(rowData as VipEvent)}
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>&nbsp;</HeaderCell>
              <Cell>
                {(rowData: VipEvent) =>
                  rowData.ticketSocketEventId ? (
                    <a
                      href="#"
                      id={`${rowData.ticketSocketEventId}_event`}
                      onClick={() => editEvent(parseInt(`${rowData.ticketSocketEventId}`))}
                    >
                      Edit
                    </a>
                  ) : (
                    ''
                  )
                }
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>&nbsp;</HeaderCell>
              <Cell>
                {(rowData: VipEvent) =>
                  rowData.ticketSocketEventId && rowData.orders && rowData.orders.length > 0 ? (
                    <a
                      href="#"
                      id={`${rowData.ticketSocketEventId}_orders`}
                      onClick={() => viewOrders(parseInt(`${rowData.ticketSocketEventId}`))}
                    >
                      Manage Orders
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
