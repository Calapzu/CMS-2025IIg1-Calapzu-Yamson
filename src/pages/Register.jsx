import React, { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Register() {
    const { signUp } = useAuth();
    const { user } = useAuthContext();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [rol, setRol] = useState('reportero'); // rol por defecto
    const [loading, setLoading] = useState(false);

    // Redirige si ya está logueado
    if (user) return <Navigate to="/dashboard" replace />;

    const submit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (password !== confirm) return toast.error('Las contraseñas no coinciden');
        if (!['reportero', 'editor'].includes(rol)) return toast.error('Rol inválido');

        setLoading(true);
        try {
            // Registro
            await signUp({ email, password, nombre, rol });
            toast.success('Cuenta creada con éxito');

            // Redirigir al login
            window.location.href = '/login';
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
                <input
                    className="input px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    className="input px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="input px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    className="input px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
                    placeholder="Confirmar contraseña"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />

                {/* Selector de rol */}
                <select
                    className="input px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                >
                    <option value="reportero">Reportero</option>
                    <option value="editor">Editor</option>
                </select>

                <button
                    className="w-full py-4 text-lg font-bold text-white bg-red-600 hover:bg-red-700 rounded-2xl transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? 'Creando...' : 'Registrarme'}
                </button>
            </form>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-red-600 hover:text-red-700 underline">
                    Inicia sesión
                </Link>
            </p>
        </div>
    );

}

