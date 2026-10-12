import React, { useState } from 'react';
import {
  UsersRound,
  Award,
  Landmark,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Share2,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Building,
  Vote,
  MessageSquare
} from 'lucide-react';

export function RwaScreen({ addToast = () => {} }) {
  const [activeTab, setActiveTab] = useState('committee'); // 'committee' | 'circulars' | 'resolutions' | 'grievances' | 'finances'
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewNoticeOpen, setIsNewNoticeOpen] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('General Notice');

  const committeeMembers = [
    {
      id: 'rwa-1',
      name: 'Dr. Arvind Swamy',
      role: 'President',
      flat: 'HCT-A-401',
      complex: 'Honeycomb Towers',
      phone: '+1 (555) 782-9901',
      email: 'president@beerwa.org',
      tenure: '2025 – 2027',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      id: 'rwa-2',
      name: 'Priya Nambiar',
      role: 'Vice President',
      flat: 'AGR-B-302',
      complex: 'Amber Grove',
      phone: '+1 (555) 345-6789',
      email: 'vp@beerwa.org',
      tenure: '2025 – 2027',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      id: 'rwa-3',
      name: 'Dr. Marcus Vance',
      role: 'General Secretary',
      flat: 'HCT-A-101',
      complex: 'Honeycomb Towers',
      phone: '+1 (555) 234-8901',
      email: 'secretary@beerwa.org',
      tenure: '2025 – 2027',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      id: 'rwa-4',
      name: 'Vikramaditya Roy',
      role: 'Treasurer',
      flat: 'NBL-A-301',
      complex: 'Nectar Bay Living',
      phone: '+1 (555) 901-2345',
      email: 'treasurer@beerwa.org',
      tenure: '2025 – 2027',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      id: 'rwa-5',
      name: 'Dr. Sarah Sterling',
      role: 'Joint Secretary (Eco & Wellness)',
      flat: 'HCT-B-201',
      complex: 'Honeycomb Towers',
      phone: '+1 (555) 456-7890',
      email: 'wellness@beerwa.org',
      tenure: '2025 – 2027',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      id: 'rwa-6',
      name: 'Elena Moreau',
      role: 'Facilities & Infrastructure Head',
      flat: 'HCT-C-103',
      complex: 'Honeycomb Towers',
      phone: '+1 (555) 678-9012',
      email: 'facilities@beerwa.org',
      tenure: '2025 – 2027',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      status: 'Active'
    }
  ];

  const [circulars, setCirculars] = useState([
    {
      id: 'CIR-2026-14',
      title: 'Annual General Body Meeting (AGM) Notice & Agenda for FY 2026-27',
      date: 'Oct 10, 2026',
      category: 'Governance',
      status: 'Published',
      downloads: 142,
      summary: 'All resident owners and registered tenants are invited to the Grand Clubhouse for the mandatory Annual General Body Meeting.'
    },
    {
      id: 'CIR-2026-13',
      title: 'Solar PV Canopy Expansion & EV Supercharger Subsidized Tariffs',
      date: 'Oct 04, 2026',
      category: 'Green Energy',
      status: 'Published',
      downloads: 98,
      summary: 'Approved installation of 120kW rooftop solar grid tie system and revision of EV charging rates to $0.11/kWh.'
    },
    {
      id: 'CIR-2026-12',
      title: 'Festival of Lights Grand Community Gala & Fireworks Guidelines',
      date: 'Sep 28, 2026',
      category: 'Social Event',
      status: 'Active',
      downloads: 184,
      summary: 'Guidelines for central courtyard cultural evening, guest parking arrangements, and eco-friendly celebration protocol.'
    },
    {
      id: 'CIR-2026-11',
      title: 'Water Cistern Cleaning & Bi-Annual Plumbing Infrastructure Audit',
      date: 'Sep 15, 2026',
      category: 'Maintenance',
      status: 'Completed',
      downloads: 112,
      summary: 'Overhead water tank sterilization schedule and scheduled pressure relief valve replacements.'
    }
  ]);

  const resolutions = [
    {
      id: 'RES-089',
      title: 'Approval of AI-Powered Biometric FaceID Turnstiles & ANPR Gates',
      proposedBy: 'Facilities Sub-Committee',
      votesInFavor: '94.2%',
      datePassed: 'Sep 02, 2026',
      status: 'Passed',
      budget: '$32,000'
    },
    {
      id: 'RES-088',
      title: 'Allocation of 10-Acre Botanical Trail Organic Herb Gardens',
      proposedBy: 'Green Initiatives Group',
      votesInFavor: '98.6%',
      datePassed: 'Aug 14, 2026',
      status: 'Passed',
      budget: '$18,500'
    },
    {
      id: 'RES-087',
      title: 'Creation of Sinking Fund Allocation for Otis Elevator Overhaul',
      proposedBy: 'Treasurer & Finance Board',
      votesInFavor: '91.8%',
      datePassed: 'Jul 22, 2026',
      status: 'Passed',
      budget: '$45,000'
    }
  ];

  const grievances = [
    {
      id: 'GRV-401',
      subject: 'EV Charging Bay Blocking by Non-EV Vehicle in Block B',
      raisedBy: 'Dr. Sarah Sterling (HCT-B-201)',
      date: '2 hours ago',
      priority: 'Urgent',
      status: 'Under Review',
      actionTaken: 'Security patrol dispatched warning ticket to vehicle'
    },
    {
      id: 'GRV-398',
      subject: 'Acoustic Soundproofing Request for Squash Courts at Night',
      raisedBy: 'David Miller (AGR-A-102)',
      date: 'Yesterday',
      priority: 'Medium',
      status: 'In Progress',
      actionTaken: 'Acoustic baffles scheduled for installation by facility team'
    },
    {
      id: 'GRV-392',
      subject: 'Pet Leash Non-Compliance near North Courtyard Playground',
      raisedBy: 'Hannah Miller (AGR-A-102)',
      date: '3 days ago',
      priority: 'Low',
      status: 'Resolved',
      actionTaken: 'Circular issued & guard posted at children play area'
    }
  ];

  const handlePublishNotice = (e) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;
    const newNotice = {
      id: `CIR-2026-${circulars.length + 15}`,
      title: newNoticeTitle,
      date: 'Just now',
      category: newNoticeCategory,
      status: 'Published',
      downloads: 0,
      summary: 'Official RWA executive resolution promulgated to all resident units via BeePortal mobile push and email notice.'
    };
    setCirculars([newNotice, ...circulars]);
    setIsNewNoticeOpen(false);
    setNewNoticeTitle('');
    addToast('Circular Published', 'Official RWA circular broadcasted to 144 resident units.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#FBBF24',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}
            >
              GOVERNANCE & SOCIETY BOARD
            </span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>Bee Community RWA Registration #RWA-CA-2024-884</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Resident Welfare Association (RWA) Portal
          </h1>
          <p style={{ margin: '0.3rem 0 0', color: '#8FA3CB', fontSize: '13.5px' }}>
            Executive management committee, official society circulars, bylaws, AGM resolutions, and community grievance resolution.
          </p>
        </div>

        <button
          onClick={() => setIsNewNoticeOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
          <Plus size={16} /> Broadcast Circular
        </button>
      </div>

      {/* 2. Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>RWA CORPUS FUND</span>
            <DollarSign size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            $482,500
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Reserve + Sinking Fund Balance</div>
        </div>

        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>COLLECTION COMPLIANCE</span>
            <TrendingUp size={16} color="#60A5FA" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#60A5FA', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            97.4%
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>140 of 144 units cleared on time</div>
        </div>

        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>ELECTED COMMITTEE</span>
            <UsersRound size={16} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            6 Officers
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Term 2025–2027 Active</div>
        </div>

        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>OPEN PETITIONS</span>
            <MessageSquare size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            3 Active
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Avg resolution SLA: 18 hrs</div>
        </div>
      </div>

      {/* 3. Sub Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.25rem' }}>
        {[
          { id: 'committee', label: 'Management Committee' },
          { id: 'circulars', label: 'Official Circulars' },
          { id: 'resolutions', label: 'AGM Resolutions' },
          { id: 'grievances', label: 'Resident Grievance Desk' }
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
      {activeTab === 'committee' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {committeeMembers.map(member => (
            <div
              key={member.id}
              style={{
                background: '#091536',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563EB' }}
                />
                <div>
                  <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '15px' }}>{member.name}</div>
                  <div style={{ color: '#FBBF24', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{member.role}</div>
                  <div style={{ color: '#8FA3CB', fontSize: '11px', marginTop: '1px' }}>{member.complex} • Unit {member.flat}</div>
                </div>
              </div>

              <div style={{ background: '#060E24', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#768EB8' }}>Tenure Period</span>
                  <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{member.tenure}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#768EB8' }}>Direct Contact</span>
                  <span style={{ color: '#60A5FA' }}>{member.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#768EB8' }}>Official Email</span>
                  <span style={{ color: '#94A3B8' }}>{member.email}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button
                  onClick={() => addToast('Communication Dispatched', `Connecting to ${member.role} (${member.phone})`, 'info')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    background: 'rgba(37, 99, 235, 0.15)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    color: '#60A5FA',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Phone size={13} /> Call
                </button>
                <button
                  onClick={() => addToast('Email Drafted', `Opening secure dispatch to ${member.email}`, 'info')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Mail size={13} /> Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'circulars' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {circulars.map(cir => (
            <div
              key={cir.id}
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
              <div style={{ flex: '1 1 450px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#60A5FA', fontSize: '11px', fontWeight: 700, background: 'rgba(37, 99, 235, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {cir.id}
                  </span>
                  <span style={{ color: '#FBBF24', fontSize: '11px', fontWeight: 600 }}>{cir.category}</span>
                  <span style={{ color: '#64748B', fontSize: '12px' }}>•</span>
                  <span style={{ color: '#8FA3CB', fontSize: '12px' }}>{cir.date}</span>
                </div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#FFFFFF', fontSize: '15px', fontWeight: 700 }}>
                  {cir.title}
                </h4>
                <p style={{ margin: 0, color: '#8FA3CB', fontSize: '12.5px', lineHeight: 1.4 }}>
                  {cir.summary}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => addToast('Notice Downloaded', `PDF document ${cir.id}.pdf saved`, 'success')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.5rem 0.95rem',
                    borderRadius: '6px',
                    background: '#1D4ED8',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={13} /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'resolutions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {resolutions.map(res => (
            <div
              key={res.id}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#34D399', fontSize: '11px', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {res.id} • {res.status}
                  </span>
                  <span style={{ color: '#8FA3CB', fontSize: '12px' }}>Passed {res.datePassed}</span>
                </div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#FFFFFF', fontSize: '15px', fontWeight: 700 }}>
                  {res.title}
                </h4>
                <div style={{ color: '#768EB8', fontSize: '12px' }}>
                  Proposed by: <strong style={{ color: '#E2E8F0' }}>{res.proposedBy}</strong> • Budget Allocated: <strong style={{ color: '#34D399' }}>{res.budget}</strong>
                </div>
              </div>

              <div style={{ background: '#060E24', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'right' }}>
                <div style={{ color: '#768EB8', fontSize: '11px' }}>VOTES IN FAVOR</div>
                <div style={{ color: '#34D399', fontWeight: 800, fontSize: '18px', fontFamily: "'Outfit', sans-serif" }}>{res.votesInFavor}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'grievances' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {grievances.map(grv => (
            <div
              key={grv.id}
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
              <div style={{ flex: '1 1 450px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#FBBF24', fontSize: '11px', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {grv.id}
                  </span>
                  <span style={{ color: grv.priority === 'Urgent' ? '#F87171' : '#60A5FA', fontSize: '11px', fontWeight: 700 }}>
                    {grv.priority} Priority
                  </span>
                  <span style={{ color: '#64748B', fontSize: '12px' }}>•</span>
                  <span style={{ color: '#8FA3CB', fontSize: '12px' }}>{grv.date}</span>
                </div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#FFFFFF', fontSize: '15px', fontWeight: 700 }}>
                  {grv.subject}
                </h4>
                <div style={{ color: '#768EB8', fontSize: '12px' }}>
                  Submitted by: {grv.raisedBy}
                </div>
                <div style={{ color: '#38BDF8', fontSize: '12px', marginTop: '0.35rem' }}>
                  Action: {grv.actionTaken}
                </div>
              </div>

              <span
                style={{
                  background: grv.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  border: `1px solid ${grv.status === 'Resolved' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  color: grv.status === 'Resolved' ? '#34D399' : '#60A5FA',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700
                }}
              >
                {grv.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Notice Modal */}
      {isNewNoticeOpen && (
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
          onClick={() => setIsNewNoticeOpen(false)}
        >
          <div
            style={{
              background: '#091536',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#FFFFFF', fontSize: '18px', fontWeight: 800 }}>
              Broadcast RWA Official Notice
            </h3>

            <form onSubmit={handlePublishNotice}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', marginBottom: '0.35rem' }}>
                  Notice Heading / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mandatory Water Shutoff for Valve Upgrades..."
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', marginBottom: '0.35rem' }}>
                  Category
                </label>
                <select
                  value={newNoticeCategory}
                  onChange={(e) => setNewNoticeCategory(e.target.value)}
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
                  <option value="Governance">Governance & AGM</option>
                  <option value="Maintenance">Infrastructure & Maintenance</option>
                  <option value="Green Energy">Solar & EV Guidelines</option>
                  <option value="Social Event">Cultural & Community Celebration</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewNoticeOpen(false)}
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
                  Promulgate to Society
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RwaScreen;
