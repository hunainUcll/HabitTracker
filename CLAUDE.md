# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
cd backend && npm install

# Run the app
./start.sh
# or
cd backend && node server.js

# App runs at http://localhost:3000
```

No build step, linter, or test suite is configured.

## Architecture

Single-page app with a Node.js/Express backend serving static frontend files.

```
backend/
  server.js       — Express server, REST API, JSON persistence
  tracker.json    — Auto-generated data store (all user data lives here)

frontend/
  index.html      — Full SPA shell; all 5 pages defined here as .page divs
  css/style.css   — All styles
  js/app.js       — All frontend logic (~1200 lines, single file)
  js/data/
    app-data.js         — (loaded at runtime, referenced by app.js)
    university-data.json — Subject/topic/slide/lab content
    ict-data.json        — 611 ICT videos across 32 playlists
```

### Backend API (`server.js`)

All data persists to `tracker.json`. The store shape:

| Collection | Key | Description |
|---|---|---|
| `daily_logs` | array | Per-day log: weight, calories, macros, water, prayers, quran |
| `weight_entries` | array | `{ date, weight }` sorted by date |
| `progress_items` | object | Keys like `"uni:subject:name"` or `"ict:playlist:num"` → `{ completed, notes }` |
| `workout_logs` | array | `{ date, day_name, exercises: {id: bool} }` |

Endpoints follow a consistent upsert pattern — POST replaces an existing entry for the same date/key, or appends a new one.

### Frontend (`app.js`)

All state is global module-level variables (`progress`, `weightData`, `workoutLogs`, `dailyLog`, etc.). On load, `loadAllData()` fetches all four API endpoints in parallel and populates these globals. If the backend is unreachable, it falls back to `localStorage` keys prefixed with `h` (`hprogress`, `hweights`, etc.).

Navigation is tab-based (`showPage(name)`), hiding/showing `.page` divs. Pages: `home`, `body`, `university`, `wealth`, `spirit`.

The workout plan (`WORKOUT_PLAN`) is static in `app.js` — days 1/3/5/6 (Mon/Wed/Fri/Sat). Exercise completion tracks against `workout_logs` via exercise `id` strings like `mon_1`, `wed_3`, etc.

Progress keys for university use the pattern `"uni:<subject>:<topicName>"`. ICT video progress uses `"ict:<playlistIndex>:<videoIndex>"`.

Dates always use local `YYYY-MM-DD` strings (never UTC) via `localDateStr()` / `todayStr()` to avoid midnight offset bugs.
