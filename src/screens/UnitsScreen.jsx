import React, { useState } from 'react';
import {
  Building2,
  Grid,
  List,
  Sparkles,
  Thermometer,
  Lock,
  Layers,
  Wrench,
  UserCheck,
  Calendar,
  DollarSign,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  Check
} from 'lucide-react';

export function UnitsScreen({ units, onSelectUnit, searchTerm = '', onOpenWorkOrderModal }) {
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filteredUnits = units.filter(unit => {
    const matchesSearch =
      unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.tenant && unit.tenant.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFloor = selectedFloor === 'all' || unit.floor.toString() === selectedFloor;
    const matchesStatus = statusFilter === 'all' || unit.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesFloor && matchesStatus;
  });

  const floors = ['all', '1', '2', '3', '4'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Building2 size={22} color="var(--electric-blue)" />
            <h1 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Units & Elevation Matrix</h1>
            <span className="badge badge-cyan">{filteredUnits.length} Units</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', background: 'var(--input-bg-theme)', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="btn-icon"
                style={{
                  width: '32px',
                  height: '32px',
                  background: viewMode === 'grid' ? 'var(--electric-blue)' : 'transparent',
                  color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                  border: 'none'
                }}
                title="Matrix View"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className="btn-icon"
                style={{
                  width: '32px',
                  height: '32px',
                  background: viewMode === 'table' ? 'var(--electric-blue)' : 'transparent',
                  color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
                  border: 'none'
                }}
                title="Table View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills with Icons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Units', icon: Building2 },
              { id: 'occupied', label: 'Occupied', color: 'var(--status-online)', icon: CheckCircle2 },
              { id: 'vacant', label: 'Vacant', color: 'var(--cyan-blue)', icon: Sparkles },
              { id: 'maintenance', label: 'Turnover', color: 'var(--status-pending)', icon: Wrench },
              { id: 'reserved', label: 'Reserved', color: 'var(--indigo)', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: `1px solid ${statusFilter === tab.id ? 'var(--electric-blue)' : 'var(--border-card)'}`,
                    background: statusFilter === tab.id ? 'rgba(59, 130, 246, 0.15)' : 'var(--input-bg-theme)',
                    color: statusFilter === tab.id ? 'var(--electric-blue)' : 'var(--text-main)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Icon size={13} color={tab.color || 'currentColor'} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Layers size={13} /> Floor:
            </span>
            {floors.map(f => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f)}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: `1px solid ${selectedFloor === f ? 'var(--cyan-blue)' : 'var(--border-card)'}`,
                  background: selectedFloor === f ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                  color: selectedFloor === f ? 'var(--cyan-blue)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {f === 'all' ? 'All' : `F${f}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Matrix View */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1rem'
        }}>
          {filteredUnits.map(unit => {
            let borderColor = 'var(--border-card)';
            let statusBadge = <span className="badge badge-online">Occupied</span>;

            if (unit.status === 'Vacant') {
              borderColor = 'rgba(34, 211, 238, 0.4)';
              statusBadge = <span className="badge badge-vacant">Vacant</span>;
            } else if (unit.status === 'Maintenance') {
              borderColor = 'rgba(245, 158, 11, 0.4)';
              statusBadge = <span className="badge badge-warning">Turnover</span>;
            } else if (unit.status === 'Reserved') {
              borderColor = 'rgba(99, 102, 241, 0.4)';
              statusBadge = <span className="badge badge-neutral" style={{ color: 'var(--indigo)' }}>Reserved</span>;
            }

            return (
              <div
                key={unit.id}
                onClick={() => onSelectUnit(unit)}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  border: `1px solid ${borderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit' }}>#{unit.number}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 6px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      F{unit.floor}
                    </span>
                  </div>
                  {statusBadge}
                </div>

                {/* Specs with Icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Bed size={13} color="var(--electric-blue)" /> {unit.type.split(',')[0]}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Maximize2 size={13} color="var(--cyan-blue)" /> {unit.sqft} sqft
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} color="var(--status-online)" /> {unit.inspectionScore}%
                  </span>
                </div>

                {/* Resident / Vacancy Ribbon */}
                <div style={{
                  padding: '0.6rem 0.75rem',
                  background: 'var(--input-bg-theme)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem'
                }}>
                  {unit.tenant ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                      <UserCheck size={14} color="var(--electric-blue)" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{unit.tenant}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan-blue)', fontWeight: 600 }}>
                      <Sparkles size={14} /> Available
                    </div>
                  )}

                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Calendar size={11} /> {unit.leaseEnd || 'Ready'}
                  </span>
                </div>

                {/* IoT Mini Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Thermometer size={12} color="var(--cyan-blue)" /> 71.5°F
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Lock size={12} color="var(--status-online)" /> Locked
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Layers size={12} color="var(--electric-blue)" /> {unit.tower.split(' ')[1]}
                  </span>
                </div>

                {/* Price & Action */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--electric-blue)', fontFamily: 'Outfit' }}>
                    ${unit.rent}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectUnit(unit);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '3px 9px', fontSize: '0.72rem' }}
                  >
                    Inspect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: 'var(--input-bg-theme)', borderBottom: '1px solid var(--border-card)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Unit</th>
                <th style={{ padding: '0.75rem 1rem' }}>Layout</th>
                <th style={{ padding: '0.75rem 1rem' }}>Sq.Ft</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Resident</th>
                <th style={{ padding: '0.75rem 1rem' }}>Rent</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnits.map(unit => (
                <tr
                  key={unit.id}
                  onClick={() => onSelectUnit(unit)}
                  style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                >
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                    #{unit.number}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{unit.type}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{unit.sqft}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {unit.status === 'Occupied' && <span className="badge badge-online">Occupied</span>}
                    {unit.status === 'Vacant' && <span className="badge badge-vacant">Vacant</span>}
                    {unit.status === 'Maintenance' && <span className="badge badge-warning">Turnover</span>}
                    {unit.status === 'Reserved' && <span className="badge badge-neutral">Reserved</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                    {unit.tenant || <span style={{ color: 'var(--text-dim)' }}>—</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--electric-blue)' }}>
                    ${unit.rent}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px' }}>
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
