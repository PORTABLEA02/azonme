import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { MainApp } from './components/MainApp';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return user ? <MainApp /> : <LoginForm />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;