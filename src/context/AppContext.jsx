import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  INITIAL_APARTMENTS,
  INITIAL_AGENCIES,
  INITIAL_MAINTENANCE,
  INITIAL_ACTIVITIES,
  INITIAL_SECURITY_DEPLOYMENTS
} from '../data/initialData';
import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  resetAllStorage
} from '../utils/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [apartments, setApartments] = useState(() => {
    const data = loadFromStorage(STORAGE_KEYS.APARTMENTS, INITIAL_APARTMENTS);
    return data.map((apt) => {
      if (apt.rwa && !apt.rwa.credentials) {
        return {
          ...apt,
          rwa: {
            ...apt.rwa,
            credentials: {
              username: `rwa_${(apt.code || apt.name).toLowerCase().replace(/[^a-z0-9]/g, '')}`,
              passwordHash: '$sha256$rwaDefault$8f49e49c71a39f67a21398bb9d682054a88746c0a0c4',
              lastUpdated: '2026-10-25',
              authStatus: 'Active'
            }
          }
        };
      }
      return apt;
    });
  });

  const [agencies, setAgencies] = useState(() => {
    const data = loadFromStorage(STORAGE_KEYS.AGENCIES, INITIAL_AGENCIES);
    return data.map((ag) => {
      if (!ag.credentials) {
        return {
          ...ag,
          credentials: {
            username: `partner_${(ag.code || ag.name).toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            passwordHash: '$sha256$partnerDefault$8f49e49c71a39f67a21398bb9d682054a88746c0a0c4',
            lastUpdated: '2026-10-25',
            authStatus: 'Active'
          }
        };
      }
      return ag;
    });
  });

  const [maintenanceRequests, setMaintenanceRequests] = useState(() =>
    loadFromStorage(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE)
  );

  const [activities, setActivities] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );

  const [securityDeployments, setSecurityDeployments] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SECURITY, INITIAL_SECURITY_DEPLOYMENTS)
  );

  // Sync state changes to LocalStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APARTMENTS, apartments);
  }, [apartments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AGENCIES, agencies);
  }, [agencies]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MAINTENANCE, maintenanceRequests);
  }, [maintenanceRequests]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
  }, [activities]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SECURITY, securityDeployments);
  }, [securityDeployments]);

  // Navigation State
  const [activePage, setActivePage] = useState('dashboard'); // 'dashboard' | 'properties' | 'agencies'
  const [selectedApartmentId, setSelectedApartmentId] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [selectedFlatNumber, setSelectedFlatNumber] = useState(null);
  const [propertyActiveTab, setPropertyActiveTab] = useState('blocks'); // 'blocks' | 'maintenance' | 'documents'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Search State
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Modals State
  const [propertyFormModal, setPropertyFormModal] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    propertyId: null
  });

  const [propertyDocumentsModal, setPropertyDocumentsModal] = useState({
    isOpen: false,
    propertyId: null
  });

  const [addBlockModal, setAddBlockModal] = useState({
    isOpen: false,
    apartmentId: null
  });

  const [editBlockModal, setEditBlockModal] = useState({
    isOpen: false,
    apartmentId: null,
    block: null
  });

  const [addFloorModal, setAddFloorModal] = useState({
    isOpen: false,
    apartmentId: null,
    blockId: null
  });

  const [addFlatModal, setAddFlatModal] = useState({
    isOpen: false,
    apartmentId: null,
    blockId: null,
    floorId: null
  });

  const [agencyOnboardingModal, setAgencyOnboardingModal] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    agencyId: null
  });

  const [propertyAssignmentModal, setPropertyAssignmentModal] = useState({
    isOpen: false,
    agencyId: null
  });

  const [registrationReviewModal, setRegistrationReviewModal] = useState({
    isOpen: false,
    agencyId: null
  });

  const [assignmentApprovalModal, setAssignmentApprovalModal] = useState({
    isOpen: false,
    agencyId: null,
    assignmentId: null
  });

  const [personnelModal, setPersonnelModal] = useState({
    isOpen: false,
    agencyId: null,
    personnel: null
  });

  const [rwaModalApartmentId, setRwaModalApartmentId] = useState(null);
  const [agencyAllocationRequest, setAgencyAllocationRequest] = useState(null);
  const [securityAllocationModalOpen, setSecurityAllocationModalOpen] = useState(false);
  const [flatDetailModalData, setFlatDetailModalData] = useState(null);
  const [maintenanceDetailModalRequest, setMaintenanceDetailModalRequest] = useState(null);
  const [agencyDetailModalId, setAgencyDetailModalId] = useState(null);
  const [newMaintenanceModalApartmentId, setNewMaintenanceModalApartmentId] = useState(null);

  // Toasts Notification State
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation Actions
  const navigateTo = (page, options = {}) => {
    setActivePage(page);
    setIsMobileSidebarOpen(false);

    if (page === 'properties') {
      if (options.apartmentId) {
        setSelectedApartmentId(options.apartmentId);
        setSelectedBlockId(options.blockId || null);
        setSelectedFloorId(options.floorId || null);
        setSelectedFlatNumber(options.flatNumber || null);
        if (options.tab) {
          setPropertyActiveTab(options.tab);
        }
      }
    }
  };

  const selectApartment = (aptId) => {
    setSelectedApartmentId(aptId);
    setSelectedBlockId(null);
    setSelectedFloorId(null);
    setSelectedFlatNumber(null);
    setPropertyActiveTab('blocks');
  };

  const selectBlock = (blockId) => {
    setSelectedBlockId(blockId);
    setSelectedFloorId(null);
    setSelectedFlatNumber(null);
  };

  const selectFloor = (floorId) => {
    setSelectedFloorId(floorId);
    setSelectedFlatNumber(null);
  };

  const selectFlat = (apartment, block, floor, flat) => {
    setFlatDetailModalData({ apartment, block, floor, flat });
  };

  const clearPropertySelection = (level) => {
    if (level === 'all') {
      setSelectedApartmentId(null);
      setSelectedBlockId(null);
      setSelectedFloorId(null);
      setSelectedFlatNumber(null);
    } else if (level === 'apartment') {
      setSelectedBlockId(null);
      setSelectedFloorId(null);
      setSelectedFlatNumber(null);
    } else if (level === 'block') {
      setSelectedFloorId(null);
      setSelectedFlatNumber(null);
    }
  };

  // Helper to re-calculate apartment counters accurately
  const recalculateApartmentCounters = (aptList) => {
    return aptList.map((apt) => {
      let totalFlats = 0;
      let occupiedFlats = 0;
      let vacantFlats = 0;
      let totalFloors = 0;

      (apt.blocks || []).forEach((block) => {
        let bOcc = 0;
        let bVac = 0;
        const floors = block.floors || [];
        totalFloors += floors.length;

        floors.forEach((floor) => {
          let fOcc = 0;
          let fVac = 0;
          (floor.flats || []).forEach((flat) => {
            if (flat.status === 'Occupied') {
              fOcc++;
            } else {
              fVac++;
            }
          });
          floor.occupiedFlats = fOcc;
          floor.vacantFlats = fVac;
          floor.totalFlats = fOcc + fVac;
          bOcc += fOcc;
          bVac += fVac;
        });

        block.occupiedFlats = bOcc;
        block.vacantFlats = bVac;
        block.flatsCount = bOcc + bVac;
        block.floorsCount = floors.length;
        totalFlats += block.flatsCount;
        occupiedFlats += bOcc;
        vacantFlats += bVac;
      });

      return {
        ...apt,
        totalBlocks: (apt.blocks || []).length,
        totalFloors: Math.max(totalFloors, apt.totalFloors || 0),
        totalFlats,
        occupiedFlats,
        vacantFlats
      };
    });
  };

  // ==========================================
  // PROPERTY CRUD & STRUCTURE ACTIONS
  // ==========================================

  // Add new property
  const addProperty = (newPropertyData) => {
    const id = `apt-${Date.now()}`;
    const code = newPropertyData.code || `BR-${Math.floor(100 + Math.random() * 900)}`;

    const newApt = {
      id,
      code,
      name: newPropertyData.name,
      propertyType: newPropertyData.propertyType || 'Residential Apartment',
      tagline: newPropertyData.tagline || 'Residential Community',
      address: newPropertyData.address || '',
      address2: newPropertyData.address2 || '',
      city: newPropertyData.city || 'Emerald City',
      state: newPropertyData.state || 'CA',
      zip: newPropertyData.zip || '94016',
      country: newPropertyData.country || 'United States',
      mapLink: newPropertyData.mapLink || '',
      image: newPropertyData.image || '/Images/bee-community-master.jpg',
      additionalImages: newPropertyData.additionalImages || [],
      builtYear: Number(newPropertyData.builtYear) || new Date().getFullYear(),
      registrationNumber: newPropertyData.registrationNumber || `REG-${code}-2026`,
      landArea: newPropertyData.landArea || '12.0 Acres',
      description: newPropertyData.description || 'Master community registered with BEE Residence.',
      propertyManager: newPropertyData.propertyManager || 'Admin Operations Desk',
      propertyManagerContact: newPropertyData.propertyManagerContact || '+1 (555) 000-1122',
      emergencyContact: newPropertyData.emergencyContact || '+1 (555) 911-0000',
      internalNotes: newPropertyData.internalNotes || '',
      status: newPropertyData.status || 'Active - Optimal',
      activeMaintenance: 0,
      rwaStatus: newPropertyData.rwaStatus || 'Not Registered',
      rwa: null,
      blocks: newPropertyData.blocks || [],
      documents: newPropertyData.documents || []
    };

    setApartments((prev) => {
      const updated = [newApt, ...prev];
      return recalculateApartmentCounters(updated);
    });

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'property',
        title: 'New Property Registered',
        description: `"${newApt.name}" (${newApt.code}) was registered with ${newApt.blocks.length} blocks.`,
        time: 'Just now',
        icon: 'Building2'
      },
      ...prev
    ]);

    addToast(`Property "${newApt.name}" registered successfully.`);
    return id;
  };

  // Update existing property
  const updateProperty = (propertyId, updatedData) => {
    setApartments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id !== propertyId) return apt;
        return {
          ...apt,
          ...updatedData,
          // Preserve existing blocks if not explicitly modified
          blocks: updatedData.blocks || apt.blocks,
          // Preserve documents if not explicitly modified
          documents: updatedData.documents || apt.documents
        };
      });
      return recalculateApartmentCounters(updated);
    });

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'property',
        title: 'Property Information Updated',
        description: `Updated property details for ${updatedData.name || 'Property'}.`,
        time: 'Just now',
        icon: 'Building2'
      },
      ...prev
    ]);

    addToast('Property details updated successfully.');
  };

  // Delete property
  const deleteProperty = (propertyId) => {
    const apt = apartments.find((a) => a.id === propertyId);
    setApartments((prev) => prev.filter((a) => a.id !== propertyId));
    if (selectedApartmentId === propertyId) {
      clearPropertySelection('all');
    }
    addToast(`Property "${apt?.name || 'Selected'}" removed.`);
  };

  // Add block to apartment
  const addBlock = (apartmentId, blockData) => {
    const blockId = `${apartmentId}-B${Date.now().toString().slice(-4)}`;
    const floorsCount = Number(blockData.floorsCount) || 4;
    const flatsPerFloor = Number(blockData.flatsPerFloor) || 4;

    // Generate floors and flats for this block
    const floors = [];
    for (let f = 1; f <= floorsCount; f++) {
      const floorId = `${blockId}-F${f}`;
      const flats = [];
      for (let fl = 1; fl <= flatsPerFloor; fl++) {
        const flatNumber = `${f}${fl < 10 ? '0' : ''}${fl}`;
        flats.push({
          number: flatNumber,
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

    const newBlock = {
      id: blockId,
      code: `Block-${blockData.name.split(' ')[0]}`,
      name: blockData.name,
      floorsCount,
      flatsCount: floorsCount * flatsPerFloor,
      occupiedFlats: 0,
      vacantFlats: floorsCount * flatsPerFloor,
      activeMaintenance: 0,
      status: blockData.status || 'Operational',
      assignedAgencies: [],
      floors
    };

    setApartments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        return {
          ...apt,
          blocks: [...(apt.blocks || []), newBlock]
        };
      });
      return recalculateApartmentCounters(updated);
    });

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'property',
        title: 'New Tower/Block Added',
        description: `Added "${newBlock.name}" with ${floorsCount} floors to property.`,
        time: 'Just now',
        icon: 'Layers'
      },
      ...prev
    ]);

    addToast(`Block "${newBlock.name}" added successfully.`);
  };

  // Update block
  const updateBlock = (apartmentId, blockId, blockData) => {
    setApartments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        const updatedBlocks = apt.blocks.map((b) => {
          if (b.id !== blockId) return b;
          return { ...b, ...blockData };
        });
        return { ...apt, blocks: updatedBlocks };
      });
      return recalculateApartmentCounters(updated);
    });
    addToast('Block details updated.');
  };

  // Delete block
  const deleteBlock = (apartmentId, blockId) => {
    setApartments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        return {
          ...apt,
          blocks: apt.blocks.filter((b) => b.id !== blockId)
        };
      });
      return recalculateApartmentCounters(updated);
    });
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setSelectedFloorId(null);
    }
    addToast('Block removed.');
  };

  // Add Floor to block
  const addFloor = (apartmentId, blockId, floorData) => {
    setApartments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        const updatedBlocks = apt.blocks.map((block) => {
          if (block.id !== blockId) return block;
          const nextFloorNum = (block.floors?.length || 0) + 1;
          const floorId = `${blockId}-F${nextFloorNum}`;
          const flatsPerFloor = Number(floorData.flatsCount) || 4;
          const flats = [];
          for (let fl = 1; fl <= flatsPerFloor; fl++) {
            const flatNum = `${nextFloorNum}${fl < 10 ? '0' : ''}${fl}`;
            flats.push({
              number: flatNum,
              status: 'Vacant',
              residentType: null,
              residentName: null,
              phone: null,
              email: null,
              activeMaintenance: 0
            });
          }

          const newFloor = {
            id: floorId,
            floorNumber: nextFloorNum,
            name: floorData.name || `Floor ${nextFloorNum}`,
            totalFlats: flatsPerFloor,
            occupiedFlats: 0,
            vacantFlats: flatsPerFloor,
            activeMaintenance: 0,
            flats
          };

          return {
            ...block,
            floors: [...(block.floors || []), newFloor]
          };
        });
        return { ...apt, blocks: updatedBlocks };
      });
      return recalculateApartmentCounters(updated);
    });
    addToast('New floor and flats configured successfully.');
  };

  // Add Flat to floor
  const addFlat = (apartmentId, blockId, floorId, flatData) => {
    setApartments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        const updatedBlocks = apt.blocks.map((block) => {
          if (block.id !== blockId) return block;
          const updatedFloors = block.floors.map((floor) => {
            if (floor.id !== floorId) return floor;
            const newFlat = {
              number: flatData.number,
              status: flatData.status || 'Vacant',
              residentType: flatData.residentType || null,
              residentName: flatData.residentName || null,
              phone: flatData.phone || null,
              email: flatData.email || null,
              activeMaintenance: 0
            };
            return {
              ...floor,
              flats: [...(floor.flats || []), newFlat]
            };
          });
          return { ...block, floors: updatedFloors };
        });
        return { ...apt, blocks: updatedBlocks };
      });
      return recalculateApartmentCounters(updated);
    });
    addToast(`Flat ${flatData.number} added successfully.`);
  };

  // Update Flat resident & occupancy
  const updateFlatResident = (apartmentId, blockId, floorId, flatNumber, residentData) => {
    setApartments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;

        const updatedBlocks = apt.blocks.map((block) => {
          if (block.id !== blockId) return block;

          const updatedFloors = block.floors.map((floor) => {
            if (floor.id !== floorId) return floor;

            const updatedFlats = floor.flats.map((flat) => {
              if (flat.number !== flatNumber) return flat;
              return {
                ...flat,
                ...residentData
              };
            });

            return { ...floor, flats: updatedFlats };
          });

          return { ...block, floors: updatedFloors };
        });

        return { ...apt, blocks: updatedBlocks };
      });

      return recalculateApartmentCounters(updated);
    });

    addToast(`Flat ${flatNumber} resident record updated successfully.`);
  };

  // Property Documents Actions
  const addPropertyDocument = (apartmentId, docData) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      fileType: docData.fileType || 'application/pdf',
      fileSize: docData.fileSize || '2.4 MB',
      ...docData
    };

    setApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        return {
          ...apt,
          documents: [newDoc, ...(apt.documents || [])]
        };
      })
    );

    addToast(`Document "${newDoc.name}" uploaded successfully.`);
  };

  const deletePropertyDocument = (apartmentId, docId) => {
    setApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        return {
          ...apt,
          documents: (apt.documents || []).filter((d) => d.id !== docId)
        };
      })
    );
    addToast('Document removed.');
  };

  // RWA Management Actions
  const updateRWA = (apartmentId, rwaData) => {
    setApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;
        return {
          ...apt,
          rwaStatus: rwaData.status,
          rwa: {
            ...rwaData,
            totalMembers: (rwaData.committee ? rwaData.committee.length : 0) + 3
          }
        };
      })
    );

    const apt = apartments.find((a) => a.id === apartmentId);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'rwa',
        title: 'RWA Association Record Updated',
        description: `${apt ? apt.name : 'Apartment'} RWA details modified by Administrator.`,
        time: 'Just now',
        icon: 'FileText'
      },
      ...prev
    ]);

    addToast('RWA Association information updated successfully.');
  };

  // ==========================================
  // AGENCY ONBOARDING & CRUD ACTIONS
  // ==========================================

  // Add Agency (Onboarding - Stage 1)
  const addAgency = (agencyData) => {
    const id = `ag-${Date.now()}`;
    const initials = (agencyData.name || 'Agency')
      .split(' ')
      .map((w) => w[0])
      .slice(0, 4)
      .join('')
      .toUpperCase();

    const newAg = {
      id,
      name: agencyData.name,
      category: agencyData.category || (agencyData.categories?.[0] || 'Facility Management'),
      categories: agencyData.categories || [agencyData.category || 'Facility Management'],
      logoText: initials,
      contactPerson: `${agencyData.agent?.firstName || 'Agent'} ${agencyData.agent?.lastName || ''}`.trim(),
      phone: agencyData.company?.companyPhone || agencyData.agent?.phone || '+1 (555) 000-0000',
      email: agencyData.company?.companyEmail || agencyData.agent?.email || 'contact@agency.com',
      agreementStatus:
        agencyData.registrationStatus === 'Approved for Property Assignment'
          ? 'Active (Direct Contract)'
          : `Registration ${agencyData.registrationStatus || 'Submitted'}`,
      availabilityStatus: agencyData.availabilityStatus || 'Available',
      totalPersonnel: Number(agencyData.totalPersonnel) || 10,
      allocatedPersonnel: 0,
      availablePersonnel: Number(agencyData.totalPersonnel) || 10,
      onLeavePersonnel: 0,
      activeAssignmentsCount: 0,
      registrationRefNumber: agencyData.registrationRefNumber || `REG-${Date.now().toString().slice(-6)}`,
      registrationStatus: agencyData.registrationStatus || 'Submitted',
      submissionDate: agencyData.submissionDate || new Date().toISOString().split('T')[0],
      termsAccepted: agencyData.termsAccepted !== undefined ? agencyData.termsAccepted : true,
      declarationAccepted: agencyData.declarationAccepted !== undefined ? agencyData.declarationAccepted : true,
      agent: agencyData.agent || {},
      company: agencyData.company || {},
      contacts: agencyData.contacts || {},
      services: agencyData.services || [],
      documents: agencyData.documents || [],
      personnel: agencyData.personnel || [],
      assignments: [],
      propertyAssignments: agencyData.propertyAssignments || [],
      approvalHistory: agencyData.approvalHistory || [
        {
          id: `appr-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: 'registration',
          decision: agencyData.registrationStatus || 'Submitted',
          reviewer: 'System Gateway',
          comments: 'Registration submitted for administrative review.',
          changesRequested: null
        }
      ]
    };

    setAgencies((prev) => [newAg, ...prev]);

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'agency',
        title: 'New Agency Registration Submitted',
        description: `"${newAg.name}" submitted onboarding application (${newAg.registrationRefNumber}).`,
        time: 'Just now',
        icon: 'Briefcase'
      },
      ...prev
    ]);

    addToast(`Agency "${newAg.name}" onboarding record created.`);
    return id;
  };

  // Update existing agency
  const updateAgency = (agencyId, updatedData) => {
    setAgencies((prev) =>
      prev.map((ag) => {
        if (ag.id !== agencyId) return ag;
        return {
          ...ag,
          ...updatedData
        };
      })
    );
    addToast('Agency profile updated successfully.');
  };

  // Delete agency
  const deleteAgency = (agencyId) => {
    const ag = agencies.find((a) => a.id === agencyId);
    setAgencies((prev) => prev.filter((a) => a.id !== agencyId));
    addToast(`Agency "${ag?.name || 'Selected'}" deleted.`);
  };

  // Review Agency Registration (Admin Stage 1 Approval)
  const reviewAgencyRegistration = (agencyId, decision, comments, changesRequested = null) => {
    setAgencies((prev) =>
      prev.map((ag) => {
        if (ag.id !== agencyId) return ag;

        const newStatus =
          decision === 'Approve'
            ? 'Approved for Property Assignment'
            : decision === 'Request Changes'
            ? 'Changes Requested'
            : decision === 'Reject'
            ? 'Rejected'
            : decision;

        const newHistory = {
          id: `appr-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: 'registration',
          decision: newStatus,
          reviewer: 'Zivion Admin',
          comments: comments || 'Reviewed by administrator.',
          changesRequested
        };

        return {
          ...ag,
          registrationStatus: newStatus,
          agreementStatus:
            newStatus === 'Approved for Property Assignment'
              ? 'Approved (Eligible for Property Assignment)'
              : `Registration ${newStatus}`,
          approvalHistory: [newHistory, ...(ag.approvalHistory || [])]
        };
      })
    );

    const ag = agencies.find((a) => a.id === agencyId);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'approval',
        title: `Agency Registration ${decision === 'Approve' ? 'Approved' : decision}`,
        description: `${ag?.name || 'Agency'} registration updated to "${decision}".`,
        time: 'Just now',
        icon: 'CheckCircle2'
      },
      ...prev
    ]);

    addToast(`Registration decision "${decision}" recorded for ${ag?.name || 'agency'}.`);
  };

  // Add / Update Personnel
  const addAgencyPersonnel = (agencyId, personnelData) => {
    const id = `p-${Date.now()}`;
    const newP = {
      id,
      experience: '5 yrs',
      status: 'Available',
      currentShift: 'Unassigned',
      ...personnelData
    };

    setAgencies((prev) =>
      prev.map((ag) => {
        if (ag.id !== agencyId) return ag;
        const currentPersonnel = ag.personnel || [];
        const updatedPersonnel = [newP, ...currentPersonnel];
        const total = updatedPersonnel.length;
        const allocated = updatedPersonnel.filter((p) => p.status === 'Assigned').length;
        const onLeave = updatedPersonnel.filter((p) => p.status === 'On Leave').length;
        const available = Math.max(0, total - allocated - onLeave);

        return {
          ...ag,
          totalPersonnel: total,
          allocatedPersonnel: allocated,
          availablePersonnel: available,
          onLeavePersonnel: onLeave,
          personnel: updatedPersonnel
        };
      })
    );

    addToast(`Personnel "${newP.name}" added to roster.`);
  };

  const updateAgencyPersonnel = (agencyId, personnelId, personnelData) => {
    setAgencies((prev) =>
      prev.map((ag) => {
        if (ag.id !== agencyId) return ag;
        const updatedPersonnel = (ag.personnel || []).map((p) => {
          if (p.id !== personnelId) return p;
          return { ...p, ...personnelData };
        });

        const total = updatedPersonnel.length;
        const allocated = updatedPersonnel.filter((p) => p.status === 'Assigned').length;
        const onLeave = updatedPersonnel.filter((p) => p.status === 'On Leave').length;
        const available = Math.max(0, total - allocated - onLeave);

        return {
          ...ag,
          totalPersonnel: total,
          allocatedPersonnel: allocated,
          availablePersonnel: available,
          onLeavePersonnel: onLeave,
          personnel: updatedPersonnel
        };
      })
    );
    addToast('Personnel record updated.');
  };

  const deleteAgencyPersonnel = (agencyId, personnelId) => {
    setAgencies((prev) =>
      prev.map((ag) => {
        if (ag.id !== agencyId) return ag;
        const updatedPersonnel = (ag.personnel || []).filter((p) => p.id !== personnelId);
        const total = updatedPersonnel.length;
        const allocated = updatedPersonnel.filter((p) => p.status === 'Assigned').length;
        const onLeave = updatedPersonnel.filter((p) => p.status === 'On Leave').length;
        const available = Math.max(0, total - allocated - onLeave);

        return {
          ...ag,
          totalPersonnel: total,
          allocatedPersonnel: allocated,
          availablePersonnel: available,
          onLeavePersonnel: onLeave,
          personnel: updatedPersonnel
        };
      })
    );
    addToast('Personnel removed from agency.');
  };

  // ==========================================
  // PROPERTY ASSIGNMENT (STAGE 2) & APPROVAL
  // ==========================================

  // Request Property Assignment (Stage 2)
  const requestPropertyAssignment = (agencyId, assignmentData) => {
    const id = `par-${Date.now()}`;
    const newAssignment = {
      id,
      organization: assignmentData.organization || 'BEE Residence / Zivion Management',
      propertyId: assignmentData.propertyId,
      propertyName: assignmentData.propertyName,
      propertyCode: assignmentData.propertyCode,
      propertyType: assignmentData.propertyType,
      propertyAddress: assignmentData.propertyAddress,
      city: assignmentData.city,
      state: assignmentData.state,
      assignmentType: assignmentData.assignmentType || 'Single Property',
      assignedBlocks: assignmentData.assignedBlocks || [],
      assignedFloorsZones: assignmentData.assignedFloorsZones || '',
      assignedFacilitiesAreas: assignmentData.assignedFacilitiesAreas || [],
      startDate: assignmentData.startDate,
      endDate: assignmentData.endDate || null,
      requestedServices: assignmentData.requestedServices || [],
      approvedServices: [],
      approvedBlocks: [],
      propertyContactPerson: assignmentData.propertyContactPerson || '',
      propertyContactNumber: assignmentData.propertyContactNumber || '',
      propertyManagerSponsor: assignmentData.propertyManagerSponsor || 'Property Manager',
      supportingDocs: assignmentData.supportingDocs || [],
      reason: assignmentData.reason || '',
      status: 'Submitted for Approval',
      submissionDate: new Date().toISOString().split('T')[0],
      reviewDate: null,
      reviewer: null,
      comments: '',
      restrictions: ''
    };

    setAgencies((prev) =>
      prev.map((ag) => {
        if (ag.id !== agencyId) return ag;
        return {
          ...ag,
          propertyAssignments: [newAssignment, ...(ag.propertyAssignments || [])]
        };
      })
    );

    const ag = agencies.find((a) => a.id === agencyId);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'assignment_request',
        title: 'Property Assignment Requested',
        description: `${ag?.name || 'Agency'} requested assignment to "${newAssignment.propertyName}".`,
        time: 'Just now',
        icon: 'Building2'
      },
      ...prev
    ]);

    addToast(`Property assignment request submitted for ${newAssignment.propertyName}.`);
    return id;
  };

  // Review & Decide on Property Assignment (Admin Stage 2 Approval)
  const reviewPropertyAssignment = (agencyId, assignmentId, decisionData) => {
    const {
      decision, // 'Approve' | 'Approve with Restrictions' | 'Request Changes' | 'Reject'
      approvedServices = [],
      approvedBlocks = [],
      approvedStartDate = null,
      approvedEndDate = null,
      comments = '',
      rejectionReason = '',
      checklist = {}
    } = decisionData;

    setAgencies((prev) =>
      prev.map((ag) => {
        if (ag.id !== agencyId) return ag;

        let newStatus = 'Approved';
        if (decision === 'Approve with Restrictions') {
          newStatus = 'Approved with Restrictions';
        } else if (decision === 'Request Changes') {
          newStatus = 'Changes Requested';
        } else if (decision === 'Reject') {
          newStatus = 'Rejected';
        }

        const updatedAssignments = (ag.propertyAssignments || []).map((as) => {
          if (as.id !== assignmentId) return as;

          return {
            ...as,
            status: newStatus,
            reviewDate: new Date().toISOString().split('T')[0],
            reviewer: 'Zivion Admin',
            comments: comments || rejectionReason,
            checklist,
            approvedServices:
              decision === 'Approve'
                ? as.requestedServices
                : decision === 'Approve with Restrictions'
                ? approvedServices
                : [],
            approvedBlocks:
              decision === 'Approve'
                ? as.assignedBlocks
                : decision === 'Approve with Restrictions'
                ? approvedBlocks
                : [],
            approvedStartDate: approvedStartDate || as.startDate,
            approvedEndDate: approvedEndDate || as.endDate
          };
        });

        const targetAssignment = (ag.propertyAssignments || []).find((as) => as.id === assignmentId);

        const newHistory = {
          id: `appr-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: 'property_assignment',
          decision: newStatus,
          reviewer: 'Zivion Admin',
          comments: comments || rejectionReason,
          details: `Property: ${targetAssignment?.propertyName || 'Property'} • Services: ${(decision === 'Approve' ? targetAssignment?.requestedServices : approvedServices)?.join(', ')}`
        };

        const activeCount = updatedAssignments.filter(
          (a) => a.status === 'Approved' || a.status === 'Approved with Restrictions'
        ).length;

        return {
          ...ag,
          activeAssignmentsCount: Math.max(ag.activeAssignmentsCount || 0, activeCount),
          propertyAssignments: updatedAssignments,
          approvalHistory: [newHistory, ...(ag.approvalHistory || [])]
        };
      })
    );

    const ag = agencies.find((a) => a.id === agencyId);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'assignment_approval',
        title: `Property Assignment ${decision}`,
        description: `${ag?.name || 'Agency'} assignment decision: "${decision}".`,
        time: 'Just now',
        icon: 'ShieldCheck'
      },
      ...prev
    ]);

    addToast(`Property assignment ${decision} confirmed.`);
  };

  // ==========================================
  // MAINTENANCE & SECURITY ALLOCATIONS
  // ==========================================

  // Agency Assignment to Maintenance Ticket
  const assignAgencyToMaintenance = (maintenanceId, agencyId, personnelNames, scheduledDate, scheduledTime) => {
    const agency = agencies.find((ag) => ag.id === agencyId);
    if (!agency) return;

    let targetRequest = null;

    setMaintenanceRequests((prev) =>
      prev.map((req) => {
        if (req.id !== maintenanceId) return req;
        targetRequest = {
          ...req,
          status: 'Assigned',
          assignedAgencyId: agencyId,
          assignedAgencyName: agency.name,
          assignedPersonnel: personnelNames,
          scheduledDate,
          scheduledTime
        };
        return targetRequest;
      })
    );

    // Update Agency Personnel status and allocated count
    setAgencies((prev) =>
      prev.map((ag) => {
        if (ag.id !== agencyId) return ag;

        const countAssigned = personnelNames.length;
        const newAllocated = Math.min(ag.totalPersonnel, (ag.allocatedPersonnel || 0) + countAssigned);
        const newAvailable = Math.max(0, ag.totalPersonnel - newAllocated - (ag.onLeavePersonnel || 0));

        const updatedPersonnel = (ag.personnel || []).map((p) => {
          if (personnelNames.includes(p.name)) {
            return {
              ...p,
              status: 'Assigned',
              currentShift: `${scheduledDate} (${scheduledTime})`
            };
          }
          return p;
        });

        const newAssignment = {
          id: `as-${Date.now()}`,
          property: targetRequest ? targetRequest.apartmentName : 'Apartment Community',
          location: targetRequest
            ? `${targetRequest.blockName || ''} ${targetRequest.flatNumber ? `Flat ${targetRequest.flatNumber}` : ''}`
            : 'Service Location',
          type: targetRequest ? targetRequest.title : 'Maintenance Ticket',
          personnel: personnelNames,
          shift: scheduledTime,
          date: scheduledDate,
          status: 'Scheduled'
        };

        return {
          ...ag,
          allocatedPersonnel: newAllocated,
          availablePersonnel: newAvailable,
          activeAssignmentsCount: (ag.activeAssignmentsCount || 0) + 1,
          availabilityStatus: newAvailable === 0 ? 'Fully Allocated' : newAvailable < 3 ? 'Partially Available' : 'Available',
          personnel: updatedPersonnel,
          assignments: [newAssignment, ...(ag.assignments || [])]
        };
      })
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'assignment',
        title: 'Maintenance Agency Allocated',
        description: `${agency.name} assigned to "${targetRequest ? targetRequest.title : 'Ticket'}" with ${personnelNames.join(', ')}.`,
        time: 'Just now',
        icon: 'Wrench'
      },
      ...prev
    ]);

    addToast(`Assigned ${agency.name} to ticket successfully.`);
  };

  // Update Maintenance Status
  const updateMaintenanceStatus = (maintenanceId, newStatus) => {
    let reqTitle = '';
    setMaintenanceRequests((prev) =>
      prev.map((req) => {
        if (req.id !== maintenanceId) return req;
        reqTitle = req.title;
        return { ...req, status: newStatus };
      })
    );

    if (newStatus === 'Completed') {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: 'completion',
          title: 'Maintenance Request Completed',
          description: `Work order "${reqTitle}" marked as completed.`,
          time: 'Just now',
          icon: 'CheckCircle2'
        },
        ...prev
      ]);
    }

    addToast(`Status updated to "${newStatus}".`);
  };

  // Create New Maintenance Request
  const createMaintenanceRequest = (newRequestData) => {
    const newReq = {
      id: `maint-${Date.now()}`,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Reported',
      assignedAgencyId: null,
      assignedAgencyName: null,
      assignedPersonnel: [],
      scheduledDate: null,
      scheduledTime: null,
      ...newRequestData
    };

    setMaintenanceRequests((prev) => [newReq, ...prev]);

    // Increment activeMaintenance in apartment
    setApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== newReq.apartmentId) return apt;
        return {
          ...apt,
          activeMaintenance: (apt.activeMaintenance || 0) + 1
        };
      })
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'maintenance',
        title: 'New Maintenance Ticket Registered',
        description: `New issue "${newReq.title}" reported at ${newReq.apartmentName}.`,
        time: 'Just now',
        icon: 'AlertTriangle'
      },
      ...prev
    ]);

    addToast('New maintenance ticket reported successfully.');
  };

  // Allocate Security Forces
  const allocateSecurity = (deployment) => {
    const agency = agencies.find((a) => a.id === deployment.agencyId);
    if (!agency) return;

    const newDep = {
      id: `sec-${Date.now()}`,
      apartmentName: apartments.find((a) => a.id === deployment.apartmentId)?.name || 'Community',
      agencyName: agency.name,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      ...deployment
    };

    setSecurityDeployments((prev) => [newDep, ...prev]);

    setAgencies((prev) =>
      prev.map((ag) => {
        if (ag.id !== deployment.agencyId) return ag;

        const count = deployment.personnelNames ? deployment.personnelNames.length : deployment.allocatedGuards || 1;
        const newAllocated = Math.min(ag.totalPersonnel, (ag.allocatedPersonnel || 0) + count);
        const newAvailable = Math.max(0, ag.totalPersonnel - newAllocated - (ag.onLeavePersonnel || 0));

        const updatedPersonnel = (ag.personnel || []).map((p) => {
          if (deployment.personnelNames && deployment.personnelNames.some((name) => name.includes(p.name))) {
            return {
              ...p,
              status: 'Assigned',
              currentShift: deployment.shift
            };
          }
          return p;
        });

        const newAssignment = {
          id: `as-${Date.now()}`,
          property: newDep.apartmentName,
          location: deployment.blockName || 'Perimeter',
          type: 'Security Deployment',
          personnel: deployment.personnelNames || [`${deployment.allocatedGuards} Guards`],
          shift: deployment.shift,
          date: newDep.startDate,
          status: 'Active'
        };

        return {
          ...ag,
          allocatedPersonnel: newAllocated,
          availablePersonnel: newAvailable,
          activeAssignmentsCount: (ag.activeAssignmentsCount || 0) + 1,
          availabilityStatus: newAvailable === 0 ? 'Fully Allocated' : newAvailable < 3 ? 'Partially Available' : 'Available',
          personnel: updatedPersonnel,
          assignments: [newAssignment, ...(ag.assignments || [])]
        };
      })
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'security',
        title: 'Security Shift Deployed',
        description: `${agency.name} deployed ${deployment.allocatedGuards} personnel at ${newDep.apartmentName}.`,
        time: 'Just now',
        icon: 'ShieldCheck'
      },
      ...prev
    ]);

    addToast(`Security squad deployed for ${newDep.apartmentName}.`);
  };

  // Reset to default demo data
  const resetToDefaultData = () => {
    resetAllStorage();
    setApartments(INITIAL_APARTMENTS);
    setAgencies(INITIAL_AGENCIES);
    setMaintenanceRequests(INITIAL_MAINTENANCE);
    setActivities(INITIAL_ACTIVITIES);
    setSecurityDeployments(INITIAL_SECURITY_DEPLOYMENTS);
    clearPropertySelection('all');
    addToast('All data has been reset to default demo records.');
  };

  // Calculated System Metrics for Dashboard & Headers
  const metrics = useMemo(() => {
    let totalApartments = apartments.length;
    let totalBlocks = 0;
    let totalFlats = 0;
    let occupiedFlats = 0;
    let vacantFlats = 0;

    apartments.forEach((apt) => {
      totalBlocks += apt.totalBlocks || (apt.blocks?.length || 0);
      totalFlats += apt.totalFlats || 0;
      occupiedFlats += apt.occupiedFlats || 0;
      vacantFlats += apt.vacantFlats || 0;
    });

    const activeAgencies = agencies.filter((a) =>
      (a.agreementStatus || '').includes('Active') ||
      a.registrationStatus === 'Approved for Property Assignment'
    ).length;

    const availableAgencies = agencies.filter(
      (a) => a.availabilityStatus === 'Available' || a.availabilityStatus === 'Partially Available'
    ).length;

    const currentlyAssignedAgencies = agencies.filter((a) => (a.allocatedPersonnel || 0) > 0).length;
    const totalAllocatedPersonnel = agencies.reduce((acc, a) => acc + (a.allocatedPersonnel || 0), 0);

    // Calculate pending approvals (both pending registrations + pending property assignments)
    let pendingAgencyRegistrations = 0;
    let pendingPropertyAssignments = 0;

    agencies.forEach((ag) => {
      if (ag.registrationStatus === 'Submitted' || ag.registrationStatus === 'Under Review') {
        pendingAgencyRegistrations++;
      }
      (ag.propertyAssignments || []).forEach((pa) => {
        if (pa.status === 'Submitted for Approval' || pa.status === 'Under Review') {
          pendingPropertyAssignments++;
        }
      });
    });

    const pendingApprovals = pendingAgencyRegistrations + pendingPropertyAssignments;

    const activeMaintenanceRequests = maintenanceRequests.filter(
      (m) =>
        m.status === 'Reported' ||
        m.status === 'Pending Assignment' ||
        m.status === 'Assigned' ||
        m.status === 'In Progress'
    ).length;

    return {
      totalApartments,
      totalBlocks,
      totalFlats,
      occupiedFlats,
      vacantFlats,
      activeAgencies,
      availableAgencies,
      currentlyAssignedAgencies,
      totalAllocatedPersonnel,
      pendingApprovals,
      pendingAgencyRegistrations,
      pendingPropertyAssignments,
      activeMaintenanceRequests
    };
  }, [apartments, agencies, maintenanceRequests]);

  const value = {
    apartments,
    agencies,
    maintenanceRequests,
    activities,
    securityDeployments,
    metrics,

    // Navigation
    activePage,
    navigateTo,
    selectedApartmentId,
    selectedBlockId,
    selectedFloorId,
    selectedFlatNumber,
    propertyActiveTab,
    setPropertyActiveTab,
    selectApartment,
    selectBlock,
    selectFloor,
    selectFlat,
    clearPropertySelection,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,

    // Search
    globalSearchQuery,
    setGlobalSearchQuery,

    // Modals
    propertyFormModal,
    setPropertyFormModal,
    propertyDocumentsModal,
    setPropertyDocumentsModal,
    addBlockModal,
    setAddBlockModal,
    editBlockModal,
    setEditBlockModal,
    addFloorModal,
    setAddFloorModal,
    addFlatModal,
    setAddFlatModal,
    agencyOnboardingModal,
    setAgencyOnboardingModal,
    propertyAssignmentModal,
    setPropertyAssignmentModal,
    registrationReviewModal,
    setRegistrationReviewModal,
    assignmentApprovalModal,
    setAssignmentApprovalModal,
    personnelModal,
    setPersonnelModal,
    rwaModalApartmentId,
    setRwaModalApartmentId,
    agencyAllocationRequest,
    setAgencyAllocationRequest,
    securityAllocationModalOpen,
    setSecurityAllocationModalOpen,
    flatDetailModalData,
    setFlatDetailModalData,
    maintenanceDetailModalRequest,
    setMaintenanceDetailModalRequest,
    agencyDetailModalId,
    setAgencyDetailModalId,
    newMaintenanceModalApartmentId,
    setNewMaintenanceModalApartmentId,

    // Core Property Mutators
    addProperty,
    updateProperty,
    deleteProperty,
    addBlock,
    updateBlock,
    deleteBlock,
    addFloor,
    addFlat,
    updateFlatResident,
    addPropertyDocument,
    deletePropertyDocument,
    updateRWA,

    // Core Agency Mutators
    addAgency,
    updateAgency,
    deleteAgency,
    reviewAgencyRegistration,
    addAgencyPersonnel,
    updateAgencyPersonnel,
    deleteAgencyPersonnel,
    requestPropertyAssignment,
    reviewPropertyAssignment,

    // Maintenance & Security
    assignAgencyToMaintenance,
    updateMaintenanceStatus,
    createMaintenanceRequest,
    allocateSecurity,

    // Demo Data
    resetToDefaultData,

    // Toasts
    toasts,
    addToast,
    removeToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
