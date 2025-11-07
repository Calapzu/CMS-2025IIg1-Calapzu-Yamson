import React from "react";
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import CardNoticia from '../components/CardNoticia';


export default function PublicHome() {
    const [secciones, setSecciones] = useState([]);
    const [noticias, setNoticias] = useState([]);
    const [sp] = useSearchParams();
    const seccion = sp.get('s') || undefined;


    useEffect(() => {
        const load = async () => {
            // 1️⃣ Refrescar la vista materializada (para desarrollo o pequeñas apps)
            await supabase.rpc('refresh_noticias_public_view');

            // 2️⃣ Cargar secciones
            const { data: secc } = await supabase
                .from('secciones')
                .select('id, nombre, slug')
                .order('nombre');
            setSecciones(secc || []);

            // 3️⃣ Cargar noticias
            let q = supabase
                .from('noticias_public_view')
                .select('id, titulo, subtitulo, imagen_url, fecha_actualizacion, seccion_slug, seccion_nombre')
                .order('fecha_actualizacion', { ascending: false })
                .limit(24);

            if (seccion) q = q.eq('seccion_slug', seccion);

            const { data: news } = await q;
            setNoticias(news || []);
        };

        load();
    }, [seccion]);

    return (
        <div className="container space-y-6 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Noticias</h1>
            <div className="flex gap-4 flex-wrap">
                <Link
                    to="/"
                    className={`btn-ghost px-6 py-3 rounded-2xl text-lg font-bold transition-all duration-300 ${!seccion ? 'ring-1 ring-red-600' : ''
                        } hover:ring-2 hover:ring-red-500`}
                >
                    Todas
                </Link>
                {secciones.map((s) => (
                    <Link
                        key={s.id}
                        to={`/?s=${s.slug}`}
                        className={`btn-ghost px-6 py-3 rounded-2xl text-lg font-bold transition-all duration-300 ${seccion === s.slug ? 'ring-1 ring-red-600' : ''
                            } hover:ring-2 hover:ring-red-500`}
                    >
                        {s.nombre}
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {noticias.map((n) => (
                    <CardNoticia key={n.id} item={n} />
                ))}
            </div>
        </div>
    );
}