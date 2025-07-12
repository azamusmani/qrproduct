
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, LogOut, Plus, Search, Edit3, Package, QrCode, Download, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AdminDashboard = () => {
  const [productCode, setProductCode] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const statuses = ['In Warehouse', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const result = await response.json();
      if (response.ok) {
        setProducts(result.data || []);
      } else {
        toast({
          title: "Error loading products",
          description: result.error || "Failed to load products",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error loading products",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!productCode.trim() || !selectedStatus) {
      toast({
        title: "Missing information",
        description: "Please enter a product code and select a status",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const existingProduct = products.find(p => p.code === productCode);
      
      if (existingProduct) {
        // Update existing product
        const response = await fetch(`${API_BASE_URL}/products/${productCode}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: selectedStatus
          }),
        });

        const result = await response.json();
        if (response.ok) {
          toast({
            title: "Status updated",
            description: `Product ${productCode} status updated to ${selectedStatus}`,
          });
          fetchProducts(); // Refresh the list
        } else {
          toast({
            title: "Update failed",
            description: result.error || "Failed to update product",
            variant: "destructive",
          });
        }
      } else {
        // Add new product
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: productCode,
            status: selectedStatus
          }),
        });

        const result = await response.json();
        if (response.ok) {
          toast({
            title: "Product added",
            description: `New product ${productCode} added with status ${selectedStatus}`,
          });
          fetchProducts(); // Refresh the list
        } else {
          toast({
            title: "Add failed",
            description: result.error || "Failed to add product",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProductCode("");
      setSelectedStatus("");
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/');
  };

  const generateQRCode = async (productCode) => {
    setGeneratingQR(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productCode}/qr`);
      const result = await response.json();
      
      if (response.ok) {
        setQrCodeData(result);
        setShowQRModal(true);
        // Auto-populate the form with existing product data for easy updates
        setProductCode(result.productCode);
        setSelectedStatus(result.productStatus);
        toast({
          title: "QR Code Generated",
          description: `QR code for product ${productCode} (${result.productStatus}) is ready to download. Form updated for status changes.`,
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "Please add the product to the database first, then generate QR code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred while generating QR code",
        variant: "destructive",
      });
    } finally {
      setGeneratingQR(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;
    
    const link = document.createElement('a');
    link.href = qrCodeData.qrCode;
    link.download = `product-${qrCodeData.productCode}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: `QR code for ${qrCodeData.productCode} has been downloaded`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Warehouse': return 'bg-gray-100 text-gray-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product =>
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Generate QR Card */}
        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <QrCode className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-800">Generate QR Code</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="qrProductCode" className="text-sm font-medium text-slate-700">
                  Product Code
                </label>
                <Input
                  id="qrProductCode"
                  placeholder="Enter product code..."
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => generateQRCode(productCode)}
                disabled={!productCode.trim() || generatingQR}
                className="w-full h-12 bg-green-600 hover:bg-green-700"
              >
                <QrCode className="mr-2 h-4 w-4" />
                {generatingQR ? "Generating..." : "Generate QR Code"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Update Status Card */}
        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Update Product Status</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="updateProductCode" className="text-sm font-medium text-slate-700">
                  Product Code
                </label>
                <Input
                  id="updateProductCode"
                  placeholder="Enter product code..."
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleUpdateStatus}
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                {isLoading ? "Processing..." : "Update Status"}
              </Button>
            </div>
          </div>
        </Card>



        {/* Products List */}
        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Recent Products</h2>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div 
                  key={product.code} 
                  className="flex items-center justify-between p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setProductCode(product.code);
                    setSelectedStatus(product.status);
                    toast({
                      title: "Product Selected",
                      description: `Product ${product.code} loaded for editing`,
                    });
                  }}
                >
                  <div className="space-y-1">
                    <p className="font-mono text-sm font-medium">{product.code}</p>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                    {product.status}
                  </Badge>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-center text-slate-500 py-4">No products found</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* QR Code Modal */}
      {showQRModal && qrCodeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-slate-800">QR Code Generated</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQRModal(false)}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={qrCodeData.qrCode} 
                  alt={`QR Code for ${qrCodeData.productCode}`}
                  className="border-2 border-gray-200 rounded-lg max-w-full"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  Product: <span className="font-mono font-medium">{qrCodeData.productCode}</span>
                </p>
                <p className="text-sm text-slate-600">
                  Status: <span className="font-medium">{qrCodeData.productStatus}</span>
                </p>
                <p className="text-xs text-slate-500 break-all">
                  URL: {qrCodeData.url}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={downloadQRCode}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR
                </Button>
                
                <Button
                  onClick={() => setShowQRModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
