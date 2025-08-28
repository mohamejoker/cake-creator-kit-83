
-- إنشاء جدول المنتجات
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    description TEXT,
    whatsapp_number TEXT,
    benefits TEXT[] DEFAULT '{}',
    usage_instructions TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الطلبات
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    governorate TEXT,
    notes TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'جديد' CHECK (status IN ('جديد', 'قيد التجهيز', 'تم الشحن', 'تم التوصيل', 'ملغي')),
    order_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول عناصر الطلبات
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- إنشاء جدول إعدادات الموقع
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'سندرين بيوتي',
    support_phone TEXT DEFAULT '01556133633',
    support_email TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    whatsapp_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء bucket للصور في التخزين
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- إضافة بيانات أولية للمنتج الحالي
INSERT INTO public.products (
    name, 
    brand, 
    price, 
    description, 
    whatsapp_number,
    benefits,
    usage_instructions,
    images
) VALUES (
    'كيكه +Vit E',
    'سندرين بيوتي',
    350.00,
    'سيروم طبيعي بفيتامين E لبشرة نضرة وصحية خالية من العيوب. يحتوي على تركيبة فريدة تجمع بين فوائد فيتامين E والمكونات الطبيعية الفعالة للعناية الشاملة بالبشرة.',
    '01556133633',
    ARRAY[
        'ينظم إفراز الزيوت ويقلل حجم المسام',
        'غني بفيتامين E المضاد للأكسدة',
        'يحتوي على فوسفات أسكوربيل الصوديوم',
        'مكونات طبيعية للتحكم بالدهون',
        'يرطب البشرة بعمق دون ثقل',
        'مضاد قوي للأكسدة يفتح البقع الداكنة'
    ],
    ARRAY[
        'ضع السيروم على بشرة نظيفة وجافة',
        'دلك بلطف حتى يتم امتصاصه بالكامل',
        'استخدم واقي الشمس خلال النهار',
        'استخدم مرتين يومياً صباحاً ومساءً'
    ],
    ARRAY[
        '/lovable-uploads/669a4186-46ac-46f7-826a-6eddc6a7a40d.png',
        '/lovable-uploads/4a55c975-febd-4d28-9e57-ef66981767f9.png'
    ]
);

-- إضافة بيانات أولية للإعدادات
INSERT INTO public.site_settings (site_name, support_phone) 
VALUES ('سندرين بيوتي', '01556133633');

-- إضافة بعض الطلبات التجريبية
INSERT INTO public.orders (
    customer_name, 
    phone, 
    address, 
    governorate, 
    notes, 
    total_amount, 
    status,
    order_date
) VALUES 
(
    'فاطمة أحمد',
    '01234567890',
    'القاهرة، مدينة نصر، شارع عباس العقاد، عمارة 15',
    'القاهرة',
    'أفضل التوصيل بعد المغرب',
    350.00,
    'جديد',
    CURRENT_DATE
),
(
    'مريم محمد',
    '01123456789',
    'الجيزة، المهندسين، شارع البطل أحمد عبد العزيز، عمارة 8',
    'الجيزة',
    '',
    350.00,
    'قيد التجهيز',
    CURRENT_DATE - 1
),
(
    'نورا سالم',
    '01012345678',
    'الإسكندرية، سيدي جابر، شارع فؤاد، عمارة 22',
    'الإسكندرية',
    'يفضل الاتصال قبل التوصيل',
    350.00,
    'تم التوصيل',
    CURRENT_DATE - 2
);

-- إعداد التحديثات التلقائية للطوابع الزمنية
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة المحفزات للتحديث التلقائي
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- تمكين التحديثات الفورية (Realtime)
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;

-- إضافة الجداول للنشر المباشر
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- إنشاء policies للوصول العام (بدون مصادقة)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة والكتابة للجميع (بدون مصادقة)
CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.products FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.order_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.order_items FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.site_settings FOR DELETE USING (true);

-- إنشاء policies للتخزين
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
