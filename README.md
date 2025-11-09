# Campus Lost & Found – Front-End

A responsive HTML/CSS/JavaScript interface for a university lost and found platform. It covers student/staff flows (posting, searching, tracking items) and admin operations (moderation, analytics, announcements) with client-side data stored in `localStorage`.

## Quick Start

- Open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari).
- No build tools or backend are required; all interactions run on the client.
- Optional: clear browser `localStorage` to reset the seeded demo dataset.

## Key Features

- **Authentication simulation**  
  Register/login with `.edu` validation, profile snapshot, theme/role persistence, mock audit log.

- **Reports & tracking**  
  Post lost/found items with multi-image upload preview, automatic moderation queue, status timeline (Lost → Found → Returned) with quick actions.

- **Discovery tools**  
  Keyword search, category/location/status filters, quick stats, live notifications for potential matches, and personal history view.

- **Admin console**  
  Approve/reject submissions, suspend/reinstate users, publish announcements, download audit/user history JSON, auto-archive cases after 90 days, category insights chart, frequent loss highlight, recovery metrics.

- **User experience extras**  
  Light/dark mode toggle, responsive layout, accessible forms, toast-style alerts, seeded demo content for immediate exploration.

## Tech Stack

- Vanilla HTML5, modern CSS (custom properties, grid/flex) and ES2022 modules.
- No external dependencies; Google Fonts for typography.
- Canvas API for lightweight analytics visualization.

## Extending the Prototype

- Replace the authentication mock with real SSO or OAuth.
- Persist data via REST/GraphQL endpoints instead of `localStorage`.
- Integrate real email or push notifications for match alerts.
- Connect analytics widgets to real reporting pipelines or BI dashboards.

## User Story Coverage Snapshot

| Story IDs | Status | Front-end notes |
|-----------|--------|-----------------|
| 1–4, 5–7, 8, 9, 11, 13 | Implemented client-side | Forms, previews, search, filters, status transitions, history view. |
| 10 | Implemented | Theme toggle persists preference. |
| 12, 24 | Simulated | Instant in-app notifications + placeholder email messaging. |
| 14–16 | Implemented mocks | Moderation queue, edit (approve/reject), user management actions. |
| 17–23, 25 | Partially mocked | Analytics cards, chart, auto-archive, multi-image upload ready for backend integration. |

> 💡 Use the admin role to moderate posts and explore analytics. Use seeded student accounts for reporting flows. Credentials are intentionally lightweight—adjust when integrating with a real backend.