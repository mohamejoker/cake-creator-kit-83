import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { performanceMonitor } from '@/lib/performance';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  pageSize?: number;
}

function OptimizedTable<T extends { id: string }>({ 
  data, 
  columns, 
  loading = false,
  emptyMessage = 'لا توجد بيانات',
  className,
  pageSize = 50
}: OptimizedTableProps<T>) {
  
  // Memoize processed data to avoid recalculation
  const processedData = useMemo(() => {
    return performanceMonitor.measureTime(() => {
      // For large datasets, implement virtual scrolling or pagination
      return data.slice(0, pageSize);
    }, 'Table data processing')();
  }, [data, pageSize]);

  if (loading) {
    return (
      <div className="rounded-lg border">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className="text-right">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table className={className}>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column, index) => (
              <TableHead key={index} className={`text-right ${column.className || ''}`}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            processedData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.className}>
                    {column.render 
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || '')
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Show pagination info for large datasets */}
      {data.length > pageSize && (
        <div className="p-4 border-t bg-muted/30 text-sm text-muted-foreground text-center">
          عرض {Math.min(pageSize, data.length)} من أصل {data.length} عنصر
        </div>
      )}
    </div>
  );
}

export default OptimizedTable;