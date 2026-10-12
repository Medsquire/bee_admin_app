import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Car,
  Users,
  Key,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Camera,
  Radio,
  Bell,
  MapPin,
  ChevronRight,
  Phone,
  Lock,
  Unlock,
  X
} from 'lucide-react';

export function SecurityScreen({ addToast = () => {} }) {
  const [activeTab, setActiveTab] = useState('gate-log'); // 'gate-log' | 'anpr' | 'daily-staff' | 'patrols' | 'incidents'
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorFlat, setVisitorFlat] = useState('101');
  const [visitorPurpose, setVisitorPurpose] = useState('Delivery');

  const [visitorLogs, setVisitorLogs] = useState([
    {
      id: 'VIS-9021',
      name: 'Alexander Reed',
      purpose: 'Guest / Family',
      flat: 'HCT-A-101',
      host: 'Dr. Marcus Vance',
      gate: 'Main Gate 1',
      vehicle: 'CA 7XYZ-890',
      timeIn: '10 mins ago',
      timeOut: null,
      status: 'Inside',
      verifiedBy: 'FaceID + Host OTP'
    },
    {
      id: 'VIS-9020',
      name: 'Amazon Prime Courier (Jason)',
      purpose: 'Delivery',
      flat: 'AGR-B-201',
      host: 'David Miller',
      gate: 'Service Gate 3',
      vehicle: 'EV Van #44',
      timeIn: '25 mins ago',
      timeOut: '10 mins ago',
      status: 'Checked Out',
      verifiedBy: 'Barcode Scan'
    },
    {
      id: 'VIS-9019',
      name: 'Uber Premier (Driver Kamal)',
      purpose: 'Cab Pickup',
      flat: 'NBL-A-104',
      host: 'Elena Moreau',
      gate: 'Main Gate 1',
      vehicle: 'CA 9ABC-123',
      timeIn: '40 mins ago',
      timeOut: '32 mins ago',
      status: 'Checked Out',
      verifiedBy: 'App Pre-Approved'
    },
    {
      id: 'VIS-9018',
      name: 'Dr. Sarah Sterling Guest',
      purpose: 'Guest',
      flat: 'HCT-B-201',
      host: 'Dr. Sarah Sterling',
      gate: 'North Gate 2',
      vehicle: 'CA 6LMN-456',
      timeIn: '1 hr ago',
      timeOut: null,
      status: 'Inside',
      verifiedBy: 'Resident App Pass'
    }
  ]);

  const anprVehicles = [
    {
      id: 'ANPR-881',
      plate: 'CA 7XYZ-890',
      resident: 'Marcus Vance',
      flat: 'HCT-A-101',
      type: 'Resident Vehicle',
      barrier: 'Auto-Opened',
      time: '12 mins ago',
      gate: 'Main Gate 1 Boom Barrier'
    },
    {
      id: 'ANPR-880',
      plate: 'CA 4DEF-551',
      resident: 'Priya Nambiar',
      flat: 'AGR-B-302',
      type: 'Resident Vehicle',
      barrier: 'Auto-Opened',
      time: '35 mins ago',
      gate: 'North Gate 2 Boom Barrier'
    },
    {
      id: 'ANPR-879',
      plate: 'CA 9ZZZ-000',
      resident: 'Unknown / Visitor',
      flat: 'Service Gate',
      type: 'Commercial Delivery',
      barrier: 'Manual Guard Override',
      time: '50 mins ago',
      gate: 'Service Gate 3'
    }
  ];

  const dailyStaff = [
    {
      id: 'STF-101',
      name: 'Sunita Sharma',
      role: 'Housekeeping / Maid',
      flatsAssigned: ['HCT-A-101', 'HCT-A-102', 'HCT-B-201'],
      checkIn: '08:15 AM',
      status: 'On Premise',
      rfidCard: 'RFID-8812'
    },
    {
      id: 'STF-102',
      name: 'Rajesh Patil',
      role: 'Private Chauffeur',
      flatsAssigned: ['HCT-A-401'],
      checkIn: '08:45 AM',
      status: 'On Premise',
      rfidCard: 'RFID-9104'
    },
    {
      id: 'STF-103',
      name: 'Anjali Deshmukh',
      role: 'Chef / Cook',
      flatsAssigned: ['AGR-A-103', 'AGR-B-302'],
      checkIn: '07:30 AM',
      status: 'Checked Out (12:00 PM)',
      rfidCard: 'RFID-7721'
    }
  ];

  const patrols = [
    {
      checkpoint: 'Checkpoint #01: Honeycomb Towers North Perimeter',
      scannedAt: '15 mins ago',
      guard: 'Guard Vikram Singh',
      status: 'Verified Normal'
    },
    {
      checkpoint: 'Checkpoint #02: Amber Grove Botanical Walkway & Pool',
      scannedAt: '25 mins ago',
      guard: 'Guard Rajesh Kumar',
      status: 'Verified Normal'
    },
    {
      checkpoint: 'Checkpoint #03: Nectar Bay Marina Promenade Deck',
      scannedAt: '38 mins ago',
      guard: 'Guard Sunil Yadav',
      status: 'Verified Normal'
    },
    {
      checkpoint: 'Checkpoint #04: Underground Basement 2 EV Charging Grid',
      scannedAt: '52 mins ago',
      guard: 'Guard Anand Verma',
      status: 'Verified Normal'
    }
  ];

  const handleCreatePass = (e) => {
    e.preventDefault();
    if (!visitorName.trim()) return;
    const newPass = {
      id: `VIS-${Math.floor(9100 + Math.random() * 500)}`,
      name: visitorName,
      purpose: visitorPurpose,
      flat: `Flat ${visitorFlat}`,
      host: 'Chief Resident Admin',
      gate: 'Main Gate 1',
      vehicle: 'Walk-in / Cab',
      timeIn: 'Just now',
      timeOut: null,
      status: 'Inside',
      verifiedBy: 'Instant Digital Pass'
    };
    setVisitorLogs([newPass, ...visitorLogs]);
    setIsVisitorModalOpen(false);
    setVisitorName('');
    addToast('Visitor Pass Issued', `Digital entry barcode generated for ${visitorName}`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34D399',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}
            >
              24/7 PERIMETER & GATE COMMAND
            </span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>3 Automated RFID Gates Active</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Security & Gate Access Control
          </h1>
          <p style={{ margin: '0.3rem 0 0', color: '#8FA3CB', fontSize: '13.5px' }}>
            Live visitor authorization, ANPR vehicle boom barriers, domestic staff biometric roster, and guard patrol checkpoints.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={() => {
              addToast('Emergency Alert Broadcast', 'Security desk SOS alert transmitted to all gate outposts.', 'info');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ShieldAlert size={16} /> Broadcast SOS
          </button>
          <button
            onClick={() => setIsVisitorModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Plus size={16} /> Issue Visitor Pass
          </button>
        </div>
      </div>

      {/* 2. Key Security KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>ACTIVE VISITORS INSIDE</span>
            <Users size={16} color="#60A5FA" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            18 Visitors
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>All verified via Host OTP</div>
        </div>

        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>ANPR BOOM BARRIER</span>
            <Car size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            100% Operational
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Avg scan latency: 0.4 sec</div>
        </div>

        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>GUARDS ON DUTY</span>
            <ShieldCheck size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            18 / 24 On Post
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Shift Supervisor: Capt. Chauhan</div>
        </div>

        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>PATROL CHECKPOINTS</span>
            <Radio size={16} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FBBF24', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            12 / 12 Scanned
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Next round in 20 minutes</div>
        </div>
      </div>

      {/* 3. Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.25rem' }}>
        {[
          { id: 'gate-log', label: 'Live Visitor Log' },
          { id: 'anpr', label: 'ANPR Vehicle Barrier' },
          { id: 'daily-staff', label: 'Daily Staff (Maids / Drivers)' },
          { id: 'patrols', label: 'Guard Patrol Telemetry' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: activeTab === t.id ? '#1D4ED8' : 'transparent',
              color: activeTab === t.id ? '#FFFFFF' : '#8FA3CB',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'gate-log' && (
        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ background: '#060E24', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#8FA3CB' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Pass ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Visitor Details</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Destination & Host</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Entry Gate</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Vehicle</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Check-In Time</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visitorLogs.map(vis => (
                  <tr
                    key={vis.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                  >
                    <td style={{ padding: '0.85rem 1rem', color: '#60A5FA', fontWeight: 700 }}>
                      {vis.id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{vis.name}</div>
                      <div style={{ color: '#8FA3CB', fontSize: '11px' }}>{vis.purpose} • {vis.verifiedBy}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ color: '#FFFFFF' }}>{vis.flat}</div>
                      <div style={{ color: '#64748B', fontSize: '11px' }}>Host: {vis.host}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#94A3B8' }}>
                      {vis.gate}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#E2E8F0', fontFamily: 'monospace' }}>
                      {vis.vehicle}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#8FA3CB' }}>
                      {vis.timeIn}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          background: vis.status === 'Inside' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                          border: `1px solid ${vis.status === 'Inside' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                          color: vis.status === 'Inside' ? '#34D399' : '#94A3B8',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        {vis.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      {vis.status === 'Inside' ? (
                        <button
                          onClick={() => {
                            setVisitorLogs(visitorLogs.map(v => v.id === vis.id ? { ...v, status: 'Checked Out', timeOut: 'Just now' } : v));
                            addToast('Visitor Checked Out', `${vis.name} checked out at ${vis.gate}`, 'info');
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            background: '#1E3A8A',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Check Out
                        </button>
                      ) : (
                        <span style={{ color: '#64748B', fontSize: '11.5px' }}>Departed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'anpr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {anprVehicles.map(veh => (
            <div
              key={veh.id}
              style={{
                background: '#091536',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    background: '#060E24',
                    border: '2px solid #2563EB',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '16px',
                    letterSpacing: '1px'
                  }}
                >
                  {veh.plate}
                </div>
                <div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14.5px' }}>{veh.resident} ({veh.flat})</div>
                  <div style={{ color: '#8FA3CB', fontSize: '12px' }}>{veh.gate} • {veh.type}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#34D399', fontWeight: 700, fontSize: '13px' }}>{veh.barrier}</div>
                  <div style={{ color: '#64748B', fontSize: '11.5px' }}>{veh.time}</div>
                </div>
                <button
                  onClick={() => addToast('Gate Barrier Command', `Boom barrier manually raised for ${veh.plate}`, 'success')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    background: '#1D4ED8',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Trigger Barrier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'daily-staff' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.1rem' }}>
          {dailyStaff.map(stf => (
            <div
              key={stf.id}
              style={{
                background: '#091536',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14.5px' }}>{stf.name}</div>
                  <div style={{ color: '#FBBF24', fontSize: '12px', fontWeight: 600 }}>{stf.role}</div>
                </div>
                <span
                  style={{
                    background: stf.status === 'On Premise' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                    border: `1px solid ${stf.status === 'On Premise' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                    color: stf.status === 'On Premise' ? '#34D399' : '#94A3B8',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {stf.status}
                </span>
              </div>

              <div style={{ background: '#060E24', padding: '0.65rem 0.75rem', borderRadius: '8px', fontSize: '12px', color: '#8FA3CB' }}>
                <div>Flats: <strong style={{ color: '#E2E8F0' }}>{stf.flatsAssigned.join(', ')}</strong></div>
                <div style={{ marginTop: '3px' }}>Badge: <span style={{ color: '#60A5FA', fontFamily: 'monospace' }}>{stf.rfidCard}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'patrols' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {patrols.map((pt, idx) => (
            <div
              key={idx}
              style={{
                background: '#091536',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14.5px' }}>{pt.checkpoint}</div>
                <div style={{ color: '#8FA3CB', fontSize: '12px', marginTop: '2px' }}>
                  Wand Scanned by: <strong style={{ color: '#E2E8F0' }}>{pt.guard}</strong> • {pt.scannedAt}
                </div>
              </div>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34D399',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700
                }}
              >
                {pt.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Issue Visitor Pass Modal */}
      {isVisitorModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem'
          }}
          onClick={() => setIsVisitorModalOpen(false)}
        >
          <div
            style={{
              background: '#091536',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#FFFFFF', fontSize: '18px', fontWeight: 800 }}>
              Issue Instant Digital Visitor Pass
            </h3>

            <form onSubmit={handleCreatePass}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', marginBottom: '0.35rem' }}>
                  Visitor Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Hasselhoff"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#060E24',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', marginBottom: '0.35rem' }}>
                    Flat Number
                  </label>
                  <input
                    type="text"
                    value={visitorFlat}
                    onChange={(e) => setVisitorFlat(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: '#060E24',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', marginBottom: '0.35rem' }}>
                    Purpose of Visit
                  </label>
                  <select
                    value={visitorPurpose}
                    onChange={(e) => setVisitorPurpose(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#060E24',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Delivery">Delivery / Courier</option>
                    <option value="Guest / Family">Guest / Family</option>
                    <option value="Cab Pickup">Cab Pickup</option>
                    <option value="Service / Repair">Service / Repair</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#CBD5E1',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    background: '#2563EB',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Authorize Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecurityScreen;
