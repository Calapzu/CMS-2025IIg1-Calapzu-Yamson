import React, { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [rol, setRol] = useState('reportero');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirm) return toast.error('Las contraseñas no coinciden');
    if (!['reportero', 'editor'].includes(rol)) return toast.error('Rol inválido');

    setLoading(true);
    try {
      const result = await signUp({ email, password, nombre, rol });
      if (result.success) {
        toast.success(result.message);
        navigate('/dashboard'); // Redirige automáticamente al dashboard
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Crear cuenta</h1>
      <form onSubmit={submit} className="space-y-6">
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="input" />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        <input type="password" placeholder="Confirmar contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" />
        <select value={rol} onChange={(e) => setRol(e.target.value)} className="input">
          <option value="reportero">Reportero</option>
          <option value="editor">Editor</option>
        </select>
        <button type="submit" disabled={loading} className="w-full py-4 text-lg font-bold text-white bg-red-600 rounded-2xl">
          {loading ? 'Creando...' : 'Registrarme'}
        </button>
      </form>
    </div>
  );
}
