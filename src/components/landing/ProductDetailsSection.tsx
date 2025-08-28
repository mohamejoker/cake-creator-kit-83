import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface Product {
  benefits?: string[];
  usage_instructions?: string[];
}

interface ProductDetailsSectionProps {
  product: Product;
}

const ProductDetailsSection = ({ product }: ProductDetailsSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <Card className="shadow-medium border-0 overflow-hidden">
                <CardHeader className="bg-gradient-primary text-white">
                  <CardTitle className="text-xl text-center">فوائد المنتج</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Instructions */}
            {product.usage_instructions && product.usage_instructions.length > 0 && (
              <Card className="shadow-medium border-0 overflow-hidden">
                <CardHeader className="bg-gradient-accent text-white">
                  <CardTitle className="text-xl text-center">طريقة الاستخدام</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.usage_instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 leading-relaxed">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsSection;