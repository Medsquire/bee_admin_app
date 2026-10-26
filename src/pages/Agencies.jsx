import React, { useState, useMemo, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import EmptyState from '../components/common/EmptyState';
import AgencyTable from '../components/agencies/AgencyTable';
import AgencyCard from '../components/agencies/AgencyCard';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES, REGISTRATION_STATUSES } from '../data/constants';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/storage';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  ShieldAlert
} from 'lucide-react';

export default function Agencies() {
  const {
    agencies,
    metrics,
    setAgencyDetailModalId,
    setAgencyOnboardingModal
  } = useApp();

  // Remember view preference from storage (default: 'cards')
  const [viewMode, setViewMode] = useState(() =>
    loadFromStorage(STORAGE_KEYS.AGENCY_VIEW, 'cards')
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AGENCY_VIEW, viewMode);
  }, [viewMode]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const availabilities = ['ALL', 'Available', 'Partially Available', 'Fully Allocated'];

  const filteredAgencies = useMemo(() => {
    return agencies.filter((agency) => {
      // Category filter
      if (
        selectedCategory !== 'ALL' &&
        !agency.categories?.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())
      ) {
        return false;
      }

      // Availability filter
      if (selectedAvailability !== 'ALL' && agency.availabilityStatus !== selectedAvailability) {
        return false;
      }

      // Registration / Agreement Status filter
      if (selectedStatus !== 'ALL') {
        if (
          agency.registrationStatus !== selectedStatus &&
          !agency.agreementStatus?.toLowerCase().includes(selectedStatus.toLowerCase())
        ) {
          return false;
        }
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = agency.name?.toLowerCase().includes(q);
        const matchesContact = agency.contactPerson?.toLowerCase().includes(q);
        const matchesRef = agency.registrationRefNumber?.toLowerCase().includes(q);
        const matchesCategory = agency.categories?.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesContact && !matchesCategory && !matchesRef) return false;
      }

      return true;
    });
  }, [agencies, selectedCategory, selectedAvailability, selectedStatus, search]);

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* SECTION A: Agency Summary KPI Cards strictly matching PRD Section 5.B */}
      <section aria-label="Agency Summary Cards">
        <div className="kpi-grid kpi-grid-5">
          <StatCard
            title="Total Registered Agencies"
            value={agencies.length}
            icon={Briefcase}
            color="navy"
          />
          <StatCard
            title="Active Service Partners"
            value={metrics.activeAgencies}
            icon={CheckCircle2}
            color="green"
            subtitle="Approved agreements"
          />
          <StatCard
            title="Available Agencies"
            value={metrics.availableAgencies}
            icon={Clock}
            color="blue"
            subtitle="Ready for dispatch"
          />
          <StatCard
            title="Pending Approvals"
            value={metrics.pendingApprovals}
            icon={ShieldAlert}
            color={metrics.pendingApprovals > 0 ? 'amber' : 'green'}
            subtitle={`${metrics.pendingAgencyRegistrations} reg • ${metrics.pendingPropertyAssignments} assign`}
          />
          <StatCard
            title="Total Allocated Personnel"
            value={metrics.totalAllocatedPersonnel}
            icon={ShieldCheck}
            color="purple"
            subtitle="Staff on site"
          />
        </div>
      </section>

      {/* Header Bar strictly matching PRD Section 5.A:
          Title, short description, search, filters, + Add Agency button, View toggle: Table / Cards */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
              Agencies & Service Partners
            </h1>
            <p className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
              Service partner onboarding, category coverage, multi-property assignments, and approvals.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* View Toggle: Cards / Table strictly matching PRD Section 5.A */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: '#F1F5F9',
                borderRadius: 'var(--radius-md)',
                padding: '0.2rem'
              }}
            >
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-sm)'
                }}
                title="Card View"
              >
                <LayoutGrid size={15} />
                Cards
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setViewMode('table')}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-sm)'
                }}
                title="Table View"
              >
                <TableIcon size={15} />
                Table
              </button>
            </div>

            {/* Add Agency Button strictly matching PRD Section 5.A */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setAgencyOnboardingModal({ isOpen: true, mode: 'create', agencyId: null })}
              style={{ fontWeight: 700 }}
            >
              <Plus size={16} />
              Add Agency
            </button>
          </div>
        </div>

        {/* Filter & Search Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div className="search-wrapper" style={{ flex: '1 1 240px' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search by agency name, contact person, ref number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Service Category Filter with 23 Categories */}
          <div style={{ minWidth: '190px' }}>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Service Categories ({SERVICE_CATEGORIES.length})</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
            >
              {availabilities.map((av) => (
                <option key={av} value={av}>
                  {av === 'ALL' ? 'All Availability' : av}
                </option>
              ))}
            </select>
          </div>

          {/* Agency Status Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Registration Statuses</option>
              {REGISTRATION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {(search || selectedCategory !== 'ALL' || selectedAvailability !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setSelectedAvailability('ALL');
                setSelectedStatus('ALL');
              }}
              style={{ color: 'var(--primary-blue)', fontWeight: 600 }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* SECTION B: Agency Directory (Toggleable Card View & Table View strictly matching PRD Section 5.A, 5.C, 5.D) */}
      {filteredAgencies.length === 0 ? (
        <EmptyState
          title="No agencies match your criteria"
          description="Adjust your search or filter selections to view available service partners."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('ALL');
            setSelectedAvailability('ALL');
            setSelectedStatus('ALL');
          }}
        />
      ) : viewMode === 'cards' ? (
        /* CARD VIEW (Default) */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredAgencies.map((agency) => (
            <AgencyCard
              key={agency.id}
              agency={agency}
              onSelect={(id) => setAgencyDetailModalId(id)}
            />
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <AgencyTable
          agencies={filteredAgencies}
          onSelectAgency={(id) => setAgencyDetailModalId(id)}
        />
      )}
    </div>
  );
}
