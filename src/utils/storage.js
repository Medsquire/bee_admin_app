// LocalStorage Persistence Utility with fallbacks
export const STORAGE_KEYS = {
  APARTMENTS: 'bee_apartments_v4',
  AGENCIES: 'bee_agencies_v4',
  MAINTENANCE: 'bee_maintenance_v4',
  ACTIVITIES: 'bee_activities_v4',
  SECURITY: 'bee_security_v4',
  AGENCY_VIEW: 'bee_agency_view_pref',
  SERVICE_CATEGORIES: 'bee_service_categories_v3',
  ADMIN_AUTH: 'bee_admin_auth',
  PROPERTY_CONFIG: 'bee_property_config_v1',
  AGENCY_CONFIG: 'bee_agency_config_v1',
  APP_PREFERENCES: 'bee_app_preferences_v1'
};

export function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) {
      return defaultValue;
    }
    // Automatically sanitize and migrate any US mock phone numbers if previously stored
    let migrated = item.replace(/\+1\s*\((\d{3})\)\s*(\d{3})-(\d{4})/g, (match, area, mid, last) => {
      if (mid === '000' && last === '0000') return '+91 9876543210';
      if (mid === '000' && last === '1122') return '+91 9811001122';
      if (mid === '911' && last === '0000') return '+91 9811191100';
      if (mid === '911' && last === '0021') return '+91 9811191121';
      const d1 = parseInt(mid[0], 10);
      const p3 = d1 === 0 ? 1 : d1;
      return `+91 98${p3}${mid}${last}`;
    });

    // Automatically migrate legacy US addresses to Hyderabad, Telangana
    migrated = migrated
      .replace(/Emerald City/g, 'Hyderabad')
      .replace(/Emerald Bay/g, 'Hyderabad')
      .replace(/100 Bee Central Boulevard, Metro Emerald District/g, 'Plot 18 & 19, Financial District, Nanakramguda')
      .replace(/45 Apex Avenue, Highline Corridor, Emerald City/g, 'Survey No. 64, Mindspace IT Corridor, HITEC City')
      .replace(/450 Skyline Boulevard, North Hive District/g, 'Survey No. 64, Mindspace IT Corridor, HITEC City')
      .replace(/22 Botanical Way, Gardenia Valley, Emerald City/g, 'Botanical Garden Road, Masjid Banda, Kondapur')
      .replace(/12 Waterfront Drive, Marina Promenade, Emerald Bay/g, 'Durgam Cheruvu Lakefront Promenade, Madhapur')
      .replace(/100 Service Boulevard, Tech Corridor/g, 'Plot 42, Cyber Gateway Sector, HITEC City')
      .replace(/400 Industrial Ring Road/g, 'Road No. 1, Near GVK One, Banjara Hills')
      .replace(/"country":\s*"United States"/g, '"country": "India"')
      .replace(/"state":\s*"California"/g, '"state": "Telangana"')
      .replace(/"state":\s*"CA"/g, '"state": "Telangana"')
      .replace(/"pinCode":\s*"94016"/g, '"pinCode": "500081"')
      .replace(/"zip":\s*"94016"/g, '"zip": "500032"')
      .replace(/"zip":\s*"94018"/g, '"zip": "500081"')
      .replace(/"zip":\s*"94022"/g, '"zip": "500084"')
      .replace(/"zip":\s*"94033"/g, '"zip": "500081"');

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
