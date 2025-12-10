import { useState } from "react";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { Transaction } from "../lib/mockData";
import TransactionDetail from "./TransactionDetail";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onClose: () => void;
}

export default function TransactionHistory({ transactions, onClose }: TransactionHistoryProps) {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  if (selectedTxn) {
    return <TransactionDetail txn={selectedTxn} onClose={() => setSelectedTxn(null)} />;
  }

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col h-full animate-in slide-in-from-right duration-300">
       {/* Header */}
       <div className="px-4 py-3 flex items-center gap-4 bg-white sticky top-0 z-10">
          <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
             <ArrowLeft size={24} className="text-gray-600" />
          </button>
          
          <div className="flex-1 relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
             <input 
                type="text" 
                placeholder="Search transactions" 
                className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
             />
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
             <Filter size={20} className="text-gray-600" />
          </button>
       </div>

       {/* List */}
       <div className="flex-1 overflow-y-auto pb-20">
          <div className="px-4 py-2">
             <h3 className="text-xs font-medium text-gray-500 mb-3 px-2">RECENT ACTIVITY</h3>
             <div className="flex flex-col gap-1">
                {transactions.map((txn) => (
                   <div 
                     key={txn.id} 
                     onClick={() => setSelectedTxn(txn)}
                     className="flex items-start gap-4 py-3.5 px-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                   >
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${txn.type === 'received' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                         {txn.recipient[0]}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[0.95rem] text-[#1F1F1F] truncate">{txn.recipient}</h3>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {new Date(txn.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'long'})}
                          </p>
                       </div>
                       <div className="text-right">
                          <p className={`font-semibold text-[0.95rem] ${txn.type === 'received' ? 'text-green-600' : 'text-[#1F1F1F]'}`}>
                            {txn.type === 'received' ? '+' : '-'} ₹{txn.amount.toFixed(2)}
                          </p>
                          {txn.status === 'failed' && (
                             <span className="text-[10px] text-red-500 font-medium block mt-0.5">Failed</span>
                          )}
                       </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}
