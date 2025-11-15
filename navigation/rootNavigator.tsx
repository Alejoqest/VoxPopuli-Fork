import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { authService } from "../backend/services/authService";
import AppStack from "./appStack";
import AuthStack from "./authStack";

const RootNavigator = () => {
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const s = await authService.getSession();
      setSession(s);
      setLoading(false);
    };

    init();

    const unsubcribe = authService.onAuthStateChange((s) => setSession(s));

    return () => {
      if (unsubcribe) unsubcribe();
    };
  }, []);

  if (loading) return null;

  return session ? <AppStack /> : <AuthStack />;
};

export default RootNavigator;
