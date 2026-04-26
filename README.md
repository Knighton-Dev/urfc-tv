# urfc-tv

A minimal Next.js app that answers one question: **do the Utah Royals play today?**

Visit [urfc.tv](https://urfc.tv) to see it live.

## What it does

- Checks today's date (Mountain Time) against a local game schedule
- Displays a big **YES** with the opponent, kickoff time, and links to streaming services — or a **NO** with the next upcoming game
- Includes a `scripts/post-gameday.js` script that posts a Bluesky game-day reminder automatically when a game is scheduled

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS
- Vercel Analytics
- Game schedule stored as static JSON in `data/schedule.json`

## Updating the schedule

Edit `data/schedule.json` to add or update games. Each entry follows this shape:

```json
{
  "date": "YYYY-MM-DD",
  "opponent": "Team Name",
  "home": true,
  "time": "7:00 PM MT",
  "streamingServices": [{ "provider": "Provider", "url": "https://..." }],
  "broadcast": [{ "provider": "Channel Name" }]
}
```

## Bluesky reminders

Set the following environment variables and run the script on game days:

```
BLUESKY_IDENTIFIER=your-handle.bsky.social
BLUESKY_APP_PASSWORD=your-app-password
```

```bash
node scripts/post-gameday.js
```

The script exits silently (code 0) if there is no game today.

*this is just a subtle test addition*