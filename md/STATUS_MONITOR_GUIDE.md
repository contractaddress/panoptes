# Service Status Monitor - Usage Guide

## Overview

The Service Status Monitor is a comprehensive system for checking the online status of all homelab services defined in your dashboard configuration. It automatically extracts URLs, performs network checks, and maintains runtime status separate from static config.

## Features

- ✅ Extracts URLs from all config sections (heroCard, smallTiles, servicesCard)
- ✅ Performs network status checks for each service
- ✅ Maintains runtime status separate from static config
- ✅ Maps status to services using unique identifiers
- ✅ Auto-refreshes status every 15 minutes
- ✅ Feature flag to enable/disable status checks
- ✅ Modular and scalable architecture
- ✅ API endpoints for easy frontend integration
- ✅ Client-side utilities for consuming status data

---

## Architecture

### Files Created

1. **`src/utils/serviceStatusMonitor.js`** - Core monitoring logic (server-side)
2. **`src/pages/api/status.js`** - API endpoints for status data
3. **`src/utils/statusClient.js`** - Client-side utilities for consuming status API

---

## Feature Flag

The system includes a source-level feature flag that can be easily toggled:

### Location
`src/utils/serviceStatusMonitor.js:11`

```javascript
export const ENABLE_STATUS_CHECKS = true;
```

### Behavior
- **`true` (default)**: Performs actual network checks to services
- **`false`**: Skips network checks, all services return 'online' status

### When to Disable
- Testing without network requests
- Development with unreachable services
- Debugging frontend UI without status dependency

---

## Usage Examples

### 1. Using the API Endpoint (Recommended)

#### Get Current Statuses (Mapped Format)
```javascript
// In your Astro component or frontend JavaScript
const response = await fetch('/api/status?format=mapped');
const statuses = await response.json();

// Returns structure matching config:
// {
//   heroCard: { title: 'Proxmox', status: 'online', lastChecked: '...' },
//   smallTiles: [
//     { title: 'OpenWRT', status: 'online', lastChecked: '...' },
//     ...
//   ],
//   servicesCard: {
//     logos: [
//       { name: 'Docker', status: 'online', lastChecked: '...' },
//       ...
//     ]
//   }
// }
```

#### Get Raw Status Data
```javascript
const response = await fetch('/api/status?format=raw');
const statuses = await response.json();

// Returns array of all services:
// [
//   { id: 'hero_Proxmox', title: 'Proxmox', url: 'https://...', status: 'online', ... },
//   { id: 'tile_OpenWRT', title: 'OpenWRT', url: 'https://...', status: 'online', ... },
//   ...
// ]
```

#### Get Summary Statistics
```javascript
const response = await fetch('/api/status?format=summary');
const summary = await response.json();

// Returns:
// {
//   enabled: true,
//   totalServices: 13,
//   online: 10,
//   offline: 2,
//   warning: 1,
//   isRunning: true,
//   lastChecked: '2025-12-25T10:30:00.000Z'
// }
```

#### Trigger Manual Refresh
```javascript
const response = await fetch('/api/status/refresh', { method: 'POST' });
const updatedStatuses = await response.json();
```

---

### 2. Using Client-Side Utilities

Import the client utilities in your Astro components or JavaScript:

```javascript
import {
  fetchServiceStatuses,
  refreshServiceStatuses,
  setupStatusPolling,
  createStatusStore
} from '../utils/statusClient.js';
```

#### Simple Status Fetch
```javascript
const statuses = await fetchServiceStatuses();
console.log(statuses);
```

#### Get Status for Specific Service
```javascript
import { getServiceStatusByTitle } from '../utils/statusClient.js';

const proxmoxStatus = await getServiceStatusByTitle('Proxmox');
console.log(`Proxmox is ${proxmoxStatus.status}`);
```

#### Set Up Automatic Polling
```javascript
const stopPolling = setupStatusPolling((statuses) => {
  console.log('Status updated:', statuses);
  // Update your UI here
}, 15); // Poll every 15 minutes

// Stop polling when component unmounts
// stopPolling();
```

#### Using the Status Store (Reactive)
```javascript
const statusStore = createStatusStore();

// Subscribe to updates
const unsubscribe = statusStore.subscribe((statuses) => {
  console.log('Statuses changed:', statuses);
  // Update UI
});

// Start auto-polling
const stopPolling = statusStore.startPolling(15);

// Manual refresh
await statusStore.refresh();

// Cleanup
unsubscribe();
stopPolling();
```

---

### 3. Integration in Astro Components

#### Example: Display Service Status in Component

```astro
---
// src/components/ServiceCard.astro
import { dashboardConfig } from '../config/dashboard.config.js';

// Fetch statuses at build time or in a client-side script
---

<div class="service-card">
  <h2>{dashboardConfig.heroCard.title}</h2>
  <div id="status-indicator" class="status">Loading...</div>
</div>

<script>
  import { fetchServiceStatuses } from '../utils/statusClient.js';

  async function updateStatus() {
    const statuses = await fetchServiceStatuses();
    const heroStatus = statuses.heroCard.status;

    const indicator = document.getElementById('status-indicator');
    indicator.textContent = heroStatus;
    indicator.className = `status ${heroStatus}`;
  }

  // Initial load
  updateStatus();

  // Poll every 15 minutes
  setInterval(updateStatus, 15 * 60 * 1000);
</script>

<style>
  .status.online { color: green; }
  .status.offline { color: red; }
  .status.warning { color: orange; }
</style>
```

---

### 4. Server-Side Usage (Advanced)

If you need to use the monitor directly on the server (e.g., in API routes or SSR):

```javascript
import { dashboardConfig } from '../config/dashboard.config.js';
import {
  initializeStatusMonitor,
  extractServicesFromConfig,
  fetchAllStatuses,
  getServiceStatus,
  getAllStatuses,
  mapStatusesToConfig
} from '../utils/serviceStatusMonitor.js';

// Initialize monitor
await initializeStatusMonitor(dashboardConfig);

// Get all services
const services = extractServicesFromConfig(dashboardConfig);
console.log(`Found ${services.length} services`);

// Get status for specific service
const status = getServiceStatus('hero_Proxmox');
console.log(status);

// Get all statuses
const allStatuses = getAllStatuses();

// Map statuses to config structure
const mappedStatuses = mapStatusesToConfig(dashboardConfig);
```

---

## Status Values

The system returns three possible status values:

- **`online`**: Service is reachable and responding
- **`offline`**: Service is unreachable or not responding
- **`warning`**: Service is slow or returned a server error (5xx)

---

## Configuration

### Adjusting Check Interval

Edit `src/utils/serviceStatusMonitor.js:15`:

```javascript
const STATUS_CHECK_INTERVAL = 15 * 60 * 1000; // Change this value
```

### Adjusting Request Timeout

Edit `src/utils/serviceStatusMonitor.js:16`:

```javascript
const REQUEST_TIMEOUT = 5000; // Change this value (in milliseconds)
```

---

## How It Works

### 1. Service Extraction
The system scans `dashboardConfig` and extracts all services with URLs:
- **heroCard**: Single service
- **smallTiles**: Array of services
- **servicesCard.logos**: Array of services

Each service gets a unique ID: `{source}_{title}` (e.g., `hero_Proxmox`, `tile_OpenWRT`)

### 2. Status Checking
For each service:
1. Sends HEAD request to the service URL
2. Uses 5-second timeout
3. Uses `no-cors` mode for local services
4. Determines status based on response:
   - **Online**: Successful response (2xx-4xx)
   - **Warning**: Server error (5xx) or timeout
   - **Offline**: Network error or unreachable

### 3. Status Storage
- Statuses stored in a `Map<serviceId, statusData>`
- Separate from original config (no mutation)
- Includes: `status`, `lastChecked`, `url`, `title`, `source`

### 4. Auto-Refresh
- Initializes on first API call
- Runs status check every 15 minutes
- Can be manually triggered via POST to `/api/status/refresh`

### 5. Status Mapping
The `mapStatusesToConfig()` function returns a structure that mirrors the original config but contains only status data:

```javascript
{
  heroCard: { title, status, lastChecked },
  smallTiles: [{ title, status, lastChecked }, ...],
  servicesCard: { logos: [{ name, status, lastChecked }, ...] }
}
```

---

## Debugging

### Check Monitor Summary
```javascript
const response = await fetch('/api/status?format=summary');
const summary = await response.json();
console.log(summary);
// Shows: enabled status, service counts, online/offline/warning stats
```

### Enable Console Logging
The monitor logs important events to the console:
- Initialization
- Status checks
- Errors

Check your browser console or server logs for `[Status Monitor]` messages.

---

## Best Practices

1. **Always use the API endpoint** for client-side status fetching
2. **Use mapped format** for easy integration with your config structure
3. **Poll responsibly** - 15 minutes is a good default interval
4. **Handle errors gracefully** - Network requests can fail
5. **Disable feature flag** when testing UI without status checks
6. **Use statusClient utilities** instead of raw fetch calls for better abstraction

---

## Extending the System

### Adding New Service Sources

If you add new sections to `dashboardConfig.js`, update the extraction logic in `serviceStatusMonitor.js`:

```javascript
// In extractServicesFromConfig()
if (config.newSection?.items) {
  config.newSection.items.forEach((item, index) => {
    if (item.url) {
      services.push({
        id: `newsection_${item.name || index}`,
        title: item.name,
        url: item.url,
        source: 'newSection'
      });
    }
  });
}
```

### Custom Status Logic

Modify `checkServiceStatus()` to implement custom status determination:

```javascript
export async function checkServiceStatus(url) {
  // Your custom logic here
  // Return 'online', 'offline', or 'warning'
}
```

---

## Troubleshooting

### All Services Show "offline"
- Check that services are actually reachable
- Verify URLs in `dashboard.config.js`
- Check browser console for CORS or network errors
- Ensure feature flag `ENABLE_STATUS_CHECKS` is `true`

### Status Not Updating
- Check that auto-refresh is enabled (see summary)
- Manually trigger refresh: `POST /api/status/refresh`
- Check browser console for errors
- Verify the interval is not too short (causing throttling)

### Feature Flag Not Working
- Restart your dev server after changing the flag
- Clear browser cache
- Check that you're importing from the correct module

---

## API Reference

### GET /api/status

**Query Parameters:**
- `format`: `mapped` (default), `raw`, or `summary`

**Response:** JSON object with status data

### POST /api/status/refresh

**Response:** JSON object with updated status data (mapped format)

---

## Summary

This status monitoring system provides a complete solution for tracking homelab service availability:

✅ Feature flag for easy enable/disable
✅ Automatic URL extraction from config
✅ Parallel status checking
✅ 15-minute auto-refresh
✅ Clean separation of runtime status from static config
✅ Multiple consumption patterns (API, client utils, server-side)
✅ Fully modular and extensible

The system is production-ready and requires no changes to your existing config structure.
