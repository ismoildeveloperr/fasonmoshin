import { useEffect, useState, type PropsWithChildren } from "react";

import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/shared/api/supabase";

import { getAuthUser, type AuthUser } from "../api/authApi";

import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [session, setSession] = useState<Session | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const hydrateSession = async (nextSession: Session | null) => {
      if (!nextSession?.user) {
        setSession(null);
        setUser(null);
        return;
      }

      const nextUser = await getAuthUser(nextSession.user);

      if (!mounted) {
        return;
      }

      setSession(nextSession);
      setUser(nextUser);
    };

    const initialize = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        await hydrateSession(data.session);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) {
        return;
      }

      window.setTimeout(() => {
        void hydrateSession(nextSession).finally(() => {
          if (mounted) {
            setIsLoading(false);
          }
        });
      }, 0);
    });

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
