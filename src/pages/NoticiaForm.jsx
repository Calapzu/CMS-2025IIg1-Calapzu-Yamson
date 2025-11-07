import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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

        // Si no existe la noticia
        if (!data) {
          toast.error("Noticia no encontrada");
          navigate('/dashboard/noticias');
          return;
        }

        // 🔒 Verificar permisos
        if (profile?.rol !== "editor" && data.autor_id !== profile?.id) {
          toast.error("No tienes permiso para editar esta noticia");
          navigate('/dashboard/noticias');
          return;
        }

        setInitial(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const onSubmit = async (payload) => {
    try {
      if (id) {
        // 🔒 Solo autor o editor pueden modificar
        if (profile?.rol !== "editor" && initial?.autor_id !== profile?.id) {
          toast.error("No puedes editar esta noticia");
          return;
        }

        await update(id, payload);
        toast.success("Noticia actualizada con éxito 🎉");
      } else {
        await create({
          ...payload,
          autor_id: profile.id,
          autor_nombre: profile.nombre || profile.email || "Anónimo",
        });
        toast.success("Noticia creada con éxito 🗞️");
      }

      navigate('/dashboard/noticias');
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar la noticia");
    }
  };

  if (loading) return <p>Cargando noticia...</p>;

  return (
    <div className="p-8 container bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
        {id ? 'Editar noticia' : 'Nueva noticia'}
      </h1>
      <FormNoticia
        initialData={initial || {}}
        onSubmit={onSubmit}
        role={profile?.rol}
        secciones={secciones}
      />
    </div>
  );
}
