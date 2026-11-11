import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  SERVICE_CATEGORIES,
  BUSINESS_TYPES,
  AGENT_TYPES,
  PREFERRED_CONTACT_METHODS,
  REGISTRATION_STATUSES,
  AGENCY_DOCUMENT_TYPES
} from '../../data/constants';
import {
  User,
  Building2,
  Phone,
  Wrench,
  FileText,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  Key,
  Lock,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { hashPassword, generateSecurePassword } from '../../utils/crypto';

export default function AgencyOnboardingModal() {
  const {
    agencyOnboardingModal,
    setAgencyOnboardingModal,
    agencies,
    addAgency,
    updateAgency,
    addToast,
    allCategoryNames,
    setAddServiceCategoryModal
  } = useApp();

  const { isOpen, mode, agencyId } = agencyOnboardingModal;

  const [activeStep, setActiveStep] = useState(1); // 1: Personal, 2: Company, 3: Contact, 4: Services, 5: Documents, 6: Review

  // Portal Account Credentials State
  const [portalUsername, setPortalUsername] = useState('');
  const [portalPassword, setPortalPassword] = useState('');
  const [portalConfirm, setPortalConfirm] = useState('');
  const [showPortalPassword, setShowPortalPassword] = useState(false);
  const [portalPwdError, setPortalPwdError] = useState('');

  // Form State matching Bee_Zivion_Agent_Onboarding_Fields.docx
  const [formData, setFormData] = useState({
    // Section 1: Personal Information
    agent: {
      firstName: '',
      lastName: '',
      profilePhoto: null,
      designation: '',
      phone: '',
      alternatePhone: '',
      email: '',
      preferredLanguage: 'English',
      agentType: 'Company Owner',
      employeeId: '',
      emergencyContactName: '',
      emergencyContactNumber: ''
    },

    // Section 2: Company Details
    company: {
      name: '',
      registeredCompanyName: '',
      businessType: 'Private Limited Company',
      registrationNumber: '',
      gstin: '',
      pan: '',
      website: '',
      yearOfEstablishment: 2020,
      numberOfEmployees: 25,
      companyEmail: '',
      companyPhone: '',
      addressLine1: '',
      addressLine2: '',
      country: 'United States',
      state: 'California',
      city: 'Emerald City',
      pinCode: '94016',
      description: '',
      authorizedSignatoryName: '',
      authorizedSignatoryDesignation: ''
    },

    // Section 3: Contact Details
    contacts: {
      primaryContactName: '',
      primaryContactDesignation: '',
      primaryContactMobile: '',
      primaryContactEmail: '',
      alternateContactPerson: '',
      alternateContactMobile: '',
      accountsBillingName: '',
      accountsBillingEmail: '',
      accountsBillingPhone: '',
      preferredContactMethod: 'Bee App Notification',
      preferredContactTime: '09:00 AM - 06:00 PM'
    },

    // Section 4: Services Offered (Repeatable List)
    services: [],

    // Section 5: Document Uploads
    documents: [],

    // Section 6: Submission & Review
    registrationRefNumber: '',
    submissionDate: '',
    registrationStatus: 'Submitted',
    termsAccepted: false,
    declarationAccepted: false
  });

  // State for Service builder
  const [newService, setNewService] = useState({
    category: 'Facility Management',
    specialization: '',
    description: '',
    otherServiceName: '',
    coverageArea: 'All Residential Zones',
    experienceYears: 5,
    certifications: 'Certified Contractor',
    availability: '24/7 On-Call'
  });

  // State for Document builder
  const [newDoc, setNewDoc] = useState({
    documentType: 'Company Registration Certificate',
    fileName: '',
    expiryDate: '2028-12-31',
    remarks: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && agencyId) {
        const ag = agencies.find((a) => a.id === agencyId);
        if (ag) {
          setFormData({
            agent: ag.agent ? { ...ag.agent } : {
              firstName: ag.contactPerson?.split(' ')[0] || '',
              lastName: ag.contactPerson?.split(' ').slice(1).join(' ') || '',
              designation: 'Operations Lead',
              phone: ag.phone || '',
              alternatePhone: '',
              email: ag.email || '',
              preferredLanguage: 'English',
              agentType: 'Authorized Representative',
              employeeId: `EMP-${ag.logoText || '01'}`,
              emergencyContactName: '',
              emergencyContactNumber: ''
            },
            company: ag.company ? { ...ag.company } : {
              name: ag.name || '',
              registeredCompanyName: ag.name || '',
              businessType: 'Private Limited Company',
              registrationNumber: `REG-${ag.logoText || '01'}`,
              gstin: '',
              pan: '',
              website: '',
              yearOfEstablishment: 2020,
              numberOfEmployees: ag.totalPersonnel || 10,
              companyEmail: ag.email || '',
              companyPhone: ag.phone || '',
              addressLine1: '100 Service Boulevard',
              addressLine2: '',
              country: 'United States',
              state: 'California',
              city: 'Emerald City',
              pinCode: '94016',
              description: '',
              authorizedSignatoryName: ag.contactPerson || '',
              authorizedSignatoryDesignation: 'Director'
            },
            contacts: ag.contacts ? { ...ag.contacts } : {
              primaryContactName: ag.contactPerson || '',
              primaryContactDesignation: 'Primary Liaison',
              primaryContactMobile: ag.phone || '',
              primaryContactEmail: ag.email || '',
              alternateContactPerson: '',
              alternateContactMobile: '',
              accountsBillingName: '',
              accountsBillingEmail: '',
              accountsBillingPhone: '',
              preferredContactMethod: 'Bee App Notification',
              preferredContactTime: '09:00 AM - 06:00 PM'
            },
            services: ag.services ? [...ag.services] : (ag.categories || []).map((cat, idx) => ({
              id: `srv-${idx + 1}`,
              category: cat,
              specialization: `${cat} Specialist`,
              description: `Standard service coverage for ${cat}.`,
              otherServiceName: '',
              coverageArea: 'All Zones',
              experienceYears: 6,
              certifications: 'ISO 9001',
              availability: 'Standard Working Hours'
            })),
            documents: ag.documents ? [...ag.documents] : [],
            registrationRefNumber: ag.registrationRefNumber || `REG-${Date.now().toString().slice(-6)}`,
            submissionDate: ag.submissionDate || new Date().toISOString().split('T')[0],
            registrationStatus: ag.registrationStatus || 'Approved for Property Assignment',
            termsAccepted: true,
            declarationAccepted: true
          });
          setPortalUsername(ag.credentials?.username || `partner_${(ag.code || ag.name).toLowerCase().replace(/[^a-z0-9]/g, '')}`);
          setPortalPassword('');
          setPortalConfirm('');
        }
      } else {
        // Create mode fresh state
        const refNo = `REG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        setFormData({
          agent: {
            firstName: '',
            lastName: '',
            profilePhoto: null,
            designation: 'Managing Director / Owner',
            phone: '',
            alternatePhone: '',
            email: '',
            preferredLanguage: 'English',
            agentType: 'Company Owner',
            employeeId: `AGT-${Math.floor(100 + Math.random() * 900)}`,
            emergencyContactName: '',
            emergencyContactNumber: ''
          },
          company: {
            name: '',
            registeredCompanyName: '',
            businessType: 'Private Limited Company',
            registrationNumber: `CORP-${Math.floor(10000 + Math.random() * 90000)}`,
            gstin: '27AABCU9603R1Z5',
            pan: 'AABCU9603R',
            website: '',
            yearOfEstablishment: 2021,
            numberOfEmployees: 20,
            companyEmail: '',
            companyPhone: '',
            addressLine1: '',
            addressLine2: '',
            country: 'United States',
            state: 'California',
            city: 'Emerald City',
            pinCode: '94016',
            description: '',
            authorizedSignatoryName: '',
            authorizedSignatoryDesignation: 'Managing Director'
          },
          contacts: {
            primaryContactName: '',
            primaryContactDesignation: 'Primary Operations Liaison',
            primaryContactMobile: '',
            primaryContactEmail: '',
            alternateContactPerson: '',
            alternateContactMobile: '',
            accountsBillingName: '',
            accountsBillingEmail: '',
            accountsBillingPhone: '',
            preferredContactMethod: 'Bee App Notification',
            preferredContactTime: '09:00 AM - 06:00 PM'
          },
          services: [
            {
              id: `srv-${Date.now()}-1`,
              category: 'Facility Management',
              specialization: 'Comprehensive Residential Facility Operations',
              description: 'Routine upkeep, technical MEP audits, and emergency repairs.',
              otherServiceName: '',
              coverageArea: 'All Residential Zones',
              experienceYears: 6,
              certifications: 'ISO 9001 Certified',
              availability: '24/7 On-Call & Scheduled Shifts'
            }
          ],
          documents: [
            {
              id: `doc-${Date.now()}-1`,
              documentType: 'Company Registration Certificate',
              fileName: 'company_incorporation_cert.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              expiryDate: '2029-12-31',
              verificationStatus: 'Submitted',
              remarks: 'Corporate legal certificate.'
            },
            {
              id: `doc-${Date.now()}-2`,
              documentType: 'Insurance Certificate',
              fileName: 'workforce_liability_insurance.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              expiryDate: '2027-12-31',
              verificationStatus: 'Submitted',
              remarks: 'General liability insurance policy.'
            }
          ],
          registrationRefNumber: refNo,
          submissionDate: new Date().toISOString().split('T')[0],
          registrationStatus: 'Submitted',
          termsAccepted: true,
          declarationAccepted: true
        });
        const randomNum = Math.floor(100 + Math.random() * 900);
        setPortalUsername(`partner_${randomNum}`);
        const initialPwd = generateSecurePassword();
        setPortalPassword(initialPwd);
        setPortalConfirm(initialPwd);
      }
      setActiveStep(1);
    }
  }, [isOpen, mode, agencyId, agencies]);

  if (!isOpen) return null;

  // Add Service to repeatable list
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.category) return;

    const srv = {
      id: `srv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      category: newService.category,
      specialization: newService.specialization || `${newService.category} Operations`,
      description: newService.description || `Specialized service delivery for ${newService.category}.`,
      otherServiceName: newService.category === 'Other' ? newService.otherServiceName : '',
      coverageArea: newService.coverageArea || 'All Residential Zones',
      experienceYears: Number(newService.experienceYears) || 3,
      certifications: newService.certifications || 'Certified Professional Provider',
      availability: newService.availability || 'Standard Working Hours'
    };

    setFormData({
      ...formData,
      services: [...formData.services, srv]
    });

    setNewService({
      category: 'Electrical Maintenance',
      specialization: '',
      description: '',
      otherServiceName: '',
      coverageArea: 'All Residential Zones',
      experienceYears: 5,
      certifications: 'Certified Contractor',
      availability: '24/7 On-Call'
    });
  };

  const handleRemoveService = (serviceId) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s.id !== serviceId)
    });
  };

  // Add Document to uploads list
  const handleAddDocument = (e) => {
    e.preventDefault();
    const doc = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      documentType: newDoc.documentType,
      fileName: newDoc.fileName || `${newDoc.documentType.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: newDoc.expiryDate || '2028-12-31',
      verificationStatus: 'Submitted',
      remarks: newDoc.remarks || 'Document uploaded during onboarding registration.'
    };

    setFormData({
      ...formData,
      documents: [...formData.documents, doc]
    });

    setNewDoc({
      documentType: 'GST Registration Certificate',
      fileName: '',
      expiryDate: '2028-12-31',
      remarks: ''
    });
  };

  const handleRemoveDocument = (docId) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((d) => d.id !== docId)
    });
  };

  const handleSubmit = async (statusToSet = null) => {
    const finalStatus = statusToSet || formData.registrationStatus;

    if (!formData.company.name.trim()) {
      setActiveStep(2);
      return;
    }

    if (!formData.agent.firstName.trim() || !formData.agent.phone.trim()) {
      setActiveStep(1);
      return;
    }

    if (formData.services.length === 0) {
      setActiveStep(4);
      return;
    }

    // Process Portal Credentials securely
    let creds = formData.credentials || {};
    if (portalPassword) {
      const hash = await hashPassword(portalPassword);
      creds = {
        username: portalUsername.trim() || `partner_${(formData.company.name || 'agent').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        passwordHash: hash,
        lastUpdated: new Date().toISOString().split('T')[0],
        authStatus: 'Active'
      };
    } else if (!creds.username) {
      creds = {
        username: portalUsername.trim() || `partner_${(formData.company.name || 'agent').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        passwordHash: '$sha256$partnerDefault$8f49e49c71a39f67a21398bb9d682054a88746c0a0c4',
        lastUpdated: new Date().toISOString().split('T')[0],
        authStatus: 'Active'
      };
    }

    const payload = {
      name: formData.company.name,
      category: formData.services[0]?.category || 'Facility Management',
      categories: Array.from(new Set(formData.services.map((s) => s.category))),
      totalPersonnel: Number(formData.company.numberOfEmployees) || 15,
      ...formData,
      credentials: creds,
      registrationStatus: finalStatus,
      agreementStatus:
        finalStatus === 'Approved for Property Assignment'
          ? 'Approved (Eligible for Property Assignment)'
          : `Registration ${finalStatus}`
    };

    if (mode === 'edit' && agencyId) {
      updateAgency(agencyId, payload);
    } else {
      addAgency(payload);
    }

    setAgencyOnboardingModal({ isOpen: false, mode: 'create', agencyId: null });
  };

  const steps = [
    { num: 1, label: '1. Personal Info', icon: User },
    { num: 2, label: '2. Company Details', icon: Building2 },
    { num: 3, label: '3. Contact Details', icon: Phone },
    { num: 4, label: '4. Services Offered', icon: Wrench },
    { num: 5, label: '5. Document Uploads', icon: FileText },
    { num: 6, label: '6. Review & Submit', icon: CheckCircle2 }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setAgencyOnboardingModal({ isOpen: false, mode: 'create', agencyId: null })}
      title={mode === 'edit' ? `Edit Agency Onboarding — ${formData.company.name}` : 'Agent & Service Partner Onboarding'}
      subtitle="Stage 1: Register agent, company, services, and corporate documents for Zivion Admin Review"
      size="xl"
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Step Indicator Header */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: '#F8FAFC',
            overflowX: 'auto',
            padding: '0.35rem 0.75rem',
            gap: '0.35rem'
          }}
        >
          {steps.map((st) => {
            const Icon = st.icon;
            const isActive = activeStep === st.num;
            return (
              <button
                key={st.num}
                type="button"
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveStep(st.num)}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  padding: '0.4rem 0.75rem'
                }}
              >
                <Icon size={14} />
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {/* STEP 1: PERSONAL INFORMATION */}
          {activeStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.2rem' }}>
                  Stage 1 — 1. Personal Information
                </h3>
                <p className="text-xs text-muted">
                  Primary agent / contact person details responsible for service coordination
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">First Name <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Raghavan"
                    value={formData.agent.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, firstName: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Last Name <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Menon"
                    value={formData.agent.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, lastName: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Designation <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Managing Partner / Director"
                    value={formData.agent.designation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, designation: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Mobile Number with Country Code <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 9888392041"
                    value={formData.agent.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, phone: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Alternate Contact Number (Optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 9888399900"
                    value={formData.agent.alternatePhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, alternatePhone: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Email Address <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="contact@agency.com"
                    value={formData.agent.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, email: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Agent Type <span style={{ color: 'var(--error)' }}>*</span></label>
                  <select
                    className="form-select"
                    value={formData.agent.agentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, agentType: e.target.value }
                      })
                    }
                  >
                    {AGENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Employee / Agent ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.agent.employeeId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, employeeId: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Preferred Communication Language</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.agent.preferredLanguage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, preferredLanguage: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Emergency Contact Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contact name"
                    value={formData.agent.emergencyContactName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, emergencyContactName: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Emergency Contact Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 9876543210"
                    value={formData.agent.emergencyContactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agent: { ...formData.agent, emergencyContactNumber: e.target.value }
                      })
                    }
                  />
                </div>

                {/* Agency Portal Account & Credentials strictly matching Requirement 5 */}
                <div
                  style={{
                    gridColumn: '1 / -1',
                    marginTop: '0.5rem',
                    padding: '1.15rem 1.25rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #DBEAFE'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#EFF6FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2563EB'
                        }}
                      >
                        <Key size={16} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                          Agency Portal Login Credentials
                        </span>
                        <span className="badge badge-blue text-xs" style={{ marginLeft: '0.5rem' }}>
                          Admin Managed
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const pwd = generateSecurePassword();
                        setPortalPassword(pwd);
                        setPortalConfirm(pwd);
                        setShowPortalPassword(true);
                      }}
                      style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', padding: '0.2rem 0.5rem' }}
                    >
                      <RefreshCw size={12} />
                      Generate Strong Password
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem' }}>
                    <div>
                      <label className="form-label">
                        Assigned Portal Username <span style={{ color: 'var(--error)' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. partner_apex"
                        value={portalUsername}
                        onChange={(e) => setPortalUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Initial Account Password <span style={{ color: 'var(--error)' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPortalPassword ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Min 8 chars, letters & numbers"
                          value={portalPassword}
                          onChange={(e) => setPortalPassword(e.target.value)}
                          style={{ paddingRight: '2.5rem' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPortalPassword(!showPortalPassword)}
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748B'
                          }}
                        >
                          {showPortalPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        Confirm Password <span style={{ color: 'var(--error)' }}>*</span>
                      </label>
                      <input
                        type={showPortalPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Re-type password"
                        value={portalConfirm}
                        onChange={(e) => setPortalConfirm(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>
                    🔒 Password is cryptographically hashed with salted SHA-256 before storage. Plaintext passwords are never saved.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COMPANY DETAILS */}
          {activeStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.2rem' }}>
                  Stage 1 — 2. Company Details
                </h3>
                <p className="text-xs text-muted">
                  Legal company registration, tax credentials, address, and statutory numbers
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Company / Business Name <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Apex Security & Vigilance Force"
                    value={formData.company.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, name: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Registered Company Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Apex Security Force Pvt Ltd"
                    value={formData.company.registeredCompanyName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, registeredCompanyName: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Business Type <span style={{ color: 'var(--error)' }}>*</span></label>
                  <select
                    className="form-select"
                    value={formData.company.businessType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, businessType: e.target.value }
                      })
                    }
                  >
                    {BUSINESS_TYPES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Company Registration Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. REG-2022-ASVF-8891"
                    value={formData.company.registrationNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, registrationNumber: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">GSTIN (Conditional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 27AABCU9603R1Z5"
                    value={formData.company.gstin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, gstin: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">PAN (Conditional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. AABCU9603R"
                    value={formData.company.pan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, pan: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Company Email Address <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="dispatch@apexsecurity.com"
                    value={formData.company.companyEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, companyEmail: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Company Contact Number <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 9888392041"
                    value={formData.company.companyPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, companyPhone: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Year of Establishment</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.company.yearOfEstablishment}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, yearOfEstablishment: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Number of Employees</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.company.numberOfEmployees}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, numberOfEmployees: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Company Website (Optional)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://www.apexsecurity.com"
                    value={formData.company.website}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, website: e.target.value }
                      })
                    }
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Company Address Line 1 <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Building name, street, industrial layout"
                    value={formData.company.addressLine1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, addressLine1: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Company Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Suite, unit, landmarks"
                    value={formData.company.addressLine2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, addressLine2: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">City <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.company.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, city: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">State <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.company.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, state: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">PIN Code <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.company.pinCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, pinCode: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Country <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.company.country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, country: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Authorized Signatory Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Name of authorized person"
                    value={formData.company.authorizedSignatoryName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, authorizedSignatoryName: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Authorized Signatory Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Managing Director"
                    value={formData.company.authorizedSignatoryDesignation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, authorizedSignatoryDesignation: e.target.value }
                      })
                    }
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Company Description</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    placeholder="Business background, certifications, and service focus..."
                    value={formData.company.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, description: e.target.value }
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT DETAILS */}
          {activeStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.2rem' }}>
                  Stage 1 — 3. Contact Details
                </h3>
                <p className="text-xs text-muted">
                  Primary operations contact, billing/accounts personnel, and communication preferences
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Primary Contact Name <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.contacts.primaryContactName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, primaryContactName: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Primary Contact Designation <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.contacts.primaryContactDesignation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, primaryContactDesignation: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Primary Contact Mobile <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.contacts.primaryContactMobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, primaryContactMobile: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Primary Contact Email <span style={{ color: 'var(--error)' }}>*</span></label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.contacts.primaryContactEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, primaryContactEmail: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Alternate Contact Person</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.contacts.alternateContactPerson}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, alternateContactPerson: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Alternate Contact Mobile</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.contacts.alternateContactMobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, alternateContactMobile: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Accounts / Billing Contact Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.contacts.accountsBillingName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, accountsBillingName: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Accounts / Billing Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.contacts.accountsBillingEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, accountsBillingEmail: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Preferred Contact Method</label>
                  <select
                    className="form-select"
                    value={formData.contacts.preferredContactMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, preferredContactMethod: e.target.value }
                      })
                    }
                  >
                    {PREFERRED_CONTACT_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Preferred Contact Time</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 09:00 AM - 06:00 PM"
                    value={formData.contacts.preferredContactTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contacts: { ...formData.contacts, preferredContactTime: e.target.value }
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SERVICES OFFERED (REPEATABLE LIST) */}
          {activeStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.2rem' }}>
                  Stage 1 — 4. Types of Services Offered
                </h3>
                <p className="text-xs text-muted">
                  Use the repeatable service list to add every service category offered by this company.
                </p>
              </div>

              {/* Add Service Box */}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--dark-navy)' }}>
                    Add Service Category
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      setAddServiceCategoryModal({
                        isOpen: true,
                        onCategoryAdded: (cat) => setNewService({ ...newService, category: cat.name })
                      })
                    }
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                    title="Define a new category not listed in the standard options"
                  >
                    <Plus size={14} />
                    Add Service Category
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label className="text-xs font-semibold text-muted">Service Category <span style={{ color: 'var(--error)' }}>*</span></label>
                    <select
                      className="form-select"
                      value={newService.category}
                      onChange={(e) => {
                        if (e.target.value === '__ADD_NEW__') {
                          setAddServiceCategoryModal({
                            isOpen: true,
                            onCategoryAdded: (cat) => setNewService({ ...newService, category: cat.name })
                          });
                          return;
                        }
                        setNewService({ ...newService, category: e.target.value });
                      }}
                    >
                      {allCategoryNames.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__ADD_NEW__">+ Add New Service Category...</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted">Specific Service / Specialization</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CCTV & Optical Perimeter Alarm"
                      value={newService.specialization}
                      onChange={(e) => setNewService({ ...newService, specialization: e.target.value })}
                    />
                  </div>

                  {newService.category === 'Other' && (
                    <div>
                      <label className="text-xs font-semibold text-muted">Other Service Name <span style={{ color: 'var(--error)' }}>*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Specify custom service..."
                        value={newService.otherServiceName}
                        onChange={(e) => setNewService({ ...newService, otherServiceName: e.target.value })}
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-muted">Years of Experience</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newService.experienceYears}
                      onChange={(e) => setNewService({ ...newService, experienceYears: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted">Relevant Certifications</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. ISO 9001 / NFPA Certified"
                      value={newService.certifications}
                      onChange={(e) => setNewService({ ...newService, certifications: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted">Service Availability</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 24/7 On-Call"
                      value={newService.availability}
                      onChange={(e) => setNewService({ ...newService, availability: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddService}
                      style={{ width: '100%' }}
                    >
                      <Plus size={16} />
                      Add Another Service
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted">Service Description (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Description of operational scope, SLAs, and technical workforce..."
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Registered Services List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <div className="text-xs font-semibold text-muted">
                  REGISTERED SERVICES ({formData.services.length})
                </div>

                {formData.services.length === 0 ? (
                  <div className="text-xs text-muted" style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    No services added yet. Add at least one service category above.
                  </div>
                ) : (
                  formData.services.map((srv) => (
                    <div
                      key={srv.id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>
                          {srv.category} {srv.otherServiceName && `(${srv.otherServiceName})`}
                        </div>
                        <div className="text-xs text-muted">
                          {srv.specialization} • {srv.experienceYears} yrs experience • {srv.certifications} • {srv.availability}
                        </div>
                        {srv.description && (
                          <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                            {srv.description}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => handleRemoveService(srv.id)}
                        title="Remove Service"
                      >
                        <Trash2 size={16} color="var(--error)" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 5: DOCUMENT UPLOADS */}
          {activeStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.2rem' }}>
                  Stage 1 — 5. Document Uploads
                </h3>
                <p className="text-xs text-muted">
                  Attach statutory incorporation, GST, PAN, insurance policies, and licenses
                </p>
              </div>

              {/* Add Document Box */}
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
                  + Upload Company Document
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label className="text-xs font-semibold text-muted">Document Type</label>
                    <select
                      className="form-select"
                      value={newDoc.documentType}
                      onChange={(e) => setNewDoc({ ...newDoc, documentType: e.target.value })}
                    >
                      {AGENCY_DOCUMENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted">File Name / Reference</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. gstin_registration.pdf"
                      value={newDoc.fileName}
                      onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted">Document Expiry Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newDoc.expiryDate}
                      onChange={(e) => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
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

                <div>
                  <label className="text-xs font-semibold text-muted">Document Remarks</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Verification notes or policy number..."
                    value={newDoc.remarks}
                    onChange={(e) => setNewDoc({ ...newDoc, remarks: e.target.value })}
                  />
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="text-xs font-semibold text-muted">
                  ATTACHED DOCUMENTS ({formData.documents.length})
                </div>

                {formData.documents.map((d) => (
                  <div
                    key={d.id}
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
                        {d.documentType}
                      </div>
                      <div className="text-xs text-muted">
                        File: {d.fileName} • Uploaded: {d.uploadDate} {d.expiryDate ? `• Expires: ${d.expiryDate}` : ''} • Status: {d.verificationStatus || 'Submitted'}
                      </div>
                      {d.remarks && <div className="text-xs text-secondary">{d.remarks}</div>}
                    </div>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => handleRemoveDocument(d.id)}
                    >
                      <Trash2 size={16} color="var(--error)" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: REGISTRATION REVIEW & SUBMISSION */}
          {activeStep === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.2rem' }}>
                  Stage 1 — 6. Registration Review & Declaration
                </h3>
                <p className="text-xs text-muted">
                  Acknowledge statutory onboarding policies and finalize registration submission
                </p>
              </div>

              {/* Summary Card */}
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.875rem'
                }}
              >
                <div>
                  <span className="text-xs text-muted">Registration Reference:</span>
                  <div style={{ fontWeight: 700, color: 'var(--primary-blue)', fontSize: '0.9375rem' }}>
                    {formData.registrationRefNumber}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted">Company Name:</span>
                  <div style={{ fontWeight: 700, color: 'var(--dark-navy)' }}>
                    {formData.company.name || 'Not specified'}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted">Contact Agent:</span>
                  <div style={{ fontWeight: 600 }}>
                    {formData.agent.firstName} {formData.agent.lastName} ({formData.agent.phone})
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted">Offered Services:</span>
                  <div style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>
                    {formData.services.length} categories registered
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted">Registration Status:</label>
                  <select
                    className="form-select"
                    value={formData.registrationStatus}
                    onChange={(e) => setFormData({ ...formData, registrationStatus: e.target.value })}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    {REGISTRATION_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Declarations Checkboxes strictly matching PRD Section 5.E & docx Section 6 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    style={{ marginTop: '0.2rem' }}
                    required
                  />
                  <span>
                    <strong>Terms and Privacy Acknowledgement:</strong> I confirm that the service company adheres to BEE Residence code of conduct, worker welfare compliance, and data privacy policies.
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.declarationAccepted}
                    onChange={(e) => setFormData({ ...formData, declarationAccepted: e.target.checked })}
                    style={{ marginTop: '0.2rem' }}
                    required
                  />
                  <span>
                    <strong>Declaration of Information Accuracy:</strong> I solemnly declare that all personal particulars, corporate registration certificates, licenses, and statutory filings provided are true and accurate.
                  </span>
                </label>
              </div>

              {/* Workflow Notice */}
              <div
                style={{
                  padding: '0.875rem 1rem',
                  backgroundColor: '#FEF3C7',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #FDE68A',
                  fontSize: '0.75rem',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>
                  <strong>CRITICAL RULE:</strong> Company registration approval and property assignment approval are separate. Submitting this registration does NOT automatically grant access to any residential property.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
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
            onClick={() => setAgencyOnboardingModal({ isOpen: false, mode: 'create', agencyId: null })}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {activeStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Previous Step
              </button>
            )}

            {activeStep < 6 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveStep(activeStep + 1)}
              >
                Next Step →
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleSubmit('Draft')}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSubmit('Submitted')}
                >
                  <CheckCircle2 size={16} />
                  Submit for Admin Review
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
