import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, LogOut, PackageCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white bb b--black-05 sticky top-0 z-4 no-print" style={{ borderBottom: '1px solid #E2E8F0' }}>
      <div className="mw9 center ph2 ph4-ns pv2 flex items-center justify-between">

        {/* Identidad OFFCORSS Minimalista */}
        <div className="flex items-center gap1 gap2-ns cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="bg-warning pv1 ph2 ph3-ns br2 flex items-center justify-center font-bold" style={{ backgroundColor: '#FFD100' }}>
            <span className="fw8 f6 f5-ns tracking-tight" style={{ color: '#0F172A', letterSpacing: '-0.5px' }}>
              OFFCORSS
            </span>
          </div>
          <div className="bl b--light-gray pl2 pl3-ns ml1 ml2-ns dn md-flex items-center gap2" style={{ borderColor: '#E2E8F0' }}>
            <span className="fw6 f6 dark-gray flex items-center gap1">
              <PackageCheck size={16} className="gray" />
              Plataformas E-commerce
            </span>
          </div>
        </div>

        {/* Acciones de Usuario Adaptadas a Móvil */}
        {user && (
          <div className="flex items-center gap2 gap3-ns">
            {/* Botón de Perfil */}
            <button
              onClick={onOpenProfile}
              className="flex items-center mr2 gap1 gap2-ns bg-near-white hover-bg-light-gray dark-gray border-none ph2 ph3-ns pv1 pv2-ns br-pill pointer transition-all"
              style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', outline: 'none' }}
              title="Ver y editar perfil de usuario en MongoDB"
            >
              <div
                className="br-100 flex items-center justify-center dark-gray fw8 f7 shadow-sm"
                style={{ backgroundColor: '#FFD100', width: '28px', height: '28px', color: '#0F172A' }}
              >
                {user.name.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div className="dn sm-flex flex-column items-start text-left ml1">
                <span className="fw7 f6 dark-gray">{user.name} {user.lastName}</span>
                <span className="f7 gray">{user.userType}</span>
              </div>
              <UserIcon size={14} className="gray ml1" />
            </button>

            {/* Botón de Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap1 ph2 ph3-ns pv1 pv2-ns br3 fw6 f6 pointer transition-all"
              style={{
                border: '1px solid #FEE2E2',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                cursor: 'pointer',
                outline: 'none',
                height: '34px'
              }}
              title="Cerrar sesión"
            >
              <LogOut size={15} />
              <span className="dn sm-inline">Salir</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
