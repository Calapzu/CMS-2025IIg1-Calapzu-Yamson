import React from "react";
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'sonner';


export default function Login() {
    const { signIn } = useAuth();
    const { user } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    if (user) return <Navigate to="/dashboard" replace />;


    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try { await signIn({ email, password }); }
        catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    };


    return (
       <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-6">Iniciar sesión</h1>
            <form onSubmit={submit} className="space-y-6">
                <input
                    className="w-full px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="w-full px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    className="w-full py-4 bg-red-600 text-white font-bold text-lg rounded-2xl hover:bg-red-700 transition-all duration-300 disabled:bg-red-400"
                    disabled={loading}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-red-600 hover:text-red-700 font-bold underline">
                    Regístrate
                </Link>
            </p>
        </div>
    );
}