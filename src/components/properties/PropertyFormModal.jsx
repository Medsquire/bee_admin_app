import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_DOCUMENT_CATEGORIES
} from '../../data/constants';
import {
  Building2,
  MapPin,
  Image,
  Layers,
  FileText,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  Upload
} from 'lucide-react';
import InteractiveLocationPicker from './InteractiveLocationPicker';

export default function PropertyFormModal() {
  const {
    propertyFormModal,
    setPropertyFormModal,
    apartments,
    addProperty,
    updateProperty
  } = useApp();

  const { isOpen, mode, propertyId } = propertyFormModal;

  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'location' | 'images' | 'structure' | 'documents' | 'management'

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    propertyType: 'Residential Apartment',
    status: 'Active - Optimal',
    registrationNumber: '',
    builtYear: 2024,
    landArea: '14.5 Acres',
    description: '',
    address: '',
    address2: '',
    city: 'Emerald City',
    state: 'CA',
    zip: '94016',
    country: 'United States',
    latitude: 37.7749,
    longitude: -122.4194,
    mapLink: '',
    image: '/Images/bee-community-master.jpg',
    additionalImages: [],
    propertyManager: 'Col. Sanjeev Varma',
    propertyManagerContact: '+91 9844829901',
    rwaStatus: 'Active',
    emergencyContact: '+91 9811191121',
    internalNotes: '',
    blocks: [],
    documents: []
  });

  // State for block builder inside structure section
  const [newBlockDef, setNewBlockDef] = useState({
    name: '',
    floorsCount: 6,
    flatsPerFloor: 4
  });

  // State for document builder inside document section
  const [newDocDef, setNewDocDef] = useState({
    name: '',
    category: 'Master Plan',
    fileName: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && propertyId) {
        const apt = apartments.find((a) => a.id === propertyId);
        if (apt) {
          setFormData({
            name: apt.name || '',
            code: apt.code || '',
            propertyType: apt.propertyType || 'Residential Apartment',
            status: apt.status || 'Active - Optimal',
            registrationNumber: apt.registrationNumber || '',
            builtYear: apt.builtYear || 2024,
            landArea: apt.landArea || '',
            description: apt.description || '',
            address: apt.address || '',
            address2: apt.address2 || '',
            city: apt.city || 'Emerald City',
            state: apt.state || 'CA',
            zip: apt.zip || '',
            country: apt.country || 'United States',
            latitude: apt.latitude || (apt.coordinates ? apt.coordinates.lat : 37.7749),
            longitude: apt.longitude || (apt.coordinates ? apt.coordinates.lng : -122.4194),
            mapLink: apt.mapLink || '',
            image: apt.image || '/Images/bee-community-master.jpg',
            additionalImages: apt.additionalImages ? [...apt.additionalImages] : [],
            propertyManager: apt.propertyManager || '',
            propertyManagerContact: apt.propertyManagerContact || '',
            rwaStatus: apt.rwaStatus || 'Not Registered',
            emergencyContact: apt.emergencyContact || '',
            internalNotes: apt.internalNotes || '',
            blocks: apt.blocks ? JSON.parse(JSON.stringify(apt.blocks)) : [],
            documents: apt.documents ? JSON.parse(JSON.stringify(apt.documents)) : []
          });
        }
      } else {
        // Create mode initial state with 2 default blocks
        const initialCode = `BR-${Math.floor(100 + Math.random() * 900)}`;
        setFormData({
          name: '',
          code: initialCode,
          propertyType: 'Residential Apartment',
          status: 'Active - Optimal',
          registrationNumber: `REG-${initialCode}-2026`,
          builtYear: new Date().getFullYear(),
          landArea: '12.5 Acres',
          description: 'Modern residential community with lifestyle amenities and automated facility infrastructure.',
          address: '',
          address2: '',
          city: 'Emerald City',
          state: 'CA',
          zip: '94016',
          country: 'United States',
          latitude: 37.7749,
          longitude: -122.4194,
          mapLink: '',
          image: '/Images/bee-community-master.jpg',
          additionalImages: ['/Images/ApartmentImage.jpeg'],
          propertyManager: 'Col. Sanjeev Varma',
          propertyManagerContact: '+91 9844829901',
          rwaStatus: 'Active',
          emergencyContact: '+91 9811191121',
          internalNotes: 'Initial onboarding registration.',
          blocks: [
            {
              id: `blk-${Date.now()}-1`,
              code: 'Block-A',
              name: 'Tower A (Amber Wing)',
              floorsCount: 4,
              flatsCount: 16,
              occupiedFlats: 12,
              vacantFlats: 4,
              activeMaintenance: 0,
              status: 'Operational',
              floors: generateFloors(`blk-${Date.now()}-1`, 4, 4)
            },
            {
              id: `blk-${Date.now()}-2`,
              code: 'Block-B',
              name: 'Tower B (Emerald Pavilion)',
              floorsCount: 6, // Supports different floor counts as required by PRD!
              flatsCount: 24,
              occupiedFlats: 18,
              vacantFlats: 6,
              activeMaintenance: 0,
              status: 'Operational',
              floors: generateFloors(`blk-${Date.now()}-2`, 6, 4)
            }
          ],
          documents: [
            {
              id: `doc-${Date.now()}-1`,
              name: 'Approved Master Site Layout Plan',
              category: 'Master Plan',
              fileName: 'approved_master_layout.pdf',
              fileType: 'application/pdf',
              fileSize: '3.8 MB',
              uploadDate: new Date().toISOString().split('T')[0],
              description: 'Urban planning board approved master site demarcations and zoning.'
            },
            {
              id: `doc-${Date.now()}-2`,
              name: 'Architectural Structural Blueprints',
              category: 'Floor Plans',
              fileName: 'tower_architectural_plans.pdf',
              fileType: 'application/pdf',
              fileSize: '7.5 MB',
              uploadDate: new Date().toISOString().split('T')[0],
              description: 'Structural engineering blueprint for residential towers.'
            }
          ]
        });
      }
      setActiveTab('basic');
    }
  }, [isOpen, mode, propertyId, apartments]);

  function generateFloors(blockId, floorsCount, flatsPerFloor) {
    const floors = [];
    for (let f = 1; f <= floorsCount; f++) {
      const floorId = `${blockId}-F${f}`;
      const flats = [];
      for (let fl = 1; fl <= flatsPerFloor; fl++) {
        const num = `${f}${fl < 10 ? '0' : ''}${fl}`;
        flats.push({
          number: num,
          status: 'Vacant',
          residentType: null,
          residentName: null,
          phone: null,
          email: null,
          activeMaintenance: 0
        });
      }
      floors.push({
        id: floorId,
        floorNumber: f,
        name: `Floor ${f}`,
        totalFlats: flatsPerFloor,
        occupiedFlats: 0,
        vacantFlats: flatsPerFloor,
        activeMaintenance: 0,
        flats
      });
    }
    return floors;
  }

  if (!isOpen) return null;

  const handleAddBlockToStructure = (e) => {
    e.preventDefault();
    if (!newBlockDef.name.trim()) return;

    const blockId = `blk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const floorsCount = Number(newBlockDef.floorsCount) || 4;
    const flatsPerFloor = Number(newBlockDef.flatsPerFloor) || 4;

    const newBlock = {
      id: blockId,
      code: `Block-${newBlockDef.name.split(' ')[0]}`,
      name: newBlockDef.name,
      floorsCount,
      flatsCount: floorsCount * flatsPerFloor,
      occupiedFlats: 0,
      vacantFlats: floorsCount * flatsPerFloor,
      activeMaintenance: 0,
      status: 'Operational',
      floors: generateFloors(blockId, floorsCount, flatsPerFloor)
    };

    setFormData({
      ...formData,
      blocks: [...formData.blocks, newBlock]
    });

    setNewBlockDef({ name: '', floorsCount: 4, flatsPerFloor: 4 });
  };

  const handleRemoveBlock = (blockId) => {
    setFormData({
      ...formData,
      blocks: formData.blocks.filter((b) => b.id !== blockId)
    });
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDocDef.name.trim()) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: newDocDef.name,
      category: newDocDef.category,
      fileName: newDocDef.fileName || `${newDocDef.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileType: 'application/pdf',
      fileSize: '2.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      description: newDocDef.description || 'Verified property document.'
    };

    setFormData({
      ...formData,
      documents: [...formData.documents, newDoc]
    });

    setNewDocDef({ name: '', category: 'Master Plan', fileName: '', description: '' });
  };

  const handleRemoveDocument = (docId) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((d) => d.id !== docId)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setActiveTab('basic');
      return;
    }

    if (mode === 'edit' && propertyId) {
      updateProperty(propertyId, formData);
    } else {
      addProperty(formData);
    }

    setPropertyFormModal({ isOpen: false, mode: 'create', propertyId: null });
  };

  const tabs = [
    { id: 'basic', label: '1. Basic Info', icon: Building2 },
    { id: 'location', label: '2. Location', icon: MapPin },
    { id: 'images', label: '3. Images', icon: Image },
    { id: 'structure', label: '4. Structure (Towers)', icon: Layers },
    { id: 'documents', label: '5. Documents', icon: FileText },
    { id: 'management', label: '6. Management & RWA', icon: Shield }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setPropertyFormModal({ isOpen: false, mode: 'create', propertyId: null })}
      title={mode === 'edit' ? `Edit Property — ${formData.name}` : 'Register New Property'}
      subtitle="Complete property registration form strictly complying with PRD Section 4.D"
      size="xl"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Step Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: '#F8FAFC',
            overflowX: 'auto',
            padding: '0.25rem 0.5rem',
            gap: '0.25rem'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  padding: '0.4rem 0.75rem'
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {/* SECTION 1: BASIC PROPERTY INFORMATION */}
          {activeTab === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>
                  Section 1: Basic Property Information
                </h3>
                <p className="text-xs text-muted">
                  Official community identity, registration numbers, and structural category
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Apartment / Community Name <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sapphire Horizon Residences"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Property Code (Auto-generated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Property Type</label>
                  <select
                    className="form-select"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Property Operational Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {PROPERTY_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Municipal Registration Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. REG-BRH-2024-89"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Year of Construction</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.builtYear}
                    onChange={(e) => setFormData({ ...formData, builtYear: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Total Land Area</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 18.5 Acres"
                    value={formData.landArea}
                    onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Property Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Overview of the complex, architectural design, facilities, and perimeter security..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* SECTION 2: LOCATION DETAILS */}
          {activeTab === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>
                  Section 2: Location Details
                </h3>
                <p className="text-xs text-muted">Geographical address, postal demarcations, and maps</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Address Line 1 <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Street address, building number, landmark"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Sector, suite, arterial connection"
                    value={formData.address2}
                    onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">State / Province</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">PIN / Postal Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.5rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                    Interactive Property Location & Map Coordinates
                  </label>
                  <InteractiveLocationPicker
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onLocationSelect={(loc) => {
                      setFormData((prev) => ({
                        ...prev,
                        ...(loc.address ? { address: loc.address } : {}),
                        ...(loc.city ? { city: loc.city } : {}),
                        ...(loc.state ? { state: loc.state } : {}),
                        ...(loc.zip ? { zip: loc.zip } : {}),
                        ...(loc.country ? { country: loc.country } : {}),
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                        mapLink: loc.mapLink || prev.mapLink
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: PROPERTY IMAGES */}
          {activeTab === 'images' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>
                  Section 3: Property Images
                </h3>
                <p className="text-xs text-muted">
                  Primary banner image used on hero sections and cards, plus gallery perspectives
                </p>
              </div>

              <div>
                <label className="form-label">Primary Apartment Image URL / Asset</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    style={{ flex: 1 }}
                  />
                </div>

                {/* Image Presets Selector */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {[
                    '/Images/bee-community-master.jpg',
                    '/Images/honeycomb-towers.jpg',
                    '/Images/amber-grove.jpg',
                    '/Images/nectar-bay.jpg',
                    '/Images/ApartmentImage.jpeg'
                  ].map((presetImg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`btn btn-sm ${formData.image === presetImg ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setFormData({ ...formData, image: presetImg })}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Image {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Image Preview Box */}
                <div
                  style={{
                    height: '200px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    position: 'relative'
                  }}
                >
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      left: '0.5rem',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    Primary Hero Image Preview
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: PROPERTY STRUCTURE (TOWERS & DIFFERENT FLOOR COUNTS) */}
          {activeTab === 'structure' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>
                  Section 4: Property Structure & Towers
                </h3>
                <p className="text-xs text-muted">
                  Configure blocks and towers. Notice that different blocks can have different floor counts!
                </p>
              </div>

              {/* Add New Block Form */}
              <div
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
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--dark-navy)' }}>
                  + Add Block / Tower with Custom Floor Count
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label className="text-xs font-semibold text-muted">Tower / Block Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Tower C (Crown Wing)"
                      value={newBlockDef.name}
                      onChange={(e) => setNewBlockDef({ ...newBlockDef, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted">Floors in this Block</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="form-input"
                      value={newBlockDef.floorsCount}
                      onChange={(e) => setNewBlockDef({ ...newBlockDef, floorsCount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted">Flats per Floor</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      className="form-input"
                      value={newBlockDef.flatsPerFloor}
                      onChange={(e) => setNewBlockDef({ ...newBlockDef, flatsPerFloor: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddBlockToStructure}
                      style={{ width: '100%' }}
                    >
                      <Plus size={16} />
                      Add Tower
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Configured Blocks List */}
              <div>
                <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.5rem' }}>
                  CONFIGURED TOWERS ({formData.blocks.length})
                </div>

                {formData.blocks.length === 0 ? (
                  <div className="text-xs text-muted" style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    No blocks added yet. Add a tower above.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {formData.blocks.map((block) => (
                      <div
                        key={block.id}
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>
                            {block.name}
                          </div>
                          <div className="text-xs text-muted">
                            {block.floorsCount} Floors • {block.flatsCount} Units • Status: {block.status}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => handleRemoveBlock(block.id)}
                          title="Remove Block"
                        >
                          <Trash2 size={16} color="var(--error)" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 5: PROPERTY DOCUMENTS */}
          {activeTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>
                  Section 5: Property Documents
                </h3>
                <p className="text-xs text-muted">
                  Master plans, blueprints, municipal occupancy approvals, fire clearance, and manuals
                </p>
              </div>

              {/* Upload Document Box */}
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
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--dark-navy)' }}>
                  + Attach Property Document
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label className="text-xs font-semibold text-muted">Document Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Master Site Map"
                      value={newDocDef.name}
                      onChange={(e) => setNewDocDef({ ...newDocDef, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted">Document Category</label>
                    <select
                      className="form-select"
                      value={newDocDef.category}
                      onChange={(e) => setNewDocDef({ ...newDocDef, category: e.target.value })}
                    >
                      {PROPERTY_DOCUMENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted">File Name / Reference</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. site_plan_v2.pdf"
                      value={newDocDef.fileName}
                      onChange={(e) => setNewDocDef({ ...newDocDef, fileName: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleAddDocument}
                      style={{ width: '100%' }}
                    >
                      <Upload size={14} />
                      Attach Document
                    </button>
                  </div>
                </div>
              </div>

              {/* Attached Documents List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="text-xs font-semibold text-muted">
                  ATTACHED DOCUMENTS ({formData.documents.length})
                </div>

                {formData.documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.8125rem' }}>
                        {doc.name}
                      </div>
                      <div className="text-xs text-muted">
                        Category: <strong>{doc.category}</strong> • {doc.fileName} • {doc.fileSize || '2.4 MB'}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleRemoveDocument(doc.id)}
                    >
                      <Trash2 size={16} color="var(--error)" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: PROPERTY MANAGEMENT INFO */}
          {activeTab === 'management' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>
                  Section 6: Property Management & Governance
                </h3>
                <p className="text-xs text-muted">Designated property manager, RWA status, and emergency lines</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Property Manager Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.propertyManager}
                    onChange={(e) => setFormData({ ...formData, propertyManager: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Manager Contact Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.propertyManagerContact}
                    onChange={(e) => setFormData({ ...formData, propertyManagerContact: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">RWA Registration Status</label>
                  <select
                    className="form-select"
                    value={formData.rwaStatus}
                    onChange={(e) => setFormData({ ...formData, rwaStatus: e.target.value })}
                  >
                    <option value="Active">Active Registered RWA</option>
                    <option value="Not Registered">Not Registered / In Formation</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Emergency Line (24/7)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Internal Administrative Notes</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    value={formData.internalNotes}
                    onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions strictly matching PRD Section 4.D */}
        <div
          className="modal-footer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPropertyFormModal({ isOpen: false, mode: 'create', propertyId: null })}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <CheckCircle2 size={16} />
              {mode === 'edit' ? 'Update Property Record' : 'Save Property'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
