import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useSecciones() {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSecciones = async () => {
      try {
        const { data, error } = await supabase
          .from('secciones')
          .select('id, nombre')
          .order('nombre');

        if (error) throw error;
        setSecciones(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error cargando secciones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSecciones();
  }, []);

  return { secciones, loading, error };
}