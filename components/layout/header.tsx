'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart-store';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  Sun, 
  Moon,
  User,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const NavLink = ({ href, label, currentPath }: { href: string; label: string; currentPath: string }) => {
  const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
  
  return (
    <Link href={href} className={`text-sm font-medium transition-colors ${
      isActive 
        ? 'text-primary' 
        : 'text-foreground/80 hover:text-foreground'
    }`}>
      {label}
    </Link>
  );
};

export default function Header() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/products?category=sale', label: 'Sale' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Calculate number of items in cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  if (!mounted) return null;
  
  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md border-b' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Flame className="h-6 w-6" />
            <span className="font-bold text-xl hidden sm:inline-block">Lumina</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.href} 
                href={link.href} 
                label={link.label} 
                currentPath={pathname} 
              />
            ))}
          </nav>
          
          {/* Actions (Cart, Theme, Account) */}
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Link href="/account">
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="px-4 py-5 border-b">
                    <div className="flex items-center justify-between">
                      <Link href="/" className="flex items-center gap-2">
                        <Flame className="h-6 w-6" />
                        <span className="font-bold text-lg">Lumina</span>
                      </Link>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                  
                  <nav className="flex-1 overflow-auto">
                    <ul className="px-2 py-4 space-y-2">
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          <SheetClose asChild>
                            <Link 
                              href={link.href} 
                              className={`flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors ${
                                pathname === link.href 
                                  ? 'bg-secondary text-foreground' 
                                  : 'hover:bg-secondary/50'
                              }`}
                            >
                              {link.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}