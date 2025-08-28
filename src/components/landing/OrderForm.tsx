
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ShoppingCart, Phone, MapPin, User } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/components/ui/sonner';

const orderSchema = z.object({
  customer_name: z.string().min(2, 'الاسم يجب أن يحتوي على حرفين على الأقل'),
  phone: z.string().min(11, 'رقم الهاتف يجب أن يحتوي على 11 رقم على الأقل'),
  address: z.string().min(10, 'العنوان يجب أن يحتوي على 10 أحرف على الأقل'),
  governorate: z.string().min(1, 'يرجى اختيار المحافظة'),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  productPrice: number;
  onSuccess?: () => void;
}

const governorates = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'القليوبية',
  'كفر الشيخ', 'الغربية', 'المنوفية', 'البحيرة', 'بني سويف', 'الفيوم',
  'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر',
  'الوادي الجديد', 'مطروح', 'شمال سيناء', 'جنوب سيناء', 'بورسعيد',
  'دمياط', 'الإسماعيلية', 'السويس'
];

const OrderForm = ({ productPrice, onSuccess }: OrderFormProps) => {
  const { addOrder } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_name: '',
      phone: '',
      address: '',
      governorate: '',
      notes: '',
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        notes: data.notes || null, // Convert empty string to null
        total_amount: productPrice,
        status: 'جديد',
        order_date: new Date().toISOString().split('T')[0],
      };

      const result = await addOrder(orderData);
      if (result) {
        toast.success('تم تأكيد طلبك! 🎉', {
          description: 'سنتواصل معك قريباً لتأكيد التوصيل',
        });
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      toast.error('حدث خطأ', {
        description: 'يرجى المحاولة مرة أخرى',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-primary/20">
      <CardHeader className="text-center bg-gradient-primary text-white rounded-t-lg">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          اطلب الآن
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    الاسم الكامل
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
                    <Phone className="w-4 h-4" />
                    رقم الهاتف
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="01xxxxxxxxx" 
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
              name="governorate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    المحافظة
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {governorates.map((gov) => (
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
                  <FormLabel>العنوان بالتفصيل</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل عنوانك بالتفصيل (الشارع، المنطقة، أقرب معلم)"
                      className="text-right min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات إضافية (اختيارية)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أي ملاحظات أو تعليمات خاصة"
                      className="text-right"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-primary">{productPrice.toLocaleString()} جنيه</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary text-lg py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري المعالجة...' : 'تأكيد الطلب'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
