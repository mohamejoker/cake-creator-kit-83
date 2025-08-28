import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface CTASectionProps {
  productPrice: number;
  onOrderClick: () => void;
}

const CTASection = ({ productPrice, onOrderClick }: CTASectionProps) => {
  return (
    <section className="py-16 bg-gradient-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          احصلي على بشرة أحلامك اليوم!
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          انضمي لأكثر من 10,000 عميلة سعيدة واكتشفي الفرق مع منتجاتنا الطبيعية
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onOrderClick}
            className="bg-white text-primary hover:bg-white/90 text-xl px-8 py-4 shadow-glow"
          >
            <ShoppingCart className="w-6 h-6 ml-2" />
            اطلب الآن - {productPrice.toLocaleString()} جنيه
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;