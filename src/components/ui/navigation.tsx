import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Settings, 
  Menu, 
  X,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      title: 'الصفحة الرئيسية',
      href: '/',
      icon: Home,
      active: location.pathname === '/'
    }
  ];

  // Only show admin link if on admin page
  const showAdminLink = location.pathname === '/admin';
  
  if (showAdminLink) {
    navItems.push({
      title: 'لوحة التحكم',
      href: '/admin',
      icon: Settings,
      active: true
    });
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-6 left-6 z-50">
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-soft border border-primary/20 p-2">
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-full text-sm font-medium transition-all duration-200",
                    item.active 
                      ? "bg-gradient-primary text-white shadow-soft" 
                      : "hover:bg-primary/10 text-gray-700"
                  )}
                >
                  <item.icon className="w-4 h-4 ml-2" />
                  {item.title}
                </Button>
              </Link>
            ))}
            
            <Badge className="bg-gradient-primary text-white px-3 py-1 text-xs">
              سندرين بيوتي
            </Badge>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 left-4 z-50 rounded-full w-12 h-12 bg-white/95 backdrop-blur-md shadow-soft"
          size="icon"
          variant="ghost"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-primary" />
          ) : (
            <Menu className="w-5 h-5 text-primary" />
          )}
        </Button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <div className="fixed top-20 left-4 right-4 bg-white rounded-2xl shadow-soft border border-primary/20 p-6 z-50 animate-scale-in">
              <div className="space-y-3">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant={item.active ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start text-lg py-3",
                        item.active 
                          ? "bg-gradient-primary text-white" 
                          : "hover:bg-primary/10 text-gray-700"
                      )}
                    >
                      <item.icon className="w-5 h-5 ml-3" />
                      {item.title}
                    </Button>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <Badge className="bg-gradient-primary text-white px-4 py-2">
                    <ShoppingBag className="w-4 h-4 ml-2" />
                    سندرين بيوتي
                  </Badge>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navigation;