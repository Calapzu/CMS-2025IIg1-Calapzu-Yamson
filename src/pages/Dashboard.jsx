import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { profile } = useAuthContext();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error al cerrar sesión:', err.message);
    }
  };

  return (
    <div className="p-8 container space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-800"
          onClick={handleLogout}
        >
          Salir
        </Button>
      </div>

      <div className="text-gray-600 dark:text-gray-400">
        Hola <span className="font-bold text-red-600">{profile?.nombre}</span>. Rol: <b>{profile?.rol}</b>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link to="/dashboard/noticias" className="bg-white dark:bg-gray-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 transition-all px-6 py-3 rounded-2xl text-lg font-bold tracking-wider border-2 border-transparent dark:border-gray-700">
          Noticias
        </Link>
        <Link to="/dashboard/noticias/nueva" className="bg-red-600 hover:bg-red-700 text-white hover:text-white transition-all px-6 py-3 rounded-2xl text-lg font-bold tracking-wider">
          Crear noticia
        </Link>
        {profile?.rol === 'editor' && (
          <Link to="/dashboard/secciones" className="bg-white dark:bg-gray-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 transition-all px-6 py-3 rounded-2xl text-lg font-bold tracking-wider border-2 border-transparent dark:border-gray-700">
            Secciones
          </Link>
        )}
      </div>
    </div>
  );
}