
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Phone, 
  Star, 
  CheckCircle, 
  MessageCircle,
  Facebook,
  Instagram,
  ArrowUp
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import OrderFormNew from '@/components/landing/OrderFormNew';
import ProductGallery from '@/components/landing/ProductGallery';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';

const Landing = () => {
  const { products, loading } = useProducts();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const product = products?.[0];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">لا توجد منتجات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-foreground to-secondary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-right text-white space-y-6">
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                ✨ العرض الحصري
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {product.name}
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                {product.brand}
              </p>
              
              {product.description && (
                <p className="text-lg text-white/80 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white/90">+10,000 عميلة سعيدة</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => setShowOrderForm(!showOrderForm)}
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  اطلب الآن - {product.price.toLocaleString()} جنيه
                </Button>
                
                {product.whatsapp_number && (
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-primary text-lg px-6 py-3"
                    onClick={() => window.open(`https://wa.me/${product.whatsapp_number}`, '_blank')}
                  >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    واتساب
                  </Button>
                )}
              </div>
            </div>

            {/* Product Images */}
            <div className="lg:order-first">
              <ProductGallery images={product.images} productName={product.name} />
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      {showOrderForm && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">اطلبي منتجك الآن</h2>
                <p className="text-gray-600">املأي البيانات وسنتواصل معك لتأكيد الطلب</p>
              </div>
              <OrderFormNew 
                productPrice={product.price} 
                onSuccess={() => setShowOrderForm(false)}
              />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Product Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
                    <CardTitle className="text-xl text-center">فوائد المنتج</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {product.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Usage Instructions */}
              {product.usage_instructions && product.usage_instructions.length > 0 && (
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-secondary text-white rounded-t-lg">
                    <CardTitle className="text-xl text-center">طريقة الاستخدام</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {product.usage_instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{instruction}</span>
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

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            احصلي على بشرة أحلامك اليوم!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            انضمي لأكثر من 10,000 عميلة سعيدة واكتشفي الفرق مع منتجاتنا الطبيعية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowOrderForm(true)}
              className="bg-white text-primary hover:bg-white/90 text-xl px-8 py-4"
            >
              <ShoppingCart className="w-6 h-6 ml-2" />
              اطلب الآن - {product.price.toLocaleString()} جنيه
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-4">سندرين بيوتي</h3>
              <p className="text-gray-300">
                منتجات طبيعية للعناية بالبشرة بأعلى معايير الجودة
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="font-bold mb-4">تواصلي معنا</h4>
              <div className="space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  01556133633
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="font-bold mb-4">تابعونا</h4>
              <div className="flex justify-center md:justify-start gap-4">
                <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="text-center text-gray-400">
            <p>&copy; 2024 سندرين بيوتي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default Landing;
