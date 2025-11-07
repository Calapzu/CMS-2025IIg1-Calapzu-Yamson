import { supabase } from '../services/supabaseClient';

export function useAuth() {

  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err) {
      console.error("❌ Error en login:", err.message);
      return { success: false, message: err.message };
    }
  };

  const signUp = async ({ email, password, nombre, rol = "reportero" }) => {
    try {
      // 1️⃣ Crear usuario en Auth
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw new Error(signUpError.message);

      const user = data.user;
      if (!user) throw new Error("No se pudo obtener el usuario tras el registro.");

      // 2️⃣ Guardar datos extra en tabla users
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ id: user.id, nombre, email, rol }]);
      if (insertError) throw new Error(insertError.message);

      // 3️⃣ Iniciar sesión automáticamente
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw new Error(loginError.message);

      return { success: true, message: "Usuario registrado y logueado correctamente.", user: loginData.user };

    } catch (err) {
      console.error("❌ Error en registro:", err.message);
      return { success: false, message: err.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/login';
    } catch (err) {
      console.error("❌ Error cerrando sesión:", err.message);
    }
  };

  return { signIn, signUp, signOut };
}

