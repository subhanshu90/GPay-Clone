import { useState, useEffect, useRef } from "react";
import { ArrowLeft, X, Zap, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

export default function QRScanner({ onClose, onScan }: QRScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;

    const startScanning = async () => {
      try {
        scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await scanner.start(
          { facingMode: "environment" }, // Use back camera
          config,
          (decodedText) => {
            // Successfully scanned
            if (!isScanning.current) return;
            
            console.log("QR Code scanned:", decodedText);
            
            // Parse UPI URL
            if (decodedText.startsWith("upi://")) {
              isScanning.current = false;
              scanner?.stop().then(() => {
                onScan(decodedText);
              });
            } else {
              setError("Invalid QR code. Please scan a UPI payment QR code.");
              setTimeout(() => setError(null), 3000);
            }
          },
          (errorMessage) => {
            // Scanner is running but no QR detected - this is normal
            // Don't show error for this
          }
        );

        isScanning.current = true;
        setScanning(true);
      } catch (err: any) {
        console.error("Error starting scanner:", err);
        
        if (err.name === "NotAllowedError" || err.message?.includes("permission")) {
          setPermissionDenied(true);
          setError("Camera permission denied. Please allow camera access to scan QR codes.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else {
          setError("Failed to start camera. Please try again.");
        }
        setScanning(false);
      }
    };

    startScanning();

    // Cleanup
    return () => {
      isScanning.current = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScan]);

  const handleClose = () => {
    isScanning.current = false;
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        onClose();
      }).catch(() => {
        onClose();
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <button onClick={handleClose} className="p-2 bg-black/40 rounded-full backdrop-blur-md">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-4">
          <button className="p-2 bg-black/40 rounded-full backdrop-blur-md">
            <Zap size={24} />
          </button>
          <button onClick={handleClose} className="p-2 bg-black/40 rounded-full backdrop-blur-md">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="h-full w-full relative flex flex-col items-center justify-center">
        {/* Camera Feed */}
        <div id="qr-reader" className="w-full max-w-md" />

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 left-4 right-4 bg-red-500/90 backdrop-blur-md text-white px-4 py-3 rounded-lg flex items-center gap-3"
          >
            <AlertCircle size={20} />
            <p className="text-sm font-medium flex-1">{error}</p>
          </motion.div>
        )}

        {/* Instructions */}
        {scanning && !error && (
          <p className="mt-8 text-sm font-medium text-white/80 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md absolute bottom-32">
            Align QR code within the frame to scan
          </p>
        )}

        {/* Permission Denied State */}
        {permissionDenied && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-8">
            <AlertCircle size={64} className="text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Camera Access Required</h3>
            <p className="text-center text-white/80 mb-6">
              To scan QR codes, please allow camera access in your browser settings.
            </p>
            <button
              onClick={handleClose}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-medium"
            >
              Close Scanner
            </button>
          </div>
        )}

        {/* Bottom Instructions */}
        <div className="absolute bottom-12 w-full px-8 text-center">
          <p className="text-xs text-white/60 mb-4">
            Point your camera at a UPI QR code to scan
          </p>
        </div>
      </div>
    </div>
  );
}
