import React, { useState } from 'react';
import { Building2, Users, ClipboardList, BarChart3, FileText, Upload } from 'lucide-react';
import Login from './components/Login';
import Homepage from './components/Homepage';
import AddInternDetails from './components/AddInternDetails';
import DepartmentsMentors from './components/DepartmentsMentors';
import TrackApplication from './components/TrackApplication';
import InternDashboard from './components/InternDashboard';
import ProjectSubmission from './components/ProjectSubmission';
import InternPersonalDashboard from './components/InternPersonalDashboard';
import LandingPage from './components/LandingPage';
import ReviewApplications from './components/ReviewApplications';
import MentorDashboard from './components/MentorDashboard';

interface User {
  empId: string;
  role: 'employee' | 'ld_team' | 'intern' | 'mentor';
  name: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    setShowLogin(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleBackToHome = () => {
    setShowLogin(false);
  };

  // If showing login page
  if (showLogin && !user) {
    return <Login onLogin={handleLogin} onBack={handleBackToHome} />;
  }

  // If not logged in, show landing page
  if (!user) {
    return <LandingPage onLoginClick={handleLoginClick} />;
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: Building2 },
    ...(user.role === 'employee' ? [
      { id: 'add-intern', label: 'Add Intern Details', icon: Users },
    ] : []),
    ...(user.role === 'intern' ? [
      { id: 'track', label: 'Track Application', icon: BarChart3 },
      { id: 'intern-dashboard', label: 'Intern Dashboard', icon: FileText },
      { id: 'project-submission', label: 'Submit Project Report', icon: Upload },
    ] : []),
    ...(user.role === 'ld_team' ? [
      { id: 'add-intern', label: 'Add Intern Details', icon: Users },
      { id: 'review-applications', label: 'Review Applications', icon: ClipboardList },
      { id: 'departments', label: 'Departments & Mentors', icon: ClipboardList },
      { id: 'track', label: 'Track Application', icon: BarChart3 },
      { id: 'dashboard', label: 'Intern Dashboard', icon: FileText },
      { id: 'project-submission', label: 'Project Submission', icon: Upload },
    ] : []),
    ...(user.role === 'mentor' ? [
      { id: 'mentor-dashboard', label: 'Intern Dashboard', icon: Users },
      { id: 'mentor-projects', label: 'Submitted Projects', icon: FileText },
    ] : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <Homepage user={user} />;
      case 'add-intern':
        return <AddInternDetails user={user} />;
      case 'review-applications':
        return user.role === 'ld_team' ? <ReviewApplications /> : <Homepage user={user} />;
      case 'departments':
        return user.role === 'ld_team' ? <DepartmentsMentors /> : <Homepage user={user} />;
      case 'track':
        return (user.role === 'ld_team' || user.role === 'intern') ? <TrackApplication user={user} /> : <Homepage user={user} />;
      case 'dashboard':
        return user.role === 'ld_team' ? <InternDashboard /> : <Homepage user={user} />;
      case 'project-submission':
        return (user.role === 'ld_team' || user.role === 'intern') ? <ProjectSubmission user={user} /> : <Homepage user={user} />;
      case 'intern-dashboard':
        return user.role === 'intern' ? <InternPersonalDashboard user={user} /> : <Homepage user={user} />;
      case 'mentor-dashboard':
        return user.role === 'mentor' ? <MentorDashboard user={user} activeTab="dashboard" /> : <Homepage user={user} />;
      case 'mentor-projects':
        return user.role === 'mentor' ? <MentorDashboard user={user} activeTab="projects" /> : <Homepage user={user} />;
      default:
        return <Homepage user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-orange-400" />
              <div>
                <h1 className="text-2xl font-bold">Intern Onboarding Portal</h1>
                <p className="text-blue-200 text-sm">Indian Oil Corporation Limited</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">Welcome, {user.name}</p>
                <p className="text-xs text-blue-300">
                  {user.role === 'ld_team' ? 'L&D Team Member' : user.role === 'intern' ? 'Intern' : user.role === 'mentor' ? 'Mentor' : 'Employee'} • {user.empId}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-sm transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-b-2 border-orange-400'
                      : 'text-blue-200 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-200">
            © 2025 Indian Oil Corporation Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;