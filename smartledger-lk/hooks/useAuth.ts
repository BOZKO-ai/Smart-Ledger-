
"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with your actual auth provider (NextAuth, Firebase Auth, etc.)
    // For now, this is a placeholder
    setLoading(false);
  }, []);

  return { user, loading };
}

