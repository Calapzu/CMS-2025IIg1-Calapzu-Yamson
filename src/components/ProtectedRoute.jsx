import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, profile, loading } = useAuthContext();
  const location = useLocation();

  // Mientras carga la sesión/perfil
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Sin sesión: redirige a login y recuerda la ruta previa
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si se especifican roles y el perfil no cumple, redirige al dashboard
  if (Array.isArray(roles) && roles.length > 0) {
    const rolUsuario = profile?.rol;
    if (!rolUsuario || !roles.includes(rolUsuario)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Autorizado
  return children;
}

