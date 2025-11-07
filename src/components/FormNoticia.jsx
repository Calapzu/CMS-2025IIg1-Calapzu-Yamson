
import { useState } from "react";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { supabase } from "../services/supabaseClient";
import Button from "./ui/Button";
import Input from "./ui/Input";

export default function FormNoticia({
  onSubmit,
  secciones = [],
  role,
  initialData = {}
}) {
  const [titulo, setTitulo] = useState(initialData?.titulo || "");
  const [subtitulo, setSubtitulo] = useState(initialData?.subtitulo || "");
  const [contenido, setContenido] = useState(initialData?.contenido || "");
  const [categoriaId, setCategoriaId] = useState(initialData?.categoria_id || "");
  const [imagenUrl, setImagenUrl] = useState(initialData?.imagen_url || "");
  const [estado, setEstado] = useState(initialData?.estado || "Edición");
  const [saving, setSaving] = useState(false);

  const handleUpload = async (file) => {
    if (!file) return;

    setSaving(true);
    toast.loading("Comprimiendo imagen como un campeón...");

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp"
      });

      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('noticias')
        .upload(fileName, compressedFile, { upsert: true });

      if (uploadError) throw uploadError;

      // CORREGIDO: esta línea tenía un doble = que rompía todo
      const { data: { publicUrl } } = supabase.storage
        .from('noticias')
        .getPublicUrl(fileName);

      setImagenUrl(publicUrl);
      toast.dismiss();
      toast.success("¡IMAGEN CARGADA EN 0.3s!");
    } catch (err) {
      toast.dismiss();
      toast.error("Error al subir imagen: " + err.message);
      console.error("Error completo:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) {
      toast.error("Título y contenido son OBLIGATORIOS, parcero");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        contenido: contenido.trim(),
        categoria_id: categoriaId || null,
        imagen_url: imagenUrl,
        estado
      });
      toast.success("¡NOTICIA PUBLICADA COMO UN REY!");
    } catch (err) {
      toast.error(err.message || "Error al guardar la noticia");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-10 text-white">
        <h1 className="text-4xl font-black tracking-tight">
          {initialData?.id ? "EDITAR NOTICIA" : "CREAR NUEVA NOTICIA"}
        </h1>
        <p className="text-red-100 text-lg mt-2 font-medium">
          El Calapzútimo Noticiero necesita tu flow
        </p>
      </div>

      <div className="p-8 lg:p-12 space-y-10">
        <div>
          <Input
            label="TÍTULO QUE ROMPA EL INTERNET"
            placeholder="Ej: ¡Petro baila cumbia en la Casa de Nariño!"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="text-2xl font-bold"
          />
        </div>

        <div>
          <Input
            label="SUBTÍTULO PICANTE"
            placeholder="El gancho que hace que cliquen como locos..."
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-black text-red-600 uppercase tracking-wider mb-3">
            CUERPO DE LA NOTICIA
          </label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
            rows={12}
            placeholder="Aquí va el chisme completo, con fuentes, datos y todo el flow..."
            className="w-full px-6 py-5 rounded-2xl border-2 text-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 outline-none resize-none focus:ring-4 focus:ring-red-500/20 border-gray-300 dark:border-gray-700 focus:border-red-600"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-black text-red-600 uppercase tracking-wider mb-3">
              SECCIÓN
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full px-6 py-5 rounded-2xl border-2 text-lg font-bold bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-600 border-gray-300 dark:border-gray-700"
            >
              <option value="">Sin sección</option>
              {secciones?.map((s) => (
                <option key={s.id} value={s.id} className="font-bold">
                  {s.nombre.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {role === "editor" && (
            <div>
              <label className="block text-sm font-black text-red-600 uppercase tracking-wider mb-3">
                ESTADO
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl border-2 text-lg font-bold bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-600 border-gray-300 dark:border-gray-700"
              >
                <option value="Edición">Edición</option>
                <option value="Terminado">Terminado</option>
                <option value="Publicado">Publicado</option>
                <option value="Desactivado">Desactivado</option>
              </select>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-10 border-4 border-dashed border-red-600/30">
          <label className="block text-2xl font-black text-center text-red-600 mb-8">
            IMAGEN QUE HAGA CLIC
          </label>

          <div className="flex justify-center">
            <label htmlFor="file-upload" className="cursor-pointer group">
              <div className="bg-red-600 hover:bg-red-700 text-white font-black text-2xl px-12 py-16 rounded-3xl shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                <span className="block">SUBIR FOTO</span>
                <span className="block text-sm font-medium mt-2">Máx 10MB - Se convierte a WebP</span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                disabled={saving}
              />
            </label>
          </div>

          {imagenUrl && (
            <div className="mt-10 relative rounded-3xl overflow-hidden shadow-3xl border-8 border-white dark:border-gray-800">
              <img src={imagenUrl} alt="Vista previa" className="w-full h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-3xl font-black drop-shadow-2xl">VISTA PREVIA</p>
                <p className="text-white/90 text-lg font-bold">¡QUÉ NOTICIA TAN BRUTAL!</p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-10 border-t-4 border-red-600">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full py-8 text-3xl font-black tracking-wider transform hover:scale-105 transition-all duration-300"
            disabled={saving}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-4">
                <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                GUARDANDO NOTICIA...
              </span>
            ) : (
              "PUBLICAR NOTICIA AL MUNDO"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}