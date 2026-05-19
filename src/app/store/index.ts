import { create } from 'zustand';
import { Product } from '../../database/db';
import { storage } from '../../utils/storage';
import { Part } from '../../constants/mockData';

export type Screen = 
  | 'home' 
  | 'add-product' 
  | 'product-details' 
  | 'edit-product' 
  | 'settings';

interface UIState {
  // Theme state
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Search & Filter UI state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string; // Active filter chip, e.g. '#yamaha'
  setSelectedTag: (tag: string) => void;

  // Selected Product for Details
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Custom Router navigation
  currentScreen: Screen;
  navigationStack: Screen[];
  navigateTo: (screen: Screen) => void;
  goBack: () => void;
  resetNavigation: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initialize state
  theme: (storage.getItem('theme') as 'dark' | 'light') || 'dark',
  searchQuery: '',
  selectedTag: 'All',
  selectedProduct: null,
  currentScreen: 'home',
  navigationStack: ['home'],

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    storage.setItem('theme', nextTheme);
    return { theme: nextTheme };
  }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  navigateTo: (screen) => set((state) => {
    const newStack = [...state.navigationStack, screen];
    return {
      navigationStack: newStack,
      currentScreen: screen,
    };
  }),

  goBack: () => set((state) => {
    if (state.navigationStack.length <= 1) return {};
    const newStack = [...state.navigationStack];
    newStack.pop();
    const prevScreen = newStack[newStack.length - 1];
    return {
      navigationStack: newStack,
      currentScreen: prevScreen,
    };
  }),

  resetNavigation: () => set({
    currentScreen: 'home',
    navigationStack: ['home'],
    selectedProduct: null,
    searchQuery: '',
    selectedTag: 'All',
  }),
}));

interface CartItem {
  part: Part;
  quantity: number;
}

interface AppState {
  cart: CartItem[];
  addToCart: (part: Part, quantity: number) => void;
  removeFromCart: (partId: string) => void;
  clearCart: () => void;
  selectedPart: Part | null;
  setSelectedPart: (part: Part | null) => void;
  navigationStack: Screen[];
  goBack: () => void;
}

export const useAppState = create<AppState>((set) => ({
  cart: (() => {
    try {
      const stored = storage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })(),
  selectedPart: null,
  navigationStack: useUIStore.getState().navigationStack,

  addToCart: (part, quantity) => set((state) => {
    const existingIndex = state.cart.findIndex((item) => item.part.id === part.id);
    let newCart;
    if (existingIndex > -1) {
      newCart = [...state.cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + quantity,
      };
    } else {
      newCart = [...state.cart, { part, quantity }];
    }
    storage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),

  removeFromCart: (partId) => set((state) => {
    const newCart = state.cart.filter((item) => item.part.id !== partId);
    storage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),

  clearCart: () => set(() => {
    storage.setItem('cart', '[]');
    return { cart: [] };
  }),

  setSelectedPart: (part) => set({ selectedPart: part }),

  goBack: () => {
    useUIStore.getState().goBack();
  },
}));

// Keep useAppState's navigationStack in sync with useUIStore
useUIStore.subscribe((state) => {
  useAppState.setState({ navigationStack: state.navigationStack });
});

export default useUIStore;
