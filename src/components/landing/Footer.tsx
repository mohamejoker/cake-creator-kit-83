import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
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
  );
};

export default Footer;