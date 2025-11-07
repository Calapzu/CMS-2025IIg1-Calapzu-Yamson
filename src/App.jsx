import React from "react";
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicHome from './pages/PublicHome';
import NoticiaView from './pages/NoticiaView';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoticiasList from './pages/NoticiasList';
import NoticiaForm from './pages/NoticiaForm';
import Secciones from './pages/Secciones';
import PerfilUsuario from './pages/PerfilUsuario';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* PÚBLICO */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/noticia/:seccion_slug/:id" element={<NoticiaView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PRIVADO */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/noticias" element={<ProtectedRoute><NoticiasList /></ProtectedRoute>} />
          <Route path="/dashboard/noticias/nueva" element={<ProtectedRoute><NoticiaForm /></ProtectedRoute>} />
          <Route path="/dashboard/noticias/editar/:id" element={<ProtectedRoute><NoticiaForm /></ProtectedRoute>} />
          <Route path="/dashboard/secciones" element={<ProtectedRoute roles={['editor']}><Secciones /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><PerfilUsuario /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="container mx-auto p-8 text-center py-20">
              <h1 className="text-9xl font-bold text-gray-200">404</h1>
              <p className="text-2xl text-gray-600 mt-4">Página no encontrada</p>
              <a href="/" className="text-blue-600 hover:underline text-lg">← Volver al inicio</a>
            </div>
          } />
        </Routes>
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}


