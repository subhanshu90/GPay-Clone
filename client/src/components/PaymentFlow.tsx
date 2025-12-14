import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ShieldCheck,
  Share2,
  HelpCircle,
  ChevronRight,
  MoreVertical,
  RotateCcw
} from "lucide-react";
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
  const [currentTxn, setCurrentTxn] = useState<Transaction | null>(null);

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

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
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

    setCurrentTxn(newTxn);
    setStep('success');

    // Play success sound using imported file
    try {
      const audio = new Audio("/payment-success.mp3");
      audio.volume = 0.5;
      await audio.play();
      console.log('✓ Payment sound played successfully!');
    } catch (error) {
      console.warn('Audio playback failed:', error);
      // Browser may block autoplay - this is normal
    }

    // Don't call onSuccess here - only when Done button is clicked
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
                className="w-full text-center text-6xl font-medium text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 focus:outline-none p-0 pl-6 bg-transparent"
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
        <div className="flex-1 bg-white flex flex-col h-full">
          {/* UPI Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1A73E8] text-white">
            <div className="flex items-center gap-2">
              <span className="font-medium text-lg tracking-wide">Google Pay</span>
            </div>
            <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded">UPI</div>
          </div>

          {/* Bank Header Section */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">TO</p>
              <p className="text-sm font-semibold text-gray-800">{recipient.name}</p>
              <p className="text-xs text-gray-500">{recipient.upiId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">SENDING</p>
              <p className="text-lg font-bold text-gray-900">₹{parseFloat(amount).toFixed(2)}</p>
            </div>
          </div>

          {/* PIN Entry Area */}
          <div className="flex-1 flex flex-col items-center pt-12">
            <p className="text-sm font-medium text-gray-700 mb-8 tracking-wide">ENTER 6-DIGIT UPI PIN</p>

            <div className="flex gap-3 mb-12">
              {pin.map((digit, i) => (
                <div key={i} className="relative">
                  <input
                    id={`pin-${i}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-10 h-10 border-b-2 border-gray-300 text-center text-2xl text-gray-800 focus:border-[#1A73E8] transition-colors outline-none bg-transparent font-bold"
                  />
                  {/* Dot mask for entered PIN */}
                  {digit && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white pointer-events-none">
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Warnings/Security Text */}
            <div className="mt-auto mb-8 px-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-green-600" />
                <span className="text-xs font-medium text-gray-600">UPI SECURE</span>
              </div>
              <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                Do not share your UPI PIN with anyone. Google Pay or your bank will never ask for it.
              </p>
            </div>
          </div>

          {/* Keyboard/Actions Area */}
          <div className="bg-[#F8F9FA] px-4 py-3 flex justify-between items-center border-t border-gray-200">
            <button
              onClick={() => setStep('amount')}
              className="px-6 py-2 text-sm font-bold text-gray-600 uppercase tracking-wide hover:bg-gray-200 rounded transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handlePayment}
              disabled={pin.some(p => !p)}
              className="w-14 h-14 bg-[#1A73E8] rounded-full flex items-center justify-center text-white shadow-md disabled:opacity-50 disabled:shadow-none hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Check size={28} strokeWidth={3} />
            </button>
          </div>

          {/* Standard Android Nav Bar Placeholder */}
          <div className="h-12 bg-black flex items-center justify-around px-12">
            <div className="w-4 h-4 border-2 border-gray-500 rotate-45 rounded-[2px]"></div>
            <div className="w-4 h-4 border-2 border-gray-500 rounded-full"></div>
            <div className="w-4 h-4 border-2 border-gray-500 rounded-[2px]"></div>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-6"></div>
          <h3 className="text-lg font-medium text-gray-900">Processing payment...</h3>
        </div>
      )}

      {step === 'success' && currentTxn && (
        <div className="flex-1 flex flex-col bg-[#0A0A0A] text-white">
          {/* Success Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Blue Check Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-8"
            >
              <Check size={48} strokeWidth={3} className="text-white" />
            </motion.div>

            {/* Amount */}
            <h2 className="text-4xl font-medium mb-6">₹{currentTxn.amount.toFixed(2)}</h2>

            {/* Payment Details */}
            <div className="text-center space-y-1 mb-8">
              <p className="text-gray-400 text-sm">Paid to</p>
              <p className="text-white text-lg font-medium">{currentTxn.recipient}</p>
              <p className="text-gray-400 text-sm">{currentTxn.recipientUpi}</p>
              <p className="text-gray-500 text-xs mt-2">
                {new Date(currentTxn.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 pb-6 space-y-3">
            <button
              onClick={() => {
                onSuccess(currentTxn);
                onClose();
              }}
              className="w-full bg-blue-600 text-white font-medium py-3.5 rounded-full transition-all active:scale-[0.98]"
            >
              Done
            </button>
            <button className="w-full border border-gray-800 text-gray-300 font-medium py-3.5 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Share2 size={18} />
              Share screenshot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
