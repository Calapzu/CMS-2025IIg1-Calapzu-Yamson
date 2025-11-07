import React from "react";
import { Link } from "react-router-dom";

export default function CardNoticia({ item }) {
  return (
    <Link
      to={`/noticia/${item.seccion_slug}/${item.id}`}
      className="group block transform transition-all duration-300 hover:-translate-y-2"
    >
      <article className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
        {/* Imagen con overlay rojo clásico de periódico */}
        {item.imagen_url ? (
          <div className="relative overflow-hidden">
            <img
              src={item.imagen_url}
              alt={item.titulo}
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ) : (
          <div className="bg-gray-200 dark:bg-gray-800 h-64 flex items-center justify-center">
            <span className="text-6xl font-bold text-gray-400">EL DIARIO</span>
          </div>
        )}

        {/* Contenido */}
        <div className="p-6 space-y-3">
          {/* Sección - rojo colombiano */}
          <span className="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider text-white bg-red-600 rounded-full">
            {item.seccion_nombre || "General"}
          </span>

          {/* Título */}
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-300">
            {item.titulo}
          </h3>

          {/* Subtítulo */}
          <p className="text-gray-600 dark:text-gray-300 text-base line-clamp-3 leading-relaxed">
            {item.subtitulo}
          </p>

          {/* Fecha y autor (si existe) */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <time className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {new Date(item.fecha_actualizacion).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
            {item.autor && (
              <span className="text-sm font-bold text-red-600">Por {item.autor}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}