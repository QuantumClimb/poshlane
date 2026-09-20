import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Heart, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchJson } from "@/lib/apiConfig";
import { useWishlist } from "@/hooks/useWishlist";
import useCartStore from "@/stores/cartStore";

interface StoreStatus {
  id: number;
  isOpen: boolean;
  closedMessage: string | null;
  reopenTime: string | null;
}

interface NavigationProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navigation = ({
  activeCategory = "all",
  onSelectCategory,
  searchQuery = "",
  onSearchChange
}: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();
  const cartItems = useCartStore(state => state.items);
  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchStoreStatus = async () => {
      try {
        const data = await fetchJson<StoreStatus>('store-status');
        setStoreStatus(data);
      } catch (err) {
        console.error('Failed to fetch store status:', err);
      }
    };
    fetchStoreStatus();
  }, []);

  const isStoreClosed = storeStatus?.isOpen === false;

  const handleNavClick = (tabValue: string) => {
    if (location.pathname !== "/") {
      navigate(`/?tab=${tabValue}`);
    } else if (onSelectCategory) {
      onSelectCategory(tabValue);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    }
    window.dispatchEvent(new CustomEvent('poshlane-search', { detail: localSearch }));
  };

  const handleSearchInput = (val: string) => {
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
    window.dispatchEvent(new CustomEvent('poshlane-search', { detail: val }));
  };

  // Determine current active section
  const isShopActive = location.pathname === "/" && activeCategory === "all";
  const isElectronicsActive = location.pathname === "/" && (activeCategory.toLowerCase().includes("electronics") || activeCategory === "category-1");
  const isFragrancesActive = location.pathname === "/" && (activeCategory.toLowerCase().includes("fragrances") || activeCategory === "category-0");
  const isAboutActive = location.pathname === "/customer-support";

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#08090C] border-b border-white/10 h-16 transition-colors">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2" aria-label="poshlane Home">
              <img
                src="/logo-dark.svg"
                alt="poshlane Logo"
                className="h-10 w-auto object-contain drop-shadow-md hidden sm:block"
                onError={(e) => {
                  e.currentTarget.src = "/logo-desktop.svg";
                }}
              />
              <img
                src="/logo.svg"
                alt="poshlane Logo Mobile"
                className="h-9 w-9 object-contain sm:hidden"
              />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick("all")}
              className={`text-sm font-medium transition-colors relative py-1 ${
                isShopActive
                  ? "text-[#6838FF] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#6838FF]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNavClick("electronics")}
              className={`text-sm font-medium transition-colors relative py-1 ${
                isElectronicsActive
                  ? "text-[#6838FF] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#6838FF]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Electronics
            </button>
            <button
              onClick={() => handleNavClick("fragrances")}
              className={`text-sm font-medium transition-colors relative py-1 ${
                isFragrancesActive
                  ? "text-[#6838FF] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#6838FF]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Fragrances
            </button>
            <Link
              to="/customer-support"
              className={`text-sm font-medium transition-colors relative py-1 ${
                isAboutActive
                  ? "text-[#6838FF] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#6838FF]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right: Search + Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Field (~280px wide) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-[280px]">
              <input
                type="text"
                placeholder="Search for products, brands..."
                value={localSearch}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full bg-[#11141A] border border-[#1E2638] rounded-full py-1.5 pl-4 pr-9 text-xs text-white placeholder-[#9BA1B0] focus:outline-none focus:border-[#4B35E8] transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BA1B0] hover:text-white">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Mobile Search Button toggle */}
            <div className="lg:hidden flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={localSearch}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-32 sm:w-44 bg-[#11141A] border border-white/10 rounded-full py-1 px-3 text-xs text-white placeholder-[#9BA1B0]"
              />
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick("all")}
              className="relative p-2 text-white/80 hover:text-white transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#6838FF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon / Cart Drawer */}
            {!isStoreClosed && <CartDrawer />}

            {/* Account Icon */}
            <Link
              to="/admin"
              className="p-2 text-white/80 hover:text-white transition-colors hidden sm:block"
              title="Account / Admin"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#08090C] border-b border-white/10 px-4 pt-2 pb-4 space-y-3">
          <button
            onClick={() => { handleNavClick("all"); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-[#11141A]"
          >
            Shop
          </button>
          <button
            onClick={() => { handleNavClick("electronics"); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-[#11141A]"
          >
            Electronics
          </button>
          <button
            onClick={() => { handleNavClick("fragrances"); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-[#11141A]"
          >
            Fragrances
          </button>
          <Link
            to="/customer-support"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-[#11141A]"
          >
            About
          </Link>
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-[#11141A]"
          >
            Account / Admin
          </Link>
        </div>
      )}
    </header>
  );
};
