import React, { useState } from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  Wrench,
  DollarSign,
  ArrowUpRight,
  AlertCircle,
  Clock,
  Key,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Layers,
  Wifi,
  Sparkles,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  AlertTriangle,
  Hexagon
} from 'lucide-react';
import { FINANCIAL_METRICS, ACCESS_LOGS } from '../data/mockData';

export function DashboardScreen({
  units,
  tenants,
  workOrders,
  activeProperty,
  onNavigateTab,
  onSelectUnit,
  onOpenWorkOrderModal
}) {
  const [selectedChartMetric, setSelectedChartMetric] = useState('revenue');

  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'Occupied').length;
  const vacantUnits = units.filter(u => u.status === 'Vacant').length;
  const maintenanceUnits = units.filter(u => u.status === 'Maintenance').length;
  const reservedUnits = units.filter(u => u.status === 'Reserved').length;
  const occupancyPercent = ((occupiedUnits / totalUnits) * 100).toFixed(1);

  const urgentWorkOrders = workOrders.filter(w => w.priority === 'Urgent' || w.priority === 'High');
  const activeWorkOrdersCount = workOrders.filter(w => w.status !== 'Completed').length;

  const totalMonthlyRentRoll = units
    .filter(u => u.status === 'Occupied')
    .reduce((sum, u) => sum + (u.rent || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner - Clean, Icon Driven, No fluff */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          background: 'linear-gradient(135deg, rgba(11, 18, 32, 0.95) 0%, rgba(30, 58, 138, 0.3) 100%)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontFamily: 'Outfit' }}>{activeProperty.name}</h1>
            <span className="badge badge-online">
              <span className="status-dot status-dot-pulse" /> Live
            </span>
          </div>

          {/* Quick Icon Stat Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={14} color="var(--cyan-blue)" /> {activeProperty.code}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={14} color="var(--electric-blue)" /> {activeProperty.unitsCount} Units
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Key size={14} color="var(--status-online)" /> {occupancyPercent}% Leased
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Wifi size={14} color="var(--cyan-blue)" /> IoT Sync Active
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigateTab('community')} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Hexagon size={15} />
            <span>Bee Community (3 Apts)</span>
          </button>
          <button onClick={() => onNavigateTab('units')} className="btn btn-secondary btn-sm">
            <Building2 size={15} />
            <span>Floorplan</span>
          </button>
          <button onClick={onOpenWorkOrderModal} className="btn btn-gradient btn-sm">
            <Zap size={15} />
            <span>Dispatch</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards with Icon Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {/* Occupancy Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Key size={14} color="var(--status-online)" /> Occupancy
            </span>
            <span className="badge badge-online">{occupancyPercent}%</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'Outfit', marginTop: '0.35rem' }}>
            {occupiedUnits} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {totalUnits}</span>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${(occupiedUnits / totalUnits) * 100}%`, background: 'var(--status-online)' }} />
              <div style={{ width: `${(vacantUnits / totalUnits) * 100}%`, background: 'var(--cyan-blue)' }} />
              <div style={{ width: `${(maintenanceUnits / totalUnits) * 100}%`, background: 'var(--status-pending)' }} />
              <div style={{ width: `${(reservedUnits / totalUnits) * 100}%`, background: 'var(--indigo)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span><CheckCircle2 size={11} color="var(--status-online)" style={{ display: 'inline', marginRight: '2px' }} />{occupiedUnits} Occupied</span>
              <span><Sparkles size={11} color="var(--cyan-blue)" style={{ display: 'inline', marginRight: '2px' }} />{vacantUnits} Vacant</span>
              <span><Wrench size={11} color="var(--status-pending)" style={{ display: 'inline', marginRight: '2px' }} />{maintenanceUnits} Turn</span>
            </div>
          </div>
        </div>

        {/* Collection Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <DollarSign size={14} color="var(--electric-blue)" /> Inflows (Oct)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--status-online)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={13} /> 97.8%
            </span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'Outfit', marginTop: '0.35rem', color: 'var(--electric-blue)' }}>
            ${(FINANCIAL_METRICS.collectedRent / 1000).toFixed(1)}k
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} color="var(--status-online)" /> Goal: ${(FINANCIAL_METRICS.grossPotentialRent / 1000).toFixed(1)}k
          </div>
        </div>

        {/* Maintenance Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wrench size={14} color="var(--status-pending)" /> Work Orders
            </span>
            {urgentWorkOrders.length > 0 ? (
              <span className="badge badge-urgent"><AlertCircle size={11} /> {urgentWorkOrders.length} Urgent</span>
            ) : (
              <span className="badge badge-online">Clear</span>
            )}
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'Outfit', marginTop: '0.35rem' }}>
            {activeWorkOrdersCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Active</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} color="var(--cyan-blue)" /> SLA Avg: 24 mins
          </div>
        </div>

        {/* Residents Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users size={14} color="var(--cyan-blue)" /> Residents
            </span>
            <span className="badge badge-online">99.1% Retention</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'Outfit', marginTop: '0.35rem' }}>
            {tenants.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} color="var(--warning)" /> 2 Renewals in 60d
          </div>
        </div>
      </div>

      {/* Charts & Real-time IoT Access Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1.2fr',
        gap: '1.25rem'
      }}>
        {/* Financial Velocity Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--electric-blue)" />
              <h3 style={{ fontSize: '1.05rem' }}>Financial Velocity</h3>
            </div>

            <div style={{ display: 'flex', background: 'var(--input-bg-theme)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
              <button
                onClick={() => setSelectedChartMetric('revenue')}
                style={{
                  padding: '3px 9px',
                  fontSize: '0.72rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedChartMetric === 'revenue' ? 'var(--electric-blue)' : 'transparent',
                  color: selectedChartMetric === 'revenue' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Inflows
              </button>
              <button
                onClick={() => setSelectedChartMetric('expenses')}
                style={{
                  padding: '3px 9px',
                  fontSize: '0.72rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedChartMetric === 'expenses' ? 'var(--electric-blue)' : 'transparent',
                  color: selectedChartMetric === 'expenses' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Opex
              </button>
            </div>
          </div>

          {/* SVG Vector Chart */}
          <div style={{ height: '220px', position: 'relative', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '1.25rem', paddingBottom: '2rem' }}>
            {FINANCIAL_METRICS.revenueByMonth.map((item) => {
              const maxVal = 550000;
              const revHeight = (item.revenue / maxVal) * 180;
              const expHeight = (item.expenses / maxVal) * 180;

              return (
                <div
                  key={item.month}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: `calc(100% - ${revHeight + 24}px)`,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--cyan-blue)'
                  }}>
                    ${(item.revenue / 1000).toFixed(0)}k
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', width: '100%', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '24px',
                        height: `${revHeight}px`,
                        background: 'var(--primary-gradient)',
                        borderRadius: '5px 5px 0 0',
                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.25)'
                      }}
                      title={`${item.month} Revenue: $${item.revenue.toLocaleString()}`}
                    />
                    <div
                      style={{
                        width: '12px',
                        height: `${expHeight}px`,
                        background: 'rgba(148, 163, 184, 0.3)',
                        borderRadius: '3px 3px 0 0'
                      }}
                      title={`${item.month} Opex: $${item.expenses.toLocaleString()}`}
                    />
                  </div>

                  <span style={{
                    position: 'absolute',
                    bottom: '-22px',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--electric-blue)', borderRadius: '2px' }} /> Rent
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--cyan-blue)', borderRadius: '2px' }} /> Amenities
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: 'rgba(148, 163, 184, 0.4)', borderRadius: '2px' }} /> Opex
            </span>
          </div>
        </div>

        {/* Live IoT Telemetry Feed */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wifi size={18} color="var(--cyan-blue)" />
              <h3 style={{ fontSize: '1.05rem' }}>IoT Smart Access</h3>
            </div>
            <span className="badge badge-online">
              <span className="status-dot status-dot-pulse" /> Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, overflowY: 'auto', maxHeight: '280px' }}>
            {ACCESS_LOGS.map(log => {
              const isDenied = log.status.includes('Denied');

              return (
                <div
                  key={log.id}
                  style={{
                    padding: '0.65rem 0.75rem',
                    background: 'var(--input-bg-theme)',
                    border: `1px solid ${isDenied ? 'rgba(239,68,68,0.3)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: isDenied ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.12)',
                      color: isDenied ? 'var(--status-error)' : 'var(--electric-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isDenied ? <AlertTriangle size={14} /> : <Key size={14} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{log.event}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {log.visitor} • {log.unit}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: isDenied ? 'var(--status-error)' : 'var(--status-online)'
                    }}>
                      {log.status}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                      <Clock size={10} /> {log.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Immediate Units - Icon Packed Cards */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} color="var(--electric-blue)" />
            <h3 style={{ fontSize: '1.05rem' }}>Turnover & Priority Units</h3>
          </div>
          <button onClick={() => onNavigateTab('units')} className="btn btn-secondary btn-sm">
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.85rem'
        }}>
          {units.slice(0, 4).map(unit => {
            let statusBadge = <span className="badge badge-online">Occupied</span>;
            if (unit.status === 'Vacant') statusBadge = <span className="badge badge-vacant">Vacant</span>;
            if (unit.status === 'Maintenance') statusBadge = <span className="badge badge-warning">Turnover</span>;
            if (unit.status === 'Reserved') statusBadge = <span className="badge badge-neutral">Reserved</span>;

            return (
              <div
                key={unit.id}
                onClick={() => onSelectUnit(unit)}
                style={{
                  background: 'var(--input-bg-theme)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--electric-blue)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-card)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'Outfit' }}>#{unit.number}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 5px', background: 'var(--bg-surface-elevated)', borderRadius: '3px', color: 'var(--text-muted)' }}>F{unit.floor}</span>
                  </div>
                  {statusBadge}
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Maximize2 size={12} color="var(--cyan-blue)" /> {unit.sqft} sqft
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={12} color="var(--status-online)" /> {unit.inspectionScore}%
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cyan-blue)', fontFamily: 'Outfit' }}>
                    ${unit.rent}
                  </span>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                    Inspect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
