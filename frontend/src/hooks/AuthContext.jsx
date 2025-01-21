import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      setSession(data.session);
      setUser(data.session?.user);
      setLoading(false);
    };

    const listener = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    setData();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ session, user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
