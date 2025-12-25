/**
 * Status Client
 *
 * Client-side utility for fetching service statuses from the API.
 * Use this in your Astro components or frontend JavaScript.
 */

/**
 * Fetch current service statuses from the API
 *
 * @param {string} format - Response format: 'mapped' (default), 'raw', or 'summary'
 * @returns {Promise<Object>} Status data in the requested format
 */
export async function fetchServiceStatuses(format = 'mapped') {
  const response = await fetch(`/api/status?format=${format}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    cache: 'no-cache'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch statuses: ${response.statusText}`);
  }

  return await response.json();
}


/**
 * Get status for a specific service by title
 * Searches through the raw status data to find a matching service
 *
 * @param {string} title - The service title to search for
 * @returns {Promise<Object|null>} Status object or null if not found
 */
export async function getServiceStatusByTitle(title) {
  try {
    const statuses = await fetchServiceStatuses('raw');
    return statuses.find(service => service.title === title) || null;
  } catch (error) {
    console.error('[Status Client] Error getting service status:', error);
    return null;
  }
}

/**
 * Set up automatic status polling in the browser
 * Calls a callback function with updated statuses at regular intervals
 *
 * @param {Function} callback - Function to call with updated statuses
 * @param {number} intervalMinutes - Polling interval in minutes (default: 15)
 * @returns {Function} Cleanup function to stop polling
 */
export function setupStatusPolling(callback, intervalMinutes = 15) {
  const intervalMs = intervalMinutes * 60 * 1000;

  // Initial fetch
  fetchServiceStatuses().then(callback).catch(console.error);

  // Set up polling
  const intervalId = setInterval(() => {
    fetchServiceStatuses().then(callback).catch(console.error);
  }, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Create a reactive status store (for use with Astro islands or vanilla JS)
 * Returns an object with status data and methods to update it
 *
 * @returns {Object} Status store with data and methods
 */
export function createStatusStore() {
  let statuses = null;
  let listeners = [];

  const store = {
    // Get current statuses
    get data() {
      return statuses;
    },

    // Subscribe to status updates
    subscribe(callback) {
      listeners.push(callback);
      // Call immediately if we have data
      if (statuses) {
        callback(statuses);
      }
      // Return unsubscribe function
      return () => {
        listeners = listeners.filter(cb => cb !== callback);
      };
    },

    // Fetch and update statuses
    async refresh() {
      try {
        statuses = await fetchServiceStatuses();
        listeners.forEach(callback => callback(statuses));
        return statuses;
      } catch (error) {
        console.error('[Status Store] Error refreshing:', error);
        throw error;
      }
    },

    // Start auto-polling
    startPolling(intervalMinutes = 15) {
      return setupStatusPolling((data) => {
        statuses = data;
        listeners.forEach(callback => callback(statuses));
      }, intervalMinutes);
    }
  };

  return store;
}
