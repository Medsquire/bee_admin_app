import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import {
  Layers,
  Building2,
  Briefcase,
  User,
  Sliders,
  Plus,
  Edit2,
  Check,
  X,
  Search,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Save,
  RotateCcw,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  FileText,
  Phone,
  Mail,
  Trash2,
  Sun,
  Moon,
  CheckCircle2
} from 'lucide-react';

export default function Settings() {
  const {
    theme,
    setTheme,
    toggleTheme,
    currentUser,
    updateAdminProfile,
    changeAdminPassword,
    logout,
    serviceCategories,
    addServiceCategory,
    updateServiceCategory,
    toggleServiceCategoryStatus,
    deleteServiceCategory,
    propertyTypes,
    addPropertyType,
    updatePropertyType,
    deletePropertyType,
    propertyStatuses,
    addPropertyStatus,
    updatePropertyStatus,
    propertyDocumentCategories,
    addPropertyDocumentCategory,
    agencyBusinessTypes,
    addAgencyBusinessType,
    updateAgencyBusinessType,
    agencyAgentTypes,
    addAgencyAgentType,
    agencyContactMethods,
    addAgencyContactMethod,
    agencyDocumentTypes,
    addAgencyDocumentType,
    appPreferences,
    updateAppPreferences,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'properties' | 'agencies' | 'account' | 'preferences'

  // ==========================================
  // TAB 1: SERVICE CATEGORIES STATE
  // ==========================================
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryStatusFilter, setCategoryStatusFilter] = useState('ALL');
  const [editingCategory, setEditingCategory] = useState(null); // { id, name, description, status }
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  const filteredCategories = useMemo(() => {
    return serviceCategories.filter((cat) => {
      if (categoryStatusFilter !== 'ALL' && cat.status !== categoryStatusFilter) {
        return false;
      }
      if (categorySearch.trim()) {
        const query = categorySearch.toLowerCase().trim();
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesDesc = (cat.description || '').toLowerCase().includes(query);
        return matchesName || matchesDesc;
      }
      return true;
    });
  }, [serviceCategories, categorySearch, categoryStatusFilter]);

  const handleSaveNewCategory = (e) => {
    e.preventDefault();
    if (!newCategoryData.name.trim()) {
      addToast('Please enter a category name.', 'warning');
      return;
    }
    const created = addServiceCategory(newCategoryData);
    if (created) {
      setNewCategoryData({ name: '', description: '', status: 'Active' });
      setIsAddCategoryOpen(false);
    }
  };

  const handleSaveEditCategory = (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) {
      addToast('Category name cannot be empty.', 'warning');
      return;
    }
    updateServiceCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description,
      status: editingCategory.status
    });
    setEditingCategory(null);
  };

  // ==========================================
  // TAB 2: PROPERTY CONFIGURATION STATE
  // ==========================================
  const [newPropertyType, setNewPropertyType] = useState('');
  const [editingPropertyType, setEditingPropertyType] = useState(null); // { old: '', current: '' }
  const [newPropertyStatus, setNewPropertyStatus] = useState('');
  const [editingPropertyStatus, setEditingPropertyStatus] = useState(null);
  const [newDocCategory, setNewDocCategory] = useState('');

  // ==========================================
  // TAB 3: AGENCY CONFIGURATION STATE
  // ==========================================
  const [newBusinessType, setNewBusinessType] = useState('');
  const [editingBusinessType, setEditingBusinessType] = useState(null);
  const [newAgentType, setNewAgentType] = useState('');
  const [newContactMethod, setNewContactMethod] = useState('');
  const [newAgencyDocType, setNewAgencyDocType] = useState('');

  // ==========================================
  // TAB 4: ADMIN ACCOUNT STATE
  // ==========================================
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Sarah Jenkins',
    email: currentUser?.email || 'sarah.jenkins@beeproperty.com',
    phone: currentUser?.phone || '+91 9876543210',
    role: currentUser?.role || 'Super Admin',
    title: currentUser?.title || 'Super Admin'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      addToast('Admin name cannot be empty.', 'warning');
      return;
    }
    if (!profileData.email.trim() || !profileData.email.includes('@')) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }
    updateAdminProfile(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const success = changeAdminPassword(passwordData);
    if (success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  // ==========================================
  // TAB 5: PREFERENCES STATE
  // ==========================================
  const [prefForm, setPrefForm] = useState({ ...appPreferences });

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    updateAppPreferences(prefForm);
  };

  const handleResetPreferences = () => {
    const defaultPrefs = {
      defaultRequestStatus: 'Pending Review',
      defaultRequestPriority: 'Normal',
      notificationEmail: true,
      notificationSms: true,
      notificationSlaBreach: true,
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12-Hour (AM/PM)',
      currency: 'INR (₹)',
      itemsPerPage: '10',
      autoRefreshInterval: '60s'
    };
    setPrefForm(defaultPrefs);
    updateAppPreferences(defaultPrefs);
  };

  // Tab definitions
  const tabs = [
    { id: 'categories', label: 'Service Categories', icon: Layers },
    { id: 'properties', label: 'Property Configuration', icon: Building2 },
    { id: 'agencies', label: 'Agency & Services', icon: Briefcase },
    { id: 'account', label: 'Admin Account', icon: User },
    { id: 'preferences', label: 'Application Preferences', icon: Sliders }
  ];

  return (
    <div className="page-container" style={{ paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--dark-navy)', margin: 0 }}>
            Settings
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={toggleTheme}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="#2563EB" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--light-blue)',
              color: 'var(--primary-blue)',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <ShieldCheck size={14} />
            System Administration
          </span>
        </div>
      </div>

      {/* Navigation Tabs Bar with Glassmorphic Styling */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.75rem',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                backgroundColor: isActive ? 'var(--primary-blue)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.06)';
                  e.currentTarget.style.color = 'var(--primary-blue)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2.3 : 1.8} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: SERVICE CATEGORIES MANAGEMENT                           */}
      {/* ============================================================== */}
      {activeTab === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Summary Stat Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}
          >
            <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Total Categories
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-navy)', marginTop: '0.25rem' }}>
                {serviceCategories.length}
              </div>
            </div>
            <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)' }}>
                Active Categories
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
                {serviceCategories.filter((c) => c.status === 'Active').length}
              </div>
            </div>
            <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D97706' }}>
                Inactive Categories
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706', marginTop: '0.25rem' }}>
                {serviceCategories.filter((c) => c.status === 'Inactive').length}
              </div>
            </div>
          </div>

          {/* Action & Filter Toolbar */}
          <div
            className="glass-panel"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px', flexWrap: 'wrap' }}>
              <div className="search-wrapper" style={{ minWidth: '240px', flex: 1 }}>
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  className="form-input search-input"
                  placeholder="Search service categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8125rem' }}
                />
              </div>

              <div style={{ width: '160px' }}>
                <select
                  className="form-select"
                  value={categoryStatusFilter}
                  onChange={(e) => setCategoryStatusFilter(e.target.value)}
                  style={{ fontSize: '0.8125rem' }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddCategoryOpen(true)}
              style={{ fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              <Plus size={16} />
              Add Service Category
            </button>
          </div>

          {/* Add Category Form Card (if open) */}
          {isAddCategoryOpen && (
            <div
              className="glass-card"
              style={{
                padding: '1.5rem',
                border: '1.5px solid var(--primary-blue)',
                backgroundColor: 'rgba(239, 246, 255, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} color="var(--primary-blue)" />
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                    Add New Service Category
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon-sm"
                  onClick={() => setIsAddCategoryOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveNewCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      Category Name <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Solar Panel & Renewable Systems"
                      value={newCategoryData.name}
                      onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      Status
                    </label>
                    <select
                      className="form-select"
                      value={newCategoryData.status}
                      onChange={(e) => setNewCategoryData({ ...newCategoryData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Brief description of capabilities, maintenance scope, or technician requirements..."
                    value={newCategoryData.description}
                    onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsAddCategoryOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={15} />
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories Table */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.875rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Category Name
                    </th>
                    <th style={{ padding: '0.875rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Scope / Description
                    </th>
                    <th style={{ padding: '0.875rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Type
                    </th>
                    <th style={{ padding: '0.875rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Status
                    </th>
                    <th style={{ padding: '0.875rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No service categories found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => {
                      const isActive = cat.status === 'Active';
                      return (
                        <tr
                          key={cat.id}
                          className="table-row-hover"
                          style={{
                            borderBottom: '1px solid var(--border-color)',
                            transition: 'background-color var(--transition-fast)'
                          }}
                        >
                          <td style={{ padding: '0.875rem 1.25rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>
                              {cat.name}
                            </div>
                          </td>
                          <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '320px' }}>
                            {cat.description || '—'}
                          </td>
                          <td style={{ padding: '0.875rem 1.25rem' }}>
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                fontWeight: 600,
                                padding: '0.2rem 0.5rem',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: cat.isPredefined ? 'var(--bg-subtle)' : 'var(--primary-blue-subtle)',
                                color: cat.isPredefined ? 'var(--text-secondary)' : 'var(--primary-blue)',
                                border: cat.isPredefined ? '1px solid var(--border-color)' : '1px solid var(--primary-blue-border)'
                              }}
                            >
                              {cat.isPredefined ? 'Predefined' : 'Custom'}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 1.25rem' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.6rem',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: isActive ? 'var(--success-bg)' : 'var(--warning-bg)',
                                color: isActive ? 'var(--success)' : 'var(--warning)'
                              }}
                            >
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: isActive ? 'var(--success)' : 'var(--warning)'
                                }}
                              />
                              {cat.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => setEditingCategory({ ...cat })}
                                title="Edit Category"
                                style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                <Edit2 size={13} />
                                Edit
                              </button>

                              <button
                                type="button"
                                className={`btn btn-sm ${isActive ? 'btn-outline' : 'btn-primary'}`}
                                onClick={() => toggleServiceCategoryStatus(cat.id)}
                                title={isActive ? 'Deactivate Category' : 'Activate Category'}
                                style={{
                                  padding: '0.35rem 0.6rem',
                                  fontSize: '0.75rem',
                                  borderColor: isActive ? 'rgba(209, 213, 219, 0.8)' : undefined
                                }}
                              >
                                {isActive ? (
                                  <>
                                    <ToggleRight size={14} color="#D97706" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <ToggleLeft size={14} />
                                    Activate
                                  </>
                                )}
                              </button>

                              {!cat.isPredefined && (
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-icon-sm"
                                  onClick={() => deleteServiceCategory(cat.id)}
                                  title="Delete custom category"
                                  style={{ color: 'var(--error)' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Category Modal strictly conforming to the standard application Modal design system */}
          <Modal
            isOpen={Boolean(editingCategory)}
            onClose={() => setEditingCategory(null)}
            title="Edit Service Category"
            size="md"
          >
            <form
              onSubmit={handleSaveEditCategory}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}
            >
              <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Category Name <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingCategory?.name || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Status
                  </label>
                  <select
                    className="form-select"
                    value={editingCategory?.status || 'Active'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                    Inactive categories are hidden from new service request and agency assignment dropdowns.
                  </span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Description
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={editingCategory?.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    placeholder="Detailed scope or notes for this service category..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={15} />
                  Save Changes
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PROPERTY CONFIGURATION                                  */}
      {/* ============================================================== */}
      {activeTab === 'properties' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Card: Property Types */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Property Types
                </div>
              </div>

              {/* Add Type Inline */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (addPropertyType(newPropertyType)) {
                    setNewPropertyType('');
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="New property type..."
                  value={newPropertyType}
                  onChange={(e) => setNewPropertyType(e.target.value)}
                  style={{ width: '220px', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  <Plus size={14} />
                  Add Type
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {propertyTypes.map((type) => {
                const isEditing = editingPropertyType?.old === type;

                if (isEditing) {
                  return (
                    <div
                      key={type}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-blue-subtle)',
                        border: '1px solid var(--primary-blue)'
                      }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        value={editingPropertyType.current}
                        onChange={(e) => setEditingPropertyType({ ...editingPropertyType, current: e.target.value })}
                        style={{ fontSize: '0.8125rem', padding: '0.25rem 0.5rem', width: '160px' }}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-icon-sm"
                        onClick={() => {
                          updatePropertyType(editingPropertyType.old, editingPropertyType.current);
                          setEditingPropertyType(null);
                        }}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon-sm"
                        onClick={() => setEditingPropertyType(null)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={type}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--dark-navy)'
                    }}
                  >
                    <span>{type}</span>
                    <button
                      type="button"
                      onClick={() => setEditingPropertyType({ old: type, current: type })}
                      title="Rename type"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}
                    >
                      <Edit2 size={12} />
                    </button>
                    {propertyTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deletePropertyType(type)}
                        title="Remove type"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: 'var(--error)' }}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Property Operational Statuses */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Property Operational Statuses
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (addPropertyStatus(newPropertyStatus)) {
                    setNewPropertyStatus('');
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="New status name..."
                  value={newPropertyStatus}
                  onChange={(e) => setNewPropertyStatus(e.target.value)}
                  style={{ width: '220px', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  <Plus size={14} />
                  Add Status
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {propertyStatuses.map((status) => {
                const isEditing = editingPropertyStatus?.old === status;

                if (isEditing) {
                  return (
                    <div
                      key={status}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-blue-subtle)',
                        border: '1px solid var(--primary-blue)'
                      }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        value={editingPropertyStatus.current}
                        onChange={(e) => setEditingPropertyStatus({ ...editingPropertyStatus, current: e.target.value })}
                        style={{ fontSize: '0.8125rem', padding: '0.25rem 0.5rem', width: '160px' }}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-icon-sm"
                        onClick={() => {
                          updatePropertyStatus(editingPropertyStatus.old, editingPropertyStatus.current);
                          setEditingPropertyStatus(null);
                        }}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon-sm"
                        onClick={() => setEditingPropertyStatus(null)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={status}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--success-bg)',
                      border: '1px solid rgba(34, 197, 94, 0.25)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--success)'
                    }}
                  >
                    <span>{status}</span>
                    <button
                      type="button"
                      onClick={() => setEditingPropertyStatus({ old: status, current: status })}
                      title="Rename status"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Property Document Categories */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Property Document Categories
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (addPropertyDocumentCategory(newDocCategory)) {
                    setNewDocCategory('');
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="New document category..."
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  style={{ width: '220px', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  <Plus size={14} />
                  Add Category
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {propertyDocumentCategories.map((docCat) => (
                <div
                  key={docCat}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--dark-navy)'
                  }}
                >
                  <FileText size={13} color="var(--primary-blue)" />
                  <span>{docCat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: AGENCY & SERVICE CONFIGURATION                          */}
      {/* ============================================================== */}
      {activeTab === 'agencies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Card: Agency Business Entity Types */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Agency Business Entity Types
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (addAgencyBusinessType(newBusinessType)) {
                    setNewBusinessType('');
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="New business entity type..."
                  value={newBusinessType}
                  onChange={(e) => setNewBusinessType(e.target.value)}
                  style={{ width: '220px', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  <Plus size={14} />
                  Add Type
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {agencyBusinessTypes.map((type) => {
                const isEditing = editingBusinessType?.old === type;

                if (isEditing) {
                  return (
                    <div
                      key={type}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-blue-subtle)',
                        border: '1px solid var(--primary-blue)'
                      }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        value={editingBusinessType.current}
                        onChange={(e) => setEditingBusinessType({ ...editingBusinessType, current: e.target.value })}
                        style={{ fontSize: '0.8125rem', padding: '0.25rem 0.5rem', width: '160px' }}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-icon-sm"
                        onClick={() => {
                          updateAgencyBusinessType(editingBusinessType.old, editingBusinessType.current);
                          setEditingBusinessType(null);
                        }}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon-sm"
                        onClick={() => setEditingBusinessType(null)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={type}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--dark-navy)'
                    }}
                  >
                    <span>{type}</span>
                    <button
                      type="button"
                      onClick={() => setEditingBusinessType({ old: type, current: type })}
                      title="Rename entity type"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Agent / Personnel Designation Roles */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Personnel Designations & Roles
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (addAgencyAgentType(newAgentType)) {
                    setNewAgentType('');
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="New designation..."
                  value={newAgentType}
                  onChange={(e) => setNewAgentType(e.target.value)}
                  style={{ width: '220px', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  <Plus size={14} />
                  Add Designation
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {agencyAgentTypes.map((agentType) => (
                <div
                  key={agentType}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--dark-navy)'
                  }}
                >
                  <User size={13} color="var(--primary-blue)" />
                  <span>{agentType}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Preferred Communication Channels */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Preferred Communication Channels
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (addAgencyContactMethod(newContactMethod)) {
                    setNewContactMethod('');
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="New contact channel..."
                  value={newContactMethod}
                  onChange={(e) => setNewContactMethod(e.target.value)}
                  style={{ width: '220px', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  <Plus size={14} />
                  Add Channel
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {agencyContactMethods.map((method) => (
                <div
                  key={method}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--dark-navy)'
                  }}
                >
                  <Phone size={13} color="var(--primary-blue)" />
                  <span>{method}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Required Agency Compliance Documents */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Agency Compliance & Verification Documents
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (addAgencyDocumentType(newAgencyDocType)) {
                    setNewAgencyDocType('');
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="New compliance doc type..."
                  value={newAgencyDocType}
                  onChange={(e) => setNewAgencyDocType(e.target.value)}
                  style={{ width: '220px', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  <Plus size={14} />
                  Add Document
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {agencyDocumentTypes.map((docType) => (
                <div
                  key={docType}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--dark-navy)'
                  }}
                >
                  <FileText size={13} color="var(--primary-blue)" />
                  <span>{docType}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: ADMIN ACCOUNT MANAGEMENT                                */}
      {/* ============================================================== */}
      {activeTab === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Admin Identity Card with Refined Glassmorphism */}
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 255, 0.9) 100%)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue)',
                color: '#FFFFFF',
                fontSize: '1.5rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                flexShrink: 0
              }}
            >
              {currentUser?.initials || 'SJ'}
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-navy)', margin: 0 }}>
                  {currentUser?.name || 'Sarah Jenkins'}
                </h2>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--light-blue)',
                    color: 'var(--primary-blue)'
                  }}
                >
                  {currentUser?.role || 'Super Admin'}
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={13} />
                  {currentUser?.email || 'sarah.jenkins@beeproperty.com'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={13} />
                  {currentUser?.phone || '+91 9876543210'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={logout}
                style={{
                  color: 'var(--error)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  fontWeight: 600
                }}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Grid: Edit Profile & Change Password */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {/* Edit Profile Card */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <User size={18} color="var(--primary-blue)" />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Edit Administrator Profile
                </span>
              </div>

              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Full Name <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Email Address <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Role / Title
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                    <Save size={15} />
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Lock size={18} color="var(--primary-blue)" />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Change Password
                </span>
              </div>

              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Current Password <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter current password..."
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    New Password <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="At least 6 characters..."
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Confirm New Password <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Re-enter new password..."
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                    <Lock size={15} />
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: APPLICATION PREFERENCES                                 */}
      {/* ============================================================== */}
      {activeTab === 'preferences' && (
        <form onSubmit={handlePreferencesSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card: Theme & Visual Appearance (Dark Mode) */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  Visual Theme & Appearance
                </div>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: theme === 'dark' ? 'rgba(30, 58, 138, 0.5)' : 'var(--light-blue)',
                  color: 'var(--primary-blue)',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
                Active: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {/* Option 1: Light Mode */}
              <div
                onClick={() => setTheme('light')}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: theme === 'light' ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  backgroundColor: theme === 'light' ? 'var(--light-blue)' : 'var(--bg-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s ease',
                  boxShadow: theme === 'light' ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#FFFFFF',
                    color: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    flexShrink: 0
                  }}
                >
                  <Sun size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--dark-navy)' }}>
                      Light Mode
                    </div>
                    {theme === 'light' && <CheckCircle2 size={16} color="var(--primary-blue)" />}
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                    Classic clean blue-and-white theme
                  </div>
                </div>
              </div>

              {/* Option 2: Dark Mode */}
              <div
                onClick={() => setTheme('dark')}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: theme === 'dark' ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  backgroundColor: theme === 'dark' ? 'rgba(30, 58, 138, 0.35)' : 'var(--bg-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s ease',
                  boxShadow: theme === 'dark' ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#0F172A',
                    color: '#60A5FA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    flexShrink: 0
                  }}
                >
                  <Moon size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--dark-navy)' }}>
                      Dark Mode
                    </div>
                    {theme === 'dark' && <CheckCircle2 size={16} color="var(--primary-blue)" />}
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                    Executive navy & blue night theme
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Service Request & Dispatch Defaults */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)', marginBottom: '1.25rem' }}>
              Service Requests & Maintenance Defaults
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  Default Service Request Status
                </label>
                <select
                  className="form-select"
                  value={prefForm.defaultRequestStatus}
                  onChange={(e) => setPrefForm({ ...prefForm, defaultRequestStatus: e.target.value })}
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Triaged">Triaged</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  Default Maintenance Priority
                </label>
                <select
                  className="form-select"
                  value={prefForm.defaultRequestPriority}
                  onChange={(e) => setPrefForm({ ...prefForm, defaultRequestPriority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent / Critical">Urgent / Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card: Notifications & SLA Alerts */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)', marginBottom: '1.25rem' }}>
              System Notifications & SLA Alerts
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                    Email Notifications
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Send admin email updates for new agency registrations and assignment approvals
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefForm.notificationEmail}
                  onChange={(e) => setPrefForm({ ...prefForm, notificationEmail: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-blue)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                    SMS & WhatsApp Alerts
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Deliver instant mobile alerts to technicians for emergency maintenance calls
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefForm.notificationSms}
                  onChange={(e) => setPrefForm({ ...prefForm, notificationSms: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-blue)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                    SLA Response Breach Alerts
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Flag agency tickets exceeding guaranteed resolution turnaround time
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefForm.notificationSlaBreach}
                  onChange={(e) => setPrefForm({ ...prefForm, notificationSlaBreach: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-blue)' }}
                />
              </label>
            </div>
          </div>

          {/* Card: Localization & Regional Formats */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark-navy)', marginBottom: '1.25rem' }}>
              Regional & Display Formatting
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  Date Format
                </label>
                <select
                  className="form-select"
                  value={prefForm.dateFormat}
                  onChange={(e) => setPrefForm({ ...prefForm, dateFormat: e.target.value })}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  Time Format
                </label>
                <select
                  className="form-select"
                  value={prefForm.timeFormat}
                  onChange={(e) => setPrefForm({ ...prefForm, timeFormat: e.target.value })}
                >
                  <option value="12-Hour (AM/PM)">12-Hour (AM/PM)</option>
                  <option value="24-Hour">24-Hour</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  Currency
                </label>
                <select
                  className="form-select"
                  value={prefForm.currency}
                  onChange={(e) => setPrefForm({ ...prefForm, currency: e.target.value })}
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  Items Per Page
                </label>
                <select
                  className="form-select"
                  value={prefForm.itemsPerPage}
                  onChange={(e) => setPrefForm({ ...prefForm, itemsPerPage: e.target.value })}
                >
                  <option value="10">10 entries</option>
                  <option value="25">25 entries</option>
                  <option value="50">50 entries</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleResetPreferences}
            >
              <RotateCcw size={15} />
              Reset to Defaults
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
              <Save size={15} />
              Save Preferences
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
