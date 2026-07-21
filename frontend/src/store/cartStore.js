import { useState, useEffect } from 'react';

// Custom event name for cart updates
const CART_UPDATE_EVENT = 'UDINFRESH_CART_UPDATED';

// Helper to get cart from localStorage
const getCartData = () => {
  try {
    const data = localStorage.getItem('udinfresh_cart');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading cart from localStorage', err);
    return [];
  }
};

// Helper to save cart to localStorage and dispatch event
const saveCartData = (cart) => {
  try {
    localStorage.setItem('udinfresh_cart', JSON.stringify(cart));
    // Dispatch a custom event so other components know the cart changed
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
  } catch (err) {
    console.error('Error saving cart to localStorage', err);
  }
};

// The core cart actions
export const cartActions = {
  getCart: () => getCartData(),
  
  addToCart: (product, quantity = 1, weight = '1 kg') => {
    const cart = getCartData();
    // Unique ID for the cart item based on product ID and selected variant (weight)
    const cartItemId = `${product.id_produk}-${weight}`;
    
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    
    if (existingIndex >= 0) {
      // If it exists, just increase quantity
      cart[existingIndex].quantity += quantity;
    } else {
      // Otherwise, add new item. Include mock store data if not present.
      const storeName = product.nama_toko || 'Kebun Makmur Sejahtera';
      cart.push({
        cartItemId,
        productId: product.id_produk,
        name: product.nama_produk,
        price: product.harga,
        image: product.foto_produk ? `http://localhost:5000/images/${product.foto_produk}` : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
        weight: weight || (product.berat ? `${product.berat} gr` : '1 kg'),
        quantity: quantity,
        storeName: storeName,
        selected: true // default to selected when added
      });
    }
    
    saveCartData(cart);
  },
  
  updateQuantity: (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    const cart = getCartData();
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (item) {
      item.quantity = newQuantity;
      saveCartData(cart);
    }
  },
  
  removeItem: (cartItemId) => {
    const cart = getCartData();
    const newCart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCartData(newCart);
  },
  
  toggleSelect: (cartItemId) => {
    const cart = getCartData();
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (item) {
      item.selected = !item.selected;
      saveCartData(cart);
    }
  },
  
  toggleStoreSelect: (storeName, isSelected) => {
    const cart = getCartData();
    cart.forEach(item => {
      if (item.storeName === storeName) {
        item.selected = isSelected;
      }
    });
    saveCartData(cart);
  },
  
  toggleSelectAll: (isSelected) => {
    const cart = getCartData();
    cart.forEach(item => {
      item.selected = isSelected;
    });
    saveCartData(cart);
  },
  
  // Gets total number of unique items OR total sum of quantities
  getTotalItemCount: () => {
    const cart = getCartData();
    // Usually badges show the sum of quantities or just number of rows. 
    // We'll show sum of quantities to be standard.
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
};

// React hook to use the cart state reactively
export function useCart() {
  const [cart, setCart] = useState(getCartData());

  useEffect(() => {
    // Listener for custom cart updates
    const handleCartUpdate = () => {
      setCart(getCartData());
    };

    window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate);
    
    // Also listen to normal storage events for cross-tab sync
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  // Compute derived states
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedItems = cart.filter(item => item.selected);
  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isAllSelected = cart.length > 0 && cart.every(item => item.selected);

  // Group items by store for the TikTok shop UI
  const groupedByStore = cart.reduce((acc, item) => {
    if (!acc[item.storeName]) {
      acc[item.storeName] = [];
    }
    acc[item.storeName].push(item);
    return acc;
  }, {});

  // Convert to array of stores, each containing their items and store-level selection state
  const storeGroups = Object.entries(groupedByStore).map(([storeName, items]) => {
    const isStoreSelected = items.every(item => item.selected);
    return {
      storeName,
      items,
      isSelected: isStoreSelected
    };
  });

  return {
    cart,
    storeGroups,
    totalItems,
    totalPrice,
    isAllSelected,
    actions: cartActions
  };
}
