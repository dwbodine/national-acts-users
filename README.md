# National Acts User Portal

This is the user/admin portal for clients of National Acts.

Interesting points:

- all data is served by the Python API at api.nationalactsvip.com
- uses role-based JWT to control authentication, then a custom user role system for internal authorization
- non-admin users are kept separate from admin functions via front- and back-end validation
- uses React 19+ with Typescript using the NextJS Framework
- largely uses static App routing for NextJS, although non-authorized and authorized routes are handled by separate dynamic routers
- using Sass for style rendering
- the client side of the portal has a Sales Overview limited to the ticket sellers authorized
- the admin side of the portal contains:
  - general site admin functions
  - event/order/ticket admin
  - a dashboard for data rollup
  - an event calendar for task/note tracking
  - reporting
  - user activity tracking
- uses a combo of Redux and Redux Persist to allow for better performance
- main dash and all UI elements use RSuite for display
