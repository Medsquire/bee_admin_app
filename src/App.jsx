import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { UnitDetailDrawer } from './components/UnitDetailDrawer';
import { NewWorkOrderModal } from './components/NewWorkOrderModal';
import { NewTenantModal } from './components/NewTenantModal';

import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { UnitsScreen } from './screens/UnitsScreen';
import { TenantsScreen } from './screens/TenantsScreen';
import { MaintenanceScreen } from './screens/MaintenanceScreen';
import { FinancialsScreen } from './screens/FinancialsScreen';
import { AmenitiesScreen } from './screens/AmenitiesScreen';
import { ThemeGuideScreen } from './screens/ThemeGuideScreen';
import { PropertyCommunityScreen } from './screens/PropertyCommunityScreen';
import { ResidencesScreen } from './screens/ResidencesScreen';
import { RwaScreen } from './screens/RwaScreen';
import { AgenciesScreen } from './screens/AgenciesScreen';
import { SecurityScreen } from './screens/SecurityScreen';

import {
  PROPERTIES,
  INITIAL_UNITS,
  INITIAL_TENANTS,
  INITIAL_WORK_ORDERS
} from './data/mockData';
import {
  APARTMENT_TEMPLATES,
  INITIAL_COMMUNITY_FLATS
} from './data/communityData';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [activeProperty, setActiveProperty] = useState(PROPERTIES[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Live Hierarchy & Flats State
  const [apartments, setApartments] = useState(() => {
    try {
      const saved = localStorage.getItem('bee_apartments');
      return saved ? JSON.parse(saved) : APARTMENT_TEMPLATES;
    } catch {
      return APARTMENT_TEMPLATES;
    }
  });

  const [communityFlats, setCommunityFlats] = useState(() => {
    try {
      const saved = localStorage.getItem('bee_community_flats');
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_FLATS;
    } catch {
      return INITIAL_COMMUNITY_FLATS;
    }
  });

  // Live state
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [tenants, setTenants] = useState(INITIAL_TENANTS);
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);

  // Modals & Drawers
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [workOrderDefaultUnit, setWorkOrderDefaultUnit] = useState('101');
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  const addToast = (title, message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };



  // Synchronize document attribute for CSS custom properties
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      addToast(`Theme Switched`, `Now viewing ZIVION in ${next.toUpperCase()} mode.`, 'info');
      return next;
    });
  };

  // Work Order Creation Handler
  const handleCreateWorkOrder = (data) => {
    const newId = `WO-${Math.floor(8500 + Math.random() * 500)}`;
    const newOrder = {
      id: newId,
      unit: data.unit,
      category: data.category,
      title: data.title,
      description: data.description || 'Dispatched from Admin Command Center.',
      priority: data.priority,
      status: 'Reported',
      assignedTo: data.assignedTo,
      vendorPhone: '+1 (555) 700-1122',
      createdDate: 'Just now',
      estimatedCost: data.priority === 'Urgent' ? '$340.00' : '$150.00',
      tenantAccessPermission: true,
      progressPercent: 0,
      notes: 'Initial work order dispatched. Awaiting technician arrival.'
    };

    setWorkOrders(prev => [newOrder, ...prev]);
    addToast('Work Order Created', `Ticket ${newId} dispatched to ${data.assignedTo}`, 'success');
  };

  // Work Order Status Updater
  const handleUpdateWorkOrderStatus = (ticketId, nextStatus) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id === ticketId) {
        return {
          ...w,
          status: nextStatus,
          progressPercent: nextStatus === 'Completed' ? 100 : nextStatus === 'In Progress' ? 50 : 10
        };
      }
      return w;
    }));
    addToast('Work Order Status Updated', `Ticket ${ticketId} is now ${nextStatus}`, 'info');
  };

  // Tenant Onboarding Handler
  const handleCreateTenant = (data) => {
    const newTenant = {
      id: `TEN-${Date.now().toString().slice(-4)}`,
      ...data
    };

    setTenants(prev => [newTenant, ...prev]);

    setUnits(prev => prev.map(u => {
      if (u.number === data.unit) {
        return {
          ...u,
          status: 'Occupied',
          tenant: data.name,
          leaseEnd: data.leaseEnd
        };
      }
      return u;
    }));

    addToast('Resident Onboarded', `${data.name} assigned to Unit #${data.unit}`, 'success');
  };

  // Unit Status Changer
  const handleUnitStatusChange = (unitId, nextStatus) => {
    setUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        const updated = {
          ...u,
          status: nextStatus,
          tenant: nextStatus === 'Vacant' ? null : u.tenant
        };
        setSelectedUnit(updated);
        return updated;
      }
      return u;
    }));
    addToast('Unit Status Updated', `Unit marked as ${nextStatus}`, 'info');
  };

  // Send Notice simulation
  const handleSendNotice = (recipient, context) => {
    addToast('Electronic Notice Transmitted', `Instant push notification & email dispatched to ${recipient} (${context})`, 'success');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    addToast('Authenticated', 'Welcome back, Chief Admin Likitha', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    addToast('Signed Out', 'Admin session terminated safely.', 'info');
  };

  // If user is not authenticated, display the apartment community login page
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen
          onLogin={handleLogin}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar matching exact reference UI */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <div className="app-main-content">
        <Header
          currentTab={currentTab}
          addToast={addToast}
        />

        {/* Content Body with specialized screens */}
        <main className="content-body">
          {currentTab === 'dashboard' && (
            <DashboardScreen
              units={units}
              tenants={tenants}
              workOrders={workOrders}
              activeProperty={activeProperty}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSelectUnit={(unit) => setSelectedUnit(unit)}
              onOpenWorkOrderModal={() => setIsWorkOrderModalOpen(true)}
            />
          )}

          {(currentTab === 'properties' || currentTab === 'community') && (
            <PropertyCommunityScreen
              apartments={apartments}
              setApartments={setApartments}
              flats={communityFlats}
              setFlats={setCommunityFlats}
              onOpenWorkOrderModal={(unitNum) => {
                setWorkOrderDefaultUnit(unitNum);
                setIsWorkOrderModalOpen(true);
              }}
              addToast={addToast}
            />
          )}

          {currentTab === 'residences' && (
            <ResidencesScreen
              apartments={apartments}
              setApartments={setApartments}
              flats={communityFlats}
              setFlats={setCommunityFlats}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenWorkOrderModal={(unitNum) => {
                setWorkOrderDefaultUnit(unitNum);
                setIsWorkOrderModalOpen(true);
              }}
              addToast={addToast}
            />
          )}

          {currentTab === 'rwa' && (
            <RwaScreen
              addToast={addToast}
            />
          )}

          {(currentTab === 'agencys' || currentTab === 'agencies') && (
            <AgenciesScreen
              addToast={addToast}
            />
          )}

          {currentTab === 'security' && (
            <SecurityScreen
              addToast={addToast}
            />
          )}

          {currentTab === 'units' && (
            <UnitsScreen
              units={units}
              onSelectUnit={(unit) => setSelectedUnit(unit)}
              searchTerm={searchTerm}
              onOpenWorkOrderModal={(unitNum) => {
                setWorkOrderDefaultUnit(unitNum);
                setIsWorkOrderModalOpen(true);
              }}
            />
          )}

          {(currentTab === 'tenants' || currentTab === 'technicians') && (
            <TenantsScreen
              tenants={tenants}
              onOpenNewTenant={() => setIsTenantModalOpen(true)}
              onSendNotice={handleSendNotice}
              searchTerm={searchTerm}
            />
          )}

          {(currentTab === 'maintenance' || currentTab === 'services') && (
            <MaintenanceScreen
              workOrders={workOrders}
              onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
              onOpenCreateModal={(unitNum = '101') => {
                setWorkOrderDefaultUnit(unitNum);
                setIsWorkOrderModalOpen(true);
              }}
              searchTerm={searchTerm}
            />
          )}

          {currentTab === 'financials' && (
            <FinancialsScreen
              onSendNotice={handleSendNotice}
              searchTerm={searchTerm}
            />
          )}

          {currentTab === 'amenities' && (
            <AmenitiesScreen
              onSendNotice={handleSendNotice}
            />
          )}

          {(currentTab === 'theme-guide' || currentTab === 'reports') && (
            <ThemeGuideScreen
              theme={theme}
              toggleTheme={toggleTheme}
              onCopyColor={(name, hex) => {
                addToast('Hex Copied to Clipboard', `${name}: ${hex}`, 'success');
              }}
            />
          )}
        </main>
      </div>

      {/* Slide-out Unit Detail Inspection Drawer */}
      <UnitDetailDrawer
        unit={selectedUnit}
        onClose={() => setSelectedUnit(null)}
        onOpenWorkOrderModal={(unitNum) => {
          setWorkOrderDefaultUnit(unitNum);
          setIsWorkOrderModalOpen(true);
        }}
        onStatusChange={handleUnitStatusChange}
      />

      {/* New Work Order Modal */}
      <NewWorkOrderModal
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
        onSubmit={handleCreateWorkOrder}
        defaultUnit={workOrderDefaultUnit}
        units={units}
      />

      {/* New Tenant Onboarding Modal */}
      <NewTenantModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        onSubmit={handleCreateTenant}
        units={units}
      />

      {/* Floating Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
