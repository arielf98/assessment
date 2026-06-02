# Court Reporting Workflow Manager

Fullstack assessment implementation for a simplified court reporting workflow system. The app uses Node.js, TypeScript, and SQLite through Node 24's built-in `node:sqlite` module.

## Features

- Create transcription jobs with case name, duration, location, city, and status.
- Auto-assign reporters, preferring same-city reporters for physical jobs and remote-capable reporters for remote jobs.
- Assign editors after transcription and track review state.
- Enforce status flow: `NEW -> ASSIGNED -> TRANSCRIBED -> REVIEWED -> COMPLETED`.
- Calculate per-job and total payout:
  - Reporter: `IDR 2,000/minute`
  - Editor: flat fee per editor
- Serve a simple dashboard and REST API from the same Node server.

## Requirements

- Node.js 24 or newer

## Run

```
cd fe/
npm install
npm run dev
```

```
cd be/
npm install 
npm run dev
```

Open `http://localhost:5173`.

The SQLite database is created automatically at `be/dev.sqlite3`:

## REST API

### Jobs

```http
GET /api/jobs
POST /api/jobs
GET /api/jobs/:id
PUT /api/jobs/:id
```

Create job payload:

```json
{
  "case_name": "Flood Report",
  "duration": 3,
  "location": "Main Street",
  "city": "Bandung"
}
```

Update status payload:

```json
{
  "status": "TRANSCRIBED"
}
```

### People

```http
GET /api/reporters
POST /api/reporters
PUT /api/reporters/:id
GET /api/editors
POST /api/editors
PUT /api/editors/:id
```

### Payments

```http
GET /api/payments
```
