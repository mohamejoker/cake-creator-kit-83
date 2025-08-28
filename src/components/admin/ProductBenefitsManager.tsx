import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ProductBenefitsManagerProps {
  benefits: string[];
  onBenefitsChange: (benefits: string[]) => void;
}

const ProductBenefitsManager = ({ benefits, onBenefitsChange }: ProductBenefitsManagerProps) => {
  const [newBenefit, setNewBenefit] = useState('');

  const addBenefit = () => {
    const trimmedBenefit = newBenefit.trim();
    if (!trimmedBenefit) return;

    if (benefits.includes(trimmedBenefit)) {
      toast.error('فائدة مكررة', {
        description: 'هذه الفائدة موجودة بالفعل'
      });
      return;
    }

    if (benefits.length >= 10) {
      toast.error('عدد الفوائد كبير', {
        description: 'لا يمكن إضافة أكثر من 10 فوائد'
      });
      return;
    }

    onBenefitsChange([...benefits, trimmedBenefit]);
    setNewBenefit('');
    toast.success('تم إضافة الفائدة بنجاح! ✨');
  };

  const removeBenefit = (indexToRemove: number) => {
    onBenefitsChange(benefits.filter((_, index) => index !== indexToRemove));
    toast.success('تم حذف الفائدة');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBenefit();
    }
  };

  const suggestedBenefits = [
    'يرطب البشرة بعمق',
    'ينعم ملمس البشرة',
    'يقلل علامات التقدم في السن',
    'يوحد لون البشرة',
    'يحمي من أشعة الشمس الضارة',
    'يغذي البشرة بالفيتامينات',
    'يقلل ظهور التجاعيد',
    'ينظف المسام بعمق'
  ];

  const addSuggestedBenefit = (benefit: string) => {
    if (benefits.includes(benefit)) {
      toast.error('فائدة مكررة', {
        description: 'هذه الفائدة موجودة بالفعل'
      });
      return;
    }

    if (benefits.length >= 10) {
      toast.error('عدد الفوائد كبير', {
        description: 'لا يمكن إضافة أكثر من 10 فوائد'
      });
      return;
    }

    onBenefitsChange([...benefits, benefit]);
    toast.success('تم إضافة الفائدة بنجاح! ✨');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center gap-2">
          <CheckCircle className="w-6 h-6" />
          فوائد المنتج
        </CardTitle>
        <CardDescription>
          أضف فوائد المنتج لتوضيح قيمته للعملاء (حد أقصى 10 فوائد)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Benefit */}
        <div className="flex gap-3">
          <Input
            placeholder="أدخل فائدة جديدة للمنتج..."
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-right flex-1"
            maxLength={100}
          />
          <Button 
            onClick={addBenefit}
            disabled={!newBenefit.trim() || benefits.length >= 10}
            className="bg-gradient-primary"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة
          </Button>
        </div>

        {/* Character Counter */}
        {newBenefit && (
          <div className="text-sm text-muted-foreground text-left">
            {newBenefit.length}/100 حرف
          </div>
        )}

        {/* Current Benefits */}
        {benefits.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">الفوائد الحالية ({benefits.length}/10):</h4>
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3 group hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-800 text-right flex-1">{benefit}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Benefits */}
        {benefits.length < 10 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h4 className="font-medium text-gray-800">اقتراحات سريعة:</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedBenefits
                .filter(suggested => !benefits.includes(suggested))
                .slice(0, 6)
                .map((suggested, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors text-right"
                  onClick={() => addSuggestedBenefit(suggested)}
                >
                  <Plus className="w-3 h-3 ml-1" />
                  {suggested}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {benefits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>لم يتم إضافة أي فوائد بعد</p>
            <p className="text-sm">أضف فوائد المنتج لجذب العملاء</p>
          </div>
        )}

        {benefits.length >= 10 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <p className="text-amber-800 text-sm">
              ✨ تم الوصول للحد الأقصى من الفوائد (10 فوائد)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductBenefitsManager;