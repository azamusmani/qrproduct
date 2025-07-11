
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Scan, Search, Settings } from "lucide-react";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [productCode, setProductCode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckStatus = () => {
    if (!productCode.trim()) {
      toast({
        title: "Product code required",
        description: "Please enter or scan a product code",
        variant: "destructive",
      });
      return;
    }
    navigate(`/status/${productCode.trim()}`);
  };

  const handleScanSuccess = (code: string) => {
    setProductCode(code);
    setShowScanner(false);
    toast({
      title: "Barcode scanned!",
      description: `Product code: ${code}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">Product Tracker</h1>
          <p className="text-slate-600">Scan or enter a product code to check status</p>
        </div>

        {/* Main Input Card */}
        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="productCode" className="text-sm font-medium text-slate-700">
                Product Code
              </label>
              <Input
                id="productCode"
                placeholder="Enter product code..."
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="text-lg h-12"
                onKeyPress={(e) => e.key === 'Enter' && handleCheckStatus()}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowScanner(true)}
                variant="outline"
                className="h-12 text-base"
              >
                <Scan className="mr-2 h-5 w-5" />
                Scan
              </Button>
              <Button
                onClick={handleCheckStatus}
                className="h-12 text-base bg-blue-600 hover:bg-blue-700"
              >
                <Search className="mr-2 h-5 w-5" />
                Check Status
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/login')}
            className="w-full text-slate-600 hover:text-slate-800"
          >
            <Settings className="mr-2 h-4 w-4" />
            Admin Access
          </Button>
        </div>

        {/* Scanner Modal */}
        {showScanner && (
          <BarcodeScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
