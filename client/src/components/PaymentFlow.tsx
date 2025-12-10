import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, CreditCard, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_USER, generateTransactionId, generateBankRefId, type Transaction } from "../lib/mockData";

interface PaymentFlowProps {
  recipient: { name: string; upiId: string; avatar?: string };
  onClose: () => void;
  onSuccess: (txn: Transaction) => void;
}

export default function PaymentFlow({ recipient, onClose, onSuccess }: PaymentFlowProps) {
  const [step, setStep] = useState<'amount' | 'pin' | 'processing' | 'success'>('amount');
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handlePayment = async () => {
    setStep('processing');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTxn: Transaction = {
      id: generateTransactionId(),
      amount: parseFloat(amount),
      recipient: recipient.name,
      recipientUpi: recipient.upiId,
      date: new Date().toISOString(),
      status: 'success',
      type: 'sent',
      bankRefId: generateBankRefId()
    };
    
    setStep('success');
    
    // Wait for success animation
    setTimeout(() => {
      onSuccess(newTxn);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-full">
      {step === 'amount' && (
        <>
          <div className="p-4 flex items-center gap-4">
            <button onClick={onClose}><ArrowLeft size={24} /></button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-lg font-medium">
                {recipient.avatar || recipient.name[0]}
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-900 leading-tight">{recipient.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{recipient.upiId}</p>
                <div className="flex items-center gap-1 text-xs text-green-700 mt-0.5">
                   <ShieldCheck size={12} fill="currentColor" className="text-green-700" />
                   <span>Verified Name: {recipient.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="relative w-full max-w-[280px] text-center">
               <span className="absolute top-1/2 -translate-y-1/2 left-0 text-3xl font-medium text-gray-700">₹</span>
               <input 
                 type="number" 
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 placeholder="0"
                 autoFocus
                 className="w-full text-center text-6xl font-medium text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 p-0 pl-6 bg-transparent"
               />
            </div>
            
            <input 
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
              className="mt-6 text-center bg-gray-100 rounded-full py-2 px-6 text-sm font-medium w-48 focus:outline-none focus:bg-gray-200 transition-colors"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-8">
             <div className="flex items-center justify-between px-4 py-3 mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg" className="w-6 h-6" alt="Bank" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{MOCK_USER.bankAccount.bankName} •••• {MOCK_USER.bankAccount.accountNumber.slice(-4)}</span>
                      <span className="text-xs text-gray-500">Savings Account</span>
                   </div>
                </div>
                <ChevronDown size={20} className="text-gray-500" />
             </div>
             
             <button 
               disabled={!amount}
               onClick={() => setStep('pin')}
               className="w-full bg-blue-600 text-white font-medium py-3.5 rounded-full shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
             >
               Pay ₹{amount || '0'}
             </button>
             
             <div className="flex justify-center mt-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4 opacity-60" alt="UPI" />
             </div>
          </div>
        </>
      )}

      {step === 'pin' && (
        <div className="flex-1 bg-[#1a1f2e] text-white flex flex-col">
           <div className="p-4 flex justify-between items-center border-b border-white/10">
              <span className="font-medium">UPI PIN</span>
              <div className="flex items-center gap-2 text-xs opacity-70">
                 <span>SECURE</span>
                 <ShieldCheck size={14} />
              </div>
           </div>
           
           <div className="flex-1 flex flex-col items-center pt-12 px-6">
              <div className="w-full bg-white/5 rounded-lg p-4 mb-8 flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-xs text-gray-400 mb-1">Paying to</span>
                    <span className="font-medium text-lg">{recipient.name}</span>
                    <span className="text-xs text-gray-400">{recipient.upiId}</span>
                 </div>
                 <span className="text-xl font-medium">₹{amount}</span>
              </div>

              <p className="text-sm text-gray-400 mb-6">ENTER 6-DIGIT UPI PIN</p>
              
              <div className="flex gap-4 mb-8">
                 {pin.map((digit, i) => (
                    <input
                      key={i}
                      id={`pin-${i}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      className="w-10 h-10 rounded bg-white/10 border border-white/20 text-center text-xl text-white focus:border-blue-400 focus:bg-white/20 transition-all outline-none"
                    />
                 ))}
              </div>
           </div>

           <div className="p-4 grid grid-cols-2 gap-4">
              <button onClick={() => setStep('amount')} className="py-3 text-sm font-medium text-red-400">CANCEL</button>
              <button 
                onClick={handlePayment}
                disabled={pin.some(p => !p)}
                className="bg-blue-600 text-white rounded-full py-3 text-sm font-medium shadow-lg disabled:opacity-50"
              >
                SUBMIT
              </button>
           </div>
           <div className="flex justify-center pb-6 opacity-30">
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4 invert" alt="UPI" />
           </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
           <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-6"></div>
           <h3 className="text-lg font-medium text-gray-900">Processing Payment...</h3>
           <p className="text-sm text-gray-500 mt-2">Do not close this window</p>
        </div>
      )}

      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white relative overflow-hidden">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 shadow-xl relative z-10"
           >
              <Check size={48} strokeWidth={3} />
           </motion.div>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="text-center"
           >
             <h2 className="text-2xl font-bold text-gray-900 mb-1">₹{amount}</h2>
             <p className="text-lg font-medium text-gray-800 mb-1">Paid to {recipient.name}</p>
             <p className="text-sm text-gray-500">{recipient.upiId}</p>
           </motion.div>

           {/* Audio sound effect visualization */}
           <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 3, opacity: 0 }}
                 transition={{ duration: 1.5, repeat: Infinity }}
                 className="w-48 h-48 bg-blue-100 rounded-full"
              />
           </div>
        </div>
      )}
    </div>
  );
}
