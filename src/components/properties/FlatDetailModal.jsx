import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { User, Plus, Edit2 } from 'lucide-react';

export default function FlatDetailModal() {
  const {
    flatDetailModalData,
    setFlatDetailModalData,
    updateFlatResident,
    maintenanceRequests,
    setAgencyAllocationRequest,
    setNewMaintenanceModalApartmentId
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: 'Vacant',
    residentType: 'Owner',
    residentName: '',
    phone: '',
    email: ''
  });
  const [prevFlatKey, setPrevFlatKey] = useState(null);

  const flatKey = flatDetailModalData
    ? `${flatDetailModalData.apartment.id}-${flatDetailModalData.block.id}-${flatDetailModalData.flat.number}`
    : null;

  if (flatKey && flatKey !== prevFlatKey) {
    setPrevFlatKey(flatKey);
    const f = flatDetailModalData.flat;
    setFormData({
      status: f.status || 'Vacant',
      residentType: f.residentType || 'Owner',
      residentName: f.residentName || '',
      phone: f.phone || '',
      email: f.email || ''
    });
    setIsEditing(false);
  }

  if (!flatDetailModalData) return null;

  const { apartment, block, floor, flat } = flatDetailModalData;

  // Find relevant maintenance requests for this specific flat
  const flatRequests = maintenanceRequests.filter(
    (req) =>
      req.apartmentId === apartment.id &&
      req.blockId === block.id &&
      String(req.flatNumber) === String(flat.number)
  );

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      status: formData.status,
      residentType: formData.status === 'Occupied' ? formData.residentType : null,
      residentName: formData.status === 'Occupied' ? formData.residentName : null,
      phone: formData.status === 'Occupied' ? formData.phone : null,
      email: formData.status === 'Occupied' ? formData.email : null
    };

    updateFlatResident(apartment.id, block.id, floor.id, flat.number, updated);
    setFlatDetailModalData((prev) => ({
      ...prev,
      flat: { ...prev.flat, ...updated }
    }));
    setIsEditing(false);
  };

  return (
    <Modal
      isOpen={Boolean(flatDetailModalData)}
      onClose={() => setFlatDetailModalData(null)}
      title={`Flat ${flat.number} Details`}
      subtitle={`${apartment.name} • ${block.name} • ${floor.name}`}
      size="md"
    >
      <div className="modal-body">
        {/* Flat Overview Header Banner */}
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--light-blue)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary-blue-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}
        >
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
              UNIT SPECIFICATION
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
              Unit {flat.number}
            </div>
            <div className="text-xs text-muted">
              {floor.name}, {block.name}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <StatusBadge status={flat.status} />
            {flat.residentType && (
              <div className="text-xs font-semibold text-muted" style={{ marginTop: '0.25rem' }}>
                Type: {flat.residentType}
              </div>
            )}
          </div>
        </div>

        {/* Resident Management Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
              Occupancy & Resident
            </h3>
            {!isEditing && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={13} />
                Edit Resident
              </button>
            )}
          </div>

          {!isEditing ? (
            flat.status === 'Occupied' ? (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--light-blue)',
                      color: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    <User size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--dark-navy)' }}>
                      {flat.residentName}
                    </div>
                    <div className="text-xs text-muted">
                      Designation: {flat.residentType}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-light)',
                    marginTop: '0.25rem'
                  }}
                >
                  <div>
                    <span className="text-xs text-muted">Phone:</span>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                      {flat.phone || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Email:</span>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                      {flat.email || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-color)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>This unit is currently Vacant</div>
                <div className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
                  No resident alloted. Click "Edit Resident" to assign an owner or tenant.
                </div>
              </div>
            )
          ) : (
            <form
              onSubmit={handleSave}
              style={{
                padding: '1.25rem',
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Occupancy Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Occupied">Occupied</option>
                    <option value="Vacant">Vacant</option>
                  </select>
                </div>
                {formData.status === 'Occupied' && (
                  <div>
                    <label className="form-label">Resident Type</label>
                    <select
                      className="form-select"
                      value={formData.residentType}
                      onChange={(e) => setFormData({ ...formData, residentType: e.target.value })}
                    >
                      <option value="Owner">Owner</option>
                      <option value="Tenant">Tenant</option>
                    </select>
                  </div>
                )}
              </div>

              {formData.status === 'Occupied' && (
                <>
                  <div>
                    <label className="form-label">Resident Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. John & Sarah Doe"
                      value={formData.residentName}
                      onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label">Contact Phone</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="resident@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Associated Maintenance Tickets for this Flat */}
        <div>
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
              Unit Maintenance Work Orders ({flatRequests.length})
            </h3>
            <button
              type="button"
              className="btn btn-subtle btn-sm"
              onClick={() => {
                setFlatDetailModalData(null);
                setNewMaintenanceModalApartmentId(apartment.id);
              }}
            >
              <Plus size={13} />
              Report Issue
            </button>
          </div>

          {flatRequests.length === 0 ? (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.8125rem'
              }}
            >
              No active maintenance tickets recorded for Flat {flat.number}.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {flatRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--dark-navy)' }}>
                      {req.title}
                    </div>
                    <div className="text-xs text-muted">
                      Category: {req.category} • Priority: {req.priority}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StatusBadge status={req.status} />
                    {req.status !== 'Assigned' && req.status !== 'Completed' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setFlatDetailModalData(null);
                          setAgencyAllocationRequest(req);
                        }}
                      >
                        Assign Agency
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setFlatDetailModalData(null)}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
