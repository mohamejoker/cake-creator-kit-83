import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Phone, MapPin, User, MessageCircle } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/components/ui/sonner';
import { calculateOrderTotal, formatPrice, generateWhatsAppMessage } from '@/utils/helpers';
import { orderSchema, type OrderFormData } from '@/lib/validation';
import { withErrorHandling } from '@/lib/error-handler';
import { GOVERNORATES } from '@/utils/constants';

interface OrderFormProps {
  productPrice: number;
  onSuccess?: () => void;
}

const OrderFormNew = ({ productPrice, onSuccess }: OrderFormProps) => {
  const { addOrder } = useOrders();
  
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_name: '',
      phone: '',
      address: '',
      governorate: '',
      notes: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const watchedGovernorate = form.watch('governorate');

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    const result = await withErrorHandling(async () => {
      const { total } = calculateOrderTotal(productPrice, 1, data.governorate);
      
      const orderData = {
        ...data,
        phone: data.phone.replace(/\s+/g, ''), // Clean phone number
        total_amount: total,
        status: 'جديد' as const,
        order_date: new Date().toISOString().split('T')[0]
      };

      return await addOrder(orderData);
    }, 'Order submission');

    if (result) {
      toast.success('تم إرسال طلبك بنجاح! 🎉', {
        description: 'سنتواصل معك قريباً لتأكيد الطلب'
      });
      
      form.reset();
      onSuccess?.();
    }
    
    setIsSubmitting(false);
  };

  const handleWhatsAppOrder = () => {
    const { customer_name, governorate } = form.getValues();
    
    if (!customer_name.trim() || !governorate) {
      toast.error('يرجى إدخال الاسم واختيار المحافظة أولاً');
      return;
    }

    const message = generateWhatsAppMessage(
      customer_name,
      'كيكه +Vit E - سندرين بيوتي',
      productPrice,
      governorate
    );
    
    window.open(`https://wa.me/201556133633?text=${message}`, '_blank');
  };

  // Calculate totals for display
  const orderCalculation = watchedGovernorate ? 
    calculateOrderTotal(productPrice, 1, watchedGovernorate) : 
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    الاسم الكامل *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسمك الكامل"
                      className="text-right"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    رقم الهاتف *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      className="text-right"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="governorate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    المحافظة *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختاري المحافظة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GOVERNORATES.map((gov) => (
                        <SelectItem key={gov} value={gov}>
                          {gov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان بالتفصيل *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل عنوانك بالتفصيل (الشارع، المنطقة، أقرب معلم، رقم الشقة)"
                      className="text-right min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ملاحظات إضافية (اختيارية)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="أي ملاحظات أو تعليمات خاصة (مثل: أوقات التسليم المفضلة)"
                    className="text-right"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
        </Form>
      </CardContent>
    </Card>
  );
};

export default OrderFormNew;