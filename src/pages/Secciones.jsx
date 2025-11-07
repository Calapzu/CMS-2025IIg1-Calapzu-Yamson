import React from "react";
import FormSeccion from '../components/FormSeccion';
import { useAuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


export default function Secciones() {
    const { profile } = useAuthContext();
    if (profile?.rol !== 'editor') return <Navigate to="/dashboard" replace />;
    return (
        <div className="p-8 container bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Secciones</h1>
            <FormSeccion />
        </div>
    );
}