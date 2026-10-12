import React, { useState } from 'react';
import {
  X,
  Building,
  Key,
  Thermometer,
  ShieldCheck,
  Wrench,
  Clock,
  Sparkles,
  Wifi,
  User,
  Dog,
  Maximize2,
  DollarSign,
  Calendar,
  Lock,
  Unlock,
  Bed,
  CheckCircle2
} from 'lucide-react';

export function UnitDetailDrawer({ unit, onClose, onOpenWorkOrderModal, onStatusChange }) {
  const [doorLocked, setDoorLocked] = useState(true);
  const [temperature, setTemperature] = useState(72);

  if (!unit) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                Unit #{unit.number}
              </span>
              <span className={`badge ${
                unit.status === 'Occupied' ? 'badge-online' :
                unit.status === 'Vacant' ? 'badge-vacant' :
                unit.status === 'Maintenance' ? 'badge-warning' : 'badge-neutral'
              }`}>
                {unit.status}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Floor {unit.floor} • {unit.type}
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Architectural Layout SVG */}
          <div style={{
            background: 'var(--input-bg-theme)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid var(--border-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Maximize2 size={13} color="var(--cyan-blue)" /> {unit.sqft} sq.ft CAD Plan
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--cyan-blue)', fontWeight: 600 }}>Vector Schematics</span>
            </div>

            <div style={{
              height: '110px',
              background: 'rgba(11, 18, 32, 0.6)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 360 110" style={{ stroke: 'rgba(34, 211, 238, 0.5)', fill: 'rgba(59, 130, 246, 0.08)', strokeWidth: '1.5' }}>
                <rect x="20" y="10" width="190" height="90" rx="3" />
                <rect x="220" y="10" width="120" height="42" rx="3" />
                <rect x="220" y="58" width="120" height="42" rx="3" />
                <text x="115" y="55" fill="var(--cyan-blue)" fontSize="10" fontFamily="Outfit" textAnchor="middle">Living & Kitchen</text>
                <text x="280" y="35" fill="var(--electric-blue)" fontSize="9" fontFamily="Outfit" textAnchor="middle">Master Bedroom</text>
                <text x="280" y="82" fill="var(--text-muted)" fontSize="9" fontFamily="Outfit" textAnchor="middle">Ensuite Bath</text>
              </svg>
            </div>
          </div>

          {/* Quick Icon Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <DollarSign size={11} color="var(--electric-blue)" /> Rent
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--electric-blue)', fontFamily: 'Outfit' }}>${unit.rent}</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Key size={11} color="var(--cyan-blue)" /> Deposit
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'Outfit' }}>${unit.deposit}</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={11} color="var(--status-online)" /> Audit
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--status-online)', fontFamily: 'Outfit' }}>{unit.inspectionScore}%</div>
            </div>
          </div>

          {/* Resident Quick Ribbon */}
          <div style={{
            background: 'var(--input-bg-theme)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            border: '1px solid var(--border-card)'
          }}>
            {unit.tenant ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                    <User size={13} color="var(--electric-blue)" /> Resident:
                  </span>
                  <span style={{ fontWeight: 600 }}>{unit.tenant}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                    <Calendar size={13} color="var(--cyan-blue)" /> Lease Expiry:
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--cyan-blue)' }}>{unit.leaseEnd}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                    <Dog size={13} color="var(--warning)" /> Pet:
                  </span>
                  <span style={{ fontWeight: 600 }}>{unit.petFriendly ? 'Permitted' : 'None'}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--cyan-blue)', fontSize: '0.825rem', fontWeight: 600, padding: '0.5rem 0' }}>
                <Sparkles size={16} /> Ready for Lease Assignment
              </div>
            )}
          </div>

          {/* IoT Smart Hub */}
          <div style={{
            background: 'var(--input-bg-theme)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            border: '1px solid var(--border-card)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {/* Smart Lock */}
              <div style={{ padding: '0.65rem', background: 'var(--bg-sidebar)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Smart Lock</span>
                  {doorLocked ? <Lock size={12} color="var(--status-online)" /> : <Unlock size={12} color="var(--status-error)" />}
                </div>
                <button
                  onClick={() => setDoorLocked(!doorLocked)}
                  className={`btn btn-sm ${doorLocked ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ width: '100%', fontSize: '0.72rem', padding: '3px 0' }}
                >
                  {doorLocked ? 'Unlock' : 'Lock'}
                </button>
              </div>

              {/* Climate */}
              <div style={{ padding: '0.65rem', background: 'var(--bg-sidebar)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Thermostat</span>
                  <span style={{ fontWeight: 700, color: 'var(--cyan-blue)' }}>{temperature}°F</span>
                </div>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <button onClick={() => setTemperature(t => t - 1)} className="btn btn-secondary btn-sm" style={{ flex: 1, padding: '2px 0' }}>-</button>
                  <button onClick={() => setTemperature(t => t + 1)} className="btn btn-secondary btn-sm" style={{ flex: 1, padding: '2px 0' }}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {unit.features?.map((feat, i) => (
              <span
                key={i}
                style={{
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--input-bg-theme)',
                  border: '1px solid var(--border-card)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)'
                }}
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-card)',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => {
              onClose();
              onOpenWorkOrderModal(unit.number);
            }}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            <Wrench size={14} />
            <span>Dispatch Work Order</span>
          </button>

          <button
            onClick={() => {
              const nextStatus = unit.status === 'Occupied' ? 'Vacant' : unit.status === 'Vacant' ? 'Maintenance' : 'Occupied';
              onStatusChange(unit.id, nextStatus);
            }}
            className="btn btn-secondary btn-sm"
          >
            Toggle Status
          </button>
        </div>
      </div>
    </div>
  );
}
