import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';

export default function InteractiveLocationPicker({
  latitude,
  longitude,
  onLocationSelect
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Default coordinates (Skyline Towers / Emerald City area: 37.7749, -122.4194)
  const defaultLat = latitude ? parseFloat(latitude) : 37.7749;
  const defaultLng = longitude ? parseFloat(longitude) : -122.4194;

  const [currentCoords, setCurrentCoords] = useState({ lat: defaultLat, lng: defaultLng });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Custom sleek on-brand Leaflet divIcon
  const createCustomPin = () => {
    return L.divIcon({
      className: 'bee-map-pin',
      html: `
        <div style="
          position: relative;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-17px, -34px);
        ">
          <div style="
            width: 34px;
            height: 34px;
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            color: #FFFFFF;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45);
            border: 2.5px solid #FFFFFF;
          ">
            <svg style="transform: rotate(45deg); width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });
  };

  // Reverse Geocode using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};

        const streetParts = [
          addr.house_number,
          addr.road || addr.street || addr.residential || addr.neighbourhood
        ].filter(Boolean);

        const newAddress = streetParts.length > 0 ? streetParts.join(' ') : (data.display_name?.split(',')[0] || '');
        const newCity = addr.city || addr.town || addr.municipality || addr.suburb || addr.county || '';
        const newState = addr.state || addr.province || '';
        const newZip = addr.postcode || '';
        const newCountry = addr.country || 'United States';
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        onLocationSelect({
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
          address: newAddress,
          city: newCity,
          state: newState,
          zip: newZip,
          country: newCountry,
          mapLink: mapUrl
        });
      } else {
        onLocationSelect({
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
          mapLink: `https://www.google.com/maps?q=${lat},${lng}`
        });
      }
    } catch {
      onLocationSelect({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        mapLink: `https://www.google.com/maps?q=${lat},${lng}`
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = latitude ? parseFloat(latitude) : defaultLat;
    const initialLng = longitude ? parseFloat(longitude) : defaultLng;

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: true
    });

    // OpenStreetMap tile layer (No API Key required, completely free & open source)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Draggable marker
    const marker = L.marker([initialLat, initialLng], {
      icon: createCustomPin(),
      draggable: true
    }).addTo(map);

    marker.bindPopup(`<strong>Selected Property Location</strong><br/>Lat: ${initialLat.toFixed(5)}, Lng: ${initialLng.toFixed(5)}`);

    // Handle marker dragend
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setCurrentCoords({ lat: pos.lat, lng: pos.lng });
      marker.setPopupContent(`<strong>Selected Property Location</strong><br/>Lat: ${pos.lat.toFixed(5)}, Lng: ${pos.lng.toFixed(5)}`);
      reverseGeocode(pos.lat, pos.lng);
    });

    // Handle map click
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCurrentCoords({ lat, lng });
      marker.setPopupContent(`<strong>Selected Property Location</strong><br/>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
      reverseGeocode(lat, lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidate size once rendered
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position if latitude/longitude props change from outside
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        const cur = markerRef.current.getLatLng();
        if (Math.abs(cur.lat - lat) > 0.0001 || Math.abs(cur.lng - lng) > 0.0001) {
          markerRef.current.setLatLng([lat, lng]);
          mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
          setCurrentCoords({ lat, lng });
        }
      }
    }
  }, [latitude, longitude]);

  // Handle Search Input
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(searchQuery)}&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);

        // If results found and direct search, fly to first match
        if (data.length > 0) {
          selectSearchResult(data[0]);
        }
      }
    } catch (err) {
      console.warn('Location search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lng) && mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
      markerRef.current.setLatLng([lat, lng]);
      setCurrentCoords({ lat, lng });
      setSearchResults([]);
      setSearchQuery(item.display_name?.split(',').slice(0, 3).join(',') || searchQuery);

      // Auto-populate from address details
      const addr = item.address || {};
      const streetParts = [
        addr.house_number,
        addr.road || addr.street || addr.residential || addr.neighbourhood
      ].filter(Boolean);

      const newAddress = streetParts.length > 0 ? streetParts.join(' ') : (item.display_name?.split(',')[0] || '');
      const newCity = addr.city || addr.town || addr.municipality || addr.suburb || addr.county || '';
      const newState = addr.state || addr.province || '';
      const newZip = addr.postcode || '';
      const newCountry = addr.country || 'United States';
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      onLocationSelect({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        address: newAddress,
        city: newCity,
        state: newState,
        zip: newZip,
        country: newCountry,
        mapLink: mapUrl
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {/* Top Search Controls Bar */}
      <div style={{ position: 'relative', width: '100%' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="search-wrapper" style={{ flex: 1, position: 'relative' }}>
            <MapPin size={16} className="search-icon" color="#2563EB" />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search property address, neighborhood, landmark, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.4rem' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-secondary btn-sm"
            disabled={isSearching}
            style={{ fontWeight: 600, minWidth: '90px' }}
          >
            {isSearching ? <Loader2 size={14} className="spin" /> : <Search size={14} />}
            {isSearching ? 'Searching' : 'Search'}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {searchResults.length > 1 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              marginTop: '0.35rem',
              maxHeight: '220px',
              overflowY: 'auto'
            }}
          >
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => selectSearchResult(item)}
                style={{
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.8125rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  borderBottom: idx < searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Navigation size={13} color="#2563EB" />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {item.display_name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Map Canvas Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1.5px solid var(--border-color)',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

        {/* Geocoding Loading Indicator Overlay */}
        {isGeocoding && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 999,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--primary-blue)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Loader2 size={13} className="spin" />
            Updating address...
          </div>
        )}

        {/* Coordinates Status Pill on bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <MapPin size={12} color="#93C5FD" />
          Lat: {currentCoords.lat.toFixed(5)}, Lng: {currentCoords.lng.toFixed(5)}
        </div>
      </div>

      {/* Helper info banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          padding: '0.35rem 0.5rem',
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        <span>
          💡 <strong>Tip:</strong> Click anywhere on the map or drag the blue pin to pinpoint the exact property boundary. Address fields will automatically update.
        </span>
        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
          OpenStreetMap tiles (API key optional)
        </span>
      </div>
    </div>
  );
}
