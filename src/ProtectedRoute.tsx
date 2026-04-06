import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAuthorized } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Não Autorizado</h1>
        <p className="mb-6 max-w-md">Seu e-mail ({user.email}) não está na lista de e-mails autorizados para acessar este sistema.</p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Voltar para Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
