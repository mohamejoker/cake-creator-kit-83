
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductImageUpload from "./ProductImageUpload";
import ProductBenefitsManager from "./ProductBenefitsManager";
import ProductUsageManager from "./ProductUsageManager";

const ProductSettings = () => {
  const { products, loading, updateProduct } = useProducts();
  const [currentProduct, setCurrentProduct] = useState(products[0]);

  useEffect(() => {
    if (products.length > 0 && !currentProduct) {
      setCurrentProduct(products[0]);
    }
  }, [products, currentProduct]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">لا توجد منتجات لعرضها</p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProduct(currentProduct.id, {
      name: currentProduct.name,
      brand: currentProduct.brand,
      price: currentProduct.price,
      description: currentProduct.description,
      whatsapp_number: currentProduct.whatsapp_number,
      benefits: currentProduct.benefits,
      usage_instructions: currentProduct.usage_instructions,
      images: currentProduct.images
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setCurrentProduct(prev => prev ? { ...prev, [field]: value } : prev);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">إعدادات المنتج الأساسية</CardTitle>
          <CardDescription>تحديث بيانات المنتج الأساسية</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productName">اسم المنتج</Label>
                <Input
                  id="productName"
                  value={currentProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandName">اسم العلامة التجارية</Label>
                <Input
                  id="brandName"
                  value={currentProduct.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">السعر (جنيه)</Label>
                <Input
                  id="price"
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">رقم واتساب الدعم</Label>
                <Input
                  id="whatsapp"
                  value={currentProduct.whatsapp_number || ''}
                  onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">وصف المنتج</Label>
              <Textarea
                id="description"
                value={currentProduct.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="text-right min-h-[120px]"
                placeholder="اكتب وصف المنتج..."
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Product Benefits */}
      <ProductBenefitsManager
        benefits={currentProduct.benefits}
        onBenefitsChange={(benefits) => handleInputChange('benefits', benefits)}
      />

      {/* Usage Instructions */}
      <ProductUsageManager
        usageInstructions={currentProduct.usage_instructions}
        onUsageChange={(usage) => handleInputChange('usage_instructions', usage)}
      />

      {/* Image Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-primary">إدارة الصور</CardTitle>
          <CardDescription>رفع وإدارة صور المنتج</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductImageUpload
            images={currentProduct.images}
            onImagesChange={(images) => handleInputChange('images', images)}
          />
        </CardContent>
      </Card>

      <Button 
        onClick={handleSubmit}
        className="w-full bg-gradient-primary text-lg py-3"
      >
        <Save className="w-5 h-5 ml-2" />
        حفظ جميع التغييرات
      </Button>
    </div>
  );
};

export default ProductSettings;
