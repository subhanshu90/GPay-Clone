import { ArrowLeft, Share2, HelpCircle, ChevronDown, CheckCircle2, Copy } from "lucide-react";
import { Transaction, MOCK_USER } from "../lib/mockData";

interface TransactionDetailProps {
  txn: Transaction;
  onClose: () => void;
}

export default function TransactionDetail({ txn, onClose }: TransactionDetailProps) {
  const isReceived = txn.type === 'received';
  const date = new Date(txn.date);
  
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-full animate-in slide-in-from-bottom duration-300">
       {/* Header */}
       <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
             <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex gap-2">
             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <HelpCircle size={24} className="text-gray-600" />
             </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto">
          {/* Main Content */}
          <div className="flex flex-col items-center pt-8 pb-8 px-6 text-center">
             <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-medium mb-4 shadow-sm">
                {txn.recipient[0]}
             </div>
             
             <h2 className="text-xl font-medium text-gray-900 mb-1">
                {isReceived ? `Received from ${txn.recipient}` : `Paid to ${txn.recipient}`}
             </h2>
             <p className="text-sm text-gray-500 mb-6">{txn.recipientUpi}</p>
             
             <h1 className="text-4xl font-medium text-gray-900 mb-2">
                ₹{txn.amount.toFixed(2)}
             </h1>
             
             <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full mt-2 mb-8">
                <CheckCircle2 size={14} className="text-green-700 fill-green-100" />
                <span className="text-xs font-medium text-green-700">
                   Completed • {date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                </span>
             </div>

             {/* Action Buttons */}
             <div className="flex gap-3 w-full max-w-sm mb-8">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                   <Share2 size={16} /> Share receipt
                </button>
             </div>

             {/* Details List */}
             <div className="w-full max-w-md border border-gray-200 rounded-xl overflow-hidden text-left">
                <div className="p-4 border-b border-gray-100">
                   <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Payment Details</p>
                   <div className="flex justify-between items-start mb-3">
                      <div>
                         <p className="text-xs text-gray-500 mb-0.5">UPI transaction ID</p>
                         <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-900 font-medium">{txn.id.replace('T', '3245')}</p>
                            <Copy size={12} className="text-gray-400" />
                         </div>
                      </div>
                      <ChevronDown size={16} className="text-gray-400" />
                   </div>
                   
                   <div className="flex justify-between items-start mb-3">
                      <div>
                         <p className="text-xs text-gray-500 mb-0.5">To</p>
                         <p className="text-sm text-gray-900 font-medium">{txn.recipient}</p>
                         <p className="text-xs text-gray-500">{txn.recipientUpi}</p>
                      </div>
                   </div>

                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-xs text-gray-500 mb-0.5">From</p>
                         <p className="text-sm text-gray-900 font-medium">{MOCK_USER.name}</p>
                         <p className="text-xs text-gray-500">{MOCK_USER.upiId}</p>
                      </div>
                   </div>
                </div>
                
                <div className="p-4 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg" className="w-8 h-8 opacity-80" alt="Bank" />
                        <div>
                           <p className="text-sm font-medium text-gray-900">State Bank of India {MOCK_USER.bankAccount.accountNumber.slice(-4)}</p>
                           <p className="text-xs text-gray-500">Credited to beneficiary bank</p>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 pl-11">
                       UTR: {txn.bankRefId}
                    </p>
                </div>
             </div>
             
             <div className="mt-8 w-full max-w-md">
                <button className="w-full py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                   Report a problem
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
