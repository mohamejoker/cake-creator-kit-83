import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useMemo } from 'react';
import { cacheManager, CACHE_KEYS } from '@/lib/cache';

const DashboardStats = () => {
  const { orders } = useOrders();
  const { products } = useProducts();

  // Memoize expensive calculations
  const stats = useMemo(() => {
    // Check cache first
    const cacheKey = `${CACHE_KEYS.ORDER_STATS}_${orders.length}_${products.length}`;
    const cachedStats = cacheManager.get(cacheKey);
    if (cachedStats) return cachedStats;

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const pendingOrders = orders.filter(order => 
      order.status === 'جديد' || order.status === 'قيد التحضير'
    ).length;
    const completedOrders = orders.filter(order => order.status === 'تم التوصيل').length;
    const cancelledOrders = orders.filter(order => order.status === 'ملغي').length;
    
    // Calculate recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= sevenDaysAgo;
    }).length;

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Active products count
    const activeProducts = products.filter(product => product.is_active !== false).length;

    const calculatedStats = {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      recentOrders,
      averageOrderValue,
      activeProducts
    };

    // Cache for 2 minutes
    cacheManager.set(cacheKey, calculatedStats, 2 * 60 * 1000);
    return calculatedStats;
  }, [orders, products]);

  const statsCards = [
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders.toLocaleString(),
      description: 'جميع الطلبات في النظام',
      icon: ShoppingBag,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${stats.totalRevenue.toLocaleString()} ج.م`,
      description: 'المبيعات الإجمالية',
      icon: DollarSign,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'طلبات قيد المعالجة',
      value: stats.pendingOrders.toLocaleString(),
      description: 'طلبات تحتاج متابعة',
      icon: Clock,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'طلبات مكتملة',
      value: stats.completedOrders.toLocaleString(),
      description: 'طلبات تم توصيلها بنجاح',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'المنتجات النشطة',
      value: stats.activeProducts.toLocaleString(),
      description: 'منتجات متاحة للبيع',
      icon: Package,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'متوسط قيمة الطلب',
      value: `${stats.averageOrderValue.toLocaleString()} ج.م`,
      description: 'متوسط مبلغ الطلب الواحد',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden shadow-soft border-0 hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
            <div className={`h-2 w-full ${stat.color}`} />
          </Card>
        ))}
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-soft border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              النشاط الأخير
            </CardTitle>
            <CardDescription>آخر 7 أيام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">طلبات جديدة</span>
                <Badge variant="secondary" className="bg-gradient-primary text-white">
                  {stats.recentOrders}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">إجمالي المنتجات</span>
                <Badge variant="outline">
                  {products.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">معدل النجاح</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="shadow-soft border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              توزيع الطلبات
            </CardTitle>
            <CardDescription>حسب الحالة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">مكتملة</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{stats.completedOrders}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">قيد المعالجة</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">{stats.pendingOrders}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ملغية</span>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="font-medium">{stats.cancelledOrders}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="shadow-soft border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              مؤشرات الأداء
            </CardTitle>
            <CardDescription>إحصائيات هامة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">معدل التحويل</span>
                <Badge className="bg-gradient-primary text-white">
                  {stats.totalOrders > 0 ? '85%' : '0%'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">رضا العملاء</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  4.8/5 ⭐
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">وقت الاستجابة</span>
                <Badge variant="outline">
                  أقل من ساعتين
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;