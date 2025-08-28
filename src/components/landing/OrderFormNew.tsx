import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Phone, MapPin, User, MessageCircle } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/components/ui/sonner';
import { GOVERNORATES } from '@/utils/constants';
import { validatePhone, calculateOrderTotal, formatPrice, generateWhatsAppMessage } from '@/utils/helpers';

interface OrderFormProps {
  productPrice: number;
  onSuccess?: () => void;
}

const OrderFormNew = ({ productPrice, onSuccess }: OrderFormProps) => {
  const { addOrder } = useOrders();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    governorate: '',
    notes: ''
  });

  // Egyptian governorates list
  const governorates = GOVERNORATES;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customer_name.trim()) {
      toast.error('يرجى إدخال الاسم');
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error('رقم الهاتف غير صحيح', {
        description: 'يرجى إدخال رقم هاتف مصري صحيح (يبدأ بـ 01)'
      });
      return;
    }

    if (!formData.address.trim()) {
      toast.error('يرجى إدخال العنوان');
      return;
    }

    if (!formData.governorate) {
      toast.error('يرجى اختيار المحافظة');
      return;
    }

    setLoading(true);

    try {
      const { total } = calculateOrderTotal(productPrice, 1, formData.governorate);
      
      const orderData = {
        ...formData,
        phone: formData.phone.replace(/\s+/g, ''), // Clean phone number
        total_amount: total,
        status: 'جديد' as const,
        order_date: new Date().toISOString().split('T')[0]
      };

      const result = await addOrder(orderData);
      
      if (result) {
        toast.success('تم إرسال طلبك بنجاح! 🎉', {
          description: 'سنتواصل معك قريباً لتأكيد الطلب'
        });

        // Reset form
        setFormData({
          customer_name: '',
          phone: '',
          address: '',
          governorate: '',
          notes: ''
        });

        onSuccess?.();
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('حدث خطأ أثناء إرسال الطلب', {
        description: 'يرجى المحاولة مرة أخرى أو التواصل معنا'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!formData.customer_name.trim() || !formData.governorate) {
      toast.error('يرجى إدخال الاسم واختيار المحافظة أولاً');
      return;
    }

    const message = generateWhatsAppMessage(
      formData.customer_name,
      'كيكه +Vit E - سندرين بيوتي',
      productPrice,
      formData.governorate
    );
    
    window.open(`https://wa.me/201556133633?text=${message}`, '_blank');
  };

  // Calculate totals for display
  const orderCalculation = formData.governorate ? 
    calculateOrderTotal(productPrice, 1, formData.governorate) : 
    { subtotal: productPrice, shipping: 0, total: productPrice };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-soft border-primary/20">
      <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center justify-center gap-3">
          <ShoppingCart className="w-6 h-6" />
          اطلبي منتجك الآن
        </CardTitle>
        <CardDescription className="text-center text-white/90">
          املأي البيانات وسنتواصل معك لتأكيد الطلب
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                الاسم الكامل *
              </Label>
              <Input
                id="customer_name"
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className="text-right"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                رقم الهاتف *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01xxxxxxxxx"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="text-right"
                required
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="governorate" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                المحافظة *
              </Label>
              <Select 
                value={formData.governorate} 
                onValueChange={(value) => handleInputChange('governorate', value)}
              >
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختاري المحافظة" />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map((gov) => (
                    <SelectItem key={gov} value={gov}>
                      {gov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                العنوان بالتفصيل *
              </Label>
              <Textarea
                id="address"
                placeholder="أدخل عنوانك بالتفصيل (الشارع، المنطقة، أقرب معلم، رقم الشقة)"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="text-right min-h-[100px]"
                required
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات إضافية (اختيارية)</Label>
            <Textarea
              id="notes"
              placeholder="أي ملاحظات أو تعليمات خاصة (مثل: أوقات التسليم المفضلة)"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="text-right"
            />
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="bg-gradient-soft p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-gray-800 mb-3">ملخص الطلب</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>سعر المنتج</span>
                <span>{formatPrice(orderCalculation.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>رسوم الشحن</span>
                <span>{formatPrice(orderCalculation.shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-primary">
                <span>الإجمالي</span>
                <span>{formatPrice(orderCalculation.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary text-lg py-3 h-12"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  تأكيد الطلب - {formatPrice(orderCalculation.total)}
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">أو</span>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline"
              className="w-full border-green-500 text-green-700 hover:bg-green-50 text-lg py-3 h-12"
              onClick={handleWhatsAppOrder}
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              طلب عبر الواتساب
            </Button>
          </div>

          {/* Required Fields Notice */}
          <p className="text-xs text-muted-foreground text-center">
            * الحقول المطلوبة
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderFormNew;