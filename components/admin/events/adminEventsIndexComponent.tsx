import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { SelectPicker, Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setAdminDates,
  setAdminEvent,
  setAdminEvents,
  setAdminSellerId,
  setAdminTour,
  setAllSellers,
  setCountries,
  setReloadCountries,
  setReloadEvents,
  setReloadSellers,
  setReloadTours,
  setReloadVenues,
  setTicketSocketEventsOnly,
  setTours,
} from '@/lib/adminSelectionSlice';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import ReportDatePicker from '../../common/reportDatePicker';
import { GetEventsResponse, GetSellersResponse, GetToursResponse, VipEvent } from '@/types/event';
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
import { AdminSelection } from '@/types/user';
import { setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';
import { useGetTicketSocketEventsOnly } from '@/hooks/admin/useGetTicketSocketEventsOnly';
import { ItemDataType } from 'rsuite/esm/internals/types';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { GetCountriesResponse } from '@/types/admin';

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
  const { getTicketSocketEventsOnly } = useGetTicketSocketEventsOnly();
  const { getAllCountries } = useGetAllCountries();

  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [eventIdList, setEventIdList] = useState<number[]>([]);
  const allEventIds: number[] = currentAdminSelection.events?.map(evt => { return evt.externalEventId }) ?? [];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadCountries) {
        dispatch(setReloadCountries(false));
        dispatch(setIsLoading(true));
        getAllCountries().then((response: GetCountriesResponse) => {
          if (response.countries && !response.countryError) {
            dispatch(setCountries(response.countries));
          } else {
            toast.error(response.countryError);
            dispatch(setIsLoading(false));
          }
        });
      } else if (currentAdminSelection.reloadSellers) {
        dispatch(setReloadSellers(false));
        setEventIdList([]);
        setSelectedAction(null);
        setTableLoading(true);
        dispatch(setIsLoading(true));
        dispatch(setAdminSellerId(undefined));
        dispatch(setAdminTour(undefined));
        dispatch(setReloadEvents(true));
        getSellers().then((response: GetSellersResponse) => {
          dispatch(setAllSellers(response.sellers));
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (currentAdminSelection.reloadEvents) {
        setEventIdList([]);
        setSelectedAction(null);
        dispatch(setReloadEvents(false));
        const adminSelection = { ...currentAdminSelection };
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
            const start = moment(response.events[0].eventDate).unix();
            const end = moment(
              response.events[response.events.length - 1].eventDate,
            ).unix();
            const selection: AdminSelection = {
              ...adminSelection,
              start: start,
              end: end,
            };
            dispatch(setAdminDates(selection));
            getTours(sellerId)
              .then((tourResponse: GetToursResponse) => {
                if (!tourResponse.tourError && tourResponse.tours) {
                  dispatch(setTours(tourResponse.tours));
                  getTicketSocketEventsOnly(adminSelection.sellerId).then((response) => {
                    if (response.events && !response.eventError) {
                      dispatch(setTicketSocketEventsOnly(response.events));
                    }
                    dispatch(setIsLoading(false));
                    setTableLoading(false);
                  });
                } else {
                  dispatch(setIsLoading(false));
                  setTableLoading(false);
                }
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
  }, [dispatch, getSellers, currentAdminSelection, getAdminEvents, tableLoading, getTours, getTicketSocketEventsOnly, getAllCountries]);

  const updateSeller = (sellerId: number | null) => {
    if (!sellerId || isNaN(sellerId)) {
      return;
    }
    dispatch(setAdminSellerId(sellerId));
    dispatch(setAdminTour(undefined));
    dispatch(setTicketSocketEventsOnly(undefined));
    dispatch(setReloadTours(true));
    dispatch(setReloadEvents(true));
  };

  const onDateChange = (newStart: number | undefined, newEnd: number | undefined) => {
    const adminSelection = { ...currentAdminSelection };
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

  const addEvent = () => {
    if (
      !currentAdminSelection.sellerId
    ) {
      return;
    }
    const vipEvent: VipEvent = {
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
    router.push('/admin/events/edit/');
  };

  const editEvent = (eventId: number) => {
    if (
      !eventId ||
      isNaN(eventId) ||
      !currentAdminSelection.events ||
      currentAdminSelection.events.length == 0
    ) {
      return;
    }
    const vipEvent = currentAdminSelection.events.find(
      (x) => x.externalEventId == eventId,
    );
    if (!vipEvent) {
      return;
    }
    dispatch(setAdminEvent(vipEvent));
    router.push('/admin/events/edit/');
  };

  const manageOrders = (eventId: number) => {
    if (
      isNaN(eventId) ||
      !currentAdminSelection.events ||
      currentAdminSelection.events.length == 0
    ) {
      return;
    }
    const vipEvent = currentAdminSelection.events.find(
      (x) => x.externalEventId == eventId,
    );
    if (!vipEvent || !vipEvent.orders || vipEvent.orders.length == 0) {
      return;
    }
    dispatch(setAdminEvent(vipEvent));
    setTableLoading(true);
    router.push('/admin/events/orders/');
  };

  const updateEventIdList = (eventId: number | undefined, addToList: boolean) => {
    let idList: number[] = eventIdList ? [...eventIdList] : [];
    if (!addToList && eventId && idList.includes(eventId)) {
      idList = idList.filter(id => id != eventId);
    } else if (addToList && eventId && !idList.includes(eventId)) {
      idList.push(eventId);
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
          setSelectedAction(null);
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
          setSelectedAction(null);
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
          setSelectedAction(null);
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

  const setSelectedTour = (selectedTourId: number | null) => {
    if (!selectedTourId || isNaN(selectedTourId) || selectedTourId <= 0) {
      selectedTourId = 0;
    }
    const tour = currentAdminSelection.tours?.find(x => x.tourId == selectedTourId);
    dispatch(setAdminTour(tour));
    dispatch(setReloadEvents(true));
  };

  const tourList: ItemDataType<number>[] = currentAdminSelection?.tours ?
    currentAdminSelection?.tours?.map((tour) => {
      return {
        label: `${tour.tourName}`,
        value: tour.tourId
      }
    }) : [];

  const resetEvents = () => {
    onDateChange(undefined, undefined);
  };

  const selectedTourId = currentAdminSelection.selectedTour?.tourId ?? 0;
  const sellectedSellerId = currentAdminSelection.sellerId;

  const actions = [
    {
      label: "Deactivate",
      value: "inactive"
    },
    {
      label: "Deactivate",
      value: "inactive"
    },
    {
      label: "Delete",
      value: "delete"
    },
    {
      label: "Undelete",
      value: "undelete"
    },
    {
      label: "Hide",
      value: "hidden"
    },
    {
      label: "Unhide",
      value: "unhide"
    }
  ];

  const actionList: ItemDataType<string>[] = actions.map((action) => {
    return {
      label: action.label,
      value: action.value
    }
  });

  return (
    <div className="admin-container">
      <Row className="refresh-results-header">
        <Col>
          <AdminListHomeButton />
          <Button hidden={sellectedSellerId == undefined} onClick={addEvent}>Add New Event</Button>
        </Col>
      </Row>
      <Row className="refresh-results-header">
        <Col>
          <h3>Manage Events</h3>
        </Col>
      </Row>
      <AdminSellerSelect
        Id="refresh"
        Sellers={currentAdminSelection.allSellers}
        SellerId={currentAdminSelection.sellerId}
        OnSellerChange={(sellerId: number | null) => updateSeller(sellerId)}
        Countries={currentAdminSelection.countries}
      />
      <Row className="admin-select" hidden={tourList.length == 0}>
        <Col xs={1}>
          Tour:
        </Col>
        <Col>
          <SelectPicker
            value={selectedTourId}
            data={tourList}
            size="lg"
            onChange={(tId) => setSelectedTour(tId)}
            cleanable={true}
            placeholder="All Events"
            menuAutoWidth={true}
            className="admin-seller-select-value"
            onClean={() => setSelectedTour(0)}
          />
        </Col>
      </Row>
      <ReportDatePicker
        OnChange={onDateChange}
        OnStartClear={onStartClear}
        OnEndClear={onEndClear}
        Start={currentAdminSelection.start}
        End={currentAdminSelection.end}
      />
      <Row>
        <Col>
          <Button disabled={sellectedSellerId == undefined} onClick={resetEvents}>Reset</Button>
        </Col>
      </Row>
      <Row hidden={allEventIds.length == 0}>
        <Col className="bulk-arrow-row">
          <div><FaArrowTurnDown className="bulk-arrow" /></div>
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
                    checked={eventIdList.includes(rowData.externalEventId)}
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
                  <a
                    href="#"
                    id={`${rowData.externalEventId}_event`}
                    onClick={() => editEvent(parseInt(`${rowData.externalEventId}`))}
                  >
                    Edit
                  </a>
                }
              </Cell>
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>&nbsp;</HeaderCell>
              <Cell>
                {(rowData: VipEvent) =>
                  rowData.orders && rowData.orders.length > 0 ? (
                    <a
                      href="#"
                      id={`${rowData.externalEventId}_orders`}
                      onClick={() => manageOrders(parseInt(`${rowData.externalEventId}`))}
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

