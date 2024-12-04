import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const setData = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      setSession(data.session);
      setUser(data.session?.user ?? null);
    };

    const listener = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    setData();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
