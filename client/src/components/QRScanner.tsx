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
  const [showFeedback, setShowFeedback] = useState(false);
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
          aspectRatio: 1.0,
          // Removed qrbox to prevent library from drawing white scanning box
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
              // Stop scanner before calling onScan
              if (scanner && scanner.isScanning) {
                scanner.stop().then(() => {
                  onScan(decodedText);
                }).catch(err => console.log("Stop error:", err));
              } else {
                onScan(decodedText);
              }
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
        // Check if scanner is actually running before stopping
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop()
            .catch(err => console.log("Cleanup stop error:", err));
        }
        scannerRef.current = null;
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

  // Add global style for the scanner video to ensure it covers the screen
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Force video to fill the screen */
      #qr-reader video {
        object-fit: cover !important;
        width: 100% !important;
        height: 100% !important;
        border-radius: 0 !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }
      
      /* Hide ALL html5-qrcode UI elements */
      #qr-shaded-region {
        display: none !important;
        background: none !important;
      }
      
      /* Hide the scanning region borders and overlays */
      #qr-reader__scan_region,
      #qr-reader__scan_region > div,
      #qr-reader__scan_region > img,
      #qr-reader > div:not([id*="video"]) {
        border: none !important;
        background: none !important;
        box-shadow: none !important;
        display: none !important;
      }
      
      /* Hide any dashboard or status elements */
      #qr-reader__dashboard,
      #qr-reader__dashboard_section,
      #qr-reader__dashboard_section_csr,
      #qr-reader__dashboard_section_swaplink,
      #qr-reader__dashboard_section_fsr {
        display: none !important;
      }
      
      /* Keep ONLY the video visible */
      #qr-reader {
        background: transparent !important;
      }
      
      #qr-reader video {
        display: block !important;
        z-index: 0 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white">
      {/* Full-screen camera preview container */}
      <div id="qr-reader" className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Dark overlay with transparent cutout */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <mask id="mask">
              <rect width="100%" height="100%" fill="white" />
              <rect x="50%" y="50%" width="280" height="280" rx="24" ry="24" transform="translate(-140, -140)" fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#mask)" />
        </svg>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
        <button onClick={handleClose} className="p-2">
          <X size={28} className="text-white drop-shadow-lg" strokeWidth={2.5} />
        </button>
        <div className="flex gap-4">
          <button className="p-2">
            <Zap size={24} className="text-white drop-shadow-lg" />
          </button>
        </div>
      </div>

      {/* Scanning Frame with Colorful Corners - Centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] z-20 pointer-events-none">



        {/* Corner Brackets - Moved slightly outside to match screenshots */}
        {/* Top Left - Red to Pink */}
        <div className="absolute -top-1 -left-1 w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 to-pink-500 rounded-full" />
        </div>

        {/* Top Right - Orange to Yellow */}
        <div className="absolute -top-1 -right-1 w-12 h-12">
          <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-orange-500 to-yellow-500 rounded-full" />
          <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full" />
        </div>

        {/* Bottom Left - Blue to Cyan */}
        <div className="absolute -bottom-1 -left-1 w-12 h-12">
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
          <div className="absolute bottom-0 left-0 w-1.5 h-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-full" />
        </div>

        {/* Bottom Right - Green to Emerald */}
        <div className="absolute -bottom-1 -right-1 w-12 h-12">
          <div className="absolute bottom-0 right-0 w-full h-1.5 bg-gradient-to-l from-green-500 to-emerald-500 rounded-full" />
          <div className="absolute bottom-0 right-0 w-1.5 h-full bg-gradient-to-t from-green-500 to-emerald-500 rounded-full" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-24 left-4 right-4 bg-red-500/90 backdrop-blur-md text-white px-4 py-3 rounded-lg flex items-center gap-3 z-50"
        >
          <AlertCircle size={20} />
          <p className="text-sm font-medium flex-1">{error}</p>
        </motion.div>
      )}

      {/* Upload from Gallery Button - Positioned higher */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 transition-all duration-300" style={{ marginBottom: showFeedback ? '180px' : '0' }}>
        <button className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-lg hover:bg-white/30 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Upload from gallery
        </button>
      </div>

      {/* Permission Denied State */}
      {permissionDenied && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-8 z-[60]">
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

      {/* Bottom Feedback Section - Collapsible */}
      <motion.div
        initial={{ y: "85%" }}
        animate={{ y: showFeedback ? 0 : "85%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y < -50) setShowFeedback(true);
          if (info.offset.y > 50) setShowFeedback(false);
        }}
        className="absolute bottom-0 left-0 right-0 z-[60]"
      >
        <div
          className="border-t border-white/10 rounded-t-3xl bg-[#1f1f1f] p-6 pb-8"
          onClick={() => setShowFeedback(!showFeedback)}
        >
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          <p className="text-center text-white/90 font-medium mb-1">Is the QR not working?</p>

          <div className={`transition-opacity duration-300 ${showFeedback ? 'opacity-100 mt-6' : 'opacity-0 h-0 overflow-hidden'}`}>
            <p className="text-center text-gray-400 text-sm mb-6 px-8">
              If you're facing issues scanning the QR code, you can try uploading it from your gallery or type the UPI ID manually.
            </p>
            <div className="flex gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); setShowFeedback(false); }}
                className="flex-1 bg-white/10 text-white py-3 rounded-full font-medium border border-white/20"
              >
                Not now
              </button>
              <button className="flex-1 bg-blue-500 text-white py-3 rounded-full font-medium">
                Send feedback
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
