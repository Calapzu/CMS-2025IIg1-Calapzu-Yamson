import React from "react";
import { useAuthContext } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { useState } from 'react';
import { toast } from 'sonner';


export default function PerfilUsuario() {
    const { profile } = useAuthContext();
    const [nombre, setNombre] = useState(profile?.nombre ?? '');


    const save = async () => {
        const { error } = await supabase.from('users').update({ nombre }).eq('id', profile.id);
        if (error) return toast.error(error.message);
        toast.success('Actualizado');
    };


    return (
        <div className="p-8 container space-y-6 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Mi perfil</h1>
            <input
                className="input px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
            />
            <button
                className="btn-ghost px-6 py-4 rounded-2xl text-red-600 hover:text-red-800 transition-all duration-300"
                onClick={save}
            >
                Guardar
            </button>
        </div>
    );
}