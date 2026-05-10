# urfc-tv

A minimal Next.js app that answers one question: **do the Utah Royals play today?**

Visit [urfc.tv](https://urfc.tv) to see it live.

## What it does

- Checks today's date (Mountain Time) against a local game schedule
- Displays a big **YES** with the opponent, kickoff time, and links to streaming services — or a **NO** with the next upcoming game
- Includes a `scripts/post-gameday.js` script that posts a game-day reminder automatically when a game is scheduled

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

## Social reminders

The game-day script always posts to Bluesky, and can also post to a Facebook Group when Facebook credentials are configured.

### Bluesky configuration

Set the following environment variables and run the script on game days:

```
BLUESKY_IDENTIFIER=your-handle.bsky.social
BLUESKY_APP_PASSWORD=your-app-password
```

### Facebook Group configuration (optional)

To enable Facebook Group posting, set:

```
FACEBOOK_GROUP_ID=your-numeric-group-id
FACEBOOK_ACCESS_TOKEN=your-long-lived-user-access-token
```

Requirements:

- A Meta app with **Facebook Login** enabled
- A user access token that includes the permissions needed to post to groups (`publish_to_groups`)
- The token owner must be allowed to post in the target group
- A long-lived token is strongly recommended for scheduled automation

How to configure:

1. Create or use an existing app in [Meta for Developers](https://developers.facebook.com/).
2. Add **Facebook Login** to the app.
3. Generate a user access token with `publish_to_groups`.
4. Exchange it for a long-lived user token.
5. Find your Group ID (numeric) and set `FACEBOOK_GROUP_ID`.
6. In GitHub repository settings, add these secrets:
   - `FACEBOOK_GROUP_ID`
   - `FACEBOOK_ACCESS_TOKEN`
7. Keep existing Bluesky secrets in place:
   - `BLUESKY_IDENTIFIER`
   - `BLUESKY_APP_PASSWORD`

```bash
node scripts/post-gameday.js
```

The script exits silently (code 0) if there is no game today.

*this is just a subtle test addition*
