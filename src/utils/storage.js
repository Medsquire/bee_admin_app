// LocalStorage Persistence Utility with fallbacks
export const STORAGE_KEYS = {
  APARTMENTS: 'bee_apartments_v2',
  AGENCIES: 'bee_agencies_v2',
  MAINTENANCE: 'bee_maintenance_v2',
  ACTIVITIES: 'bee_activities_v2',
  SECURITY: 'bee_security_v2',
  AGENCY_VIEW: 'bee_agency_view_pref'
};

export function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Failed to load key "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save key "${key}" to localStorage:`, err);
  }
}

export function resetAllStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error('Failed to reset storage:', err);
  }
}
