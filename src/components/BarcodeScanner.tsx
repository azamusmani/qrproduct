
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  onScanSuccess: (code: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScanSuccess, onClose }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const simulateScan = () => {
    // Simulate a successful barcode scan for demo purposes
    const mockBarcode = `BC${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    onScanSuccess(mockBarcode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-white shadow-xl">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Scan Barcode</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {error ? (
            <div className="text-center space-y-4">
              <p className="text-red-600 text-sm">{error}</p>
              <Button onClick={startCamera} variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
                  <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg">
                    <p className="text-blue-700 text-sm text-center">
                      Position barcode within frame
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={simulateScan} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Scan className="mr-2 h-4 w-4" />
                  Simulate Scan (Demo)
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  For demo purposes - click to generate a sample barcode
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
