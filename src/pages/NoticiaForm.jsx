import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useNoticias } from '../hooks/useNoticias';
import { useSecciones } from '../hooks/useSecciones';
import FormNoticia from '../components/FormNoticia';

export default function NoticiaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuthContext();
    const { getById, create, update } = useNoticias();
    const { secciones, loading: loadingSecciones } = useSecciones();

    const [initial, setInitial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (id) {
                const data = await getById(id);
                setInitial(data);
            }
            setLoading(false);
        };
        load();
    }, [id]);

    const onSubmit = async (payload) => {
        if (id) await update(id, payload);
        else await create({ ...payload, autor_id: profile.id });
        navigate('/dashboard/noticias');
    };

    if (loading) return <p>Cargando noticia...</p>; // evita renderizar null

    return (
        <div className="p-8 container bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                {id ? 'Editar noticia' : 'Nueva noticia'}
            </h1>
            <FormNoticia
                initialData={initial || {}} // aseguramos que nunca sea null
                onSubmit={onSubmit}
                role={profile?.rol}
                secciones={secciones}
            />
        </div>
    );
}