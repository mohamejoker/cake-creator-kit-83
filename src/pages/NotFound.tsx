
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto shadow-soft border-primary/20">
          <CardHeader className="text-center">
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <CardTitle className="text-2xl">الصفحة غير موجودة</CardTitle>
            <CardDescription>
              عذراً، الصفحة التي تبحث عنها غير متاحة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="flex-1">
                <Link to="/">
                  <Home className="w-4 h-4 ml-2" />
                  الصفحة الرئيسية
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/admin">
                  لوحة التحكم
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
