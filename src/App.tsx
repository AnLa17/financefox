import { useState, useEffect } from 'react';
import { User } from './types';
import { LoginForm } from './components/Auth/LoginForm';
import { SetupWizard } from './components/Setup/SetupWizard';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LocalStorageService } from './services/localStorage';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const user = LocalStorageService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    LocalStorageService.logout();
    setCurrentUser(null);
  };

  const handleSetupComplete = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, isSetupComplete: true };
      LocalStorageService.saveUser(updatedUser);
      setCurrentUser(updatedUser);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🦊</div>
          <h1 className="text-2xl font-bold">Finance Fox</h1>
          <p className="text-gray-400 mt-2">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (!currentUser.isSetupComplete) {
    return <SetupWizard user={currentUser} onComplete={handleSetupComplete} />;
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} />;
}

export default App;
