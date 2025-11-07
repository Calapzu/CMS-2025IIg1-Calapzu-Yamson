import { useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

export function useNoticias() {
  // ✅ Listado para dashboard / editor
  const listForDashboard = useCallback(
    async ({ rol, userId, estado, search, limit = 20, from = 0 } = {}) => {
      let q = supabase
        .from('noticias')
        .select(
          'id, titulo, subtitulo, estado, fecha_actualizacion, categoria_id, imagen_url, autor_id',
          { count: 'exact' }
        )
        .order('fecha_actualizacion', { ascending: false })
        .range(from, from + limit - 1);

      if (rol !== 'editor') q = q.eq('autor_id', userId);
      if (estado) q = q.eq('estado', estado);
      if (search) q = q.ilike('titulo', `%${search}%`);

      const { data, error, count } = await q;
      if (error) throw error;
      return { data, count };
    },
    []
  );

  // ✅ Listado público
  const listPublic = useCallback(
    async ({ seccion, limit = 12, from = 0 } = {}) => {
      let q = supabase
        .from('noticias_public_view')
        .select('id, titulo, subtitulo, imagen_url, fecha_creacion, seccion')
        .order('fecha_creacion', { ascending: false })
        .range(from, from + limit - 1);

      if (seccion) q = q.eq('seccion', seccion);

      const { data, error } = await q;
      if (error) {
        console.error('❌ Supabase error en listPublic:', error);
        throw error;
      }

      return data;
    },
    []
  );

  // ✅ Obtener noticia por ID
  const getById = useCallback(async (id) => {
    const { data, error } = await supabase
      .from('noticias')
      .select(
        'id, titulo, subtitulo, contenido, imagen_url, estado, categoria_id, autor_id, fecha_actualizacion'
      )
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }, []);

  // ✅ Crear noticia
  const create = useCallback(async (payload) => {
    const { data, error } = await supabase
      .from('noticias')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }, []);

  // ✅ Actualizar noticia
  const update = useCallback(async (id, patch) => {
    const { data, error } = await supabase
      .from('noticias')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }, []);

  // ✅ Eliminar noticia
  const remove = useCallback(async (id) => {
    const { error } = await supabase.from('noticias').delete().eq('id', id);
    if (error) throw error;
  }, []);

  return {
    listForDashboard,
    listPublic,
    getById,
    create,
    update,
    remove,
  };
}
