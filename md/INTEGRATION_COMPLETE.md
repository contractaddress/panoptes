# Integration Complete! 🎉

The service status monitoring system has been fully integrated into your homelab dashboard app.

## What Was Changed

### Components Updated

#### 1. **`src/components/HeroCard.astro`**
- Added `data-service-id` attribute to identify the service
- Added `data-status-indicator`, `data-status-text`, and `data-status-image` attributes for dynamic updates
- Service ID format: `hero_{title}` (e.g., `hero_Proxmox`)

#### 2. **`src/components/DashboardCard.astro`**
- Added `data-service-id` attribute to identify each tile
- Added `data-status-indicator` and `data-status-image` attributes for dynamic updates
- Service ID format: `tile_{title}` (e.g., `tile_OpenWRT`)

#### 3. **`src/components/ServiceCard.astro`**
- Added `data-service-id` attribute to each logo box
- Added `data-status-image` attribute to service icons
- Service ID format: `service_{name}` (e.g., `service_Docker`)

#### 4. **`src/pages/index.astro`**
- Added status monitoring script that runs on page load
- Fetches statuses from API every 15 minutes
- Updates UI elements dynamically without page refresh
- Refreshes statuses when tab becomes visible again
- Includes console logging for debugging

#### 5. **`src/config/dashboard.config.js`**
- Added default `status: 'online'` properties to all services
- Ensures consistent initial state before runtime checks

### New Files Created

1. **`src/utils/serviceStatusMonitor.js`** - Core monitoring engine
2. **`src/pages/api/status.js`** - API endpoints
3. **`src/utils/statusClient.js`** - Client utilities
4. **`src/utils/statusTooltip.js`** - Enhanced with new helper functions

---

## How It Works

### Initialization Flow

1. **Page Load** → Browser loads `index.astro`
2. **Static Render** → Components render with default 'online' status from config
3. **Script Execution** → Status monitoring script initializes
4. **API Call** → Fetches `/api/status?format=raw` to get all service statuses
5. **UI Update** → Updates status indicators, text, and images for each service
6. **Periodic Refresh** → Repeats every 15 minutes automatically

### Runtime Updates

The system updates three types of UI elements:

1. **Status Indicators** (colored dots)
   - Classes: `status-online`, `status-offline`, `status-warning`
   - Updates tooltip text

2. **Status Text** (hero card "Status: online")
   - Updates text content
   - Updates color class

3. **Status Images** (service icons)
   - Applies `offline-image` or `warning-image` classes
   - Makes icons grayscale/dimmed when offline

### Service Identification

Each service is identified using a unique ID pattern:
- **Hero Card:** `hero_{title}` → `hero_Proxmox`
- **Small Tiles:** `tile_{title}` → `tile_OpenWRT`, `tile_Pi-hole`, etc.
- **Services:** `service_{name}` → `service_Docker`, `service_Service 2`, etc.

---

## Testing the Integration

### 1. Start Your Dev Server

```bash
npm run dev
# or
yarn dev
```

### 2. Open Browser Console

Visit `http://localhost:4321` and open Developer Tools (F12)

You should see console logs:
```
[Dashboard] Initializing status monitoring...
[Dashboard] Fetching service statuses...
[Status Monitor] Initialized with 14 services
[Dashboard] Updated 14 services
[Dashboard] Status monitoring active (updates every 15 minutes)
```

### 3. Check the API

Open in a new tab:
```
http://localhost:4321/api/status
```

You should see JSON with all service statuses.

### 4. Test Status Updates

To test the system, temporarily set a service to offline:

**Option A: Disable a service**
- Stop one of your homelab services
- Wait a few seconds
- Manually refresh: `POST http://localhost:4321/api/status/refresh`
- Watch the UI update

**Option B: Use the feature flag**
Edit `src/utils/serviceStatusMonitor.js:11`:
```javascript
export const ENABLE_STATUS_CHECKS = false;
```
All services will show as "online" (useful for UI testing)

---

## Monitoring Services

### Your Current Configuration

The system is now monitoring all 14 services:

**Hero Card (1 service):**
- Proxmox → `https://proxmox.local:8006`

**Small Tiles (4 services):**
- OpenWRT → `https://openwrt.local`
- Pi-hole → `https://pihole.local`
- Immich → `https://immich.local`
- Wireguard → `https://wireguard.local`

**Services Card (9 services):**
- Docker → `https://docker.local`
- Service 2 → `https://service2.local`
- Service 3 → `https://service3.local`
- Service 4 → `https://service4.local`
- Service 5 → `https://service5.local`
- Service 6 → `https://service6.local`
- Service 7 → `https://service7.local`
- Service 8 → `https://service8.local`
- Service 9 → `https://service9.local`

### Status Check Behavior

- **Method:** HEAD requests to each URL
- **Timeout:** 5 seconds per request
- **Interval:** 15 minutes (auto-refresh)
- **Mode:** `no-cors` (works with local services without CORS headers)
- **Parallel:** All services checked simultaneously

### Status Values

- **`online`** → Green indicator (service reachable)
- **`offline`** → Red indicator (service unreachable or error)
- **`warning`** → Orange indicator (slow response or 5xx error)

---

## Troubleshooting

### Services Show "offline" But They're Running

**Possible causes:**
1. **CORS Issues** - Check browser console for CORS errors
2. **Wrong URLs** - Verify URLs in `dashboard.config.js`
3. **SSL/TLS Issues** - Self-signed certificates might cause problems
4. **Service doesn't support HEAD** - Some services block HEAD requests

**Solutions:**
- Check browser console for errors
- Try accessing URLs directly in browser
- Verify services are actually reachable
- Check network tab in DevTools

### Status Not Updating

**Check these:**
1. API endpoint works: `http://localhost:4321/api/status`
2. Console shows no JavaScript errors
3. Feature flag is enabled: `ENABLE_STATUS_CHECKS = true`
4. Browser cache is cleared

### Want to See It Update Faster?

Edit `src/pages/index.astro:45`:
```javascript
const UPDATE_INTERVAL = 1 * 60 * 1000; // 1 minute for testing
```

Don't forget to change it back to 15 minutes for production!

---

## Feature Flag Control

**Location:** `src/utils/serviceStatusMonitor.js:11`

```javascript
export const ENABLE_STATUS_CHECKS = true;
```

**Set to `false` to:**
- Disable all network requests
- Default all services to "online"
- Test UI without status checks

**Remember:** Restart dev server after changing the flag!

---

## Console Logging

The system includes helpful console logs:

**From Dashboard:**
- `[Dashboard] Initializing status monitoring...`
- `[Dashboard] Fetching service statuses...`
- `[Dashboard] Updated X services`
- `[Dashboard] Tab visible, refreshing statuses...`
- `[Dashboard] Failed to update statuses: <error>`

**From Status Monitor (server-side):**
- `[Status Monitor] Initialized with X services`
- `[Status Monitor] Feature flag ENABLE_STATUS_CHECKS: true/false`
- `[Status Monitor] Running scheduled status check...`
- `[Status Monitor] Auto-refresh enabled (every X minutes)`

**From API:**
- `[API] Manual status refresh requested`
- `[API] Error fetching/refreshing statuses: <error>`

---

## Performance Considerations

- **Initial Load:** ~0-5 seconds (parallel checks to all services)
- **Refresh Interval:** 15 minutes (configurable)
- **Network Impact:** Minimal (HEAD requests only)
- **Client Impact:** Negligible (lightweight DOM updates)
- **No Page Refresh:** Status updates happen in background

---

## Customization

### Change Update Interval

Edit `src/pages/index.astro:45`:
```javascript
const UPDATE_INTERVAL = 15 * 60 * 1000; // Change this
```

### Change Request Timeout

Edit `src/utils/serviceStatusMonitor.js:16`:
```javascript
const REQUEST_TIMEOUT = 5000; // Change this (milliseconds)
```

### Change Status Colors

Edit `src/utils/statusTooltip.js:52-63` or your CSS files.

### Add More Services

Just add them to `dashboard.config.js` - they'll be automatically detected!

---

## API Reference

### Available Endpoints

```bash
# Get statuses (mapped to config structure)
GET /api/status?format=mapped

# Get raw array of all services
GET /api/status?format=raw

# Get summary statistics
GET /api/status?format=summary

# Trigger manual refresh
POST /api/status/refresh
```

### Example Response (Raw)

```json
[
  {
    "id": "hero_Proxmox",
    "title": "Proxmox",
    "url": "https://proxmox.local:8006",
    "source": "heroCard",
    "status": "online",
    "lastChecked": "2025-12-25T10:30:00.000Z"
  },
  ...
]
```

---

## Next Steps

1. ✅ **System is integrated and ready!**
2. Test with your actual services
3. Customize colors/styling if needed
4. Adjust refresh interval for your needs
5. Monitor console logs to verify operation
6. Add more services as your homelab grows

---

## Summary

✅ All components updated with status tracking
✅ Runtime status monitoring active
✅ API endpoints ready and functional
✅ Auto-refresh every 15 minutes
✅ Feature flag for easy enable/disable
✅ Monitoring all 14 configured services
✅ Zero config changes needed (unless customizing)

**The system is now fully integrated and operational!**

Check the browser console when you load your dashboard to see it in action.

For more details, see:
- `STATUS_MONITOR_GUIDE.md` - Complete documentation
- `QUICK_START.md` - Quick reference guide
