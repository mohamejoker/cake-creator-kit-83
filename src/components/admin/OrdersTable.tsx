import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Calendar,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import OptimizedTable from '@/components/ui/optimized-table';
import { performanceMonitor } from '@/lib/performance';
import { useMemo } from 'react';

const OrdersTable = () => {
  const { orders, loading, updateOrderStatus, refetch } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Memoize filtered orders for better performance
  const filteredOrders = useMemo(() => {
    return performanceMonitor.measureTime(() => {
      if (!searchTerm && statusFilter === 'all') return orders;
      
      return orders.filter(order => {
        const matchesSearch = !searchTerm || (
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phone.includes(searchTerm) ||
          order.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      });
    }, 'Filter orders')();
  }, [orders, searchTerm, statusFilter]);

  // Debounced search to improve performance
  const debouncedSearch = useMemo(
    () => performanceMonitor.debounce((term: string) => setSearchTerm(term), 300),
    []
  );
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      toast.success('تم تحديث حالة الطلب بنجاح');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جديد': return 'bg-blue-100 text-blue-800';
      case 'قيد التجهيز': return 'bg-orange-100 text-orange-800';
      case 'تم الشحن': return 'bg-purple-100 text-purple-800';
      case 'تم التوصيل': return 'bg-green-100 text-green-800';
      case 'ملغي': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportOrders = () => {
    // Optimize CSV generation
    const csvContent = [
      ['اسم العميل', 'الهاتف', 'العنوان', 'المحافظة', 'المبلغ', 'الحالة', 'التاريخ'],
      ...filteredOrders.map(order => [
        order.customer_name,
        order.phone,
        order.address,
        order.governorate || '',
        order.total_amount,
        order.status,
        new Date(order.created_at).toLocaleDateString('ar-EG')
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `طلبات-${new Date().toLocaleDateString('ar-EG')}.csv`;
    link.click();
    
    toast.success('تم تصدير البيانات بنجاح');
  };

  // Define table columns
  const tableColumns = [
    {
      key: 'customer_name' as const,
      header: 'العميل',
      render: (_, order) => (
        <div>
          <p className="font-semibold">{order.customer_name}</p>
          {order.governorate && (
            <p className="text-xs text-muted-foreground">{order.governorate}</p>
          )}
        </div>
      )
    },
    {
      key: 'phone' as const,
      header: 'التواصل',
      render: (phone) => (
        <div className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          <span className="text-sm">{phone}</span>
        </div>
      )
    },
    // Add more columns as needed...
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري تحميل الطلبات...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-soft border-primary/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl text-primary">إدارة الطلبات</CardTitle>
              <CardDescription>عرض وإدارة جميع طلبات العملاء</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
              <Button variant="outline" size="sm" onClick={exportOrders}>
                <Download className="w-4 h-4 ml-2" />
                تصدير CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، الهاتف، أو العنوان..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="pr-10 text-right"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="تصفية بالحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="جديد">جديد</SelectItem>
                  <SelectItem value="قيد التجهيز">قيد التجهيز</SelectItem>
                  <SelectItem value="تم الشحن">تم الشحن</SelectItem>
                  <SelectItem value="تم التوصيل">تم التوصيل</SelectItem>
                  <SelectItem value="ملغي">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              عرض {filteredOrders.length} من أصل {orders.length} طلب
            </p>
          </div>

          {/* Orders Table */}
          <OptimizedTable
            data={filteredOrders}
            columns={[
              {
                key: 'customer_name',
                header: 'العميل',
                render: (_, order) => (
                  <div>
                    <p className="font-semibold">{order.customer_name}</p>
                    {order.governorate && (
                      <p className="text-xs text-muted-foreground">{order.governorate}</p>
                    )}
                  </div>
                )
              },
              {
                key: 'phone',
                header: 'التواصل',
                render: (phone) => (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span className="text-sm">{phone}</span>
                  </div>
                )
              },
              {
                key: 'address',
                header: 'العنوان',
                render: (address) => (
                  <div className="flex items-start gap-1 max-w-xs">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm truncate" title={address}>
                      {address}
                    </span>
                  </div>
                )
              },
              {
                key: 'total_amount',
                header: 'المبلغ',
                render: (amount) => (
                  <span className="font-bold text-primary">
                    {Number(amount).toLocaleString()} ج.م
                  </span>
                )
              },
              {
                key: 'status',
                header: 'الحالة',
                render: (status, order) => (
                  <Select
                    value={status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-auto border-0 p-0 h-auto">
                      <Badge className={getStatusColor(status)} variant="secondary">
                        {status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جديد">جديد</SelectItem>
                      <SelectItem value="قيد التجهيز">قيد التجهيز</SelectItem>
                      <SelectItem value="تم الشحن">تم الشحن</SelectItem>
                      <SelectItem value="تم التوصيل">تم التوصيل</SelectItem>
                      <SelectItem value="ملغي">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                )
              },
              {
                key: 'created_at',
                header: 'التاريخ',
                render: (date) => (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-sm">
                      {new Date(date).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                )
              },
              {
                key: 'id',
                header: 'الإجراءات',
                render: (_, order) => (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>تفاصيل الطلب</DialogTitle>
                        <DialogDescription>
                          معلومات تفصيلية عن الطلب رقم {selectedOrder?.id}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">اسم العميل</Label>
                              <p className="text-sm mt-1">{selectedOrder.customer_name}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">رقم الهاتف</Label>
                              <p className="text-sm mt-1">{selectedOrder.phone}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">المحافظة</Label>
                              <p className="text-sm mt-1">{selectedOrder.governorate || 'غير محدد'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">إجمالي المبلغ</Label>
                              <p className="text-sm mt-1 font-bold text-primary">
                                {Number(selectedOrder.total_amount).toLocaleString()} جنيه
                              </p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">العنوان الكامل</Label>
                            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">
                              {selectedOrder.address}
                            </p>
                          </div>
                          {selectedOrder.notes && (
                            <div>
                              <Label className="text-sm font-medium">ملاحظات</Label>
                              <p className="text-sm mt-1 p-3 bg-blue-50 rounded-lg">
                                {selectedOrder.notes}
                              </p>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-4 border-t">
                            <Badge className={getStatusColor(selectedOrder.status)}>
                              {selectedOrder.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              تاريخ الطلب: {new Date(selectedOrder.created_at).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )
              }
            ]}
            loading={loading}
            emptyMessage={
              searchTerm || statusFilter !== 'all' 
                ? 'لا توجد طلبات تطابق معايير البحث'
                : 'لا توجد طلبات بعد'
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersTable;