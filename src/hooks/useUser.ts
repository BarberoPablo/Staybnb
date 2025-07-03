"use client";

import { createClient } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState, useRef } from "react";

const supabase = createClient();

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initialAuthEvent = useRef(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (initialAuthEvent.current) {
        initialAuthEvent.current = false;
        return;
      }
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe?.(); // si subscription tiene unsubscribe
    };
  }, []);

  return { user, session, loading };
}

/*
useUser hook - Explanation:

1. Initially, we call supabase.auth.getSession() to get the current session.
2. We store the session and user in state, and set loading to false.
3. Then, we subscribe to authentication changes with supabase.auth.onAuthStateChange.
4. The first event received from onAuthStateChange is almost identical to the session we already have,
   so we use a flag (initialAuthEvent) to ignore this first event and avoid unnecessary state updates.
5. For subsequent events (login, logout, refresh), we update the state with the new session and user.
6. This prevents the state from being set twice on mount and avoids side effects depending on user from running multiple times.

Summary:
- getSession() fetches initial auth state.
- onAuthStateChange listens for future auth changes.
- The first duplicate event is ignored.
*/
