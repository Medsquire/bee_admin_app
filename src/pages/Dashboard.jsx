import React from 'react';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Layers,
  Home,
  CheckCircle2,
  Clock,
  Briefcase,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  MapPin,
  FileText,
  UserCheck
} from 'lucide-react';

export default function Dashboard() {
  const {
    metrics,
    apartments,
    maintenanceRequests,
    agencies,
    activities,
    navigateTo,
    setAgencyAllocationRequest,
    setMaintenanceDetailModalRequest,
    setRegistrationReviewModal,
    setAssignmentApprovalModal,
    setAgencyDetailModalId
  } = useApp();

  const recentMaintenance = maintenanceRequests.slice(0, 5);

  const agencyCategoriesSummary = React.useMemo(() => {
    const map = {};
    agencies.forEach((ag) => {
      (ag.categories || []).forEach((cat) => {
        map[cat] = (map[cat] || 0) + 1;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [agencies]);

  const recentAssignments = React.useMemo(() => {
    const list = [];
    agencies.forEach((ag) => {
      if (ag.assignments) {
        ag.assignments.forEach((as) => {
          list.push({ ...as, agencyName: ag.name, agencyCategory: ag.category, agencyId: ag.id });
        });
      }
    });
    return list.slice(0, 4);
  }, [agencies]);

  // Pending approval requests for quick admin action
  const pendingRegistrations = React.useMemo(() => {
    return agencies.filter(
      (ag) => ag.registrationStatus === 'Submitted' || ag.registrationStatus === 'Under Review'
    );
  }, [agencies]);

  const pendingPropertyAssignments = React.useMemo(() => {
    const list = [];
    agencies.forEach((ag) => {
      (ag.propertyAssignments || []).forEach((pa) => {
        if (pa.status === 'Submitted for Approval' || pa.status === 'Under Review') {
          list.push({ ...pa, agencyId: ag.id, agencyName: ag.name });
        }
      });
    });
    return list;
  }, [agencies]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment':
      case 'assignment_request':
        return <Wrench size={14} color="#2563EB" />;
      case 'maintenance':
        return <AlertTriangle size={14} color="#D97706" />;
      case 'security':
        return <ShieldCheck size={14} color="#16A34A" />;
      case 'rwa':
        return <FileText size={14} color="#6366F1" />;
      case 'approval':
      case 'assignment_approval':
        return <UserCheck size={14} color="#2563EB" />;
      case 'property':
        return <Building2 size={14} color="#0F172A" />;
      default:
        return <CheckCircle2 size={14} color="#16A34A" />;
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* SECTION A: Summary Cards (8 KPI Cards strictly matching PRD Section 3.A) */}
      <section aria-label="KPI Summary Cards">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}
        >
          <StatCard
            title="Total Apartments"
            value={metrics.totalApartments}
            icon={Building2}
            color="navy"
            onClick={() => navigateTo('properties')}
          />
          <StatCard
            title="Total Blocks/Towers"
            value={metrics.totalBlocks}
            icon={Layers}
            color="blue"
            onClick={() => navigateTo('properties')}
          />
          <StatCard
            title="Total Flats"
            value={metrics.totalFlats}
            icon={Home}
            color="blue"
            onClick={() => navigateTo('properties')}
          />
          <StatCard
            title="Occupied Flats"
            value={metrics.occupiedFlats}
            icon={CheckCircle2}
            color="green"
            subtitle={`${metrics.totalFlats > 0 ? Math.round((metrics.occupiedFlats / metrics.totalFlats) * 100) : 0}% occupancy`}
            onClick={() => navigateTo('properties')}
          />
          <StatCard
            title="Vacant Flats"
            value={metrics.vacantFlats}
            icon={Clock}
            color="amber"
            subtitle="Ready for leasing"
            onClick={() => navigateTo('properties')}
          />
          <StatCard
            title="Active Agencies"
            value={metrics.activeAgencies}
            icon={Briefcase}
            color="purple"
            subtitle={`${metrics.availableAgencies} available`}
            onClick={() => navigateTo('agencies')}
          />
          <StatCard
            title="Pending Agency Approvals"
            value={metrics.pendingApprovals}
            icon={UserCheck}
            color={metrics.pendingApprovals > 0 ? 'amber' : 'green'}
            subtitle={`${metrics.pendingAgencyRegistrations} reg • ${metrics.pendingPropertyAssignments} assign`}
            onClick={() => navigateTo('agencies')}
          />
          <StatCard
            title="Active Maintenance Requests"
            value={metrics.activeMaintenanceRequests}
            icon={Wrench}
            color="amber"
            subtitle="Pending / In Progress"
            onClick={() => navigateTo('properties', { tab: 'maintenance' })}
          />
        </div>
      </section>

      {/* SECTION B: Property Overview strictly matching PRD Section 3.B */}
      <section aria-label="Property Overview">
        <div className="section-header">
          <div>
            <h2>Registered Apartment Communities</h2>
            <p className="text-xs text-muted">
              Live status, occupancy metrics, and architecture across all developments
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigateTo('properties')}
          >
            Explore Hierarchy
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {apartments.map((apartment) => {
            const occupancyRate = apartment.totalFlats > 0
              ? Math.round((apartment.occupiedFlats / apartment.totalFlats) * 100)
              : 0;

            return (
              <div
                key={apartment.id}
                className="card card-interactive"
                onClick={() => navigateTo('properties', { apartmentId: apartment.id })}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                  <img
                    src={apartment.image}
                    alt={apartment.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <StatusBadge status={apartment.rwaStatus === 'Active' ? 'Active' : 'Not Registered'} />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      right: '0.75rem',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      color: '#FFFFFF',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {occupancyRate}% Occupied
                  </div>
                </div>

                {/* Content */}
                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                      {apartment.name}
                    </h3>
                    <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                      <MapPin size={12} color="var(--primary-blue)" />
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {apartment.address}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span><strong>{apartment.totalBlocks || (apartment.blocks?.length || 0)}</strong> Blocks</span>
                    <span>•</span>
                    <span><strong>{apartment.totalFlats}</strong> Flats</span>
                    <span>•</span>
                    <span style={{ color: 'var(--success)' }}><strong>{apartment.occupiedFlats}</strong> Occupied</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid var(--border-light)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--primary-blue)'
                    }}
                  >
                    <span>View Property Hierarchy</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2-Column Section: Maintenance & Agency Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
        {/* SECTION C: Maintenance Overview strictly matching PRD Section 3.C */}
        <section aria-label="Maintenance Overview" className="card" style={{ padding: '1.25rem' }}>
          <div className="section-header" style={{ marginBottom: '0.875rem' }}>
            <div>
              <h2>Recent Maintenance Requests</h2>
              <p className="text-xs text-muted">Real-time status of reported work orders</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigateTo('properties', { tab: 'maintenance' })}
            >
              All Tickets ({maintenanceRequests.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {recentMaintenance.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      color: 'var(--dark-navy)',
                      cursor: 'pointer',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                    className="breadcrumb-link"
                    onClick={() => setMaintenanceDetailModalRequest(req)}
                  >
                    {req.title}
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                    {req.apartmentName} • {req.blockName || 'Common Grounds'} • {req.category}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <StatusBadge status={req.status} />
                  {req.status !== 'Assigned' && req.status !== 'Completed' ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setAgencyAllocationRequest(req)}
                    >
                      Assign
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION D: Agency Overview strictly matching PRD Section 3.D */}
        <section aria-label="Agency Overview" className="card" style={{ padding: '1.25rem' }}>
          <div className="section-header" style={{ marginBottom: '0.875rem' }}>
            <div>
              <h2>Agency Overview & Approvals</h2>
              <p className="text-xs text-muted">Service partners, availability & approvals</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigateTo('agencies')}
            >
              Manage Agencies
            </button>
          </div>

          {/* Allocation metric 5 pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
              gap: '0.5rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                padding: '0.5rem',
                backgroundColor: 'var(--light-blue)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--primary-blue-border)'
              }}
            >
              <div className="text-xs" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
                Total
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                {agencies.length}
              </div>
            </div>

            <div
              style={{
                padding: '0.5rem',
                backgroundColor: '#DCFCE7',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #BBF7D0'
              }}
            >
              <div className="text-xs" style={{ color: 'var(--success)', fontWeight: 600 }}>
                Active
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)' }}>
                {metrics.activeAgencies}
              </div>
            </div>

            <div
              style={{
                padding: '0.5rem',
                backgroundColor: '#EFF6FF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #BFDBFE'
              }}
            >
              <div className="text-xs" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
                Available
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                {metrics.availableAgencies}
              </div>
            </div>

            <div
              style={{
                padding: '0.5rem',
                backgroundColor: '#FEF3C7',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #FDE68A'
              }}
            >
              <div className="text-xs" style={{ color: 'var(--warning)', fontWeight: 600 }}>
                Pending
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--warning)' }}>
                {metrics.pendingApprovals}
              </div>
            </div>

            <div
              style={{
                padding: '0.5rem',
                backgroundColor: '#F1F5F9',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div className="text-xs text-muted font-semibold">Allocated</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                {metrics.totalAllocatedPersonnel}
              </div>
            </div>
          </div>

          {/* Pending Approval Requests with Action Buttons */}
          {(pendingRegistrations.length > 0 || pendingPropertyAssignments.length > 0) && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--warning)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={13} />
                APPROVAL REQUESTS REQUIRING ATTENTION ({metrics.pendingApprovals})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pendingRegistrations.map((ag) => (
                  <div
                    key={ag.id}
                    style={{
                      padding: '0.625rem 0.875rem',
                      backgroundColor: '#FFFBEB',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #FDE68A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--dark-navy)' }}>
                        {ag.name}
                      </div>
                      <div className="text-xs text-muted">
                        Registration Application • Ref: {ag.registrationRefNumber}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => setRegistrationReviewModal({ isOpen: true, agencyId: ag.id })}
                    >
                      Review Registration
                    </button>
                  </div>
                ))}

                {pendingPropertyAssignments.map((pa) => (
                  <div
                    key={pa.id}
                    style={{
                      padding: '0.625rem 0.875rem',
                      backgroundColor: '#EFF6FF',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #BFDBFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--dark-navy)' }}>
                        {pa.agencyName}
                      </div>
                      <div className="text-xs text-muted">
                        Assignment Request • {pa.propertyName}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        setAssignmentApprovalModal({
                          isOpen: true,
                          agencyId: pa.agencyId,
                          assignmentId: pa.id
                        })
                      }
                    >
                      Review Assignment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Agency Assignments */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.4rem' }}>
              RECENT SERVICE ASSIGNMENTS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentAssignments.map((as, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.625rem 0.875rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem'
                  }}
                >
                  <div>
                    <div
                      style={{ fontWeight: 700, color: 'var(--dark-navy)', cursor: 'pointer' }}
                      className="breadcrumb-link"
                      onClick={() => setAgencyDetailModalId(as.agencyId)}
                    >
                      {as.agencyName}
                    </div>
                    <div className="text-xs text-muted">
                      {as.type} • {as.property}
                    </div>
                  </div>
                  <span className="badge badge-blue">{as.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Allocation Pills */}
          <div>
            <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.4rem' }}>
              SERVICE COVERAGE BY CATEGORY
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {agencyCategoriesSummary.slice(0, 6).map(([cat, count]) => (
                <span key={cat} className="badge badge-slate" style={{ fontSize: '0.6875rem' }}>
                  {cat}: {count}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* SECTION E: Recent Activity strictly matching PRD Section 3.E */}
      <section aria-label="Recent Activity" className="card" style={{ padding: '1.25rem' }}>
        <div className="section-header" style={{ marginBottom: '0.875rem' }}>
          <div>
            <h2>Recent Activity Feed</h2>
            <p className="text-xs text-muted">Real-time audit log of system actions and modifications</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {activities.slice(0, 6).map((activity) => (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.875rem',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#F8FAFC'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.1rem'
                }}
              >
                {getActivityIcon(activity.type)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--dark-navy)' }}>
                    {activity.title}
                  </span>
                  <span className="text-xs text-muted">{activity.time}</span>
                </div>
                <p className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
