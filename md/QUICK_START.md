# Quick Start - Service Status Monitor

## What's Been Created

A complete status monitoring system has been set up for your homelab dashboard:

### Files Created:
1. **`src/utils/serviceStatusMonitor.js`** - Core monitoring engine
2. **`src/pages/api/status.js`** - REST API endpoints
3. **`src/utils/statusClient.js`** - Client-side utilities
4. **`STATUS_MONITOR_GUIDE.md`** - Complete documentation
5. **`STATUS_INTEGRATION_EXAMPLE.astro`** - Working example

### Files Enhanced:
- **`src/utils/statusTooltip.js`** - Added helper functions for status display

---

## Quick Test (3 steps)

### 1. Start Your Dev Server
```bash
npm run dev
# or
yarn dev
```

### 2. Test the API
Open in your browser or use curl:
```bash
# Get all statuses (mapped format)
curl http://localhost:4321/api/status

# Get summary
curl http://localhost:4321/api/status?format=summary

# Get raw data
curl http://localhost:4321/api/status?format=raw

# Trigger refresh
curl -X POST http://localhost:4321/api/status/refresh
```

### 3. View the Example Page
Copy the example to your pages directory:
```bash
cp STATUS_INTEGRATION_EXAMPLE.astro src/pages/status-demo.astro
```

Then visit: `http://localhost:4321/status-demo`

---

## Feature Flag Control

The system includes a feature flag to enable/disable status checks:

**Location:** `src/utils/serviceStatusMonitor.js:11`

```javascript
export const ENABLE_STATUS_CHECKS = true;  // Set to false to disable
```

**When `false`:**
- No network requests are made
- All services default to "online"
- Perfect for testing UI without status checks

**Remember:** Restart your dev server after changing the flag!

---

## Integration in 5 Minutes

### Option 1: Simple Status Display

Add this to any `.astro` component:

```astro
<div id="service-status"></div>

<script>
  import { fetchServiceStatuses } from '../utils/statusClient.js';

  async function updateStatus() {
    const statuses = await fetchServiceStatuses();
    document.getElementById('service-status').innerHTML =
      `Proxmox: ${statuses.heroCard.status}`;
  }

  updateStatus();
  setInterval(updateStatus, 15 * 60 * 1000); // Every 15 min
</script>
```

### Option 2: Status with Styling

```astro
<div id="status-indicator" class="status"></div>

<script>
  import { fetchServiceStatuses } from '../utils/statusClient.js';
  import { getStatusDisplayInfo } from '../utils/statusTooltip.js';

  async function updateStatus() {
    const statuses = await fetchServiceStatuses();
    const status = statuses.heroCard.status;
    const info = getStatusDisplayInfo(status, statuses.heroCard.lastChecked);

    const el = document.getElementById('status-indicator');
    el.textContent = status;
    el.className = `status ${info.badgeClass}`;
    el.title = info.tooltip;
    el.style.color = info.color;
  }

  updateStatus();
</script>
```

### Option 3: All Services List

```astro
<div id="services"></div>

<script>
  import { fetchServiceStatuses } from '../utils/statusClient.js';

  async function displayAllServices() {
    const data = await fetch('/api/status?format=raw').then(r => r.json());

    const html = data.map(service => `
      <div>
        <strong>${service.title}:</strong>
        <span style="color: ${service.status === 'online' ? 'green' : 'red'}">
          ${service.status}
        </span>
      </div>
    `).join('');

    document.getElementById('services').innerHTML = html;
  }

  displayAllServices();
</script>
```

---

## How It Works

1. **Automatic Initialization**: First API call initializes the monitor
2. **URL Extraction**: Scans your `dashboard.config.js` for all service URLs
3. **Status Checking**: Makes network requests to each service
4. **Auto-Refresh**: Checks status every 15 minutes automatically
5. **Separate Storage**: Status kept separate from config (no mutation)

---

## Current Configuration

Based on your `dashboard.config.js`:

- **Hero Card:** 1 service (Proxmox)
- **Small Tiles:** 4 services (OpenWRT, Pi-hole, Immich, Wireguard)
- **Services Card:** 9 services (Docker + Service 2-9)
- **Total:** 14 services being monitored

All services will be automatically detected and monitored!

---

## Customization

### Change Check Interval
Edit `src/utils/serviceStatusMonitor.js:15`:
```javascript
const STATUS_CHECK_INTERVAL = 15 * 60 * 1000; // milliseconds
```

### Change Request Timeout
Edit `src/utils/serviceStatusMonitor.js:16`:
```javascript
const REQUEST_TIMEOUT = 5000; // milliseconds
```

### Status Colors
Edit `src/utils/statusTooltip.js:52-63` to customize colors

---

## Troubleshooting

### Services showing "offline" but they're running
- Check if URLs in `dashboard.config.js` are correct
- Try accessing the URLs directly in browser
- Check browser console for CORS errors
- Verify services allow HEAD requests

### Status not updating
- Check browser console for errors
- Verify API endpoint is accessible: `/api/status`
- Check that feature flag is `true`
- Restart dev server

### Want to disable for testing
```javascript
// In src/utils/serviceStatusMonitor.js
export const ENABLE_STATUS_CHECKS = false;
```

---

## Next Steps

1. **Test the system**: Use the API endpoints or example page
2. **Integrate into your components**: Use the patterns above
3. **Customize styling**: Add CSS for status badges/indicators
4. **Monitor**: Check browser console for `[Status Monitor]` logs
5. **Read full docs**: See `STATUS_MONITOR_GUIDE.md` for advanced usage

---

## API Quick Reference

```bash
# Get mapped statuses (matches config structure)
GET /api/status?format=mapped

# Get raw array of all services
GET /api/status?format=raw

# Get summary statistics
GET /api/status?format=summary

# Trigger manual refresh
POST /api/status/refresh
```

---

## Summary

✅ System is ready to use - no additional setup required!
✅ Automatically monitors all 14 services in your config
✅ API endpoints ready at `/api/status`
✅ Auto-refreshes every 15 minutes
✅ Feature flag for easy enable/disable
✅ Zero changes needed to your existing config

Just start using the API or client utilities in your components!
