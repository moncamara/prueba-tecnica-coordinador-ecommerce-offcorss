import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { UserProfileModal } from './components/UserProfileModal';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

// Componente para proteger rutas privadas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const MainContent: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-vh-100 flex flex-column bg-washed-yellow">
      {!isLoginPage && isAuthenticated && (
        <Navbar onOpenProfile={() => setIsProfileOpen(true)} />
      )}

      <main className="flex-auto">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Modal de Detalle de Usuario */}
      {isAuthenticated && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <MainContent />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
