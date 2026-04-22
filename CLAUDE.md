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

## Key files

| File | Role |
|---|---|
| `src/App.jsx` | Root: session check, router, user prop threading |
| `src/config/api.js` | All API endpoint constants and sessionStorage key |
| `src/api/` | API call functions (auth, project, health check) |
| `src/components/ProjectDetail.jsx` | Timeline rendering + report creation |
| `src/components/Dashboard.jsx` | Project list + create-project flow |
| `vite.config.js` | `/api` proxy to localhost:3000 |
