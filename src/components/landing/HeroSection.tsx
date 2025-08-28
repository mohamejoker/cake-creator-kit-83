import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, MessageCircle } from 'lucide-react';
import ProductGallery from './ProductGallery';

interface Product {
  id: string;
  name: string;
  brand: string;
  description?: string;
  price: number;
  whatsapp_number?: string;
  images: string[];
}

interface HeroSectionProps {
  product: Product;
  onOrderClick: () => void;
}

const HeroSection = ({ product, onOrderClick }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-black/10"></div>
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
                onClick={onOrderClick}
                variant="premium"
                size="xl"
                className="shadow-glow hover:shadow-[0_0_40px_hsl(330_81%_60%_/_0.4)] animate-pulse"
              >
                <ShoppingCart className="w-6 h-6 ml-2" />
                اطلب الآن - {product.price.toLocaleString()} جنيه
              </Button>
              
              {product.whatsapp_number && (
                <Button 
                  variant="whatsapp"
                  size="lg"
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
  );
};

export default HeroSection;