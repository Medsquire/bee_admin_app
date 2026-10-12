import React, { useState } from 'react';
import {
  Briefcase,
  ShieldCheck,
  Sparkles,
  Wrench,
  Trees,
  Droplet,
  Zap,
  Phone,
  Mail,
  Star,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Users,
  DollarSign,
  FileText,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export function AgenciesScreen({ addToast = () => {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const [agenciesList, setAgenciesList] = useState([
    {
      id: 'AG-01',
      name: 'BeeGuard Security & Surveillance Ltd',
      category: 'Security',
      icon: ShieldCheck,
      rating: 4.9,
      staffCount: 24,
      monthlyCost: '$12,500',
      contractEnd: 'Dec 31, 2027',
      supervisor: 'Captain Ramesh Chauhan',
      phone: '+1 (555) 890-1122',
      email: 'ops@beeguard-security.com',
      slaScore: '99.4%',
      status: 'Active',
      description: '24/7 Gate access control, ANPR boom barriers, CCTV control room operations, and night perimeter patrolling.'
    },
    {
      id: 'AG-02',
      name: 'SparkleClean Facility & Housekeeping Corp',
      category: 'Housekeeping',
      icon: Sparkles,
      rating: 4.8,
      staffCount: 18,
      monthlyCost: '$8,200',
      contractEnd: 'Oct 31, 2027',
      supervisor: 'Maria Gonzalez',
      phone: '+1 (555) 432-8877',
      email: 'services@sparkleclean.io',
      slaScore: '98.2%',
      status: 'Active',
      description: 'Daily common area sanitization, waste segregation & recycling, clubhouse upkeep, and high-rise facade cleaning.'
    },
    {
      id: 'AG-03',
      name: 'Apex Elevator & Mobility AMC (Otis Partner)',
      category: 'Elevators',
      icon: Wrench,
      rating: 4.9,
      staffCount: 6,
      monthlyCost: '$6,400',
      contractEnd: 'Aug 31, 2027',
      supervisor: 'Eng. Samuel Vance',
      phone: '+1 (555) 765-4321',
      email: 'amc@apexelevator.com',
      slaScore: '99.8%',
      status: 'Active',
      description: 'Comprehensive maintenance for 6 high-speed passenger elevators, 24/7 emergency rescue hotline, and quarterly safety certifications.'
    },
    {
      id: 'AG-04',
      name: 'Verdant Landscaping & Botanical Care',
      category: 'Landscaping',
      icon: Trees,
      rating: 4.7,
      staffCount: 8,
      monthlyCost: '$4,800',
      contractEnd: 'Nov 30, 2026',
      supervisor: 'Deepak Verma',
      phone: '+1 (555) 321-9988',
      email: 'botany@verdantgardens.net',
      slaScore: '97.5%',
      status: 'Active',
      description: '10-acre botanical promenades, automated drip irrigation, organic flower beds, tree pruning, and fountain biological care.'
    },
    {
      id: 'AG-05',
      name: 'AquaPure MEP & Water Infrastructure',
      category: 'Plumbing & STP',
      icon: Droplet,
      rating: 4.8,
      staffCount: 7,
      monthlyCost: '$3,900',
      contractEnd: 'Sep 15, 2027',
      supervisor: 'Carlos Silva',
      phone: '+1 (555) 654-2211',
      email: 'mep@aquapuretech.com',
      slaScore: '98.9%',
      status: 'Active',
      description: 'Sewage Treatment Plant (STP) operation, Water Treatment (WTP) chlorine levels, overhead tank flush, and central plumbing maintenance.'
    },
    {
      id: 'AG-06',
      name: 'VoltGuard Electrical & DG Backup AMC',
      category: 'Electrical',
      icon: Zap,
      rating: 4.9,
      staffCount: 5,
      monthlyCost: '$4,200',
      contractEnd: 'Jul 31, 2027',
      supervisor: 'Ronald Weber',
      phone: '+1 (555) 987-6543',
      email: 'engineering@voltguard.org',
      slaScore: '99.1%',
      status: 'Active',
      description: 'Diesel Generator 100% backup maintenance, 33kV substation monitoring, solar inverter synchronization, and earthing audits.'
    }
  ]);

  const filteredAgencies = agenciesList.filter(ag => {
    if (categoryFilter !== 'all' && ag.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return ag.name.toLowerCase().includes(q) || ag.category.toLowerCase().includes(q) || ag.supervisor.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60A5FA',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}
            >
              CONTRACTOR & AGENCY MANAGEMENT
            </span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>6 Verified Service Agencies</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Agencies & Facility Contractors (Agencys)
          </h1>
          <p style={{ margin: '0.3rem 0 0', color: '#8FA3CB', fontSize: '13.5px' }}>
            External facility maintenance agencies, security contractors, housekeeping AMCs, and service level performance scorecards.
          </p>
        </div>

        <button
          onClick={() => {
            addToast('Onboarding Portal', 'Agency onboarding workflow launched.', 'info');
          }}
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
          <Plus size={16} /> Onboard New Agency
        </button>
      </div>

      {/* 2. Key Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>ACTIVE AGENCIES</span>
            <Briefcase size={16} color="#60A5FA" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            {agenciesList.length} Partners
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>All contracts active & compliant</div>
        </div>

        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>DEPLOYED PERSONNEL</span>
            <Users size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            68 Staff
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Guards, maids, arborists & MEP</div>
        </div>

        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>MONTHLY OUTLAY</span>
            <DollarSign size={16} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FBBF24', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            $40,000
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Funded from society maintenance</div>
        </div>

        <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>AVERAGE SLA SCORE</span>
            <TrendingUp size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            98.8%
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Exceeding 95% target threshold</div>
        </div>
      </div>

      {/* 3. Search & Filter Controls */}
      <div
        style={{
          background: '#091536',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1 1 280px', position: 'relative' }}>
          <Search size={16} color="#768EB8" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder="Search agency name, supervisor, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#060E24',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.55rem 0.85rem 0.55rem 2.25rem',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'Security', 'Housekeeping', 'Elevators', 'Landscaping', 'Plumbing & STP', 'Electrical'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                background: categoryFilter === cat ? '#1D4ED8' : '#0B1633',
                color: categoryFilter === cat ? '#FFFFFF' : '#8FA3CB',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'all' ? 'All Agencies' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Agency Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
        {filteredAgencies.map((agency) => {
          const Icon = agency.icon;
          return (
            <div
              key={agency.id}
              style={{
                background: '#091536',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'transform 0.15s ease, border-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              {/* Top Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(37, 99, 235, 0.15)',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      color: '#60A5FA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '15px', fontWeight: 800, lineHeight: 1.2 }}>
                      {agency.name}
                    </h3>
                    <div style={{ color: '#FBBF24', fontSize: '11.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                      <Star size={12} fill="#FBBF24" color="#FBBF24" /> {agency.rating} Rating • {agency.category}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34D399',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {agency.status}
                </span>
              </div>

              <p style={{ margin: 0, color: '#8FA3CB', fontSize: '12.5px', lineHeight: 1.4 }}>
                {agency.description}
              </p>

              {/* Stats Box */}
              <div style={{ background: '#060E24', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                <div>
                  <div style={{ color: '#768EB8', fontSize: '10.5px' }}>STAFF</div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px', marginTop: '2px' }}>{agency.staffCount}</div>
                </div>
                <div>
                  <div style={{ color: '#768EB8', fontSize: '10.5px' }}>PAYOUT</div>
                  <div style={{ color: '#34D399', fontWeight: 700, fontSize: '13px', marginTop: '2px' }}>{agency.monthlyCost}</div>
                </div>
                <div>
                  <div style={{ color: '#768EB8', fontSize: '10.5px' }}>SLA</div>
                  <div style={{ color: '#60A5FA', fontWeight: 700, fontSize: '13px', marginTop: '2px' }}>{agency.slaScore}</div>
                </div>
              </div>

              {/* Supervisor Info */}
              <div style={{ fontSize: '12px', color: '#8FA3CB' }}>
                Lead Supervisor: <strong style={{ color: '#FFFFFF' }}>{agency.supervisor}</strong>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button
                  onClick={() => {
                    setSelectedAgency(agency);
                    setIsContractModalOpen(true);
                  }}
                  style={{
                    flex: 1,
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
                  Contract & SLA
                </button>
                <button
                  onClick={() => addToast('Call Initiated', `Dialing ${agency.supervisor} (${agency.phone})`, 'info')}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    background: 'rgba(37, 99, 235, 0.15)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    color: '#60A5FA',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Call Supervisor"
                >
                  <Phone size={13} />
                </button>
                <button
                  onClick={() => addToast('Dispatched Task', `Work ticket dispatched to ${agency.name}`, 'success')}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '6px',
                    background: '#1D4ED8',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Dispatch
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contract & SLA Details Modal */}
      {isContractModalOpen && selectedAgency && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setIsContractModalOpen(false)}
        >
          <div
            style={{
              background: '#091536',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsContractModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#8FA3CB',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ margin: '0 0 0.5rem 0', color: '#FFFFFF', fontSize: '18px', fontWeight: 800 }}>
              {selectedAgency.name}
            </h3>
            <div style={{ color: '#60A5FA', fontSize: '12px', marginBottom: '1.25rem' }}>
              Contract ID: {selectedAgency.id}-AMC-2026 • Valid until {selectedAgency.contractEnd}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '13px' }}>
              <div style={{ background: '#060E24', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ color: '#768EB8', fontSize: '11px' }}>Scope of Service</div>
                <div style={{ color: '#FFFFFF', marginTop: '3px', lineHeight: 1.4 }}>{selectedAgency.description}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: '#060E24', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ color: '#768EB8', fontSize: '11px' }}>Monthly Retainer</div>
                  <div style={{ color: '#34D399', fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>{selectedAgency.monthlyCost}</div>
                </div>
                <div style={{ background: '#060E24', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ color: '#768EB8', fontSize: '11px' }}>SLA Performance</div>
                  <div style={{ color: '#60A5FA', fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>{selectedAgency.slaScore}</div>
                </div>
              </div>

              <div style={{ background: '#060E24', padding: '0.75rem', borderRadius: '8px' }}>
                <div style={{ color: '#768EB8', fontSize: '11px' }}>Point of Contact</div>
                <div style={{ color: '#FFFFFF', fontWeight: 600, marginTop: '2px' }}>{selectedAgency.supervisor}</div>
                <div style={{ color: '#8FA3CB', fontSize: '12px' }}>{selectedAgency.phone} • {selectedAgency.email}</div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  addToast('Contract Downloaded', `Document ${selectedAgency.id}-Agreement.pdf saved`, 'success');
                  setIsContractModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: '8px',
                  background: '#1D4ED8',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Download Master Agreement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgenciesScreen;
