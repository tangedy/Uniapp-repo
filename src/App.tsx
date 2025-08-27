import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import ProgramSearch from './components/Programs/ProgramSearch';
import ApplicationTracker from './components/Applications/ApplicationTracker';
import { programs } from './data/programs';
import { useApplications } from './hooks/useApplications';

const AuthenticatedApp: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'programs' | 'tracker'>('dashboard');
  
  const {
    applications,
    addApplication,
    updateApplication,
    removeApplication,
    getAppliedProgramIds,
  } = useApplications();

  if (!user) {
    return <AuthContainer />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard applications={applications} />;
      case 'programs':
        return (
          <ProgramSearch
            programs={programs}
            appliedPrograms={getAppliedProgramIds()}
            onAddToApplications={addApplication}
          />
        );
      case 'tracker':
        return (
          <ApplicationTracker
            applications={applications}
            onUpdateApplication={updateApplication}
            onRemoveApplication={removeApplication}
          />
        );
      default:
        return <Dashboard applications={applications} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleForm={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;