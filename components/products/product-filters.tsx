'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const MAX_PRICE = 500;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get filter states from URL
  const currentCategory = searchParams?.get('category') || 'all';
  const currentMinPrice = Number(searchParams?.get('minPrice') || 0);
  const currentMaxPrice = Number(searchParams?.get('maxPrice') || MAX_PRICE);
  const currentSort = searchParams?.get('sort') || 'newest';
  
  // Local state for filters
  const [category, setCategory] = useState(currentCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([currentMinPrice, currentMaxPrice]);
  const [sort, setSort] = useState(currentSort);
  const [isOpen, setIsOpen] = useState(false);
  
  // Update local state when URL params change
  useEffect(() => {
    setCategory(currentCategory);
    setPriceRange([currentMinPrice, currentMaxPrice]);
    setSort(currentSort);
  }, [currentCategory, currentMinPrice, currentMaxPrice, currentSort]);
  
  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Update category
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    // Update price range
    if (priceRange[0] > 0) {
      params.set('minPrice', priceRange[0].toString());
    } else {
      params.delete('minPrice');
    }
    
    if (priceRange[1] < MAX_PRICE) {
      params.set('maxPrice', priceRange[1].toString());
    } else {
      params.delete('maxPrice');
    }
    
    // Update sort
    if (sort !== 'newest') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setCategory('all');
    setPriceRange([0, MAX_PRICE]);
    setSort('newest');
    router.push(pathname);
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filter Products</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-2 overflow-auto">
              <MobileFilters 
                category={category} 
                setCategory={setCategory} 
                priceRange={priceRange} 
                setPriceRange={setPriceRange}
                sort={sort}
                setSort={setSort}
              />
            </div>
            <DrawerFooter className="flex flex-row gap-2">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                Reset
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      
      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Filters</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs"
          >
            Reset All
          </Button>
        </div>
        
        <DesktopFilters 
          category={category} 
          setCategory={setCategory} 
          priceRange={priceRange} 
          setPriceRange={setPriceRange}
          sort={sort}
          setSort={setSort}
          applyFilters={applyFilters}
        />
      </div>
    </>
  );
}

function MobileFilters({ 
  category, 
  setCategory, 
  priceRange, 
  setPriceRange,
  sort,
  setSort
}: {
  category: string;
  setCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sort: string;
  setSort: (sort: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Categories filter removed: implement dynamic categories here in the future */}
      
      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-medium">Price Range</h3>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={10}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="py-4"
        />
        <div className="flex items-center justify-between text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
      
      {/* Sort By */}
      <div className="space-y-4">
        <h3 className="font-medium">Sort By</h3>
        <RadioGroup value={sort} onValueChange={setSort}>
          {SORT_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`sort-${option.value}-mobile`} />
              <Label 
                htmlFor={`sort-${option.value}-mobile`}
                className="cursor-pointer text-sm"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

function DesktopFilters({ 
  category, 
  setCategory, 
  priceRange, 
  setPriceRange,
  sort,
  setSort,
  applyFilters
}: {
  category: string;
  setCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sort: string;
  setSort: (sort: string) => void;
  applyFilters: () => void;
}) {
  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['categories', 'price', 'sort']}>
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {/* Categories filter removed: implement dynamic categories here in the future */}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-2">
              <Slider
                min={0}
                max={MAX_PRICE}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="py-4"
              />
              <div className="flex items-center justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Sort By */}
        <AccordionItem value="sort">
          <AccordionTrigger>Sort By</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={sort} onValueChange={setSort} className="pt-2">
              {SORT_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
                  <Label 
                    htmlFor={`sort-${option.value}`}
                    className="cursor-pointer text-sm"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </div>
  );
}