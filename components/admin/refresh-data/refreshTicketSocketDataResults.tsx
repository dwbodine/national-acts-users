import { Col, Row } from 'react-bootstrap';
import { RefreshTicketSocketDataResultProps } from '@/types/props';
import moment from 'moment';

export default function RefreshTicketSocketDataResults(props: RefreshTicketSocketDataResultProps) {
  const results = props.UpdateResults;

  let succeeded = '';
  let errorMessage = '';
  let username = '';
  let sellerName = '';
  let startTimerStr = '';
  let endTimerStr = '';
  let startRefreshStr = '';
  let endRefreshStr = '';
  let duration = '';
  let totalEventsFromService = '';
  let serviceEventsSkipped = '';
  let eventsFailed = '';
  let ordersFailed = '';
  let ticketsFailed = '';
  let ticketTypesFailed = '';
  let eventsUpdated = '';
  let eventsInserted = '';
  let ordersUpdated = '';
  let ordersInserted = '';
  let ordersDeleted = '';
  let ticketsUpdated = '';
  let ticketsInserted = '';
  let ticketTypesUpdated = '';
  let ticketTypesInserted = '';
  let orderDataUpdateSucceeded = '';
  let orderDataUpdateDuration = '';
  let orderDataRowsTotal = '';
  let orderDataRowsRemoved = '';
  let orderDataRowsInserted = '';
  let orderDataRowsUpdated = '';
  let totalDuration = '';

  if (results) {
    succeeded = results.succeeded ? 'true' : 'false';
    orderDataUpdateSucceeded = results.orderDataUpdateSucceeded ? 'true' : 'false';
    errorMessage = results.succeeded ? '' : (results.errorMessage ?? 'unknown');
    username = results.username
      ? results.username
      : (results.userId?.toString() ?? 'n/a');
    sellerName = results.sellerName
      ? results.sellerName
      : (results.sellerId?.toString() ?? 'n/a');
    startRefreshStr = results.start
      ? moment.unix(results.start).format('MM/DD/YYYY')
      : 'n/a';
    endRefreshStr = results.end ? moment.unix(results.end).format('MM/DD/YYYYY') : 'n/a';
    startTimerStr = results.startTimer
      ? moment.unix(results.startTimer).format('hh:mm:ss A')
      : 'n/a';
    endTimerStr = results.endTimer
      ? moment.unix(results.endTimer).format('hh:mm:ss A')
      : 'n/a';
    duration = results.duration ? results.duration.toFixed(1) : '0.0';
    orderDataUpdateDuration = results.orderDataUpdateDuration
      ? results.orderDataUpdateDuration.toFixed(1)
      : '0.0';
    totalDuration = results.totalDuration ? results.totalDuration.toFixed(1) : '0.0';
    totalEventsFromService = results.totalEventsFromService
      ? results.totalEventsFromService.toString()
      : '0';
    serviceEventsSkipped =
      results.serviceEventsSkipped && results.serviceEventsSkipped.length > 0
        ? results.serviceEventsSkipped.join(', ')
        : 'None';
    eventsFailed =
      results.eventsFailed && results.eventsFailed.length > 0
        ? results.eventsFailed.join(', ')
        : 'None';
    ordersFailed =
      results.ordersFailed && results.ordersFailed.length > 0
        ? results.ordersFailed.join(', ')
        : 'None';
    ticketsFailed =
      results.ticketsFailed && results.ticketsFailed.length > 0
        ? results.ticketsFailed.join(', ')
        : 'None';
    ticketTypesFailed =
      results.ticketTypesFailed && results.ticketTypesFailed.length > 0
        ? results.ticketTypesFailed.join(', ')
        : 'None';
    eventsUpdated = results.eventsUpdated ? results.eventsUpdated.toString() : '0';
    eventsInserted = results.eventsInserted ? results.eventsInserted.toString() : '0';
    ordersUpdated = results.ordersUpdated ? results.ordersUpdated.toString() : '0';
    ordersInserted = results.ordersInserted ? results.ordersInserted.toString() : '0';
    ordersDeleted = results.ordersDeleted ? results.ordersDeleted.toString() : '0';
    ticketsUpdated = results.ticketsUpdated ? results.ticketsUpdated.toString() : '0';
    ticketsInserted = results.ticketsInserted ? results.ticketsInserted.toString() : '0';
    ticketTypesUpdated = results.ticketTypesUpdated
      ? results.ticketTypesUpdated.toString()
      : '0';
    ticketTypesInserted = results.ticketTypesInserted
      ? results.ticketTypesInserted.toString()
      : '0';
    orderDataRowsTotal = results.orderDataRowsTotal
      ? results.orderDataRowsTotal.toString()
      : '0';
    orderDataRowsRemoved = results.orderDataRowsRemoved
      ? results.orderDataRowsRemoved.toString()
      : '0';
    orderDataRowsUpdated = results.orderDataRowsUpdated
      ? results.orderDataRowsUpdated.toString()
      : '0';
    orderDataRowsInserted = results.orderDataRowsInserted
      ? results.orderDataRowsInserted.toString()
      : '0';
  }

  return results ? (
    <>
      <Row>
        <Col>
          <h3>Refresh Events Results</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col>Update succeeded: {succeeded}</Col>
          </Row>
          <Row hidden={!errorMessage}>
            <Col>Error message: {errorMessage}</Col>
          </Row>
          <Row>
            <Col>Order data update succeeded: {orderDataUpdateSucceeded}</Col>
          </Row>
          <Row>
            <Col>User: {username}</Col>
          </Row>
          <Row>
            <Col>Seller: {sellerName}</Col>
          </Row>
          <Row>
            <Col>Refresh started: {startTimerStr}</Col>
          </Row>
          <Row>
            <Col>Refresh ended: {endTimerStr}</Col>
          </Row>
          <Row>
            <Col>Start: {startRefreshStr}</Col>
          </Row>
          <Row>
            <Col>End: {endRefreshStr}</Col>
          </Row>
          <Row>
            <Col>Event update uration: {duration} seconds</Col>
          </Row>
          <Row>
            <Col>Order update duration: {orderDataUpdateDuration} seconds</Col>
          </Row>
          <Row>
            <Col>Total duration: {totalDuration} seconds</Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>Total events from service: {totalEventsFromService}</Col>
          </Row>
          <Row>
            <Col>Service events skipped: {serviceEventsSkipped}</Col>
          </Row>
          <Row>
            <Col>Events failed: {eventsFailed}</Col>
          </Row>
          <Row>
            <Col>Orders failed: {ordersFailed}</Col>
          </Row>
          <Row>
            <Col>Tickets failed: {ticketsFailed}</Col>
          </Row>
          <Row>
            <Col>Ticket types failed: {ticketTypesFailed}</Col>
          </Row>
          <Row>
            <Col>Events updated: {eventsUpdated}</Col>
          </Row>
          <Row>
            <Col>Events inserted: {eventsInserted}</Col>
          </Row>
          <Row>
            <Col>Orders updated: {ordersUpdated}</Col>
          </Row>
          <Row>
            <Col>Orders inserted: {ordersInserted}</Col>
          </Row>
          <Row>
            <Col>Orders deleted: {ordersDeleted}</Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>Tickets updated: {ticketsUpdated}</Col>
          </Row>
          <Row>
            <Col>Tickets inserted: {ticketsInserted}</Col>
          </Row>
          <Row>
            <Col>Ticket types updated: {ticketTypesUpdated}</Col>
          </Row>
          <Row>
            <Col>Ticket types inserted: {ticketTypesInserted}</Col>
          </Row>
          <Row>
            <Col>Order data rows total: {orderDataRowsTotal}</Col>
          </Row>
          <Row>
            <Col>Order data rows removed: {orderDataRowsRemoved}</Col>
          </Row>
          <Row>
            <Col>Order data rows updated: {orderDataRowsUpdated}</Col>
          </Row>
          <Row>
            <Col>Order data rows inserted: {orderDataRowsInserted}</Col>
          </Row>
        </Col>
      </Row>
    </>
  ) : (
    ''
  );
}
