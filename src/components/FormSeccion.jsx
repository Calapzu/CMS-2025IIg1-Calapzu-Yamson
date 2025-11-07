// src/pages/Secciones.jsx
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const toSlug = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default function Secciones() {
  const [items, setItems] = useState([]);
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [cargando, setCargando] = useState(true);

  const load = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from("secciones")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      toast.error("Error cargando secciones");
      console.error(error);
    } else {
      setItems(data || []);
    }
    setCargando(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    const cleanedSlug = toSlug(slug || nombre);

    if (!cleanedSlug) {
      toast.error("Slug inválido, mi rey");
      return;
    }

    const { error } = await supabase
      .from("secciones")
      .insert({ nombre: nombre.trim(), slug: cleanedSlug });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("SECCIÓN CREADA CON ÉXITO");
      setNombre("");
      setSlug("");
      load();
    }
  };

  const update = async (id, patch) => {
    const { error } = await supabase.from("secciones").update(patch).eq("id", id);
    if (error) toast.error("Error al actualizar");
    else {
      toast.success("ACTUALIZADO");
      load();
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Seguro que quieres ELIMINAR esta sección para siempre?")) return;

    const { error } = await supabase.from("secciones").delete().eq("id", id);
    if (error) toast.error("Error al eliminar");
    else {
      toast.success("SECCIÓN BORRADA");
      load();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-950 py-12">
      <div className="max-w-6xl mx-auto px-6">

        {/* TÍTULO CALAPZÚTIMO */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 bg-clip-text text-transparent animate-pulse">
            SECCIONES CALAPZÚTIMAS
          </h1>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-4">
            El alma del noticiero más verguero de Colombia
          </p>
        </div>

        {/* FORMULARIO CREAR */}
        <form
          onSubmit={create}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 mb-16 border-8 border-red-600"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Input
                label="NOMBRE DE LA SECCIÓN"
                placeholder="Ej: Política Caliente, Farandula VIP, Deportes Extremos"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setSlug(toSlug(e.target.value));
                }}
                required
              />
            </div>
            <div>
              <Input
                label="SLUG (se genera solo, pero puedes editar)"
                placeholder="se-genera-automatico"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-8 py-8 text-3xl font-black tracking-wider bg-gradient-to-r from-yellow-500 to-red-600 hover:from-red-600 hover:to-yellow-500"
          >
            CREAR SECCIÓN NUEVA
          </Button>
        </form>

        {/* ESTADO DE CARGA */}
        {cargando ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-24 w-24 border-8 border-red-600 border-t-transparent"></div>
            <p className="text-4xl font-black text-red-600 mt-8">CARGANDO EL PODER CALAPZÚTIMO...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
            <p className="text-6xl font-black text-gray-400">AÚN NO HAY SECCIONES</p>
            <p className="text-2xl text-gray-600 mt-6">¡Crea la primera y haz historia!</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {items.map((it, i) => (
              <div
                key={it.id}
                className="group bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border-4 border-transparent hover:border-red-600"
                style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}
              >
                <div className="p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="text-center lg:text-left">
                    <h3 className="text-5xl font-black text-red-600 group-hover:text-yellow-500 transition-all duration-500">
                      {it.nombre.toUpperCase()}
                    </h3>
                    <p className="text-3xl font-mono text-gray-600 dark:text-gray-400 mt-4 tracking-wider">
                      /{it.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="font-black text-xl border-4 border-red-600 hover:bg-red-600 hover:text-white px-8 py-4"
                      onClick={() => {
                        const nuevo = prompt("Nuevo nombre:", it.nombre);
                        if (nuevo?.trim()) update(it.id, { nombre: nuevo.trim() });
                      }}
                    >
                      RENOMBRAR
                    </Button>

                    <Button
                      variant="ghost"
                      size="lg"
                      className="font-black text-xl border-4 border-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4"
                      onClick={() => {
                        const nuevo = prompt("Nuevo slug:", it.slug);
                        if (nuevo) {
                          const cleaned = toSlug(nuevo);
                          if (cleaned) update(it.id, { slug: cleaned });
                          else toast.error("Slug no válido");
                        }
                      }}
                    >
                      CAMBIAR SLUG
                    </Button>

                    <Button
                      variant="danger"
                      size="lg"
                      className="font-black text-xl px-8 py-4"
                      onClick={() => remove(it.id)}
                    >
                      ELIMINAR
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTADOR FINAL */}
        <div className="text-center mt-20">
          <p className="text-3xl font-black text-gray-700 dark:text-gray-300">
            Total de secciones activas:{" "}
            <span className="text-6xl text-red-600">{items.length}</span>
          </p>
          <p className="text-xl text-gray-600 mt-4">
            ¡El Calapzútimo Noticiero está más vivo que nunca!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}