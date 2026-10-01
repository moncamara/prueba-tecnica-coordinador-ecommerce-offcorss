import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token, user } = await loginApi(username, password);
      login(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifique usuario y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 flex items-center justify-center ph3 py4" style={{ backgroundColor: '#F8FAFC' }}>
      
      {/* Tarjeta de Login Recogida y Compacta (Máximo 400px) */}
      <div
        className="bg-white br4 shadow-2 overflow-hidden transition-all w-100"
        style={{ maxWidth: '400px', border: '1px solid #E2E8F0', padding: '32px 28px' }}
      >
        
        {/* Cabecera de Marca OFFCORSS Centrada */}
        <div className="text-center pb3 border-b border-gray-100 mb3" style={{ borderColor: '#F1F5F9' }}>
          <div className="inline-flex bg-warning pv1 ph3 br3 mb2" style={{ backgroundColor: '#FFD100' }}>
            <span className="fw8 f5 dark-gray tracking-tight" style={{ color: '#0F172A', letterSpacing: '-0.5px' }}>
              OFFCORSS
            </span>
          </div>
          <h1 className="f4 fw8 dark-gray mt1 mb1 tracking-tight">Portal Coordinador</h1>
          <p className="f7 gray m0">Plataformas & Catálogo E-commerce</p>
        </div>

        {/* Formulario de Login */}
        {error && (
          <div className="bg-washed-red red ph3 pv2 br3 mb3 f7 fw6 flex items-center gap2" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-column gap3">
          
          <div>
            <label className="db f7 fw7 gray mb1 uppercase tracking-wide">
              Usuario (Username)
            </label>
            <div className="relative flex items-center">
              <UserIcon size={16} className="absolute left-1 ml2 gray" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-100 pa2 pl5 br3 ba dark-gray fw6 f6"
                style={{ border: '1.5px solid #CBD5E1', height: '44px' }}
              />
            </div>
          </div>

          <div>
            <label className="db f7 fw7 gray mb1 uppercase tracking-wide">
              Contraseña (Password)
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-1 ml2 gray" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-100 pa2 pl5 br3 ba dark-gray fw6 f6"
                style={{ border: '1.5px solid #CBD5E1', height: '44px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-offcorss-primary w-100 pv3 f6 fw7 mt2"
            style={{ height: '44px' }}
          >
            {loading ? (
              <span>Validando en DB...</span>
            ) : (
              <>
                <LogIn size={16} />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>

        </form>

        {/* Credenciales de Prueba Compactas */}
        <div className="mt4 pt3 border-t border-gray-100 pa3 br3" style={{ backgroundColor: '#FAFAFA', border: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap1 f7 fw7 dark-gray mb1">
            <Sparkles size={13} style={{ color: '#E5BC00' }} />
            Credenciales de Prueba (DB):
          </div>
          <div className="f7 gray flex flex-column gap1">
            <span className="flex items-center gap1">
              <CheckCircle2 size={11} className="green" /> <strong>Usuario:</strong> <code>admin</code>
            </span>
            <span className="flex items-center gap1">
              <CheckCircle2 size={11} className="green" /> <strong>Contraseña:</strong> <code>admin123</code>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
