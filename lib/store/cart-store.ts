import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (i) => i.id === item.id && i.selectedSize === item.selectedSize
        );
        
        if (existingItemIndex !== -1) {
          // If item already exists, update quantity
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          return { items: updatedItems };
        } else {
          // Otherwise add new item
          return { items: [...state.items, item] };
        }
      }),
      
      removeItem: (productId, size) => set((state) => ({
        items: state.items.filter(
          (item) => !(item.id === productId && item.selectedSize === size)
        ),
      })),
      
      updateQuantity: (productId, quantity, size) => set((state) => ({
        items: state.items.map((item) => {
          if (item.id === productId && item.selectedSize === size) {
            return { ...item, quantity };
          }
          return item;
        }),
      })),
      
      clearCart: () => set({ items: [] }),
      
      totalAmount: () => {
        return get().items.reduce((total, item) => {
          const price = item.salePrice || item.price;
          return total + (price * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);