import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';

export default function NewMaintenanceModal() {
  const {
    newMaintenanceModalApartmentId,
    setNewMaintenanceModalApartmentId,
    apartments,
    createMaintenanceRequest
  } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    apartmentId: '',
    blockId: '',
    floorId: '',
    flatNumber: '',
    category: 'Plumbing',
    priority: 'Medium',
    description: '',
    reportedBy: 'Property Desk Admin'
  });

  const [prevModalId, setPrevModalId] = useState(null);

  if (newMaintenanceModalApartmentId && newMaintenanceModalApartmentId !== prevModalId) {
    setPrevModalId(newMaintenanceModalApartmentId);
    setFormData((prev) => ({
      ...prev,
      apartmentId: newMaintenanceModalApartmentId,
      blockId: '',
      floorId: '',
      flatNumber: ''
    }));
  }

  if (!newMaintenanceModalApartmentId) return null;

  const currentApartment = apartments.find((a) => a.id === formData.apartmentId);
  const currentBlock = currentApartment?.blocks.find((b) => b.id === formData.blockId);
  const currentFloor = currentBlock?.floors.find((f) => f.id === formData.floorId);

  const categories = [
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.apartmentId) return;

    createMaintenanceRequest({
      title: formData.title,
      apartmentId: formData.apartmentId,
      apartmentName: currentApartment?.name || 'Apartment',
      blockId: formData.blockId || null,
      blockName: currentBlock?.name || (formData.blockId ? 'Selected Block' : 'Common Grounds'),
      floorId: formData.floorId || null,
      floorName: currentFloor?.name || null,
      flatNumber: formData.flatNumber || null,
      scope: formData.flatNumber ? 'Flat' : formData.blockId ? 'Block' : 'Common Area',
      category: formData.category,
      priority: formData.priority,
      description: formData.description,
      reportedBy: formData.reportedBy
    });

    setNewMaintenanceModalApartmentId(null);
  };

  return (
    <Modal
      isOpen={Boolean(newMaintenanceModalApartmentId)}
      onClose={() => setNewMaintenanceModalApartmentId(null)}
      title="Report Maintenance Issue"
      subtitle="Register an infrastructure or unit ticket linked directly to property hierarchy"
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Issue Title */}
          <div>
            <label className="form-label">Issue Summary / Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Master Bathroom Diverter Seepage"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Category & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div>
              <label className="form-label">Service Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Priority Level</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Location Hierarchy Selection */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div className="text-xs font-semibold" style={{ color: 'var(--dark-navy)' }}>
              PROPERTY LOCATION SPECIFICATION
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label">Apartment Community</label>
                <select
                  className="form-select"
                  value={formData.apartmentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apartmentId: e.target.value,
                      blockId: '',
                      floorId: '',
                      flatNumber: ''
                    })
                  }
                  required
                >
                  {apartments.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Block / Tower (Optional)</label>
                <select
                  className="form-select"
                  value={formData.blockId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      blockId: e.target.value,
                      floorId: '',
                      flatNumber: ''
                    })
                  }
                >
                  <option value="">Common Area (Entire Property)</option>
                  {currentApartment?.blocks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.blockId && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Floor (Optional)</label>
                  <select
                    className="form-select"
                    value={formData.floorId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        floorId: e.target.value,
                        flatNumber: ''
                      })
                    }
                  >
                    <option value="">Block Common Area</option>
                    {currentBlock?.floors.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.floorId && (
                  <div>
                    <label className="form-label">Flat Number (Optional)</label>
                    <select
                      className="form-select"
                      value={formData.flatNumber}
                      onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                    >
                      <option value="">Floor Common Area</option>
                      {currentFloor?.flats.map((flat) => (
                        <option key={flat.number} value={flat.number}>
                          Flat {flat.number} ({flat.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Technical Description & Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe symptoms, locations, observed leaks or noises..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Reported By */}
          <div>
            <label className="form-label">Reported By</label>
            <input
              type="text"
              className="form-input"
              value={formData.reportedBy}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setNewMaintenanceModalApartmentId(null)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Work Order
          </button>
        </div>
      </form>
    </Modal>
  );
}
