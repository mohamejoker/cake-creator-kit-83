
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cacheManager, CACHE_KEYS } from '@/lib/cache';
import { performanceMonitor } from '@/lib/performance';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string | null;
  whatsapp_number: string | null;
  benefits: string[];
  usage_instructions: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = performanceMonitor.measureTime(async () => {
    // Check cache first
    const cachedProducts = cacheManager.get<Product[]>(CACHE_KEYS.PRODUCTS);
    if (cachedProducts) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const productsData = data || [];
      setProducts(productsData);
      
      // Cache the results
      cacheManager.set(CACHE_KEYS.PRODUCTS, productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "خطأ في تحميل المنتجات",
        description: "حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, 'fetchProducts');

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      ));

      // Invalidate cache after update
      cacheManager.invalidate(CACHE_KEYS.PRODUCTS);

      toast({
        title: "تم التحديث بنجاح! ✨",
        description: "تم حفظ جميع التغييرات على المنتج",
      });

      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء حفظ التغييرات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [data, ...prev]);
      
      // Invalidate cache after new product
      cacheManager.invalidate(CACHE_KEYS.PRODUCTS);
      
      toast({
        title: "تم إضافة المنتج بنجاح! ✨",
        description: "تم إضافة المنتج الجديد بنجاح",
      });

      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();

    // إعداد التحديثات الفورية
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product change detected:', payload);
          // Invalidate cache and refetch
          cacheManager.invalidate(CACHE_KEYS.PRODUCTS);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    products,
    loading,
    updateProduct,
    addProduct,
    refetch: fetchProducts
  };
};
