import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { PROPERTY_DOCUMENT_CATEGORIES } from '../../data/constants';
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';

export default function PropertyDocumentsModal() {
  const {
    propertyDocumentsModal,
    setPropertyDocumentsModal,
    apartments,
    addPropertyDocument,
    deletePropertyDocument,
    addToast
  } = useApp();

  const { isOpen, propertyId } = propertyDocumentsModal;

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Master Plan',
    fileName: '',
    description: ''
  });

  const apartment = apartments.find((a) => a.id === propertyId);

  if (!isOpen || !apartment) return null;

  const docs = apartment.documents || [];

  const filteredDocs = docs.filter((d) => {
    if (selectedCategoryFilter !== 'ALL' && d.category !== selectedCategoryFilter) return false;
    return true;
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.name.trim()) return;

    addPropertyDocument(apartment.id, {
      name: uploadForm.name,
      category: uploadForm.category,
      fileName: uploadForm.fileName || `${uploadForm.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      description: uploadForm.description || 'Verified property document.',
      fileSize: '3.2 MB'
    });

    setUploadForm({
      name: '',
      category: 'Master Plan',
      fileName: '',
      description: ''
    });
    setIsUploading(false);
  };

  const handleSimulateDownload = (doc) => {
    addToast(`Downloading document "${doc.name}" (${doc.fileName})...`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setPropertyDocumentsModal({ isOpen: false, propertyId: null })}
      title={`${apartment.name} — Document Repository`}
      subtitle="Manage master plans, blueprints, occupancy approvals, and certificates"
      size="lg"
    >
      <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Controls Bar: Category Filter & Upload Trigger */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="text-xs font-semibold text-muted">Category:</span>
            <select
              className="form-select"
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '180px', padding: '0.35rem 0.6rem', fontSize: '0.8125rem' }}
            >
              <option value="ALL">All Categories ({docs.length})</option>
              {PROPERTY_DOCUMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsUploading(!isUploading)}
          >
            <Upload size={14} />
            {isUploading ? 'Cancel Upload' : 'Upload Document'}
          </button>
        </div>

        {/* Upload Form Expansion */}
        {isUploading && (
          <form
            onSubmit={handleUploadSubmit}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--light-blue)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-blue-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-navy)' }}>
              Upload New Property Document
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label className="text-xs font-semibold text-muted">Document Title <span style={{ color: 'var(--error)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Master Site Clearance NOC"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted">Category</label>
                <select
                  className="form-select"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                >
                  {PROPERTY_DOCUMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted">File Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. site_clearance.pdf"
                  value={uploadForm.fileName}
                  onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted">Description / Remarks</label>
              <input
                type="text"
                className="form-input"
                placeholder="Brief summary of document purpose..."
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsUploading(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
              >
                Save Document
              </button>
            </div>
          </form>
        )}

        {/* Document Preview Dialog */}
        {previewDoc && (
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--primary-blue)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--dark-navy)' }}>
                Document Preview: {previewDoc.name}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setPreviewDoc(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                height: '140px',
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: 'var(--text-secondary)'
              }}
            >
              <FileText size={36} color="var(--primary-blue)" />
              <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                {previewDoc.fileName} • {previewDoc.fileSize || '2.4 MB'}
              </div>
              <div className="text-xs text-muted">
                Official {previewDoc.category} verified for {apartment.name}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleSimulateDownload(previewDoc)}
              >
                <Download size={14} />
                Download Copy
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setPreviewDoc(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        )}

        {/* Documents Table / Card List */}
        {filteredDocs.length === 0 ? (
          <div
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-secondary)'
            }}
          >
            <FileText size={32} style={{ margin: '0 auto 0.5rem', color: 'var(--text-muted)' }} />
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>No documents found</div>
            <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
              Upload floor plans, site layouts, or occupancy certificates above.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                style={{
                  padding: '0.875rem 1rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--light-blue)',
                      color: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <FileText size={18} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-navy)' }}>
                      {doc.name}
                    </div>
                    <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.6875rem', marginRight: '0.5rem' }}>
                        {doc.category}
                      </span>
                      {doc.fileName} • {doc.fileSize || '2.4 MB'} • Uploaded {doc.uploadDate}
                    </div>
                    {doc.description && (
                      <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {doc.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPreviewDoc(doc)}
                    title="Preview Document"
                  >
                    <Eye size={15} />
                    Preview
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleSimulateDownload(doc)}
                    title="Download File"
                  >
                    <Download size={15} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => deletePropertyDocument(apartment.id, doc.id)}
                    title="Delete Document"
                  >
                    <Trash2 size={15} color="var(--error)" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="modal-footer" style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setPropertyDocumentsModal({ isOpen: false, propertyId: null })}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
