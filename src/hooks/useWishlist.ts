import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('poshlane_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('poshlane_wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('poshlane_wishlist');
        if (saved) setWishlist(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('wishlist-updated', handleStorageChange);
    return () => window.removeEventListener('wishlist-updated', handleStorageChange);
  }, []);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isWishlisted = (id: number) => wishlist.includes(id);

  return { wishlist, toggleWishlist, isWishlisted, wishlistCount: wishlist.length };
};
