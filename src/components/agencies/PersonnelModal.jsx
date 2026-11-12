import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { User, CheckCircle2 } from 'lucide-react';

export default function PersonnelModal() {
  const { personnelModal, setPersonnelModal, agencies, addAgencyPersonnel, updateAgencyPersonnel } = useApp();
  const { isOpen, agencyId, personnel } = personnelModal;

  const agency = agencies.find((a) => a.id === agencyId);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '5 yrs',
    phone: '',
    email: '',
    status: 'Available',
    currentShift: 'Unassigned',
    assignedProperty: ''
  });

  useEffect(() => {
    if (personnel) {
      setFormData({
        name: personnel.name || '',
        role: personnel.role || '',
        experience: personnel.experience || '5 yrs',
        phone: personnel.phone || '',
        email: personnel.email || '',
        status: personnel.status || 'Available',
        currentShift: personnel.currentShift || 'Unassigned',
        assignedProperty: personnel.assignedProperty || ''
      });
    } else {
      setFormData({
        name: '',
        role: 'Field Technician',
        experience: '5 yrs',
        phone: '',
        email: '',
        status: 'Available',
        currentShift: 'Unassigned',
        assignedProperty: ''
      });
    }
  }, [personnel]);

  if (!isOpen || !agency) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (personnel) {
      updateAgencyPersonnel(agency.id, personnel.id, formData);
    } else {
      addAgencyPersonnel(agency.id, formData);
    }

    setPersonnelModal({ isOpen: false, agencyId: null, personnel: null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setPersonnelModal({ isOpen: false, agencyId: null, personnel: null })}
      title={personnel ? `Edit Staff — ${personnel.name}` : `Add Personnel to ${agency.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Anand Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Role / Designation <span style={{ color: 'var(--error)' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Master Hydraulic Plumber"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Experience</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 7 yrs"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                className="form-input"
                placeholder="staff@agency.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Availability Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="form-label">Current Shift / Assignment</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Morning Shift (06:00 - 14:00)"
                value={formData.currentShift}
                onChange={(e) => setFormData({ ...formData, currentShift: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPersonnelModal({ isOpen: false, agencyId: null, personnel: null })}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <CheckCircle2 size={16} />
            {personnel ? 'Update Staff Member' : 'Add Staff Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
