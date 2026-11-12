import React, { useState, useMemo } from 'react';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Eye } from 'lucide-react';

export default function MaintenanceList({ apartmentId = null, blockId = null }) {
  const {
    maintenanceRequests,
    apartments,
    setMaintenanceDetailModalRequest,
    setNewMaintenanceModalApartmentId
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedApartmentFilter, setSelectedApartmentFilter] = useState(apartmentId || 'ALL');

  const categories = [
    'ALL',
    'Plumbing',
    'Electrical repairs',
    'Lift maintenance',
    'Gardening and landscaping',
    'Fountain and water-feature maintenance',
    'Water pumps',
    'Cleaning and sanitation',
    'Painting',
    'Common-area repairs',
    'AC and Appliance Repair',
    'Other facility issues'
  ];

  const priorities = ['ALL', 'High', 'Medium', 'Low'];
  const statuses = ['ALL', 'Reported', 'Pending Assignment', 'Assigned', 'In Progress', 'Completed'];

  const filteredRequests = useMemo(() => {
    return maintenanceRequests.filter((req) => {
      // 1. STRICT SCOPE FILTER: Show ONLY property-level structure & facilities
      // (Apartment / Community, Block / Tower, Floor, Common areas/facilities).
      // Exclude individual flat/unit-level issues (e.g. Flat 101, Flat 202, private interiors).
      const scope = (req.scope || '').toLowerCase().trim();
      if (scope === 'flat' || scope === 'unit' || scope === 'private' || req.flatNumber || req.flatId) {
        return false;
      }

      // 2. Apartment filter
      if (apartmentId && req.apartmentId !== apartmentId) return false;
      if (!apartmentId && selectedApartmentFilter !== 'ALL' && req.apartmentId !== selectedApartmentFilter) return false;

      // 3. Block filter
      if (blockId && req.blockId !== blockId) return false;

      // 4. Category filter
      if (selectedCategory !== 'ALL' && req.category !== selectedCategory) return false;

      // 5. Priority filter
      if (selectedPriority !== 'ALL' && req.priority !== selectedPriority) return false;

      // 6. Status filter
      if (selectedStatus !== 'ALL' && req.status !== selectedStatus) return false;

      // 7. Search text
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = req.title.toLowerCase().includes(q);
        const matchesDesc = req.description?.toLowerCase().includes(q);
        const matchesAgency = req.assignedAgencyName?.toLowerCase().includes(q);
        const matchesLocation =
          req.apartmentName.toLowerCase().includes(q) ||
          (req.blockName && req.blockName.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesAgency && !matchesLocation) return false;
      }

      return true;
    });
  }, [
    maintenanceRequests,
    apartmentId,
    blockId,
    selectedApartmentFilter,
    selectedCategory,
    selectedPriority,
    selectedStatus,
    search
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Controls Bar: Search & Filters */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Search Field */}
          <div className="search-wrapper" style={{ flex: '1 1 260px' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search by title, location, agency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* New Issue Button */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setNewMaintenanceModalApartmentId(apartmentId || apartments[0]?.id)}
          >
            <Plus size={16} />
            Report Issue
          </button>
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {!apartmentId && (
            <div style={{ minWidth: '160px' }}>
              <select
                className="form-select"
                value={selectedApartmentFilter}
                onChange={(e) => setSelectedApartmentFilter(e.target.value)}
              >
                <option value="ALL">All Apartments</option>
                {apartments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ minWidth: '150px' }}>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: '120px' }}>
            <select
              className="form-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p === 'ALL' ? 'All Priorities' : `${p} Priority`}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: '140px' }}>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>

          {(search || selectedCategory !== 'ALL' || selectedPriority !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setSelectedPriority('ALL');
                setSelectedStatus('ALL');
                if (!apartmentId) setSelectedApartmentFilter('ALL');
              }}
              style={{ color: 'var(--primary-blue)', fontWeight: 600 }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Maintenance Records Table */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          title="No maintenance records match your filters"
          description="Try selecting a different category or clearing search parameters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('ALL');
            setSelectedPriority('ALL');
            setSelectedStatus('ALL');
          }}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Issue & Category</th>
                <th>Location / Scope</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Agency</th>
                <th>Reported</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  {/* Issue & Category */}
                  <td style={{ maxWidth: '280px' }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: 'var(--dark-navy)',
                        fontSize: '0.84375rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => setMaintenanceDetailModalRequest(req)}
                      className="breadcrumb-link"
                    >
                      {req.title}
                    </div>
                    <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                      {req.category}
                    </div>
                  </td>

                  {/* Location / Scope (Property Level only) */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                      {req.apartmentName}
                    </div>
                    <div className="text-xs text-muted">
                      {req.blockName || 'Community Common Area'}
                      {req.floorName ? ` • ${req.floorName}` : ''}
                    </div>
                  </td>

                  {/* Priority */}
                  <td>
                    <StatusBadge status={req.priority} />
                  </td>

                  {/* Status */}
                  <td>
                    <StatusBadge status={req.status} />
                  </td>

                  {/* Assigned Agency */}
                  <td>
                    {req.assignedAgencyName ? (
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--primary-blue)', fontSize: '0.8125rem' }}>
                          {req.assignedAgencyName}
                        </div>
                        {req.assignedPersonnel && req.assignedPersonnel.length > 0 && (
                          <div className="text-xs text-muted">
                            Staff: {req.assignedPersonnel.join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted" style={{ fontStyle: 'italic' }}>
                        Not Allocated
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="text-xs text-muted">
                    {req.reportedDate}
                  </td>

                  {/* Actions: ONLY View action/icon */}
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setMaintenanceDetailModalRequest(req)}
                      title="View complete issue details"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--primary-blue)',
                        fontWeight: 600,
                        padding: '0.35rem 0.75rem'
                      }}
                    >
                      <Eye size={15} />
                      <span>View</span>
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
