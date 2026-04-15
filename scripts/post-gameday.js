#!/usr/bin/env node
// Post a Bluesky game-day reminder for Utah Royals FC.
// Reads data/schedule.json, finds a game scheduled for today (MT), and posts
// if one is found. Exits silently (code 0) when there is no game today.
//
// Required environment variables:
//   BLUESKY_IDENTIFIER   – your Bluesky handle, e.g. utahroyals.bsky.social
//   BLUESKY_APP_PASSWORD – an App Password from Settings → App Passwords

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const BSKY_API = "https://bsky.social/xrpc";

// ── helpers ──────────────────────────────────────────────────────────────────

function getTodayMT() {
  return new Date()
    .toLocaleDateString("en-CA", { timeZone: "America/Denver" }); // YYYY-MM-DD
}

function buildPostText(game) {
  const lines = [];

  lines.push(`⚽ Utah Royals play TODAY vs. ${game.opponent} at ${game.time}!`);

  const streamingLines = [];
  if (game.streamingServices && game.streamingServices.length > 0) {
    for (const s of game.streamingServices) {
      streamingLines.push(`${s.provider} → ${s.url}`);
    }
  }

  const broadcastLines = [];
  if (game.broadcast && game.broadcast.length > 0) {
    for (const b of game.broadcast) {
      broadcastLines.push(b.provider);
    }
  }

  if (streamingLines.length > 0) {
    lines.push(`Watch on ${streamingLines.join(" | ")}`);
    if (broadcastLines.length > 0) {
      lines.push(`Also on ${broadcastLines.join(", ")}`);
    }
  } else if (broadcastLines.length > 0) {
    lines.push(`Watch on ${broadcastLines.join(", ")}`);
  }

  lines.push("#UtahRoyals #NWSL");

  return lines.join("\n");
}

async function createSession(identifier, password) {
  const res = await fetch(`${BSKY_API}/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`createSession failed (${res.status}): ${body}`);
  }
  return res.json(); // { did, accessJwt, ... }
}

async function createPost(accessJwt, did, text) {
  const res = await fetch(`${BSKY_API}/com.atproto.repo.createRecord`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessJwt}`,
    },
    body: JSON.stringify({
      repo: did,
      collection: "app.bsky.feed.post",
      record: {
        $type: "app.bsky.feed.post",
        text,
        createdAt: new Date().toISOString(),
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`createRecord failed (${res.status}): ${body}`);
  }
  return res.json();
}

// ── main ─────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const schedulePath = join(__dirname, "..", "data", "schedule.json");
const schedule = JSON.parse(readFileSync(schedulePath, "utf8"));

const today = getTodayMT();
const game = schedule.find((g) => g.date === today) ?? null;

if (!game) {
  console.log(`No game today (${today}). Nothing to post.`);
  process.exit(0);
}

const identifier = process.env.BLUESKY_IDENTIFIER;
const password = process.env.BLUESKY_APP_PASSWORD;

if (!identifier || !password) {
  console.error(
    "BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD must be set in the environment."
  );
  process.exit(1);
}

const postText = buildPostText(game);
console.log("Composing post:\n---\n" + postText + "\n---");

try {
  const { accessJwt, did } = await createSession(identifier, password);
  const result = await createPost(accessJwt, did, postText);
  console.log("Posted successfully:", result.uri);
} catch (err) {
  console.error("Failed to post to Bluesky:", err.message);
  process.exit(1);
}
