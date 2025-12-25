/**
 * API Endpoint: Service Status
 *
 * GET /api/status - Returns current status of all services
 * POST /api/status/refresh - Triggers a manual status refresh
 */

import { dashboardConfig } from '../../config/dashboard.config.js';
import {
  initializeStatusMonitor,
  getAllStatuses,
  mapStatusesToConfig,
  refreshStatuses,
  getMonitorSummary,
  extractServicesFromConfig
} from '../../utils/serviceStatusMonitor.js';

// Initialize monitor on first load (if not already initialized)
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await initializeStatusMonitor(dashboardConfig);
    isInitialized = true;
  }
}

/**
 * GET /api/status
 * Returns the current status of all services
 */
export async function GET({ request }) {
  try {
    await ensureInitialized();

    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'mapped';

    let response;

    switch (format) {
      case 'raw':
        const statuses = getAllStatuses();
        response = Array.from(statuses.entries()).map(([id, data]) => ({
          id,
          ...data
        }));
        break;

      case 'summary':
        response = getMonitorSummary();
        break;

      case 'mapped':
      default:
        response = mapStatusesToConfig(dashboardConfig);
        break;
    }

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('[API] Error:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch statuses' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * POST /api/status/refresh
 * Triggers a manual refresh of all service statuses
 */
export async function POST({ request }) {
  try {
    await ensureInitialized();

    console.log('[API] Manual status refresh requested');
    await refreshStatuses(dashboardConfig);

    const response = mapStatusesToConfig(dashboardConfig);

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('[API] Error refreshing statuses:', error);
    return new Response(JSON.stringify({ error: 'Failed to refresh statuses' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
