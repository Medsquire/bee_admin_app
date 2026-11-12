import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { ASSIGNMENT_TYPES } from '../../data/constants';
import {
  Layers,
  Wrench,
  CheckCircle2,
  Plus,
  AlertCircle
} from 'lucide-react';

export default function PropertyAssignmentModal() {
  const {
    propertyAssignmentModal,
    setPropertyAssignmentModal,
    agencies,
    apartments,
    requestPropertyAssignment
  } = useApp();

  const { isOpen, agencyId } = propertyAssignmentModal;

  const agency = agencies.find((a) => a.id === agencyId);

  // Form State
  const [formData, setFormData] = useState({
    organization: 'Bee Property / Zivion Management',
    propertyId: '',
    propertyName: '',
    propertyCode: '',
    propertyType: 'Residential Apartment',
    propertyAddress: '',
    city: '',
    state: '',
    assignmentType: 'Single Property',
    assignedBlocks: [],
    assignedFloorsZones: 'All Floors and Core Shafts',
    assignedFacilitiesAreas: ['Main Gate & Perimeter', 'Utility Rooms'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    requestedServices: [],
    serviceDetails: '',
    expectedHours: '08:00 - 18:00 (Emergency 24/7)',
    propertyContactPerson: '',
    propertyContactNumber: '',
    propertyManagerSponsor: '',
    reason: '',
    supportingDocs: ['SLA_Draft_Agreement.pdf']
  });

  // Multiple property assignment list if user clicks "+ Add Another Property"
  const [queuedAssignments, setQueuedAssignments] = useState([]);

  useEffect(() => {
    if (isOpen && apartments.length > 0) {
      const defaultApt = apartments[0];
      const initialServices = agency?.services ? agency.services.map((s) => s.category) : agency?.categories || [];

      setFormData({
        organization: 'Bee Property / Zivion Management',
        propertyId: defaultApt.id,
        propertyName: defaultApt.name,
        propertyCode: defaultApt.code,
        propertyType: defaultApt.propertyType || 'Residential Apartment',
        propertyAddress: defaultApt.address,
        city: defaultApt.city,
        state: defaultApt.state,
        assignmentType: 'Single Property',
        assignedBlocks: (defaultApt.blocks || []).map((b) => b.id),
        assignedFloorsZones: 'All Floors and Core Shafts',
        assignedFacilitiesAreas: ['Main Gate & Perimeter', 'Common Grounds'],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2027-12-31',
        requestedServices: initialServices.slice(0, 2),
        serviceDetails: `Standing service agreement for ${agency?.name || 'Service Partner'}.`,
        expectedHours: '08:00 - 18:00 (Emergency 24/7)',
        propertyContactPerson: defaultApt.propertyManager || 'Col. Sanjeev Varma',
        propertyContactNumber: defaultApt.propertyManagerContact || '+91 9844829901',
        propertyManagerSponsor: defaultApt.propertyManager || 'Col. Sanjeev Varma',
        reason: 'Authorized property maintenance and service deployment.',
        supportingDocs: ['Contract_Proposal.pdf']
      });
      setQueuedAssignments([]);
    }
  }, [isOpen, agencyId, apartments, agency]);

  if (!isOpen || !agency) return null;

  // Selected apartment object
  const selectedApt = apartments.find((a) => a.id === formData.propertyId) || apartments[0];

  // Auto-populate when property changes
  const handlePropertyChange = (aptId) => {
    const apt = apartments.find((a) => a.id === aptId);
    if (!apt) return;

    setFormData({
      ...formData,
      propertyId: apt.id,
      propertyName: apt.name,
      propertyCode: apt.code,
      propertyType: apt.propertyType || 'Residential Apartment',
      propertyAddress: apt.address,
      city: apt.city,
      state: apt.state,
      assignedBlocks: (apt.blocks || []).map((b) => b.id),
      propertyContactPerson: apt.propertyManager || '',
      propertyContactNumber: apt.propertyManagerContact || '',
      propertyManagerSponsor: apt.propertyManager || ''
    });
  };

  // Toggle block selection
  const handleToggleBlock = (blockId) => {
    if (formData.assignedBlocks.includes(blockId)) {
      setFormData({
        ...formData,
        assignedBlocks: formData.assignedBlocks.filter((id) => id !== blockId)
      });
    } else {
      setFormData({
        ...formData,
        assignedBlocks: [...formData.assignedBlocks, blockId]
      });
    }
  };

  // Toggle service selection (strictly filtered from agency's registered services!)
  const handleToggleService = (serviceCat) => {
    if (formData.requestedServices.includes(serviceCat)) {
      setFormData({
        ...formData,
        requestedServices: formData.requestedServices.filter((s) => s !== serviceCat)
      });
    } else {
      setFormData({
        ...formData,
        requestedServices: [...formData.requestedServices, serviceCat]
      });
    }
  };

  // Facilities options
  const facilitiesOptions = [
    'Main Gate & Perimeter',
    'Clubhouse / Community Center',
    'Swimming Pool & Deck',
    'Basements & Utility Rooms',
    'Visitor & Resident Parking',
    'Elevator Core Shafts',
    'Central Grounds & Fountain',
    'Rooftop Mechanical Stations'
  ];

  const handleToggleFacility = (fac) => {
    if (formData.assignedFacilitiesAreas.includes(fac)) {
      setFormData({
        ...formData,
        assignedFacilitiesAreas: formData.assignedFacilitiesAreas.filter((f) => f !== fac)
      });
    } else {
      setFormData({
        ...formData,
        assignedFacilitiesAreas: [...formData.assignedFacilitiesAreas, fac]
      });
    }
  };

  // Stage 1 registered services that can be requested
  const registeredServicesList = agency.services?.length > 0
    ? agency.services.map((s) => s.category)
    : agency.categories || ['Facility Management'];

  // Add another property into batch queue
  const handleAddAnotherProperty = () => {
    if (!formData.propertyId || formData.requestedServices.length === 0) return;

    setQueuedAssignments([...queuedAssignments, { ...formData }]);

    // Select another property if available
    const nextApt = apartments.find((a) => a.id !== formData.propertyId && !queuedAssignments.some((q) => q.propertyId === a.id));
    if (nextApt) {
      handlePropertyChange(nextApt.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.propertyId || formData.requestedServices.length === 0) return;

    // Submit current assignment
    requestPropertyAssignment(agency.id, formData);

    // Submit any queued multiple property assignments
    queuedAssignments.forEach((q) => {
      requestPropertyAssignment(agency.id, q);
    });

    setPropertyAssignmentModal({ isOpen: false, agencyId: null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setPropertyAssignmentModal({ isOpen: false, agencyId: null })}
      title={`Request Property Assignment — ${agency.name}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Important Rule Banner */}
          <div
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: '#EFF6FF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #BFDBFE',
              fontSize: '0.75rem',
              color: '#1E40AF',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>
              <strong>STAGE 2 PROPERTY ASSIGNMENT:</strong> An agency may register company details once and subsequently request access to one or more communities. Only services registered in Stage 1 may be selected. Property access activates only after Zivion Admin approval.
            </span>
          </div>

          {/* Section 7. Property Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
              7. Target Property Selection
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Managing Organization</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.organization}
                  disabled
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label className="form-label">Property Community <span style={{ color: 'var(--error)' }}>*</span></label>
                <select
                  className="form-select"
                  value={formData.propertyId}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  required
                >
                  {apartments.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.name} ({apt.code}) — {apt.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Property Code (Auto-populated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.propertyCode}
                  disabled
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label className="form-label">Property Type (Auto-populated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.propertyType}
                  disabled
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Property Address & Location (Auto-populated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={`${formData.propertyAddress}, ${formData.city}, ${formData.state}`}
                  disabled
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label className="form-label">Assignment Type <span style={{ color: 'var(--error)' }}>*</span></label>
                <select
                  className="form-select"
                  value={formData.assignmentType}
                  onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value })}
                >
                  {ASSIGNMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Assignment Start Date <span style={{ color: 'var(--error)' }}>*</span></label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Assignment End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Towers / Blocks Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              Assigned Towers / Blocks in {selectedApt?.name} <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(selectedApt?.blocks || []).map((b) => {
                const isSelected = formData.assignedBlocks.includes(b.id);
                return (
                  <button
                    key={b.id}
                    type="button"
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleToggleBlock(b.id)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    <Layers size={13} />
                    {b.name} ({b.floorsCount} Floors)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assigned Facilities / Areas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              Assigned Facilities & Operational Zones
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {facilitiesOptions.map((fac) => {
                const isSelected = formData.assignedFacilitiesAreas.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleToggleFacility(fac)}
                    style={{
                      fontSize: '0.75rem',
                      border: '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'var(--primary-blue)' : '#FFFFFF'
                    }}
                  >
                    {fac}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services to Be Provided (Multi-select from Stage 1 services) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Services to Be Provided at This Property <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <p className="text-xs text-muted">
                Only services registered by {agency.name} in Stage 1 are selectable.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {registeredServicesList.map((srvCat) => {
                const isSelected = formData.requestedServices.includes(srvCat);
                return (
                  <button
                    key={srvCat}
                    type="button"
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleToggleService(srvCat)}
                    style={{ fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    <Wrench size={13} />
                    {srvCat}
                  </button>
                );
              })}
            </div>
            {formData.requestedServices.length === 0 && (
              <span className="text-xs font-semibold" style={{ color: 'var(--error)' }}>
                Please select at least one service category.
              </span>
            )}
          </div>

          {/* Additional Service & Management Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Expected Service Hours</label>
              <input
                type="text"
                className="form-input"
                value={formData.expectedHours}
                onChange={(e) => setFormData({ ...formData, expectedHours: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Property Manager / Sponsor</label>
              <input
                type="text"
                className="form-input"
                value={formData.propertyManagerSponsor}
                onChange={(e) => setFormData({ ...formData, propertyManagerSponsor: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Property Contact Person</label>
              <input
                type="text"
                className="form-input"
                value={formData.propertyContactPerson}
                onChange={(e) => setFormData({ ...formData, propertyContactPerson: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Property Contact Number</label>
              <input
                type="tel"
                className="form-input"
                value={formData.propertyContactNumber}
                onChange={(e) => setFormData({ ...formData, propertyContactNumber: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Reason for Assignment</label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="Scope of works, scheduled maintenance, or security post requirement..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
          </div>

          {/* Queued Multiple Property Assignments */}
          {queuedAssignments.length > 0 && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.4rem' }}>
                ADDITIONAL PROPERTIES IN BATCH ({queuedAssignments.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {queuedAssignments.map((q, idx) => (
                  <div key={idx} style={{ fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>{q.propertyName}</strong> — {q.requestedServices.join(', ')}</span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => setQueuedAssignments(queuedAssignments.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* + Add Another Property Button strictly matching PRD Section 5.G & docx Section 8 */}
          <div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddAnotherProperty}
            >
              <Plus size={14} />
              Add Another Property Assignment
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="modal-footer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            flexShrink: 0
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPropertyAssignmentModal({ isOpen: false, agencyId: null })}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            <CheckCircle2 size={16} />
            Submit Assignment Request ({queuedAssignments.length + 1} Properties)
          </button>
        </div>
      </form>
    </Modal>
  );
}
