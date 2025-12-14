import { createContext, useContext, useState, ReactNode } from "react";
import { Transaction, MOCK_TRANSACTIONS } from "../lib/mockData";

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (txn: Transaction) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

    const addTransaction = (txn: Transaction) => {
        setTransactions((prev) => [txn, ...prev]);
    };

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error("useTransactions must be used within a TransactionProvider");
    }
    return context;
}
