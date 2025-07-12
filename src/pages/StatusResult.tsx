
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const StatusResult = () => {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productCode) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/products/${productCode}`);
        const result = await response.json();
        
        if (response.ok) {
          setProduct(result.data);
        } else {
          setError('Product not found');
          toast({
            title: "Product not found",
            description: "The product code you entered was not found in our system",
            variant: "destructive",
          });
        }
      } catch (error) {
        setError('Network error');
        toast({
          title: "Error",
          description: "Failed to fetch product information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productCode, toast]);

  const getStatusDescription = (status: string) => {
    const descriptions = {
      'In Warehouse': 'Your product is safely stored in our warehouse',
      'Processing': 'Your product is being prepared for shipment',
      'Shipped': 'Your product has been shipped and is on its way',
      'Out for Delivery': 'Your product is out for delivery today',
      'Delivered': 'Your product has been successfully delivered'
    };
    return descriptions[status as keyof typeof descriptions] || 'Status information available';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Warehouse': return <Package className="h-8 w-8" />;
      case 'Processing': return <Clock className="h-8 w-8" />;
      case 'Shipped': return <Truck className="h-8 w-8" />;
      case 'Out for Delivery': return <Truck className="h-8 w-8" />;
      case 'Delivered': return <CheckCircle className="h-8 w-8" />;
      default: return <AlertCircle className="h-8 w-8" />;
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="max-w-md mx-auto space-y-6 pt-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading product information...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="max-w-md mx-auto space-y-6 pt-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Product Not Found</h2>
            <p className="text-slate-600 mb-4">The product code "{productCode}" was not found in our system.</p>
            <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
              Try Another Code
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Product Status</h1>
        </div>

        {/* Status Card */}
        <Card className="p-6 shadow-lg">
          <div className="space-y-6">
            {/* Product Code */}
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600">Product Code</p>
              <p className="text-2xl font-mono font-bold text-slate-800">{product.code}</p>
            </div>

            {/* Status Display */}
            <div className="text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getStatusColor(product.status)}`}>
                {getStatusIcon(product.status)}
              </div>
              
              <div className="space-y-2">
                <Badge className={`text-lg px-4 py-2 ${getStatusColor(product.status)}`}>
                  {product.status}
                </Badge>
                <p className="text-slate-600">{product.description}</p>
              </div>
            </div>

            {/* Product Code Display */}
            <div className="text-center text-sm text-slate-500">
              Product Code: {product.code}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          >
            Check Another Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusResult;
