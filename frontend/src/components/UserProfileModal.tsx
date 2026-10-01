import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User as UserIcon, Shield, Mail, Calendar, Edit3, Save, LogOut, CheckCircle2, Key, Database, Server } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, token, updateUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'auth'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [userType, setUserType] = useState(user?.userType || '');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      await updateUser({ name, lastName, email, userType });
      setNotification({ type: 'success', text: '¡Perfil actualizado con éxito en la Base de Datos!' });
      setIsEditing(false);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({ type: 'error', text: err.message || 'Error al actualizar perfil' });
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = user.createdAt
    ? new Date(Number(user.createdAt) || user.createdAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '29 de septiembre de 2026';

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center ph2 ph3-ns py3 py4-ns overflow-y-auto no-print-overlay"
      style={{ zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Contenedor Modal Estilo Mi Cuenta OFFCORSS */}
      <div
        className="bg-white br3 br4-ns w-100 max-w-5xl shadow-5 overflow-hidden transition-all relative my-auto"
        style={{ border: '1px solid #E2E8F0', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Botón de Cierre Superior Nítido */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-1 right-1 z-3 br-100 flex items-center justify-center pointer transition-all"
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            outline: 'none',
            backgroundColor: '#F1F5F9',
            color: '#475569',
            cursor: 'pointer'
          }}
          title="Cerrar modal"
        >
          <X size={16} />
        </button>

        {/* Estructura 2 Columnas Responsiva: Menú Lateral / Superior + Panel Principal */}
        <div className="flex flex-column flex-row-ns min-h-100">
          
          {/* Menú Izquierdo en Desktop / Superior en Móvil */}
          <div
            className="w-100 w-30-ns pa3 pa4-ns flex flex-column justify-between border-b border-r-ns border-gray-100"
            style={{ backgroundColor: '#FAFAFA', borderColor: '#F1F5F9' }}
          >
            <div>
              {/* Avatar e Identificación */}
              <div className="flex items-center flex-column-ns text-left text-center-ns pb2 pb4-ns border-b border-gray-200 gap2" style={{ borderColor: '#E2E8F0' }}>
                <div
                  className="br-100 flex items-center justify-center dark-gray fw8 f4 f3-ns shadow-1 shrink-0"
                  style={{ backgroundColor: '#FFD100', width: '48px', height: '48px', color: '#0F172A' }}
                >
                  {user.name.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="f5 f4-ns fw8 dark-gray m0">¡Hola, {user.name}!</h3>
                  <p className="f7 gray mt1 mb0">Perfil de Usuario OFFCORSS</p>
                </div>
              </div>

              {/* Pestañas de Navegación */}
              <div className="pv2 pv3-ns flex flex-row flex-column-ns gap2">
                
                {/* Pestaña Mi Perfil */}
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 w-100-ns text-center text-left-ns pv2 ph3 br3 fw7 f7 f6-ns flex items-center justify-center justify-start-ns gap2 pointer transition-all ${
                    activeTab === 'profile' ? 'bg-white shadow-sm dark-gray' : 'gray hover-dark-gray bg-transparent'
                  }`}
                  style={{
                    border: activeTab === 'profile' ? '1px solid #E2E8F0' : '1px solid transparent',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <UserIcon size={16} className={activeTab === 'profile' ? 'text-dark' : 'gray'} />
                  <span>Mi Perfil</span>
                </button>

                {/* Pestaña Autenticación & DB */}
                <button
                  type="button"
                  onClick={() => setActiveTab('auth')}
                  className={`flex-1 w-100-ns text-center text-left-ns pv2 ph3 br3 fw6 f7 f6-ns flex items-center justify-center justify-start-ns gap2 pointer transition-all ${
                    activeTab === 'auth' ? 'bg-white shadow-sm dark-gray fw7' : 'gray hover-dark-gray bg-transparent'
                  }`}
                  style={{
                    border: activeTab === 'auth' ? '1px solid #E2E8F0' : '1px solid transparent',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Shield size={16} className={activeTab === 'auth' ? 'text-dark' : 'gray'} />
                  <span>Autenticación & DB</span>
                </button>

              </div>
            </div>

            {/* Botón Cerrar Sesión (Visible en Desktop) */}
            <div className="pt3 border-t border-gray-200 dn db-ns" style={{ borderColor: '#E2E8F0' }}>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-100 flex items-center justify-center gap2 ph3 pv2 br3 fw6 f6 pointer transition-all"
                style={{
                  border: '1px solid #FEE2E2',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <LogOut size={15} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>

          {/* Panel Principal Derecho */}
          <div className="w-100 w-70-ns pa3 pa4-m pa5-l flex flex-column justify-between bg-white">
            
            {activeTab === 'profile' ? (
              /* TAB 1: MI PERFIL */
              <div>
                <div className="flex items-center justify-between pb2 pb3-ns mb3 mb4-ns border-b border-gray-100" style={{ borderColor: '#F1F5F9' }}>
                  <div>
                    <h2 className="f4 f3-ns fw8 dark-gray tracking-tight m0">Perfil de Usuario</h2>
                    <p className="f7 gray mt1 mb0">Datos en MongoDB (GraphQL)</p>
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="btn-offcorss-primary br-pill ph3 ph4-ns pv2 f7 f6-ns"
                    >
                      <Edit3 size={14} /> EDITAR
                    </button>
                  )}
                </div>

                {notification && (
                  <div
                    className={`ph3 ph4-ns pv2 pv3-ns br3 mb3 mb4-ns fw6 f7 f6-ns flex items-center gap2 ${
                      notification.type === 'success' ? 'bg-washed-green green' : 'bg-washed-red red'
                    }`}
                    style={{ border: notification.type === 'success' ? '1px solid #A7F3D0' : '1px solid #FCA5A5' }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{notification.text}</span>
                  </div>
                )}

                <form onSubmit={handleSave} className="flex flex-column gap2 gap3-ns">
                  
                  <div className="grid-2-col">
                    <div className="profile-field-card">
                      <label className="f7 fw7 gray uppercase tracking-wide db mb1">Nombre</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          className="w-100 pa2 br2 ba b--black-20 dark-gray fw6 f6"
                          style={{ border: '1.5px solid #CBD5E1' }}
                        />
                      ) : (
                        <div className="f5 f4-ns fw8 dark-gray">{user.name}</div>
                      )}
                    </div>

                    <div className="profile-field-card">
                      <label className="f7 fw7 gray uppercase tracking-wide db mb1">Apellido</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          required
                          className="w-100 pa2 br2 ba b--black-20 dark-gray fw6 f6"
                          style={{ border: '1.5px solid #CBD5E1' }}
                        />
                      ) : (
                        <div className="f5 f4-ns fw8 dark-gray">{user.lastName}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid-2-col">
                    <div className="profile-field-card">
                      <label className="f7 fw7 gray uppercase tracking-wide db mb1">Email (Correo Electrónico)</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="w-100 pa2 br2 ba b--black-20 dark-gray fw6 f6"
                          style={{ border: '1.5px solid #CBD5E1' }}
                        />
                      ) : (
                        <div className="f6 f5-ns fw7 flex items-center gap1 truncate" style={{ color: '#2563EB' }}>
                          <Mail size={15} className="shrink-0" /> {user.email}
                        </div>
                      )}
                    </div>

                    <div className="profile-field-card">
                      <label className="f7 fw7 gray uppercase tracking-wide db mb1">Rol / Tipo de Usuario</label>
                      {isEditing ? (
                        <select
                          value={userType}
                          onChange={e => setUserType(e.target.value)}
                          className="w-100 pa2 br2 ba b--black-20 dark-gray fw6 f6 bg-white"
                          style={{ border: '1.5px solid #CBD5E1' }}
                        >
                          <option value="Coordinador E-commerce">Coordinador E-commerce</option>
                          <option value="Administrador">Administrador</option>
                          <option value="Analista Digital">Analista Digital</option>
                          <option value="Desarrollador Frontend">Desarrollador Frontend</option>
                        </select>
                      ) : (
                        <div className="f6 fw7 dark-gray">
                          {user.userType}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid-2-col">
                    <div className="profile-field-card">
                      <label className="f7 fw7 gray uppercase tracking-wide db mb1">Username (Identificador DB)</label>
                      <div className="f6 f5-ns fw7 gray">{user.username}</div>
                    </div>

                    <div className="profile-field-card">
                      <label className="f7 fw7 gray uppercase tracking-wide db mb1">Fecha de Alta (createdAt)</label>
                      <div className="f7 f6-ns gray flex items-center gap1">
                        <Calendar size={14} className="shrink-0" /> {formattedDate}
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap2 mt3 pt3 border-t border-gray-100" style={{ borderColor: '#F1F5F9' }}>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn-offcorss-secondary ph3 ph4-ns"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-offcorss-primary br-pill ph3 ph4-ns"
                      >
                        <Save size={15} />
                        {isSaving ? 'Guardando...' : 'GUARDAR CAMBIOS'}
                      </button>
                    </div>
                  )}

                </form>
              </div>
            ) : (
              /* TAB 2: AUTENTICACIÓN & DB */
              <div>
                <div className="pb2 pb3-ns mb3 mb4-ns border-b border-gray-100" style={{ borderColor: '#F1F5F9' }}>
                  <h2 className="f4 f3-ns fw8 dark-gray tracking-tight m0">Autenticación & Base de Datos</h2>
                  <p className="f7 gray mt1 mb0">Arquitectura de datos y sesión JWT</p>
                </div>

                <div className="flex flex-column gap2 gap3-ns">
                  
                  <div className="profile-field-card">
                    <div className="flex items-center gap2 mb1">
                      <Key size={15} className="green shrink-0" />
                      <strong className="f7 f6-ns dark-gray">Token de Sesión JWT:</strong>
                    </div>
                    <code className="f7 bg-white pa2 br2 ba b--black-10 truncate dark-gray" style={{ border: '1px solid #E2E8F0' }}>
                      {token || 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}
                    </code>
                    <span className="f7 gray mt1">Expira en 24 horas.</span>
                  </div>

                  <div className="grid-2-col">
                    <div className="profile-field-card">
                      <div className="flex items-center gap2 mb1">
                        <Database size={15} style={{ color: '#2563EB' }} className="shrink-0" />
                        <strong className="f7 f6-ns dark-gray">Base de Datos:</strong>
                      </div>
                      <span className="f7 f6-ns fw7 dark-gray">MongoDB (Colección: `users`)</span>
                      <span className="f7 green mt1">Estado: Conexión Activa</span>
                    </div>

                    <div className="profile-field-card">
                      <div className="flex items-center gap2 mb1">
                        <Server size={15} style={{ color: '#FFD100' }} className="shrink-0" />
                        <strong className="f7 f6-ns dark-gray">Servidor API GraphQL:</strong>
                      </div>
                      <span className="f7 f6-ns fw7 dark-gray">Node.js + Apollo Server</span>
                      <span className="f7 gray mt1">Endpoint: `/graphql`</span>
                    </div>
                  </div>

                  <div className="profile-field-card bg-washed-yellow" style={{ backgroundColor: '#FFFDF0', border: '1px solid #FDE68A' }}>
                    <h4 className="f7 f6-ns fw8 dark-gray m0 mb1">Seguridad de la Información:</h4>
                    <p className="f7 gray lh-copy m0">
                      Las contraseñas están encriptadas con <strong>bcryptjs (10 rondas)</strong>. Las mutaciones están protegidas con firmas JWT.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Pie de Página */}
            <div className="pt3 pt4-ns mt3 mt4-ns border-t border-gray-100 flex flex-column flex-row-ns items-center justify-between f7 gray gap1" style={{ borderColor: '#F1F5F9' }}>
              <span>Estado: <strong className="green" style={{ color: '#059669' }}>Activa (GraphQL MongoDB)</strong></span>
              <span>OFFCORSS Plataformas E-commerce</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
