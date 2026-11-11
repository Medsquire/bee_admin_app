// LocalStorage Persistence Utility with fallbacks
export const STORAGE_KEYS = {
  APARTMENTS: 'bee_apartments_v3',
  AGENCIES: 'bee_agencies_v3',
  MAINTENANCE: 'bee_maintenance_v3',
  ACTIVITIES: 'bee_activities_v3',
  SECURITY: 'bee_security_v3',
  AGENCY_VIEW: 'bee_agency_view_pref',
  SERVICE_CATEGORIES: 'bee_service_categories_v3',
  ADMIN_AUTH: 'bee_admin_auth'
};

export function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) {
      return defaultValue;
    }
    // Automatically sanitize and migrate any US mock phone numbers if previously stored
    const migrated = item.replace(/\+1\s*\((\d{3})\)\s*(\d{3})-(\d{4})/g, (match, area, mid, last) => {
      if (mid === '000' && last === '0000') return '+91 9876543210';
      if (mid === '000' && last === '1122') return '+91 9811001122';
      if (mid === '911' && last === '0000') return '+91 9811191100';
      if (mid === '911' && last === '0021') return '+91 9811191121';
      const d1 = parseInt(mid[0], 10);
      const p3 = d1 === 0 ? 1 : d1;
      return `+91 98${p3}${mid}${last}`;
    });
    return JSON.parse(migrated);
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
