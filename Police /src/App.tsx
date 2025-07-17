import React, { useState } from 'react';
import { 
  BarChart3, 
  Car, 
  Flag, 
  AlertTriangle, 
  FileText, 
  Settings, 
  User, 
  LogOut, 
  Search,
  Menu,
  X,
  Database,
} from 'lucide-react';
import OverviewDashboard from './components/OverviewDashboard';
import ViolationFlagging from './components/ViolationFlagging';
import ViolationsManagement from './components/ViolationsManagement';
import VehicleInformationAccess from './components/VehicleInformationAccess';
import FieldReporting from './components/FieldReporting';
import PersonalSettings from './components/PersonalSettings';

// Lazy load VehicleScanner to avoid OpenCV loading issues
const VehicleScanner = React.lazy(() => import('./components/VehicleScanner'));

function App() {
  const [activeNav, setActiveNav] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: BarChart3, active: true },
    { id: 'scanner', label: 'Vehicle Plate Scanner', icon: Car, active: false },
    { id: 'flagging', label: 'Violation Flagging System', icon: Flag, active: false },
    { id: 'violations', label: 'Violations Management', icon: AlertTriangle, active: false },
    { id: 'vehicle-info', label: 'Vehicle Information Access', icon: Car, active: false },
    { id: 'field-reporting', label: 'Field Reporting', icon: FileText, active: false },
    { id: 'settings', label: 'Personal Settings', icon: Settings, active: false },
  ];

  const getPageTitle = () => {
    switch (activeNav) {
      case 'overview':
        return 'Good Morning, Officer!';
      case 'scanner':
        return 'Vehicle Plate Scanner';
      case 'flagging':
        return 'Violation Flagging System';
      case 'violations':
        return 'Violations Management';
      case 'vehicle-info':
        return 'Vehicle Information Access';
      case 'field-reporting':
        return 'Field Reporting';
      case 'settings':
        return 'Personal Settings';
      default:
        return 'Police Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'overview':
        return <OverviewDashboard />;
      case 'scanner':
        return (
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Loading Vehicle Scanner...</span>
            </div>
          }>
            <VehicleScanner />
          </React.Suspense>
        );
      case 'flagging':
        return <ViolationFlagging />;
      case 'violations':
        return <ViolationsManagement />;
      case 'vehicle-info':
        return <VehicleInformationAccess />;
      case 'field-reporting':
        return <FieldReporting />;
      case 'settings':
        return <PersonalSettings />;
      default:
        return <OverviewDashboard />;
    }
  };

  // Add error boundary
  const [hasError, setHasError] = useState(false);
  
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Application error:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">Please refresh the page to try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-['Inter',sans-serif] relative">
      {/* Sidebar Navigation */}
      <div className={`w-64 bg-white shadow-lg flex flex-col fixed h-full z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-lg lg:text-xl font-bold text-gray-800">Police Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-2 lg:py-4">
          <ul className="space-y-1 lg:space-y-2 px-2 lg:px-3">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveNav(item.id);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeNav === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3 flex-shrink-0" />
                  <span className="text-xs lg:text-sm font-medium truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-3 lg:p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 lg:w-10 h-8 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 lg:w-6 h-4 lg:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-semibold text-gray-800 truncate">Officer John Doe</p>
              <p className="text-xs text-gray-500 truncate">Patrol Officer</p>
            </div>
          </div>
          <button className="w-full flex items-center px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <LogOut className="w-3 lg:w-4 h-3 lg:h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg lg:text-2xl font-bold text-gray-800 truncate">{getPageTitle()}</h2>
            </div>
            <div className="relative flex-shrink-0 w-full max-w-xs lg:max-w-sm">
              <Search className="w-4 lg:w-5 h-4 lg:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;