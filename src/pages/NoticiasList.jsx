// src/pages/NoticiasList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext"; // ← IMPORT OBLIGATORIO
import { supabase } from "../services/supabaseClient";
import { toast } from "react-hot-toast";

export default function NoticiasDashboard() {
  const { profile } = useAuthContext(); // ← AHORA SÍ EXISTE

  const [items, setItems] = useState([]);
  const [estado, setEstado] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    if (!profile) return;

    let query = supabase
      .from("noticias")
      .select("id, titulo, estado, fecha_actualizacion")
      .order("fecha_actualizacion", { ascending: false });

    // Filtros según rol
    if (profile.rol === "reportero") {
      query = query.eq("autor_id", profile.id);
    }

    if (estado) {
      query = query.eq("estado", estado);
    }

    if (search) {
      query = query.ilike("titulo", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Error cargando noticias");
      console.error(error);
      return;
    }

    setItems(data || []);
  };

  useEffect(() => {
    if (profile) load();
  }, [profile, estado, search]);

  const cambiarEstadoNoticia = async (id, nuevo) => {
    const { error } = await supabase
      .from("noticias")
      .update({ estado: nuevo })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Estado cambiado a: ${nuevo}`);
      load();
    }
  };

  const remove = async (id) => {
    const { error } = await supabase.from("noticias").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Noticia eliminada");
  };

  // Si aún no cargó el perfil
  if (!profile) {
    return <p className="p-4">Cargando usuario...</p>;
  }

  return (
    <div className="p-8 space-y-6 container max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Noticias de {profile.nombre}
        </h1>
        <Link to="/dashboard/noticias/nueva" className="btn-primary">
          + Crear noticia
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          className="input px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option>Edición</option>
          <option>Terminado</option>
          <option>Publicado</option>
          <option>Desactivado</option>
        </select>

        <input
          className="input flex-1 min-w-64 px-6 py-4 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn-ghost px-6 py-4 rounded-2xl text-red-600 hover:text-red-800"
          onClick={load}
        >
          Filtrar
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No hay noticias con estos filtros.
          </p>
          <p className="text-sm mt-2">
            {profile.rol === "reportero"
              ? "¡Crea tu primera noticia!"
              : "Prueba con otros filtros"}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white dark:bg-gray-800 rounded-lg shadow">
          {items.map((n) => (
            <li key={n.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{n.titulo}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {n.estado} · {new Date(n.fecha_actualizacion).toLocaleDateString("es-CO")}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/dashboard/noticias/editar/${n.id}`}
                    className="btn-ghost text-sm text-red-600 hover:text-red-700"
                  >
                    Editar
                  </Link>

                  {profile.rol === "reportero" && n.estado === "Edición" && (
                    <button
                      className="btn-ghost text-sm text-orange-600 hover:text-orange-700"
                      onClick={() => cambiarEstadoNoticia(n.id, "Terminado")}
                    >
                      Terminado
                    </button>
                  )}

                  {profile.rol === "editor" && (
                    <>
                      {n.estado !== "Publicado" && (
                        <button
                          className="btn-ghost text-sm text-green-600 hover:text-green-700"
                          onClick={() => cambiarEstadoNoticia(n.id, "Publicado")}
                        >
                          Publicar
                        </button>
                      )}
                      {n.estado !== "Desactivado" && (
                        <button
                          className="btn-ghost text-sm text-orange-600 hover:text-orange-700"
                          onClick={() => cambiarEstadoNoticia(n.id, "Desactivado")}
                        >
                          Desactivar
                        </button>
                      )}
                      <button
                        className="btn-ghost text-sm text-red-600 hover:text-red-700"
                        onClick={() => {
                          if (confirm("¿Eliminar esta noticia para siempre?")) {
                            remove(n.id).then(load);
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}
