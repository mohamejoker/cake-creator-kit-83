import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Link2, Plus } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ProductImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ProductImageUpload = ({ images, onImagesChange }: ProductImageUploadProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة كبير جداً', {
        description: 'يجب أن يكون حجم الصورة أقل من 5 ميجا'
      });
      return;
    }

    setUploading(true);
    
    // Create a blob URL for the uploaded file
    try {
      const imageUrl = URL.createObjectURL(file);
      onImagesChange([...images, imageUrl]);
      toast.success('تم رفع الصورة بنجاح! ✨');
    } catch (error) {
      toast.error('خطأ في رفع الصورة', {
        description: 'حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlAdd = () => {
    if (!newImageUrl.trim()) return;
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(newImageUrl)) {
      toast.error('رابط غير صحيح', {
        description: 'يرجى إدخال رابط صورة صحيح'
      });
      return;
    }

    onImagesChange([...images, newImageUrl]);
    setNewImageUrl('');
    toast.success('تم إضافة الصورة بنجاح! ✨');
  };

  const removeImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, index) => index !== indexToRemove));
    toast.success('تم حذف الصورة');
  };

  return (
    <div className="space-y-6">
      {/* Upload Methods */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-primary hover:text-primary/80">
                    رفع صورة من الجهاز
                  </span>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </Label>
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, PNG أو WebP (حد أقصى 5MB)
                </p>
              </div>
              {uploading && (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">جاري الرفع...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* URL Input */}
        <Card className="border-2 border-dashed border-secondary/30 hover:border-secondary/50 transition-colors">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                  <Link2 className="w-6 h-6 text-secondary" />
                </div>
                <Label className="text-lg font-medium">إضافة رابط صورة</Label>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="text-right"
                />
                <Button 
                  onClick={handleUrlAdd}
                  variant="outline"
                  className="w-full"
                  disabled={!newImageUrl.trim()}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة الرابط
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images Preview */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">صور المنتج ({images.length})</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                    <img
                      src={image}
                      alt={`صورة ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded text-center">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {images.length === 0 && (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8 text-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>لم يتم إضافة أي صور بعد</p>
            <p className="text-sm">ارفع صوراً أو أضف روابط صور لعرض المنتج</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductImageUpload;