import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ArrowRight, Lightbulb } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ProductUsageManagerProps {
  usageInstructions: string[];
  onUsageChange: (instructions: string[]) => void;
}

const ProductUsageManager = ({ usageInstructions, onUsageChange }: ProductUsageManagerProps) => {
  const [newInstruction, setNewInstruction] = useState('');

  const addInstruction = () => {
    const trimmedInstruction = newInstruction.trim();
    if (!trimmedInstruction) return;

    if (usageInstructions.includes(trimmedInstruction)) {
      toast.error('خطوة مكررة', {
        description: 'هذه الخطوة موجودة بالفعل'
      });
      return;
    }

    if (usageInstructions.length >= 8) {
      toast.error('عدد الخطوات كبير', {
        description: 'لا يمكن إضافة أكثر من 8 خطوات'
      });
      return;
    }

    onUsageChange([...usageInstructions, trimmedInstruction]);
    setNewInstruction('');
    toast.success('تم إضافة الخطوة بنجاح! ✨');
  };

  const removeInstruction = (indexToRemove: number) => {
    onUsageChange(usageInstructions.filter((_, index) => index !== indexToRemove));
    toast.success('تم حذف الخطوة');
  };

  const moveInstruction = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= usageInstructions.length) return;
    
    const newInstructions = [...usageInstructions];
    const [movedItem] = newInstructions.splice(fromIndex, 1);
    newInstructions.splice(toIndex, 0, movedItem);
    
    onUsageChange(newInstructions);
    toast.success('تم تحديث ترتيب الخطوات');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInstruction();
    }
  };

  const suggestedInstructions = [
    'نظف البشرة جيداً بالماء الدافئ',
    'جفف البشرة بلطف بمنشفة ناعمة',
    'ضع كمية صغيرة من المنتج على راحة اليد',
    'دلك البشرة بحركات دائرية لطيفة',
    'اتركي المنتج لمدة 10-15 دقيقة',
    'اشطف البشرة بالماء البارد',
    'استخدم مرطب مناسب لنوع بشرتك',
    'كرر العملية يومياً للحصول على أفضل النتائج'
  ];

  const addSuggestedInstruction = (instruction: string) => {
    if (usageInstructions.includes(instruction)) {
      toast.error('خطوة مكررة', {
        description: 'هذه الخطوة موجودة بالفعل'
      });
      return;
    }

    if (usageInstructions.length >= 8) {
      toast.error('عدد الخطوات كبير', {
        description: 'لا يمكن إضافة أكثر من 8 خطوات'
      });
      return;
    }

    onUsageChange([...usageInstructions, instruction]);
    toast.success('تم إضافة الخطوة بنجاح! ✨');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center gap-2">
          <ArrowRight className="w-6 h-6" />
          طريقة الاستخدام
        </CardTitle>
        <CardDescription>
          أضف خطوات استخدام المنتج بالتسلسل (حد أقصى 8 خطوات)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Instruction */}
        <div className="flex gap-3">
          <Input
            placeholder="أدخل خطوة جديدة لاستخدام المنتج..."
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-right flex-1"
            maxLength={150}
          />
          <Button 
            onClick={addInstruction}
            disabled={!newInstruction.trim() || usageInstructions.length >= 8}
            className="bg-gradient-primary"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة
          </Button>
        </div>

        {/* Character Counter */}
        {newInstruction && (
          <div className="text-sm text-muted-foreground text-left">
            {newInstruction.length}/150 حرف
          </div>
        )}

        {/* Current Instructions */}
        {usageInstructions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">خطوات الاستخدام ({usageInstructions.length}/8):</h4>
            <div className="space-y-3">
              {usageInstructions.map((instruction, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4 group hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-800 text-right flex-1 leading-relaxed">{instruction}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveInstruction(index, index - 1)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                        title="تحريك لأعلى"
                      >
                        ↑
                      </Button>
                    )}
                    {index < usageInstructions.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveInstruction(index, index + 1)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                        title="تحريك لأسفل"
                      >
                        ↓
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Instructions */}
        {usageInstructions.length < 8 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              <h4 className="font-medium text-gray-800">اقتراحات سريعة:</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedInstructions
                .filter(suggested => !usageInstructions.includes(suggested))
                .slice(0, 4)
                .map((suggested, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors text-right p-2 h-auto justify-start"
                  onClick={() => addSuggestedInstruction(suggested)}
                >
                  <Plus className="w-3 h-3 ml-1 flex-shrink-0" />
                  <span className="text-wrap">{suggested}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {usageInstructions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg">
            <ArrowRight className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>لم يتم إضافة أي خطوات بعد</p>
            <p className="text-sm">أضف خطوات الاستخدام لإرشاد العملاء</p>
          </div>
        )}

        {usageInstructions.length >= 8 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <p className="text-amber-800 text-sm">
              ✨ تم الوصول للحد الأقصى من الخطوات (8 خطوات)
            </p>
          </div>
        )}

        {usageInstructions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm text-center">
              💡 يمكنك إعادة ترتيب الخطوات باستخدام أسهم التحريك
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductUsageManager;