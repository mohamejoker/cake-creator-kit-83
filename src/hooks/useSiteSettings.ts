
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SiteSettings {
  id: string;
  site_name: string;
  support_phone: string;
  support_email?: string;
  facebook_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
  created_at: string;
  updated_at: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      toast({
        title: "خطأ في تحميل الإعدادات",
        description: "حدث خطأ أثناء تحميل إعدادات الموقع.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    if (!settings) return false;

    try {
      const { error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', settings.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updates } : prev);
      
      toast({
        title: "تم التحديث بنجاح! ✨",
        description: "تم حفظ إعدادات الموقع",
      });

      return true;
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء حفظ الإعدادات.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
};
