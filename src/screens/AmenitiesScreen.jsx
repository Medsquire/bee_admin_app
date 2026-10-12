import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Clock,
  Calendar,
  Star,
  MapPin,
  Plus,
  Wifi,
  Waves,
  Dumbbell,
  Coffee,
  Zap
} from 'lucide-react';
import { AMENITIES_DATA } from '../data/mockData';

export function AmenitiesScreen({ onSendNotice }) {
  const [amenities] = useState(AMENITIES_DATA);

  const getAmenityIcon = (name) => {
    if (name.includes('Lounge')) return <Coffee size={18} color="var(--cyan-blue)" />;
    if (name.includes('Pool')) return <Waves size={18} color="var(--electric-blue)" />;
    if (name.includes('Fitness')) return <Dumbbell size={18} color="var(--status-online)" />;
    if (name.includes('Co-Working')) return <Wifi size={18} color="var(--indigo)" />;
    return <Zap size={18} color="var(--warning)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Action */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Sparkles size={22} color="var(--cyan-blue)" />
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Amenities & Spaces</h1>
          <span className="badge badge-cyan">{amenities.length} Active</span>
        </div>

        <button onClick={() => onSendNotice('Facility Desk', 'Booking Slot')} className="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>Book Slot</span>
        </button>
      </div>

      {/* Grid with Icon Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {amenities.map(item => (
          <div
            key={item.id}
            className="glass-panel"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Image Banner */}
            <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11, 18, 32, 0.9) 0%, transparent 70%)' }} />

              <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                <span className="badge badge-online">
                  <span className="status-dot status-dot-pulse" /> {item.status}
                </span>
              </div>

              <div style={{ position: 'absolute', bottom: '0.65rem', left: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.72rem', padding: '2px 6px', background: 'rgba(0,0,0,0.65)', borderRadius: '4px', color: 'var(--cyan-blue)', fontWeight: 600 }}>
                  <MapPin size={10} style={{ display: 'inline', marginRight: '3px' }} /> {item.floor}
                </span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getAmenityIcon(item.name)}
                  <h3 style={{ fontSize: '1.05rem', fontFamily: 'Outfit' }}>{item.name}</h3>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--warning)', fontSize: '0.78rem', fontWeight: 700 }}>
                  <Star size={12} fill="currentColor" /> {item.rating}
                </span>
              </div>

              {/* Icon Specs */}
              <div style={{
                background: 'var(--input-bg-theme)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 0.75rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <Clock size={12} color="var(--electric-blue)" /> {item.hours.split(' ')[0]}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--cyan-blue)', fontWeight: 600 }}>
                  <Users size={12} /> Max {item.capacity}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-online)', fontWeight: 700 }}>
                  <Calendar size={12} /> {item.activeBookingsToday} Today
                </span>
              </div>

              {/* Action */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: 'auto'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  Keycard BLE
                </span>
                <button
                  onClick={() => onSendNotice('Resident Concierge', item.name)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '3px 9px', fontSize: '0.75rem' }}
                >
                  <Calendar size={12} />
                  <span>Reserve</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
