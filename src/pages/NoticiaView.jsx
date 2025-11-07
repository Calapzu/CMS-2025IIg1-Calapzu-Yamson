import React from "react";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';


export default function NoticiaView() {
    const { id } = useParams();
    const [item, setItem] = useState(null);


    useEffect(() => {
        const load = async () => {
            const { data, error } = await supabase
                .from('noticias_public_view')
                .select('*')
                .eq('id', id)
                .single(); // CAMBIA maybeSingle() → single()

            if (error) {
                console.error("Error cargando noticia:", error);
                setItem(null);
                return;
            }

            setItem(data);
        };
        load();
    }, [id]);


    if (!item) return <div className="p-4">Cargando...</div>;


    return (
        <article className="max-w-3xl mx-auto p-8 space-y-6 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">{item.titulo}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.seccion_nombre ? `Sección: ${item.seccion_nombre} · ` : ''}
                {item.autor_nombre ? `Autor: ${item.autor_nombre} · ` : ''}
                {new Date(item.fecha_actualizacion).toLocaleString()}
            </p>
            {item.imagen_url && (
                <img
                    src={item.imagen_url}
                    className="w-full rounded-2xl shadow-lg mt-6"
                    alt={item.titulo}
                />
            )}
            <div className="prose max-w-none whitespace-pre-wrap text-gray-900 dark:text-white mt-6">
                {item.contenido}
            </div>
        </article>
    );
}