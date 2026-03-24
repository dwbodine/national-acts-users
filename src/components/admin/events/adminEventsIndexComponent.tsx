'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaArrowTurnDown } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Checkbox, Col, Nav, Row, SelectPicker, Table } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetAdminEvents } from '@/hooks/admin/useGetAdminEvents';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useGetTicketSocketEventsOnly } from '@/hooks/admin/useGetTicketSocketEventsOnly';
import { useGetTours } from '@/hooks/admin/useGetTours';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { useSetEventsDeleted } from '@/hooks/event/useSetEventsDeleted';
import { useSetEventsHidden } from '@/hooks/event/useSetEventsHidden';
import { useSetEventsInactive } from '@/hooks/event/useSetEventsInactive';
import { useSetEventsLiveInBandsInTown } from '@/hooks/event/useSetEventsLiveInBandsInTown';
import {
  setAdminEvents,
  setTicketSocketEventsOnly,
  setTours,
  setVenues,
} from '@/lib/adminDataSelectionSlice';
import { setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';
import {
  setAdminDates,
  setAdminEvent,
  setAdminOrder,
  setAdminSellerId,
  setAdminTour,
  setAllSellers,
  setCountries,
  setReloadCountries,
  setReloadEvents,
  setReloadSellers,
  setReloadTours,
  setReloadVenues,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { VipEvent } from '@/types/event';
import {
  GetCountriesResponse,
  GetEventsResponse,
  GetSellersResponse,
  GetToursResponse,
  ModifyEventResponse,
} from '@/types/responses';
import { AdminSelection } from '@/types/user';
import { getEventStatusSlug, getEventStatusText } from '@/utils/eventUtils';

import ConfirmationDialog from '../../common/confirmationDialogComponent';
import ReportDatePicker from '../../common/reportDatePickerControl';
import AdminSellerSelect from '../common/adminSellerSelectComponent';

export default function AdminEventsIndex() {
  const { Column, HeaderCell, Cell } = Table;
  type EventsTabKey = 'active' | 'inactive';
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const { getSellers } = useGetSellers();
  const { getAdminEvents } = useGetAdminEvents();
  const { getLocation } = useGetLocation();
  const dispatch = useDispatch();
  const [tableLoading, setTableLoading] = useState(false);
  const { setEventsInactive } = useSetEventsInactive();
  const { setEventsDeleted } = useSetEventsDeleted();
  const { setEventsHidden } = useSetEventsHidden();
  const { setEventsLiveInBandsInTown } = useSetEventsLiveInBandsInTown();
  const { getTours } = useGetTours();
  const { getTicketSocketEventsOnly } = useGetTicketSocketEventsOnly();
  const { getAllCountries } = useGetAllCountries();
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [eventIdList, setEventIdList] = useState<number[]>([]);
  const [eventsTabKey, setEventsTabKey] = useState<EventsTabKey>('active');
  const allEventIds: number[] =
    currentAdminDataSelection.events?.map((evt) => evt.externalEventId) ?? [];
  const allEvents = currentAdminDataSelection.events ?? [];
  const activeEvents = useMemo(
    () =>
      allEvents.filter(
        (evt) =>
          !evt.isDeleted && evt.isActive && moment(evt.eventDate).isSameOrAfter(moment(), 'day'),
      ),
    [allEvents],
  );
  const inactiveEvents = useMemo(
    () =>
      allEvents
        .filter(
          (evt) =>
            evt.isDeleted || !evt.isActive || moment(evt.eventDate).isBefore(moment(), 'day'),
        )
        .sort((a, b) => moment(b.eventDate).valueOf() - moment(a.eventDate).valueOf()),
    [allEvents],
  );
  const visibleEvents = eventsTabKey === 'inactive' ? inactiveEvents : activeEvents;
  const visibleEventIds = visibleEvents.map((evt) => evt.externalEventId);
  const numVisibleSelected = visibleEventIds.filter((id) => eventIdList.includes(id)).length;
  const allVisibleSelected =
    visibleEventIds.length > 0 && numVisibleSelected === visibleEventIds.length;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadCountries) {
        dispatch(setReloadCountries(false));
        dispatch(setIsLoading(true));
        void getAllCountries().then((response: GetCountriesResponse) => {
          if (response.countries && !response.error) {
            dispatch(setCountries(response.countries));
          } else {
            toast.error(response.error);
            dispatch(setIsLoading(false));
          }
        });
      } else if (currentAdminSelection.reloadSellers) {
        dispatch(setReloadSellers(false));
        setEventIdList([]);
        setSelectedAction(null);
        if (!globalSelection.isLoading) {
          dispatch(setIsLoading(true));
        }
        dispatch(setAdminSellerId(undefined));
        dispatch(setAdminTour(undefined));
        dispatch(setReloadEvents(true));
        void getSellers().then((response: GetSellersResponse) => {
          if (response.sellers && !response.error) {
            dispatch(setAllSellers(response.sellers));
          } else {
            toast.error(response.error);
            dispatch(setIsLoading(false));
          }
        });
      } else if (currentAdminSelection.reloadEvents) {
        setEventIdList([]);
        setSelectedAction(null);
        dispatch(setReloadEvents(false));
        dispatch(setReloadVenues(true));
        const adminSelection = { ...currentAdminSelection };
        const sellerId: number = adminSelection.sellerId ?? 0;
        if (sellerId === 0) {
          setTableLoading(false);
          dispatch(setIsLoading(false));
          return;
        }

        if (!tableLoading) {
          setTableLoading(true);
        }
        if (!globalSelection.isLoading) {
          dispatch(setIsLoading(true));
        }
        void getAdminEvents(adminSelection).then((response: GetEventsResponse) => {
          if (response.events && !response.error) {
            dispatch(setAdminEvents(response.events));
            dispatch(setAdminEvent(undefined));
            dispatch(setAdminOrder(undefined));
            dispatch(setReloadEvents(false));
            if (response.events?.length > 0) {
              const [firstEvent] = response.events;
              const lastEvent = response.events[response.events.length - 1];
              if (firstEvent && lastEvent) {
                const start = moment(firstEvent.eventDate).unix();
                const end = moment(lastEvent.eventDate).unix();
                const selection: AdminSelection = {
                  ...adminSelection,
                  end,
                  start,
                };
                dispatch(setAdminDates(selection));
                void getTours(sellerId).then((tourResponse: GetToursResponse) => {
                  dispatch(setReloadTours(false));
                  if (!tourResponse.error && tourResponse.tours) {
                    dispatch(setTours(tourResponse.tours));
                    void getTicketSocketEventsOnly(adminSelection.sellerId).then(
                      (resp: GetEventsResponse) => {
                        if (resp.events && !resp.error) {
                          dispatch(setTicketSocketEventsOnly(response.events));
                        } else {
                          toast.error(resp.error);
                        }
                        dispatch(setIsLoading(false));
                        setTableLoading(false);
                      },
                    );
                  } else {
                    dispatch(setIsLoading(false));
                    setTableLoading(false);
                  }
                });
              }
            } else {
              dispatch(setIsLoading(false));
              setTableLoading(false);
            }
          } else {
            toast.error(response.error);
            dispatch(setIsLoading(false));
            setTableLoading(false);
          }
        });
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    dispatch,
    getSellers,
    currentAdminSelection,
    getAdminEvents,
    tableLoading,
    getTours,
    getTicketSocketEventsOnly,
    getAllCountries,
  ]);

  const updateSeller = (sellerId: number | null) => {
    if (!sellerId || isNaN(sellerId)) {
      return;
    }
    dispatch(setAdminSellerId(sellerId));
    dispatch(setAdminTour(undefined));
    dispatch(setTicketSocketEventsOnly(undefined));
    dispatch(setReloadTours(true));
    dispatch(setTours([]));
    dispatch(setReloadEvents(true));
    setEventsTabKey('active');
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
    if (!currentAdminSelection.sellerId) {
      return;
    }
    const vipEvent: VipEvent = {
      announceDate: undefined,
      disableLinkButton: false,
      disableLinkReason: undefined,
      disableVipLinkButton: false,
      disableVipLinkReason: undefined,
      eventDate: '',
      externalEventId: 0,
      externalUrl: undefined,
      externalVipLink: undefined,
      isActive: true,
      isDeleted: false,
      isExternal: true,
      sellerId: currentAdminSelection.sellerId,
      title: '',
    };
    dispatch(setReloadAdminEvents(false));
    dispatch(setReloadVenues(true));
    dispatch(setVenues(undefined));
    dispatch(setAdminEvent(vipEvent));
    router.push('/admin/events/edit');
  };

  const editEvent = (eventId: number) => {
    if (
      !eventId ||
      isNaN(eventId) ||
      !currentAdminDataSelection.events ||
      currentAdminDataSelection.events.length === 0
    ) {
      return;
    }
    const vipEvent = currentAdminDataSelection.events.find((x) => x.externalEventId === eventId);
    if (!vipEvent) {
      return;
    }
    dispatch(setAdminEvent(vipEvent));
    router.push('/admin/events/edit');
  };

  const manageOrders = (eventId: number) => {
    if (
      isNaN(eventId) ||
      !currentAdminDataSelection.events ||
      currentAdminDataSelection.events.length === 0
    ) {
      return;
    }
    const vipEvent = currentAdminDataSelection.events.find((x) => x.externalEventId === eventId);
    if (!vipEvent || !vipEvent.orders || vipEvent.orders.length === 0) {
      return;
    }
    dispatch(setAdminEvent(vipEvent));
    setTableLoading(true);
    router.push('/admin/events/orders');
  };

  const updateEventIdList = (eventId: number | undefined, addToList: boolean) => {
    let idList: number[] = eventIdList ? [...eventIdList] : [];
    if (!addToList && eventId && idList.includes(eventId)) {
      idList = idList.filter((id) => id !== eventId);
    } else if (addToList && eventId && !idList.includes(eventId)) {
      idList.push(eventId);
    }
    setEventIdList(idList);
  };

  const selectAllEvents = (addToList: boolean, eventIds: number[]) => {
    if (eventIds.length === 0) {
      return;
    }
    if (addToList) {
      setEventIdList([...new Set([...eventIdList, ...eventIds])]);
    } else {
      setEventIdList(eventIdList.filter((id) => !eventIds.includes(id)));
    }
  };

  const deactivateEvents = (isActive: boolean) => {
    if (eventIdList.length === 0) {
      return;
    }
    if (!globalSelection.isLoading) {
      dispatch(setIsLoading(true));
    }
    void setEventsInactive(eventIdList, isActive).then((response: ModifyEventResponse) => {
      if (response.success && !response.error) {
        const successMessage = isActive
          ? 'Events activated successfully'
          : 'Events deactivated successfully';
        toast.success(successMessage);
        setEventIdList([]);
        setSelectedAction(null);
        dispatch(setReloadEvents(true));
      } else {
        let errorMessage = response.error;
        if (!errorMessage) {
          errorMessage = isActive
            ? 'Unexpected error occurred while activating events'
            : 'Unexpected error occurred while deactivating events';
        }
        toast.error(errorMessage);
      }
      dispatch(setIsLoading(false));
    });
  };

  const deleteEvents = (setDeleted: boolean) => {
    if (eventIdList.length === 0) {
      return;
    }
    if (!globalSelection.isLoading) {
      dispatch(setIsLoading(true));
    }
    void setEventsDeleted(eventIdList, setDeleted).then((response: ModifyEventResponse) => {
      if (response.success && !response.error) {
        const successMessage = setDeleted
          ? 'Events deleted successfully'
          : 'Events undeleted successfully';
        toast.success(successMessage);
        setEventIdList([]);
        setSelectedAction(null);
        dispatch(setReloadEvents(true));
      } else {
        let errorMessage = response.error;
        if (!errorMessage) {
          errorMessage = setDeleted
            ? 'Unexpected error occurred while deleting events'
            : 'Unexpected error occurred while undeleting events';
        }
        toast.error(errorMessage);
      }
      dispatch(setIsLoading(false));
    });
  };

  const setLiveInBandsInTown = () => {
    if (eventIdList.length === 0) {
      return;
    }
    if (!globalSelection.isLoading) {
      dispatch(setIsLoading(true));
    }
    void setEventsLiveInBandsInTown(eventIdList).then((response: ModifyEventResponse) => {
      if (response.success && !response.error) {
        const successMessage = 'Events updated successfully';
        toast.success(successMessage);
        setEventIdList([]);
        setSelectedAction(null);
        dispatch(setReloadEvents(true));
      } else {
        let errorMessage = response.error;
        if (!errorMessage) {
          errorMessage = 'Unexpected error occurred while updating events';
        }
        toast.error(errorMessage);
      }
      dispatch(setIsLoading(false));
    });
  };

  const hideEvents = (setHidden: boolean) => {
    if (eventIdList.length === 0) {
      return;
    }
    if (!globalSelection.isLoading) {
      dispatch(setIsLoading(true));
    }
    void setEventsHidden(eventIdList, setHidden).then((response: ModifyEventResponse) => {
      if (response.success && !response.error) {
        const successMessage = setHidden
          ? 'Events hidden successfully'
          : 'Events unhidden successfully';
        toast.success(successMessage);
        setEventIdList([]);
        setSelectedAction(null);
        dispatch(setReloadEvents(true));
      } else {
        let errorMessage = response.error;
        if (!errorMessage) {
          errorMessage = setHidden
            ? 'Unexpected error occurred while hiding events'
            : 'Unexpected error occurred while unhiding events';
        }
        toast.error(errorMessage);
      }
      dispatch(setIsLoading(false));
    });
  };

  const handleBulkEdit = () => {
    toast.dismiss();
    if (eventIdList.length === 0 || !selectedAction) {
      return;
    }

    switch (selectedAction) {
      case 'inactive':
        deactivateEvents(false);
        break;
      case 'active':
        deactivateEvents(true);
        break;
      case 'delete':
        deleteEvents(true);
        break;
      case 'undelete':
        deleteEvents(false);
        break;
      case 'hidden':
        hideEvents(true);
        break;
      case 'unhide':
        hideEvents(false);
        break;
      case 'bandsintown':
        setLiveInBandsInTown();
        break;
      default:
        break;
    }
  };

  const bulkEditConfirm = () => {
    if (eventIdList.length === 0 || !selectedAction) {
      return;
    }

    let message = '';
    switch (selectedAction) {
      case 'inactive':
        message = `You are about to deactivate ${eventIdList.length} events`;
        break;
      case 'active':
        message = `You are about to activate ${eventIdList.length} events`;
        break;
      case 'delete':
        message = `You are about to delete ${eventIdList.length} events`;
        break;
      case 'undelete':
        message = `You are about to undelete ${eventIdList.length} events`;
        break;
      case 'hidden':
        message = `You are about to hide ${eventIdList.length} events`;
        break;
      case 'unhide':
        message = `You are about to unhide ${eventIdList.length} events`;
        break;
      case 'bandsintown':
        message = `You are about to mark ${eventIdList.length} events as live in BandsInTown`;
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

  const setSelectedTour = (selectedTourId: number | null) => {
    let tourId = selectedTourId;
    if (!tourId || isNaN(tourId) || tourId <= 0) {
      tourId = 0;
    }
    const tour = currentAdminDataSelection.tours?.find((x) => x.tourId === tourId);
    dispatch(setAdminTour(tour));
    dispatch(setReloadEvents(true));
  };

  const tourList: ItemDataType<number>[] = currentAdminDataSelection?.tours
    ? currentAdminDataSelection?.tours?.map((tour) => ({
        label: `${tour.tourName}`,
        value: tour.tourId,
      }))
    : [];

  const resetEvents = () => {
    onDateChange(undefined, undefined);
  };

  const selectedTourId = currentAdminSelection.selectedTour?.tourId ?? 0;
  const sellectedSellerId = currentAdminSelection.sellerId;

  const actions = [
    {
      label: 'Deactivate',
      value: 'inactive',
    },
    {
      label: 'Activate',
      value: 'active',
    },
    {
      label: 'Delete',
      value: 'delete',
    },
    {
      label: 'Undelete',
      value: 'undelete',
    },
    {
      label: 'Hide',
      value: 'hidden',
    },
    {
      label: 'Unhide',
      value: 'unhide',
    },
    {
      label: 'Mark Live In BandsInTown',
      value: 'bandsintown',
    },
  ];

  const actionList: ItemDataType<string>[] = actions.map((action) => ({
    label: action.label,
    value: action.value,
  }));

  return (
    <>
      <PageHeader pageTitle="Manage Events" />
      <div className="admin-container">
        <Row>
          <Col>
            <Button hidden={sellectedSellerId === undefined} onClick={addEvent}>
              Add New Event
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <AdminSellerSelect
              Id="refresh"
              Sellers={currentAdminSelection.allSellers}
              SellerId={currentAdminSelection.sellerId}
              OnSellerChange={(sellerId: number | null) => updateSeller(sellerId)}
              Countries={currentAdminSelection.countries}
            />
          </Col>
        </Row>
        <Row className="admin-select" hidden={tourList.length === 0}>
          <Col xs={2}>Tour:</Col>
          <Col xs={8}>
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
        <Row>
          <Col xs={24}>
            <ReportDatePicker
              OnChange={onDateChange}
              OnStartClear={onStartClear}
              OnEndClear={onEndClear}
              Start={currentAdminSelection.start}
              End={currentAdminSelection.end}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button disabled={sellectedSellerId === undefined} onClick={resetEvents}>
              Reset
            </Button>
          </Col>
        </Row>
        <Row hidden={allEventIds.length === 0}>
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
            <Nav
              appearance="tabs"
              activeKey={eventsTabKey}
              onSelect={(key) => setEventsTabKey(key as EventsTabKey)}
            >
              <Nav.Item eventKey="active">Upcoming Events ({activeEvents.length})</Nav.Item>
              <Nav.Item eventKey="inactive">
                Past/Inactive Events ({inactiveEvents.length})
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Table
              autoHeight={true}
              data={visibleEvents}
              bordered
              cellBordered
              loading={tableLoading}
              locale={{ emptyMessage: 'No events found' }}
              rowClassName={(rowData: VipEvent) => getEventStatusSlug(rowData)}
            >
              <Column width={50}>
                <HeaderCell>
                  <Checkbox
                    id={`evtId_selectAll`}
                    checked={allVisibleSelected}
                    indeterminate={numVisibleSelected > 0 && !allVisibleSelected}
                    onChange={(_, checked) => selectAllEvents(checked, visibleEventIds)}
                  />
                </HeaderCell>
                <Cell>
                  {(rowData: VipEvent) => (
                    <Checkbox
                      id={`evtId_${rowData.externalEventId}`}
                      checked={eventIdList.includes(rowData.externalEventId)}
                      onChange={(_, checked) => updateEventIdList(rowData.externalEventId, checked)}
                    />
                  )}
                </Cell>
              </Column>
              <Column flexGrow={1} minWidth={100}>
                <HeaderCell>Date</HeaderCell>
                <Cell>{(rowData: VipEvent) => moment(rowData.eventDate).format('MM/DD/YYYY')}</Cell>
              </Column>
              <Column flexGrow={3}>
                <HeaderCell>Title</HeaderCell>
                <Cell>{(rowData: VipEvent) => rowData.title}</Cell>
              </Column>
              <Column flexGrow={2}>
                <HeaderCell>Venue</HeaderCell>
                <Cell>{(rowData: VipEvent) => (rowData.venue ? rowData.venue.name : '')}</Cell>
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
              <Column flexGrow={1}>
                <HeaderCell>Event Status</HeaderCell>
                <Cell>{(rowData: VipEvent) => getEventStatusText(rowData)}</Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>&nbsp;</HeaderCell>
                <Cell>
                  {(rowData: VipEvent) => (
                    <a
                      href="#"
                      id={`${rowData.externalEventId}_event`}
                      onClick={() => editEvent(parseInt(`${rowData.externalEventId}`))}
                    >
                      Edit
                    </a>
                  )}
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
    </>
  );
}
