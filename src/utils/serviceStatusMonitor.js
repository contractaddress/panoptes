/** SEMI-VIBE CODED API UNTIL I'VE LEARNED HTTP REQUESTS AND MAPPING IN JS :D
 *
 * Service Status Monitor
 *
 * A modular system for monitoring the online status of homelab services.
 * Extracts URLs from dashboard config, performs network checks, and maintains
 * a runtime status map separate from the static configuration.
 */

// ============================================================================
// FEATURE FLAG: Enable/Disable Runtime Status Checks
// ============================================================================
// Set to false to disable all network checks and default all services to "online"
export const ENABLE_STATUS_CHECKS = false;

// ============================================================================
// Configuration
// ============================================================================
const STATUS_CHECK_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
const REQUEST_TIMEOUT = 5000; // 5 seconds timeout for each request

// ============================================================================
// Runtime State
// ============================================================================
let statusMap = new Map(); // Map<serviceId, {status, lastChecked, url}>
let intervalId = null;

/**
 * Extract all services with URLs from the dashboard config
 * Returns an array of service objects with unique identifiers
 *
 * @param {Object} config - The dashboard configuration object
 * @returns {Array} Array of {id, title, url, source} objects
 */
export function extractServicesFromConfig(config) {
  const services = [];

  // Extract from heroCard
  if (config.heroCard?.content?.location?.url) {
    services.push({
      id: `hero_${config.heroCard.title}`,
      title: config.heroCard.title,
      url: config.heroCard.content.location.url,
      source: 'heroCard'
    });
  }

  // Extract from smallTiles
  if (Array.isArray(config.smallTiles)) {
    config.smallTiles.forEach((tile, index) => {
      if (tile.location?.url) {
        services.push({
          id: `tile_${tile.title || index}`,
          title: tile.title,
          url: tile.location.url,
          source: 'smallTiles'
        });
      }
    });
  }

  // Extract from servicesCard logos
  if (Array.isArray(config.servicesCard?.logos)) {
    config.servicesCard.logos.forEach((service, index) => {
      if (service.location?.url) {
        services.push({
          id: `service_${service.name || index}`,
          title: service.name,
          url: service.location.url,
          source: 'servicesCard'
        });
      }
    });
  }

  return services;
}

/**
 * Check if a single service is online
 * Simple check: 200 = online, anything else = offline
 * For Proxmox, uses a simple connectivity check instead of HTTP
 *
 * @param {string} url - The URL to check
 * @param {string} title - The service title for special handling
 * @returns {Promise<string>} Status: 'online' or 'offline'
 */
export async function checkServiceStatus(url, title = '') {
  // If feature flag is disabled, return online
  if (!ENABLE_STATUS_CHECKS) {
    return 'online';
  }

  // Special handling for Proxmox - use connectivity check instead of HTTP
  if (title.toLowerCase().includes('proxmox')) {
    return checkProxmoxConnectivity(url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-cache'
    });

    clearTimeout(timeoutId);

    // Simple logic: 200 = online, everything else = offline
    return response.status === 200 ? 'online' : 'offline';
  } catch (error) {
    // Any error = offline
    return 'offline';
  }
}

/**
 * Fetch statuses for all services in parallel
 *
 * @param {Array} services - Array of service objects from extractServicesFromConfig
 * @returns {Promise<Map>} Map of serviceId to status data
 */
export async function fetchAllStatuses(services) {
  const statusPromises = services.map(async (service) => {
    const status = await checkServiceStatus(service.url, service.title);
    return {
      id: service.id,
      title: service.title,
      url: service.url,
      source: service.source,
      status,
      lastChecked: new Date().toISOString()
    };
  });

  const results = await Promise.all(statusPromises);

  // Update the status map
  const newStatusMap = new Map();
  results.forEach(result => {
    newStatusMap.set(result.id, result);
  });

  statusMap = newStatusMap;
  return statusMap;
}

/**
 * Get the current status for a specific service by ID
 *
 * @param {string} serviceId - The unique service identifier
 * @returns {Object|null} Status object or null if not found
 */
export function getServiceStatus(serviceId) {
  return statusMap.get(serviceId) || null;
}

/**
 * Get all current statuses
 *
 * @returns {Map} Complete status map
 */
export function getAllStatuses() {
  return new Map(statusMap); // Return a copy to prevent external mutations
}

/**
 * Map statuses to config structure
 * Returns a structured object that mirrors the original config
 * but contains only runtime status information
 *
 * @param {Object} config - Original dashboard config
 * @returns {Object} Status structure matching config shape
 */
export function mapStatusesToConfig(config) {
  const statusConfig = {
    heroCard: null,
    smallTiles: [],
    servicesCard: { logos: [] }
  };

  // Map heroCard status
  if (config.heroCard) {
    const heroId = `hero_${config.heroCard.title}`;
    const heroStatus = statusMap.get(heroId);
    statusConfig.heroCard = {
      title: config.heroCard.title,
      status: heroStatus?.status || 'offline',
      lastChecked: heroStatus?.lastChecked || null
    };
  }

  // Map smallTiles statuses
  if (Array.isArray(config.smallTiles)) {
    statusConfig.smallTiles = config.smallTiles.map((tile, index) => {
      const tileId = `tile_${tile.title || index}`;
      const tileStatus = statusMap.get(tileId);
      return {
        title: tile.title,
        status: tileStatus?.status || 'offline',
        lastChecked: tileStatus?.lastChecked || null
      };
    });
  }

  // Map servicesCard statuses
  if (Array.isArray(config.servicesCard?.logos)) {
    statusConfig.servicesCard.logos = config.servicesCard.logos.map((service, index) => {
      const serviceId = `service_${service.name || index}`;
      const serviceStatus = statusMap.get(serviceId);
      return {
        name: service.name,
        status: serviceStatus?.status || 'offline',
        lastChecked: serviceStatus?.lastChecked || null
      };
    });
  }

  return statusConfig;
}

/**
 * Initialize the status monitoring system
 * Performs initial status check and sets up auto-refresh
 *
 * @param {Object} config - The dashboard configuration object
 * @returns {Promise<void>}
 */
export async function initializeStatusMonitor(config) {
  stopStatusMonitor();

  const services = extractServicesFromConfig(config);

  // Perform initial status check
  await fetchAllStatuses(services);

  // Set up auto-refresh interval
  if (ENABLE_STATUS_CHECKS) {
    intervalId = setInterval(async () => {
      await fetchAllStatuses(services);
    }, STATUS_CHECK_INTERVAL);
  }
}

/**
 * Stop the status monitoring system
 * Clears the auto-refresh interval
 */
export function stopStatusMonitor() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}


/**
 * Get a summary of the current status monitoring state
 * Useful for debugging and monitoring
 *
 * @returns {Object} Summary object
 */
export function getMonitorSummary() {
  const statuses = Array.from(statusMap.values());
  const onlineCount = statuses.filter(s => s.status === 'online').length;
  const offlineCount = statuses.filter(s => s.status === 'offline').length;
  const warningCount = statuses.filter(s => s.status === 'warning').length;

  return {
    enabled: ENABLE_STATUS_CHECKS,
    totalServices: statusMap.size,
    online: onlineCount,
    offline: offlineCount,
    warning: warningCount,
    isRunning: intervalId !== null,
    lastChecked: statuses[0]?.lastChecked || null
  };
}

/**
 * proxmox was being a pain to check connectivity
 * so i gave it its own status checker
 *
 * @param {string} url - The Proxmox URL to check
 * @returns {Promise<string>} Status: 'online' or 'offline'
 */
async function checkProxmoxConnectivity(url) {
  const controller = new AbortController();
  let timeoutId = null;
  
  try {
    timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    // Extract just the hostname and port for connectivity check
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      console.error(`[Proxmox Check] Invalid URL: ${url}`);
      return 'offline';
    }

    // Try to establish a connection by fetching a minimal endpoint
    // Use no-cors mode to avoid CORS issues
    // We don't care about the response, just whether the connection succeeds
    const testUrl = `${urlObj.protocol}//${urlObj.hostname}:${urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80')}/`;
    
    const response = await fetch(testUrl, {
      method: 'HEAD', // HEAD is lighter than GET
      signal: controller.signal,
      mode: 'no-cors', // Avoid CORS issues
      cache: 'no-cache'
    });

    clearTimeout(timeoutId);
    
    // If we get here, the connection was successful
    console.log(`[Proxmox Check] Connection successful to ${urlObj.hostname}:${urlObj.port || '8006'}`);
    return 'online';
    
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    console.error(`[Proxmox Check] Connection failed to ${url}: ${error.message}`);
    return 'offline';
  }
}
