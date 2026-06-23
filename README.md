# YouTube Video Stats Dashboard

Full stack YouTube analytics dashboard for creators.

## Features

- Paste YouTube video URL
- Embedded playable video
- Real time stats (views, likes, comments)
- YouTube Analytics API integration (OAuth login)
- Watch time, CTR, impressions
- Subs gained/lost (creator only)
- Traffic sources
- Device + country analytics
- Export data (CSV/JSON)

## Tech Stack

- Frontend: React (or vanilla JS)
- Backend: Node.js + Express
- Auth: Google OAuth 2.0
- APIs:
  - YouTube Data API v3
  - YouTube Analytics API
  - YouTube Reporting API

## Setup

1. Clone repo
2. npm install
3. Copy .env.example to .env
4. Add your API keys
5. Run backend + frontend

## Important

Some stats (watch time, subs gained/lost, CTR) only work after OAuth login with channel access.
