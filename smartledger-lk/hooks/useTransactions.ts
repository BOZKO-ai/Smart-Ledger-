
"use client";

import { useState, useEffect } from "react";

export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch transactions from MongoDB
    setLoading(false);
  }, []);

  return { transactions, loading };
}

