import { supabase } from '../services/supabaseClient';

export function useAuth() {
  // Login
  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("❌ Error en login:", err.message);
      throw err;
    }
  };

  // Registro (opcional)
  const signUp = async ({ email, password, nombre, rol = "reportero" }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("No se pudo crear el usuario");

      // Guardar perfil en tabla users con rol dinámico
      const { error: insertErr } = await supabase
        .from("users")
        .insert({
          id: user.id,
          nombre,
          email,
          rol, // puede ser 'reportero' o 'editor'
        });
      if (insertErr) throw insertErr;

      return data;
    } catch (err) {
      console.error("❌ Error en registro:", err.message);
      throw err;
    }
  };


  const signOut = async () => {
    try {
      console.log("🚪 Cerrando sesión global...");

      // 1️⃣ Cierra sesión en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 2️⃣ Forzar recarga completa de la app
      // Esto limpia todo estado de React y contextos
      window.location.href = '/login';
    } catch (err) {
      console.error("❌ Error cerrando sesión:", err);
    }
  };

  return { signIn, signUp, signOut };
}
