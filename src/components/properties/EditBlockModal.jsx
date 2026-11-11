import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Edit2, CheckCircle2 } from 'lucide-react';

export default function EditBlockModal() {
  const { editBlockModal, setEditBlockModal, updateBlock } = useApp();
  const { isOpen, apartmentId, block } = editBlockModal;

  const [formData, setFormData] = useState({
    name: '',
    status: 'Operational'
  });

  useEffect(() => {
    if (block) {
      setFormData({
        name: block.name || '',
        status: block.status || 'Operational'
      });
    }
  }, [block]);

  if (!isOpen || !block) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    updateBlock(apartmentId, block.id, {
      name: formData.name,
      status: formData.status
    });

    setEditBlockModal({ isOpen: false, apartmentId: null, block: null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setEditBlockModal({ isOpen: false, apartmentId: null, block: null })}
      title={`Edit ${block.name}`}
      subtitle="Update tower details and operational status"
      size="sm"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Block / Tower Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Operational Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Operational">Operational</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Under Renovation">Under Renovation</option>
            </select>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditBlockModal({ isOpen: false, apartmentId: null, block: null })}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <CheckCircle2 size={16} />
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
