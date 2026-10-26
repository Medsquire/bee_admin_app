import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Agencies from './pages/Agencies';
import RWAManagementModal from './components/properties/RWAManagementModal';
import AgencyAllocationModal from './components/agencies/AgencyAllocationModal';
import SecurityAllocationModal from './components/agencies/SecurityAllocationModal';
import FlatDetailModal from './components/properties/FlatDetailModal';
import MaintenanceDetailModal from './components/properties/MaintenanceDetailModal';
import NewMaintenanceModal from './components/properties/NewMaintenanceModal';
import AgencyDetailsModal from './components/agencies/AgencyDetailsModal';
import PropertyFormModal from './components/properties/PropertyFormModal';
import PropertyDocumentsModal from './components/properties/PropertyDocumentsModal';
import AddBlockModal from './components/properties/AddBlockModal';
import EditBlockModal from './components/properties/EditBlockModal';
import AddFloorModal from './components/properties/AddFloorModal';
import AddFlatModal from './components/properties/AddFlatModal';
import AgencyOnboardingModal from './components/agencies/AgencyOnboardingModal';
import PropertyAssignmentModal from './components/agencies/PropertyAssignmentModal';
import RegistrationReviewModal from './components/agencies/RegistrationReviewModal';
import AssignmentApprovalModal from './components/agencies/AssignmentApprovalModal';
import PersonnelModal from './components/agencies/PersonnelModal';
import ToastContainer from './components/common/ToastContainer';

function MainApp() {
  const { activePage } = useApp();

  return (
    <div className="app-container">
      {/* Fixed Desktop / Drawer Mobile Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Header />

        <main style={{ flex: 1 }}>
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'properties' && <Properties />}
          {activePage === 'agencies' && <Agencies />}
        </main>
      </div>

      {/* Global Interactive Modals strictly adhering to PRD requirements */}
      <RWAManagementModal />
      <AgencyAllocationModal />
      <SecurityAllocationModal />
      <FlatDetailModal />
      <MaintenanceDetailModal />
      <NewMaintenanceModal />
      <AgencyDetailsModal />
      
      {/* Property Hierarchy & CRUD Modals */}
      <PropertyFormModal />
      <PropertyDocumentsModal />
      <AddBlockModal />
      <EditBlockModal />
      <AddFloorModal />
      <AddFlatModal />

      {/* Agency Onboarding, Personnel & Multi-Stage Approvals */}
      <AgencyOnboardingModal />
      <PropertyAssignmentModal />
      <RegistrationReviewModal />
      <AssignmentApprovalModal />
      <PersonnelModal />

      {/* Action Toast Feedback */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

