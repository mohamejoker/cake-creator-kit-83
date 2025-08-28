
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Droplets, Star, CheckCircle, Heart } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'آمان مضمون',
    description: 'مكونات طبيعية 100% آمنة على البشرة'
  },
  {
    icon: Zap,
    title: 'نتائج سريعة',
    description: 'نتائج ملحوظة خلال أسبوعين من الاستخدام'
  },
  {
    icon: Droplets,
    title: 'ترطيب عميق',
    description: 'يوفر ترطيباً مكثفاً يدوم طوال اليوم'
  },
  {
    icon: Star,
    title: 'جودة عالية',
    description: 'منتج مصنوع بأعلى معايير الجودة العالمية'
  },
  {
    icon: CheckCircle,
    title: 'مُختبر إكلينيكياً',
    description: 'تم اختباره من قبل أطباء الجلدية'
  },
  {
    icon: Heart,
    title: 'محبوب من العملاء',
    description: 'أكثر من 10,000 عميلة راضية عن النتائج'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            لماذا تختارين سندرين بيوتي؟
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            نحن نقدم لك منتجات عناية متميزة بمكونات طبيعية وفعالة لتحصلي على أفضل النتائج
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
