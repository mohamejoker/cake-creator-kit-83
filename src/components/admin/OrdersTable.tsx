import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const OrdersTable = () => {
  const { orders, loading, updateOrderStatus, refetch } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `طلبات-${new Date().toLocaleDateString('ar-EG')}.csv`;
    link.click();
    
    toast.success('تم تصدير البيانات بنجاح');
  };

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">التواصل</TableHead>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'لا توجد طلبات تطابق معايير البحث'
                        : 'لا توجد طلبات بعد'
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{order.customer_name}</p>
                          {order.governorate && (
                            <p className="text-xs text-muted-foreground">{order.governorate}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span className="text-sm">{order.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1 max-w-xs">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm truncate" title={order.address}>
                            {order.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-primary">
                          {Number(order.total_amount).toLocaleString()} ج.م
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-auto border-0 p-0 h-auto">
                            <Badge className={getStatusColor(order.status)} variant="secondary">
                              {order.status}
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
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-sm">
                            {new Date(order.created_at).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersTable;