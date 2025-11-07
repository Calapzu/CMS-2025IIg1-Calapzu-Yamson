import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener perfil desde tabla users
  const fetchProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nombre, email, rol')
        .eq('id', uid)
        .maybeSingle();
      if (error) throw error;
      setProfile(data ?? null);
    } catch (err) {
      console.error('❌ Error cargando perfil:', err.message);
      setProfile(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;

      setSession(session);

      if (session?.user?.id) {
        await fetchProfile(session.user.id);
      }

      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) await fetchProfile(newSession.user.id);
      else setProfile(null);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      profile,
      role: profile?.rol ?? null,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
