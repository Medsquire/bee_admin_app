import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Layers, Plus } from 'lucide-react';

export default function AddFloorModal() {
  const { addFloorModal, setAddFloorModal, apartments, addFloor } = useApp();
  const { isOpen, apartmentId, blockId } = addFloorModal;

  const [formData, setFormData] = useState({
    name: '',
    flatsCount: 4
  });

  const apartment = apartments.find((a) => a.id === apartmentId);
  const block = apartment?.blocks.find((b) => b.id === blockId);

  if (!isOpen || !apartment || !block) return null;

  const nextFloorNum = (block.floors?.length || 0) + 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    addFloor(apartment.id, block.id, {
      name: formData.name || `Floor ${nextFloorNum}`,
      flatsCount: Number(formData.flatsCount)
    });

    setFormData({ name: '', flatsCount: 4 });
    setAddFloorModal({ isOpen: false, apartmentId: null, blockId: null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setAddFloorModal({ isOpen: false, apartmentId: null, blockId: null })}
      title={`Add Floor to ${block.name}`}
      size="sm"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Floor Label / Designation</label>
            <input
              type="text"
              className="form-input"
              placeholder={`e.g. Floor ${nextFloorNum} or Penthouse Level`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Number of Flats on this Floor</label>
            <input
              type="number"
              min="1"
              max="20"
              className="form-input"
              value={formData.flatsCount}
              onChange={(e) => setFormData({ ...formData, flatsCount: e.target.value })}
              required
            />
            <span className="text-xs text-muted">Generates vacant units automatically</span>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setAddFloorModal({ isOpen: false, apartmentId: null, blockId: null })}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Plus size={16} />
            Add Floor
          </button>
        </div>
      </form>
    </Modal>
  );
}
