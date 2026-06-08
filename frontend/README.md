# GitHub Datasets Dashboard Frontend

Welcome to the frontend application for the GitHub Datasets Management Platform. This React-based dashboard provides codebase analytics, full CRUD operations, advanced regex filtering, drag-and-drop JSON importing, CSV exporting, bulk record operations, and comprehensive administrator controls.

---

## 🚀 Technology Stack & Dependencies

The application is engineered on a modern frontend stack designed for performance, premium aesthetics, and responsive layout scaling:
- **Build Tooling & Core**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) (utilizing extremely fast HMR bundling)
- **Styling & Theme Engine**: [Tailwind CSS v4](https://tailwindcss.com/) with a built-in dark mode selector, glassmorphism visual designs, responsive grids, and CSS transition animations.
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + [React Redux](https://react-redux.js.org/) (centralizing slices for `auth`, `users`, `datasets`, `stats`, and `ui`).
- **Form Handling & Validation**: [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) (providing schema-based validation on user credentials, settings forms, and database record inputs).
- **Data Visualization**: [Recharts](https://recharts.org/) (interactive, SVG-based responsive diagrams with custom tooltip components).
- **Networking**: [Axios](https://axios-http.com/) (configured client with automatic JWT token attachment and global HTTP status interception).
- **Icon Pack**: [Lucide React](https://lucide.dev/) (modern, clean SVG icons).

---

## 📂 Directory Layout & Architecture

```text
frontend/
├── dist/                     # Compiled production bundle
├── public/                   # Static public assets
└── src/
    ├── components/           # Reusable UI widgets & modal dialogues
    │   ├── Layout.jsx        # private route wrapper (Navbar, Sidebar, Footer)
    │   ├── Navbar.jsx        # global theme switcher, logout, user profile
    │   ├── Sidebar.jsx       # navigation routes and administrative paths
    │   ├── ToastContainer.jsx# floating global feedback alert overlay
    │   └── ...
    ├── pages/                # Screen view pages
    │   ├── LandingPage.jsx   # interactive hero section and health checks
    │   ├── Login.jsx         # Formik authenticated log-in
    │   ├── StatsDashboard.jsx# concurrent counts cards & progress bars
    │   ├── DatasetsExplorer.jsx # main data roster containing search/filters
    │   ├── AnalyticsDashboard.jsx # metric chart layouts (Recharts)
    │   ├── AdminUsers.jsx    # administrator user roster panel
    │   └── ...
    ├── services/
    │   └── api.js            # Axios client settings & 401/429 global error interceptors
    ├── store/                # Redux Slice definitions
    │   ├── authSlice.js
    │   ├── datasetSlice.js
    │   ├── statsSlice.js
    │   ├── userSlice.js
    │   └── uiSlice.js
    ├── App.jsx               # router routing definitions and route guards
    ├── main.jsx              # app render entrypoint
    └── index.css             # global CSS rules and Tailwind CSS v4 variables
```

---

## 💎 Features Walkthrough (PR 1 - PR 18)

1. **Global Responsive Shell**: Glassmorphism navbar overlays, collapsible sidebar toggles, and unified layout footer wrappers supporting custom dark mode theme settings.
2. **Landing Hero Section**: Visual showcases of platform features and automated mount-based API health checking (`/system/health`).
3. **Authentication Guard Rails**: Fully validated Login/Registration forms with strict client-side validation rules. Employs `ProtectedRoute` and `AdminRoute` layout wrappers to shield dashboard data.
4. **OTPs Forgot Password Flow**: Recover accounts using mail-based One-Time Passwords (`ForgotPassword` and `ResetPassword`).
5. **Real-time Counters Summary**: Parallel fetches counts from all endpoints concurrently on stats load using `Promise.all` alongside numerical counter increments.
6. **Live Multi-filter Search Explorer**: Advanced pagination lists with live debounced search and multi-filtering options (frameworks, classification types, doc-types, programming languages, and trash state).
7. **Single-record CRUD Panels**: Specialized page dialogs to add, review, edit, or delete datasets using custom validation schemas.
8. **Soft Delete & Trash Restoration**: Soft-deletes files instead of wiping databases. Dimmed strike-through row layouts indicate soft-deleted state, while administrator accounts can restore them with green Restore arrows.
9. **Floating Batch Actions Bar**: Multi-checkbox row select triggers bulk actions (bulk edit fields, bulk soft delete, bulk hard delete, or bulk restore).
10. **CSV Export & JSON Import Manager**: Drag-and-drop JSON upload area with client-side syntax checks alongside download triggers to download database summaries as CSV spreadsheets.
11. **Analytics Dashboard**: Interactive charts (element donut ratios, horizontal repositories bars, language distributions, and platform source charts) with customized tooltips.
12. **Admin User Roster Controls**: CRUD controls on other registered user accounts, enabling administrators to set roles or delete users (blocks self-deletions).
13. **Centralized Interceptor Alerts**: centralizes error display inside a sliding toast alert overlay that dismisses itself after 4 seconds. Catch rate-limit responses (HTTP 429) automatically.

---

## 🛠️ Local Environment Configuration

By default, the Axios client routes traffic to the remote Render production backend:
`https://github-dataset-backend-vokd.onrender.com/api/v1`

For local integration, define a `.env` file in the `frontend` root folder:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🏃 Execution Instructions

First, install local project dependencies:
```bash
npm install
```

### Development Server
Launches the local Vite server (accessible on `http://localhost:5173`):
```bash
npm run dev
```

### Production Compilation
Builds and minifies source code for static deployment inside the `/dist` directory:
```bash
npm run build
```
