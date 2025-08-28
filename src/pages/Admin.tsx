
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  ShoppingBag, 
  BarChart3,
  Users,
  RefreshCw
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import ProductSettings from '@/components/admin/ProductSettings';
import OrdersTable from '@/components/admin/OrdersTable';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStats from '@/components/admin/DashboardStats';

const Admin = () => {
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const { orders, loading: ordersLoading, refetch: refetchOrders } = useOrders();

  const refreshData = () => {
    refetchProducts();
    refetchOrders();
  };

  if (productsLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Header */}
      <AdminHeader onRefresh={refreshData} />

      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Statistics */}
        <DashboardStats />

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">لوحة القيادة</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2 text-xs sm:text-sm">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">الطلبات</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 text-xs sm:text-sm">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">المنتجات</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">التحليلات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-soft border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    آخر الطلبات
                  </CardTitle>
                  <CardDescription>أحدث 5 طلبات في النظام</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-primary">{Number(order.total_amount).toLocaleString()} ج.م</p>
                          <Badge 
                            variant={order.status === 'تم التوصيل' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    معلومات المنتج
                  </CardTitle>
                  <CardDescription>تفاصيل المنتج الحالي</CardDescription>
                </CardHeader>
                <CardContent>
                  {products.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {products[0].images.length > 0 && (
                          <img 
                            src={products[0].images[0]} 
                            alt={products[0].name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-bold">{products[0].name}</h3>
                          <p className="text-muted-foreground">{products[0].brand}</p>
                          <p className="font-bold text-primary">{products[0].price.toLocaleString()} جنيه</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">الفوائد</p>
                          <p className="font-medium">{products[0].benefits.length} فائدة</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">خطوات الاستخدام</p>
                          <p className="font-medium">{products[0].usage_instructions.length} خطوة</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">لا توجد منتجات</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersTable />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductSettings />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-soft border-primary/20">
                <CardHeader>
                  <CardTitle>توزيع الطلبات حسب الحالة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['جديد', 'قيد التجهيز', 'تم الشحن', 'تم التوصيل', 'ملغي'].map((status) => {
                      const count = orders.filter(order => order.status === status).length;
                      const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                      
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-sm">{status}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium min-w-[3rem]">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-primary/20">
                <CardHeader>
                  <CardTitle>الطلبات حسب المحافظة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      orders.reduce((acc, order) => {
                        const gov = order.governorate || 'غير محدد';
                        acc[gov] = (acc[gov] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([governorate, count]) => (
                      <div key={governorate} className="flex justify-between items-center">
                        <span className="text-sm">{governorate}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
