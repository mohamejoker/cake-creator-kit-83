
import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import HeroSection from '@/components/landing/HeroSection';
import OrderFormNew from '@/components/landing/OrderFormNew';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ProductDetailsSection from '@/components/landing/ProductDetailsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ScrollToTopButton from '@/components/landing/ScrollToTopButton';

const Landing = () => {
  const { products, loading } = useProducts();
  const [showOrderForm, setShowOrderForm] = useState(false);

  const product = products?.[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <p className="text-muted-foreground text-xl">لا توجد منتجات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <HeroSection 
        product={product} 
        onOrderClick={() => setShowOrderForm(!showOrderForm)} 
      />

      {/* Order Form Section */}
      {showOrderForm && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">اطلبي منتجك الآن</h2>
                <p className="text-muted-foreground">املأي البيانات وسنتواصل معك لتأكيد الطلب</p>
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
      <ProductDetailsSection product={product} />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection 
        productPrice={product.price}
        onOrderClick={() => setShowOrderForm(true)}
      />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Landing;
