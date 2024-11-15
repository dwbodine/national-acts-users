import { TicketSocketRefreshHistory } from '@/types/event';
import moment from 'moment';
import { Table } from 'rsuite';

export default function RefreshTicketSocketHistoryTable(props: any) {
  const results = props.history as TicketSocketRefreshHistory[] | undefined;
  const { Column, HeaderCell, Cell } = Table;

  return results != undefined ? (
    <Table height={420} data={results} bordered cellBordered>
      <Column resizable>
        <HeaderCell>User</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.username ? rowData.username : (rowData.userId?.toString() ?? 'n/a')
          }
        </Cell>
      </Column>
      <Column resizable>
        <HeaderCell>Seller</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.sellerName
              ? rowData.sellerName
              : (rowData.sellerId?.toString() ?? 'n/a')
          }
        </Cell>
      </Column>
      <Column resizable>
        <HeaderCell>Start Query</HeaderCell>
        <Cell>
          {(rowData) => (rowData.start ? moment.unix(rowData.start).format('l') : 'n/a')}
        </Cell>
      </Column>
      <Column resizable>
        <HeaderCell>End Query</HeaderCell>
        <Cell>
          {(rowData) => (rowData.end ? moment.unix(rowData.end).format('l') : 'n/a')}
        </Cell>
      </Column>
      <Column resizable>
        <HeaderCell>Start Timer</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.startTimer ? moment.unix(rowData.startTimer).format('l LTS') : 'n/a'
          }
        </Cell>
      </Column>
      <Column resizable>
        <HeaderCell>End Timer</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.endTimer ? moment.unix(rowData.endTimer).format('l LTS') : 'n/a'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Event update duration</HeaderCell>
        <Cell>
          {(rowData) => (rowData.duration ? rowData.duration.toFixed(1) : '0.0')}
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Order update duration</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.orderDataUpdateDuration
              ? rowData.orderDataUpdateDuration.toFixed(1)
              : '0.0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Total duration</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.totalDuration ? rowData.totalDuration.toFixed(1) : '0.0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Success</HeaderCell>
        <Cell>{(rowData) => (rowData.succeeded ? 'true' : 'false')}</Cell>
      </Column>
      <Column>
        <HeaderCell>Order Data Update</HeaderCell>
        <Cell>
          {(rowData) => (rowData.orderDataUpdateSucceeded ? 'suceeded' : 'failed')}
        </Cell>
      </Column>
      <Column resizable>
        <HeaderCell>Error</HeaderCell>
        <Cell>{(rowData) => (rowData.errorMessage ? rowData.errorMessage : 'n/a')}</Cell>
      </Column>
      <Column>
        <HeaderCell>Service Events Skipped</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.serviceEventsSkipped && rowData.serviceEventsSkipped.length > 0
              ? 'yes'
              : 'no'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Events failed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.eventsFailed && rowData.eventsFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Orders failed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ordersFailed && rowData.ordersFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Tickets failed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketsFailed && rowData.ticketsFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Ticket types failed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketTypesFailed && rowData.ticketTypesFailed.length > 0
              ? 'yes'
              : 'no'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Total Events From Service</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.totalEventsFromService
              ? rowData.totalEventsFromService.toString()
              : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Events Inserted</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.eventsInserted ? rowData.eventsInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Events Updated</HeaderCell>
        <Cell>
          {(rowData) => (rowData.eventsUpdated ? rowData.eventsUpdated.toString() : '0')}
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Orders Inserted</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ordersInserted ? rowData.ordersInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Orders Updated</HeaderCell>
        <Cell>
          {(rowData) => (rowData.ordersUpdated ? rowData.ordersUpdated.toString() : '0')}
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Orders Deleted</HeaderCell>
        <Cell>
          {(rowData) => (rowData.ordersDeleted ? rowData.ordersDeleted.toString() : '0')}
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Tickets Inserted</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketsInserted ? rowData.ticketsInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Tickets Updated</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketsUpdated ? rowData.ticketsUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Ticket types Inserted</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketTypesInserted ? rowData.ticketTypesInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Ticket types Updated</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketTypesUpdated ? rowData.ticketTypesUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Order data rows total</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.orderDataRowsTotal ? rowData.orderDataRowsTotal.toString() : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Order data rows removed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.orderDataRowsRemoved ? rowData.orderDataRowsRemoved.toString() : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Order data rows updated</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.orderDataRowsUpdated ? rowData.orderDataRowsUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column>
        <HeaderCell>Order data rows inserted</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.orderDataRowsInserted ? rowData.orderDataRowsInserted.toString() : '0'
          }
        </Cell>
      </Column>
    </Table>
  ) : (
    ''
  );
}
