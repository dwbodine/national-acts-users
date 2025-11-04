'use client';

import { RefreshTicketSocketHistoryTableProps } from '@/types/props';
import { Table } from 'rsuite';
import moment from 'moment';

export default function RefreshTicketSocketHistoryTable(
  props: RefreshTicketSocketHistoryTableProps,
) {
  const results = props.History;
  const { Column, HeaderCell, Cell } = Table;

  return results ? (
    <Table autoHeight data={results} bordered cellBordered>
      <Column resizable fullText flexGrow={2}>
        <HeaderCell>Date</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.startTimer ? moment.unix(rowData.startTimer).format('l') : 'n/a'
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={4}>
        <HeaderCell>User</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.username ? rowData.username : (rowData.userId?.toString() ?? 'n/a')
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={3}>
        <HeaderCell>Seller</HeaderCell>
        <Cell>{(rowData) => (rowData.sellerName ? rowData.sellerName : 'n/a')}</Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>Start Query</HeaderCell>
        <Cell>
          {(rowData) => (rowData.start ? moment.unix(rowData.start).format('l') : 'n/a')}
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>End Query</HeaderCell>
        <Cell>
          {(rowData) => (rowData.end ? moment.unix(rowData.end).format('l') : 'n/a')}
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>Start Timer</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.startTimer ? moment.unix(rowData.startTimer).format('LTS') : 'n/a'
          }
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>End Timer</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.endTimer ? moment.unix(rowData.endTimer).format('LTS') : 'n/a'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Event update duration</HeaderCell>
        <Cell>
          {(rowData) => (rowData.duration ? rowData.duration.toFixed(1) : '0.0')}
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order update duration</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.orderDataUpdateDuration
              ? rowData.orderDataUpdateDuration.toFixed(1)
              : '0.0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Total duration</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.totalDuration ? rowData.totalDuration.toFixed(1) : '0.0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Success</HeaderCell>
        <Cell>{(rowData) => (rowData.succeeded ? 'true' : 'false')}</Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order Data Update</HeaderCell>
        <Cell>
          {(rowData) => (rowData.orderDataUpdateSucceeded ? 'succeeded' : 'failed')}
        </Cell>
      </Column>
      <Column resizable fullText flexGrow={1}>
        <HeaderCell>Error</HeaderCell>
        <Cell>{(rowData) => (rowData.errorMessage ? rowData.errorMessage : 'n/a')}</Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Service Events Skipped</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.serviceEventsSkipped && rowData.serviceEventsSkipped.length > 0
              ? 'yes'
              : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Events failed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.eventsFailed && rowData.eventsFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Orders failed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ordersFailed && rowData.ordersFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Tickets failed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketsFailed && rowData.ticketsFailed.length > 0 ? 'yes' : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Ticket types failed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketTypesFailed && rowData.ticketTypesFailed.length > 0
              ? 'yes'
              : 'no'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Total Events From Service</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.totalEventsFromService
              ? rowData.totalEventsFromService.toString()
              : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Events Inserted</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.eventsInserted ? rowData.eventsInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Events Updated</HeaderCell>
        <Cell>
          {(rowData) => (rowData.eventsUpdated ? rowData.eventsUpdated.toString() : '0')}
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Orders Inserted</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ordersInserted ? rowData.ordersInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Orders Updated</HeaderCell>
        <Cell>
          {(rowData) => (rowData.ordersUpdated ? rowData.ordersUpdated.toString() : '0')}
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Orders Deleted</HeaderCell>
        <Cell>
          {(rowData) => (rowData.ordersDeleted ? rowData.ordersDeleted.toString() : '0')}
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Tickets Inserted</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketsInserted ? rowData.ticketsInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Tickets Updated</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketsUpdated ? rowData.ticketsUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Ticket types Inserted</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketTypesInserted ? rowData.ticketTypesInserted.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Ticket types Updated</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.ticketTypesUpdated ? rowData.ticketTypesUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order data rows total</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.orderDataRowsTotal ? rowData.orderDataRowsTotal.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order data rows removed</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.orderDataRowsRemoved ? rowData.orderDataRowsRemoved.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
        <HeaderCell>Order data rows updated</HeaderCell>
        <Cell>
          {(rowData) =>
            rowData.orderDataRowsUpdated ? rowData.orderDataRowsUpdated.toString() : '0'
          }
        </Cell>
      </Column>
      <Column fullText flexGrow={1}>
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
