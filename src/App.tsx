import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import FilterBar from './components/FilterBar';
import PendingApprovalsTable from './components/PendingApprovalsTable';
import ViolationFilterBar from './components/ViolationFilterBar';
import ViolationTable from './components/ViolationTable';
import Dashboard from './components/Dashboard';
import UserAccountManagement from './components/UserAccountManagement';
import VehicleRegistry from './components/VehicleRegistry';
import AnalyticsReporting from './components/AnalyticsReporting';

function App() {
  const [activeItem, setActiveItem] = useState('violation-management');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Violation management specific filters
  const [plateNumberFilter, setPlateNumberFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [violationStatusFilter, setViolationStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    console.log(`Navigation clicked: ${item}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Search query: ${query}`);
  };

  const handleFilterChange = (filter: string) => {
    setFilterQuery(filter);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const handlePlateNumberChange = (plateNumber: string) => {
    setPlateNumberFilter(plateNumber);
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
  };

  const handleViolationStatusChange = (status: string) => {
    setViolationStatusFilter(status);
  };

  const handleDateChange = (date: string) => {
    setDateFilter(date);
  };

  const getPageTitle = () => {
    switch (activeItem) {
      case 'overview':
        return 'Overview Dashboard';
      case 'pending-approvals':
        return 'Pending Approvals';
      case 'violation-management':
        return 'Violation Management';
      case 'user-accounts':
        return 'User Account Management';
      case 'vehicle-registry':
        return 'Data Entry & Vehicle Registry';
      case 'analytics':
        return 'Analytics & Reporting';
      default:
        return 'Dashboard';
    }
  };

  const renderMainContent = () => {
    switch (activeItem) {
      case 'overview':
        return <Dashboard />;
      case 'pending-approvals':
        return (
          <>
            <FilterBar 
              onFilterChange={handleFilterChange}
              onStatusChange={handleStatusChange}
            />
            
            <PendingApprovalsTable 
              searchQuery={searchQuery}
              filterQuery={filterQuery}
              statusFilter={statusFilter}
            />
          </>
        );
      case 'violation-management':
        return (
          <>
            <ViolationFilterBar
              onPlateNumberChange={handlePlateNumberChange}
              onTypeChange={handleTypeChange}
              onStatusChange={handleViolationStatusChange}
              onDateChange={handleDateChange}
            />
            
            <ViolationTable
              searchQuery={searchQuery}
              plateNumberFilter={plateNumberFilter}
              typeFilter={typeFilter}
              statusFilter={violationStatusFilter}
              dateFilter={dateFilter}
            />
          </>
        );
      case 'user-accounts':
        return <UserAccountManagement searchQuery={searchQuery} />;
      case 'vehicle-registry':
        return <VehicleRegistry searchQuery={searchQuery} />;
      case 'analytics':
        return <AnalyticsReporting />;
      default:
        return (
          <div className="p-6 text-center text-gray-500">
            Select a menu item to view content
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 font-['Inter']">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      
      <div className="lg:ml-64">
        <TopBar title={getPageTitle()} onSearch={handleSearch} />
        
        <main className="min-h-screen">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;