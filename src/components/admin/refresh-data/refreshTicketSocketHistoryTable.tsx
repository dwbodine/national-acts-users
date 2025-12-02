'use client';

import { RefreshTicketSocketHistoryTableProps } from '@/types/props';
import { Table } from 'rsuite';
import { TicketSocketRefreshHistory } from '@/types/event';
import moment from 'moment';

export default function RefreshTicketSocketHistoryTable(
  props: RefreshTicketSocketHistoryTableProps,
) {
  const results: TicketSocketRefreshHistory[] | undefined = props.History;
  const { Column, HeaderCell, Cell } = Table;

  return results ? (
    <Table autoHeight data={results} bordered cellBordered>
      <Column resizable fullText flexGrow={2}>
        <HeaderCell>Date</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.startTimer ? moment.unix(rowData.startTimer).format('l') : 'n/a'
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={4}>
        <HeaderCell>User</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.username ? rowData.username : (rowData.userId?.toString() ?? 'n/a')
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={3}>
        <HeaderCell>Seller</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.sellerName ? rowData.sellerName : 'n/a'
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>Start Query</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.start ? moment.unix(rowData.start).format('l') : 'n/a'
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>End Query</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.end ? moment.unix(rowData.end).format('l') : 'n/a'
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>Start Timer</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.startTimer ? moment.unix(rowData.startTimer).format('LTS') : 'n/a'
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>End Timer</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.endTimer ? moment.unix(rowData.endTimer).format('LTS') : 'n/a'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Event update duration</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.duration ? rowData.duration.toFixed(1) : '0.0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order update duration</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.orderDataUpdateDuration ? rowData.orderDataUpdateDuration.toFixed(1) : '0.0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Total duration</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.totalDuration ? rowData.totalDuration.toFixed(1) : '0.0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Success</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) => (rowData.succeeded ? 'true' : 'false')}
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order Data Update</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.orderDataUpdateSucceeded ? 'succeeded' : 'failed'
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>Error</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.errorMessage ? rowData.errorMessage : 'n/a'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Service Events Skipped</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.serviceEventsSkipped && rowData.serviceEventsSkipped.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Events failed</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.eventsFailed && rowData.eventsFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Orders failed</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ordersFailed && rowData.ordersFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Tickets failed</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ticketsFailed && rowData.ticketsFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Ticket types failed</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ticketTypesFailed && rowData.ticketTypesFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Total Events From Service</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.totalEventsFromService ? rowData.totalEventsFromService.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Events Inserted</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.eventsInserted ? rowData.eventsInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Events Updated</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.eventsUpdated ? rowData.eventsUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Orders Inserted</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ordersInserted ? rowData.ordersInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Orders Updated</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ordersUpdated ? rowData.ordersUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Orders Deleted</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ordersDeleted ? rowData.ordersDeleted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Tickets Inserted</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ticketsInserted ? rowData.ticketsInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Tickets Updated</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ticketsUpdated ? rowData.ticketsUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Ticket types Inserted</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ticketTypesInserted ? rowData.ticketTypesInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Ticket types Updated</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.ticketTypesUpdated ? rowData.ticketTypesUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order data rows total</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.orderDataRowsTotal ? rowData.orderDataRowsTotal.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order data rows removed</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.orderDataRowsRemoved ? rowData.orderDataRowsRemoved.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order data rows updated</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.orderDataRowsUpdated ? rowData.orderDataRowsUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order data rows inserted</HeaderCell>
        <Cell>
          {(rowData: TicketSocketRefreshHistory) =>
            rowData.orderDataRowsInserted ? rowData.orderDataRowsInserted.toString() : '0'
          }
        </Cell>
      </Column>
    </Table>
  ) : (
    ''
  );
}
