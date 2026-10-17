# Ticket partner API coordination

This users-app change targets `national-acts-api` branch
`feature-database-migration-alembic`. It must ship with that API contract.

## Implementation plan

1. Replace legacy response fields in types, event navigation, fan moments, tours,
   order management, check-in, exports, and dashboard grouping.
2. Keep application event IDs, partner mapping IDs, and original provider IDs
   distinct. Send partner mapping IDs for order/ticket operations. Keep existing
   wire parameter names (`tsOrderId`, `orderId`, `ticketId`, and ID lists).
3. Send both `ticketPartnerId` and `ticketPartnerEventId` when associating a
   TicketSocket event; use `venueId` for venue edits. Gate TicketSocket operations
   on the partner, since National Acts events also have partner mapping IDs.
4. Invalidate persisted event/order selections once on upgrade. Preserve global
   state and reload server data rather than guessing mappings for old IDs.
5. Add behavior tests with distinct application, partner, and provider IDs; run
   `yarn lint`, `yarn typecheck`, `yarn test`, and `yarn build`.

## Identifier contract

| Purpose                                                            | Field                                               |
| ------------------------------------------------------------------ | --------------------------------------------------- |
| Application event routes, notes, tours, fan moments, event actions | `eventId`                                           |
| Event partner                                                      | `ticketPartnerId` (1 National Acts, 2 TicketSocket) |
| Partner event association and dashboard grouping                   | `ticketPartnerEventId`                              |
| Order routes, edits, refunds, activation/deletion                  | `ticketPartnerOrderId`                              |
| Ticket edits, refunds, check-in                                    | `ticketPartnerOrderTicketId`                        |
| Displayed/exported provider order number                           | `originalOrderId`                                   |
| Provider event/ticket identifiers                                  | `originalEventId`, `originalTicketId`               |
| Event venue selection                                              | `venueId`                                           |

Ticket-type responses still call their partner event mapping ID `eventId`.
`ticketSocketId` continues to identify a TicketSocket account, not a partner.
Old bookmarked order URLs cannot safely be translated without a server lookup;
new order links use `partnerOrderId` instead of `id`, and legacy links show a
message directing users to reopen orders through the order list/search.

## Coordinated rollout

1. Build and validate both matching branches. Apply the API migrations to a
   staging database with representative imported orders, comped tickets, notes,
   tours, fan moments, and daily reporting rows.
2. Run both candidate applications together in staging. Check event deep links,
   event/venue saves, TicketSocket associations, tour and fan-moment selection,
   order search/navigation/editing, check-in/undo, refund flags, bulk actions,
   CSV exports, and dashboard drill-downs. Use IDs whose numeric values differ
   across application, partner, and provider namespaces.
3. Verify opening a browser with saved pre-release selections reloads data, and
   a second reload retains new-contract selections.
4. Verify changing or clearing a TicketSocket association leaves exactly the
   intended mapping in API responses. The API update currently ensures a mapping
   exists; removal/replacement of prior mappings needs explicit staging coverage.
5. Release the migrated API and users build in one maintenance window; prevent
   edits from old browser bundles during the switch and require a browser reload.
   Neither version of this users build supports both API contracts at once.
6. Smoke-test the same paths after release. If rollback is needed, coordinate
   the API's documented database rollback and the prior users build together.
   Do not roll back only one application.

No production migration, deployment, or real refund is performed by this change.

## Local validation

The users-app implementation passes `yarn lint`, `yarn typecheck`, `yarn test`
(105 tests across 28 files, with coverage), and `yarn build`.
Regression tests cover partner IDs in outgoing payloads, check-in and undo,
event association selection, application event navigation, legacy order links,
persisted-state upgrades, and dashboard grouping. Existing export and fan-moment
tests use the updated contract.

The staging and production rollout steps above remain to be performed against
the migrated API and database.
