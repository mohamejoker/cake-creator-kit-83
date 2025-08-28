import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  onRefresh: () => void;
}

const AdminHeader = ({ onRefresh }: AdminHeaderProps) => {
  return (
    <header className="bg-white shadow-soft border-b border-primary/10 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              لوحة التحكم
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">إدارة المنتجات والطلبات</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex"
              >
                <Home className="w-4 h-4 ml-2" />
                الصفحة الرئيسية
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="hidden sm:flex"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث البيانات
            </Button>
            <Badge className="bg-gradient-primary text-white px-3 py-1">
              سندرين بيوتي
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;