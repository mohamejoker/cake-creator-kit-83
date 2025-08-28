
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cacheManager, CACHE_KEYS } from '@/lib/cache';
import { performanceMonitor } from '@/lib/performance';

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  governorate: string | null;
  notes: string | null;
  total_amount: number;
  status: string;
  order_date: string;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = performanceMonitor.measureTime(async () => {
    // Check cache first
    const cachedOrders = cacheManager.get<Order[]>(CACHE_KEYS.ORDERS);
    if (cachedOrders) {
      setOrders(cachedOrders);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const ordersData = data || [];
      setOrders(ordersData);
      
      // Cache the results
      cacheManager.set(CACHE_KEYS.ORDERS, ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "خطأ في تحميل الطلبات",
        description: "حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, 'fetchOrders');

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, status } : order
      ));

      // Invalidate cache after update
      cacheManager.invalidate(CACHE_KEYS.ORDERS);
      cacheManager.invalidate(CACHE_KEYS.ORDER_STATS);

      toast({
        title: "تم تحديث الحالة",
        description: `تم تغيير حالة الطلب إلى: ${status}`,
      });

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث حالة الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => [data, ...prev]);
      
      // Invalidate cache after new order
      cacheManager.invalidate(CACHE_KEYS.ORDERS);
      cacheManager.invalidate(CACHE_KEYS.ORDER_STATS);
      
      return data;
    } catch (error) {
      console.error('Error adding order:', error);
      toast({
        title: "خطأ في إضافة الطلب",
        description: "حدث خطأ أثناء إضافة الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();

    // إعداد التحديثات الفورية للطلبات
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order change detected:', payload);
          // Invalidate cache and refetch
          cacheManager.invalidate(CACHE_KEYS.ORDERS);
          cacheManager.invalidate(CACHE_KEYS.ORDER_STATS);
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    orders,
    loading,
    updateOrderStatus,
    addOrder,
    refetch: fetchOrders
  };
};
