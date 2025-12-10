import { useState, useRef, useEffect } from "react";
import { ArrowLeft, X, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface QRScannerProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

export default function QRScanner({ onClose, onScan }: QRScannerProps) {
  const [scanning, setScanning] = useState(true);
  
  // Mock scanning effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto scan for demo purposes
      onScan("upi://pay?pa=merchant@okaxis&pn=Merchant%20Store&mc=1234&tid=1234567890&tr=1234567890&tn=Payment&am=0&cu=INR");
    }, 3000);
    return () => clearTimeout(timer);
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <button onClick={onClose} className="p-2 bg-black/40 rounded-full backdrop-blur-md">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-4">
           <button className="p-2 bg-black/40 rounded-full backdrop-blur-md">
              <Zap size={24} />
           </button>
           <button onClick={onClose} className="p-2 bg-black/40 rounded-full backdrop-blur-md">
              <X size={24} />
           </button>
        </div>
      </div>

      <div className="h-full w-full relative flex flex-col items-center justify-center">
        {/* Camera Feed Simulation */}
        <div className="absolute inset-0 bg-gray-900">
           {/* Mock camera patterns */}
           <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black"></div>
        </div>

        {/* Scanner Frame */}
        <div className="relative w-64 h-64 border-2 border-white/30 rounded-3xl overflow-hidden">
           <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
           <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
           
           {/* Scanning Line Animation */}
           <motion.div 
             animate={{ y: [0, 256, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             className="w-full h-0.5 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,1)]"
           />
        </div>

        <p className="mt-8 text-sm font-medium text-white/80 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
           Align QR code within the frame to scan
        </p>

        <div className="absolute bottom-12 w-full px-8">
           <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 py-3 rounded-xl font-medium text-sm">
              Upload from gallery
           </button>
        </div>
      </div>
    </div>
  );
}
