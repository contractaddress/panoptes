# Architecture Explanation

## Why Server-Side + Client-Side?

You might wonder: "Why do we need `serviceStatusMonitor.js` on the server if we're just fetching from it in the client?"

Here's the reasoning:

## Current Architecture

```
┌─────────────────────────────────────────┐
│  Server-Side (Node.js/Astro)            │
│  ┌────────────────────────────────────┐ │
│  │ serviceStatusMonitor.js            │ │
│  │  - Checks 14 services every 15min │ │
│  │  - Makes HEAD requests             │ │
│  │  - Stores results in memory        │ │
│  │  - ONE background process          │ │
│  └────────────────────────────────────┘ │
│              ↓                           │
│  ┌────────────────────────────────────┐ │
│  │ API: /api/status                   │ │
│  │  - Returns cached results          │ │
│  │  - Instant response                │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
              ↓ (HTTP GET)
┌─────────────────────────────────────────┐
│  Client-Side (Browser)                  │
│  ┌────────────────────────────────────┐ │
│  │ index.astro script                 │ │
│  │  - Fetches /api/status             │ │
│  │  - Updates UI elements             │ │
│  │  - Polls every 15min               │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Why Not All Client-Side?

### Option 1: All Client-Side ❌
```javascript
// In browser script
for (const service of services) {
  const status = await fetch(service.url); // Each client does this!
}
```

**Problems:**
1. **CORS Errors**: Local services (https://proxmox.local) won't allow cross-origin requests from browser
2. **Multiple Clients = Multiple Requests**: 3 browser tabs = 42 requests (14 services × 3)
3. **Network Load**: Every client hammers your services
4. **Battery/CPU**: Each tab runs expensive network operations
5. **Inconsistent**: Tab 1 might see service online, Tab 2 sees offline (race conditions)

### Option 2: Server-Side Only ❌
```javascript
// Generate static page with statuses at build time
const statuses = await checkAllServices();
// Page shows stale data, never updates
```

**Problems:**
1. **No Updates**: Status only checked at build time
2. **Requires Rebuild**: To see new status, rebuild entire site
3. **Not Real-Time**: Defeats the purpose

### Option 3: Server-Side + Client-Side ✅ (Current)
```javascript
// Server: Check once, many clients use result
// Client: Just fetch lightweight JSON
```

**Benefits:**
1. ✅ **Single Source of Truth**: Server checks once
2. ✅ **No CORS Issues**: Server-to-service communication
3. ✅ **Efficient**: Clients fetch ~2KB JSON, not 14 HTTP requests
4. ✅ **Consistent**: All clients see same data
5. ✅ **Real-Time**: Auto-updates without rebuild
6. ✅ **Scalable**: 100 clients? Still just 1 server doing checks

## Performance Comparison

### All Client-Side (BAD)
```
3 browser tabs open:
  - 14 services × 3 tabs = 42 HEAD requests
  - ~5 seconds each = 210 seconds of waiting
  - Network traffic: High
  - CORS errors: Likely
```

### Current Architecture (GOOD)
```
3 browser tabs open:
  - Server: 14 HEAD requests (once)
  - Clients: 3 GET /api/status (instant, ~2KB each)
  - Network traffic: Minimal
  - CORS errors: None
```

## What Each Layer Does

### `serviceStatusMonitor.js` (Server)
**Role:** Heavy lifting
- Makes actual network requests to services
- Handles timeouts, retries, errors
- Maintains status cache in memory
- Runs background interval (once per server)

### `api/status.js` (Server)
**Role:** API gateway
- Exposes server's status data via HTTP
- Returns pre-computed results instantly
- Handles multiple response formats

### `statusClient.js` (Client)
**Role:** Thin wrapper
- Just wraps `fetch('/api/status')`
- Provides nice functions for clients
- ~50 lines of code

### `index.astro` script (Client)
**Role:** UI updater
- Fetches JSON from API
- Updates DOM elements
- Schedules periodic fetches

## Alternative: Push Instead of Poll

You could eliminate client-side polling entirely:

### Using Server-Sent Events (SSE)
```javascript
// Server pushes updates to clients
const eventSource = new EventSource('/api/status/stream');
eventSource.onmessage = (event) => {
  const statuses = JSON.parse(event.data);
  updateUI(statuses);
};
```

**Trade-offs:**
- ✅ No client polling
- ✅ Instant updates
- ❌ More complex server code
- ❌ Keeps connection open
- ❌ Not needed for 15-minute intervals

For 15-minute intervals, polling is simpler and fine.

## Summary

The architecture separates concerns:

1. **Server does expensive work** (network checks)
2. **API exposes cached results** (fast read access)
3. **Clients consume lightweight data** (just JSON)

This is a standard pattern for monitoring dashboards and is the **correct way** to do it.

If you want to simplify, the only real option would be SSE/WebSockets, but that adds complexity for minimal benefit at 15-minute intervals.
