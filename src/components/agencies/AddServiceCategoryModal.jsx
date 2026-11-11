import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';

export default function AddServiceCategoryModal() {
  const {
    addServiceCategoryModal,
    setAddServiceCategoryModal,
    addServiceCategory
  } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [error, setError] = useState('');

  if (!addServiceCategoryModal.isOpen) return null;

  const handleClose = () => {
    setName('');
    setDescription('');
    setStatus('Active');
    setError('');
    setAddServiceCategoryModal({ isOpen: false, onCategoryAdded: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Service category name is required.');
      return;
    }

    const created = addServiceCategory({
      name: trimmedName,
      description: description.trim(),
      status
    });

    if (created) {
      if (typeof addServiceCategoryModal.onCategoryAdded === 'function') {
        addServiceCategoryModal.onCategoryAdded(created);
      }
      handleClose();
    }
  };

  return (
    <Modal
      isOpen={addServiceCategoryModal.isOpen}
      onClose={handleClose}
      title="Add Service Category"
      subtitle="Define a new service specialization for agency onboarding and property maintenance"
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {error && (
            <div
              style={{
                padding: '0.625rem 0.875rem',
                backgroundColor: 'var(--error-bg)',
                border: '1px solid var(--error-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--error)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="form-label">
              Service Category Name <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Solar Panel Maintenance"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                required
              />
            </div>
            <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
              This category will immediately appear across agency onboarding, filter lists, and work orders.
            </p>
          </div>

          <div>
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Operational scope, required equipment, vendor prerequisites, or SLAs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active — Available for selection</option>
              <option value="Inactive">Inactive — Hidden from new selections</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            <Plus size={16} />
            Save Category
          </button>
        </div>
      </form>
    </Modal>
  );
}
