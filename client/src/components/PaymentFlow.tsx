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
  X,
  AlertCircle,
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

  // Lock body scroll and reset scroll position when component mounts
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Reset window scroll to top
    window.scrollTo(0, 0);

    return () => {
      // Restore body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 h-[100dvh] w-screen bg-background z-[9999] flex flex-col text-foreground overscroll-none overflow-hidden touch-none"
    >
      {step === 'amount' && (
        <div className="flex flex-col h-full relative">
          {/* Solid Backdrop */}
          <div className="absolute inset-0 bg-background -z-10" />

          {/* Header */}
          <div className="flex items-center justify-between p-4 shrink-0">
            <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-muted/20 transition-colors">
              <X className="text-foreground" size={24} />
            </button>
            <div className="flex gap-2">
              <button className="p-2 -mr-2 rounded-full hover:bg-muted/20 transition-colors">
                <AlertCircle className="text-foreground" size={24} />
              </button>
              <button className="p-2 -mr-2 rounded-full hover:bg-muted/20 transition-colors">
                <MoreVertical className="text-foreground" size={24} />
              </button>
            </div>
          </div>

          {/* Main Content Container - Top Aligned */}
          <div className="flex flex-col items-center mt-4 w-full shrink-0">
            {/* Recipient Info */}
            <div className="flex flex-col items-center pointer-events-none select-none mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md">
                {recipient.avatar || recipient.name[0]}
              </div>
              <h2 className="font-semibold text-foreground text-lg mb-1">Paying {recipient.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <ShieldCheck size={14} className="text-green-500 fill-current" />
                <span className="font-medium">Banking name: {recipient.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{recipient.upiId}</p>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col items-center justify-center mb-6 w-full">
              <div className="flex items-center justify-center w-full relative px-8">
                <span className={`font-normal text-foreground transition-all duration-200 ${amount ? 'text-5xl translate-y-[-4px]' : 'text-4xl text-muted-foreground'}`}>
                  ₹
                </span>
                <input
                  type="tel"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={amount}
                  placeholder="0"
                  onChange={(e) => {
                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                      setAmount(e.target.value);
                    }
                  }}
                  className="font-normal text-foreground bg-transparent text-left focus:outline-none placeholder:text-muted-foreground/30 ml-1 transition-all duration-200"
                  style={{
                    fontSize: amount ? '5rem' : '4rem',
                    caretColor: 'currentColor',
                    width: amount ? `${amount.length + 0.5}ch` : '1.5ch',
                    maxWidth: '100%'
                  }}
                />
              </div>
            </div>

            {/* Note Pill */}
            <button className="px-6 py-2.5 bg-muted/50 text-foreground rounded-full text-sm font-medium hover:bg-muted transition-colors border border-border/50 flex items-center gap-2">
              Add note
            </button>
          </div>

          {/* Floating Next Button */}
          <AnimatePresence>
            {amount && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed bottom-8 right-6 z-50"
              >
                <button
                  onClick={() => setStep('pin')}
                  className="w-14 h-14 bg-[#1A73E8] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all active:scale-95"
                >
                  <ChevronRight size={32} className="text-white ml-0.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
              <p className="text-sm font-semibold text-gray-900">{recipient.name}</p>
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
                    className="w-10 h-10 border-b-2 border-gray-300 text-center text-2xl text-gray-900 focus:border-[#1A73E8] transition-colors outline-none bg-transparent font-bold"
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
        <div className="flex-1 flex flex-col items-center justify-center bg-background">
          <div className="w-16 h-16 rounded-full border-4 border-muted border-t-blue-600 animate-spin mb-6"></div>
          <h3 className="text-lg font-medium text-foreground">Processing payment...</h3>
        </div>
      )}

      {step === 'success' && currentTxn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col bg-background text-foreground"
        >
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
            <h2 className="text-4xl font-medium mb-6">₹{Number(currentTxn.amount).toFixed(2)}</h2>

            {/* Payment Details */}
            <div className="text-center space-y-1 mb-8">
              <p className="text-muted-foreground text-sm">Paid to</p>
              <p className="text-foreground text-lg font-medium">{currentTxn.recipient}</p>
              <p className="text-muted-foreground text-sm">{currentTxn.recipientUpi}</p>
              <p className="text-muted-foreground text-xs mt-2">
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
          <div className="p-4 pb-12 space-y-3">
            <button
              onClick={() => {
                onSuccess(currentTxn);
                onClose();
              }}
              className="w-full bg-blue-600 text-white font-medium py-3.5 rounded-full transition-all active:scale-[0.98]"
            >
              Done
            </button>
            <button className="w-full border border-border text-foreground font-medium py-3.5 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Share2 size={18} />
              Share screenshot
            </button>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
