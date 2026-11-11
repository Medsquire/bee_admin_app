import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Layers, Plus, CheckCircle2 } from 'lucide-react';

export default function AddBlockModal() {
  const { addBlockModal, setAddBlockModal, apartments, addBlock } = useApp();
  const { isOpen, apartmentId } = addBlockModal;

  const [formData, setFormData] = useState({
    name: '',
    floorsCount: 4,
    flatsPerFloor: 4,
    status: 'Operational'
  });

  const apartment = apartments.find((a) => a.id === apartmentId);

  if (!isOpen || !apartment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addBlock(apartment.id, {
      name: formData.name,
      floorsCount: Number(formData.floorsCount),
      flatsPerFloor: Number(formData.flatsPerFloor),
      status: formData.status
    });

    setFormData({ name: '', floorsCount: 4, flatsPerFloor: 4, status: 'Operational' });
    setAddBlockModal({ isOpen: false, apartmentId: null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setAddBlockModal({ isOpen: false, apartmentId: null })}
      title={`Add Block / Tower — ${apartment.name}`}
      subtitle="Expand community with new residential tower with configurable floor count"
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Block / Tower Name <span style={{ color: 'var(--error)' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Tower D (Sapphire Wing)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Total Floors in Tower</label>
              <input
                type="number"
                min="1"
                max="100"
                className="form-input"
                value={formData.floorsCount}
                onChange={(e) => setFormData({ ...formData, floorsCount: e.target.value })}
                required
              />
              <span className="text-xs text-muted">Supports custom floor count per block</span>
            </div>

            <div>
              <label className="form-label">Flats Per Floor</label>
              <input
                type="number"
                min="1"
                max="20"
                className="form-input"
                value={formData.flatsPerFloor}
                onChange={(e) => setFormData({ ...formData, flatsPerFloor: e.target.value })}
                required
              />
              <span className="text-xs text-muted">Auto-generates unit numbers</span>
            </div>
          </div>

          <div>
            <label className="form-label">Operational Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Operational">Operational</option>
              <option value="Under Finishing">Under Finishing</option>
              <option value="Expansion Phase">Expansion Phase</option>
            </select>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setAddBlockModal({ isOpen: false, apartmentId: null })}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Plus size={16} />
            Add Tower to Property
          </button>
        </div>
      </form>
    </Modal>
  );
}
