# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server on http://localhost:5173
npm run build     # Production build to /dist
npm run lint      # ESLint check
npm run preview   # Preview production build locally
```

No test suite is configured (no Jest/Vitest).

## Architecture

CivilTrack is a React 19 + Vite SPA for digitizing construction site daily reports (bitácoras). Field residents submit photo+text reports; site directors review via a dashboard.

**Routing (React Router v7):**
- `/` → Dashboard — lists projects, opens NewProjectModal
- `/proyectos/:id` → ProjectDetail — timeline of daily reports, opens NewReportModal

**Auth:** Cookie-based sessions. `App.jsx` calls `fetchCurrentUser()` on mount; if the cookie is valid the user object flows down as props. Logout clears `sessionStorage` (key: `civiltrack_usuario`).

**API layer** (`src/api/`): Raw `fetch()` with `credentials: 'include'` for most calls. Axios is used only in `NewReportModal` for `multipart/form-data` file uploads. The Vite dev proxy rewrites `/api` → `http://localhost:3000`.

**State:** Local `useState` + prop drilling only — no Context, Redux, or external store.

**Data normalization:** Backend field names are inconsistent across endpoints (e.g. `id` vs `id_proyecto`, `usuario` vs `author`). Components normalize on the way in; see `ProjectDetail.jsx` for the current mapping.

## Dark mode

Dark mode is implemented using a class-based strategy on `<html>`:

- **Tailwind v4:** `@custom-variant dark (&:is(.dark *))` is declared in `index.css` so `dark:` utilities activate when any ancestor has the `.dark` class.
- **Hook:** `src/hooks/useDarkMode.js` — reads `localStorage('civiltrack_theme')`, falls back to `prefers-color-scheme`, and toggles `document.documentElement.classList` on every state change.
- **Wiring:** `App.jsx` calls the hook once and passes `darkMode` + `toggleDarkMode` as props down to `Dashboard` → `Drawer`. `ProjectDetail` and `Login` only need the `dark:` classes (no props needed — they react to the `<html>` class automatically).
- **Toggle button:** Lives inside the `Drawer` component (hamburger menu). Renders a Sun/Moon icon + label + animated pill toggle. Positioned above "Cerrar sesión" with a separator.

## Mobile-first conventions

- Minimum touch target: `min-h-[44px]` for most actions, `min-h-[52px]` for primary actions.
- Safe-area padding via `env(safe-area-inset-top/bottom)` on headers, modals, and bottom bars.
- iOS auto-zoom prevention: all `input`, `textarea`, `select` have `font-size: 16px` in `index.css`.
- Bottom navigation on mobile (`md:hidden`); top/inline controls on tablet (`hidden md:flex`).
- Animations: `animate-slide-in-right` (Drawer), `animate-slide-up` (modals), `animate-fade-in-out` (Toast) — all defined in `index.css`.

## Key files

| File | Role |
|---|---|
| `src/App.jsx` | Root: session check, router, dark mode init, user prop threading |
| `src/hooks/useDarkMode.js` | Dark mode state — persists to localStorage, toggles `<html>.dark` |
| `src/config/api.js` | All API endpoint constants and sessionStorage key |
| `src/api/` | API call functions (auth, project, health check) |
| `src/components/Dashboard.jsx` | Project list, create-project flow, Drawer with dark mode toggle |
| `src/components/ProjectDetail.jsx` | Timeline rendering + report creation |
| `src/components/NewProjectModal.jsx` | Create project modal (slide-up, mobile-optimized) |
| `src/components/EditProjectModal.jsx` | Edit project modal |
| `src/components/DeleteConfirmModal.jsx` | Delete confirmation modal |
| `src/components/NewReportModal.jsx` | Create report modal — uses Axios for multipart/form-data |
| `src/components/Login.jsx` | Login form with client-side validation |
| `src/index.css` | Global styles: Tailwind import, dark variant, animations, safe-area helpers |
| `vite.config.js` | `/api` proxy to localhost:3000 |
