// src/hooks/useTransactions.js
// Hook para gerenciar transações

import { useCallback, useEffect, useState } from "react";
import * as storage from "../services/storage";
import { supabase } from "../services/supabase";
import * as supabaseService from "../services/supabaseService";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const createLocalTransaction = (transaction, userId) => ({
    ...transaction,
    id: `local-${Date.now()}`,
    user_id: userId,
    synced: false,
  });

  const syncLocalTransactions = useCallback(
    async (localTransactions, userId) => {
      const synced = [];
      const failed = [];

      for (const transaction of localTransactions) {
        const normalizedTransaction = {
          amount: transaction.amount,
          type: transaction.type,
          category_id: transaction.category_id || transaction.categoryId,
          description: transaction.description,
          date: transaction.date || new Date().toISOString(),
        };

        const result = await supabaseService.addTransaction(userId, normalizedTransaction);

        if (result.success) {
          synced.push(result.data);
        } else {
          failed.push(transaction);
        }
      }

      return { synced, failed };
    },
    [],
  );

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const user = await supabase.auth.getUser();

      if (!user.data?.user?.id) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      const cached = await storage.getTransactionsLocally();
      const pendingLocal = cached.filter((t) => t.synced === false);

      const result = await supabaseService.getTransactions(user.data.user.id);

      if (result.success) {
        let finalTransactions = result.data;

        if (pendingLocal.length) {
          const syncResult = await syncLocalTransactions(pendingLocal, user.data.user.id);
          finalTransactions = [
            ...syncResult.synced,
            ...result.data,
            ...syncResult.failed,
          ];
        }

        setTransactions(finalTransactions);
        await storage.saveTransactionsLocally(finalTransactions);
      } else {
        setTransactions(cached);
      }
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      const cached = await storage.getTransactionsLocally();
      setTransactions(cached);
    } finally {
      setLoading(false);
    }
  }, [syncLocalTransactions]);

  const addTransaction = useCallback(
    async (transaction) => {
      try {
        console.log("🔵 addTransaction called with:", transaction);
        
        const user = await supabase.auth.getUser();
        console.log("👤 Current user:", user.data?.user?.id);
        
        if (!user.data?.user?.id) {
          console.error("❌ Usuário não autenticado");
          return { success: false, error: "Usuário não autenticado" };
        }

        // Normalizar o objeto: categoryId -> category_id
        const normalizedTransaction = {
          ...transaction,
          category_id: transaction.categoryId || transaction.category_id,
        };
        delete normalizedTransaction.categoryId;
        
        console.log("📝 Transação normalizada:", normalizedTransaction);

        const result = await supabaseService.addTransaction(
          user.data.user.id,
          normalizedTransaction,
        );

        console.log("📤 Resultado Supabase:", result);

        if (result.success) {
          const updated = [result.data, ...transactions];
          setTransactions(updated);
          await storage.saveTransactionsLocally(updated);
          console.log("✅ Transação adicionada com sucesso!");
          return { success: true };
        }

        console.warn("⚠️ Erro Supabase, salvando localmente:", result.error);
        const localTransaction = createLocalTransaction(
          normalizedTransaction,
          user.data.user.id,
        );
        const updated = [localTransaction, ...transactions];
        setTransactions(updated);
        await storage.saveTransactionsLocally(updated);

        return {
          success: true,
          warning: `Transação salva localmente. ${result.error}`,
          local: true,
        };
      } catch (error) {
        console.error("❌ Erro na adição:", error);
        return { success: false, error: error.message };
      }
    },
    [transactions],
  );

  const deleteTransaction = useCallback(
    async (transactionId) => {
      try {
        const result = await supabaseService.deleteTransaction(transactionId);

        if (result.success) {
          const updated = transactions.filter((t) => t.id !== transactionId);
          setTransactions(updated);
          await storage.saveTransactionsLocally(updated);
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [transactions],
  );

  const updateTransaction = useCallback(
    async (transactionId, updates) => {
      try {
        const result = await supabaseService.updateTransaction(
          transactionId,
          updates,
        );

        if (result.success) {
          const updated = transactions.map((t) =>
            t.id === transactionId ? result.data : t,
          );
          setTransactions(updated);
          await storage.saveTransactionsLocally(updated);
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [transactions],
  );

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refreshTransactions: loadTransactions,
  };
};
