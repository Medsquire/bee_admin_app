import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Home, Plus } from 'lucide-react';

export default function AddFlatModal() {
  const { addFlatModal, setAddFlatModal, apartments, addFlat } = useApp();
  const { isOpen, apartmentId, blockId, floorId } = addFlatModal;

  const [formData, setFormData] = useState({
    number: '',
    status: 'Vacant',
    residentType: 'Owner',
    residentName: '',
    phone: '',
    email: ''
  });

  const apartment = apartments.find((a) => a.id === apartmentId);
  const block = apartment?.blocks.find((b) => b.id === blockId);
  const floor = block?.floors.find((f) => f.id === floorId);

  if (!isOpen || !apartment || !block || !floor) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.number.trim()) return;

    addFlat(apartment.id, block.id, floor.id, {
      number: formData.number,
      status: formData.status,
      residentType: formData.status === 'Occupied' ? formData.residentType : null,
      residentName: formData.status === 'Occupied' ? formData.residentName : null,
      phone: formData.status === 'Occupied' ? formData.phone : null,
      email: formData.status === 'Occupied' ? formData.email : null
    });

    setFormData({
      number: '',
      status: 'Vacant',
      residentType: 'Owner',
      residentName: '',
      phone: '',
      email: ''
    });
    setAddFlatModal({ isOpen: false, apartmentId: null, blockId: null, floorId: null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setAddFlatModal({ isOpen: false, apartmentId: null, blockId: null, floorId: null })}
      title={`Add Flat to ${floor.name}`}
      subtitle={`${apartment.name} • ${block.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Flat / Unit Number <span style={{ color: 'var(--error)' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 501 or PH-1"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Initial Occupancy Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Vacant">Vacant</option>
              <option value="Occupied">Occupied</option>
            </select>
          </div>

          {formData.status === 'Occupied' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.875rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
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

              <div>
                <label className="form-label">Resident Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Elena Vance"
                  value={formData.residentName}
                  onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="resident@emerald.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setAddFlatModal({ isOpen: false, apartmentId: null, blockId: null, floorId: null })}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Plus size={16} />
            Register Flat
          </button>
        </div>
      </form>
    </Modal>
  );
}
