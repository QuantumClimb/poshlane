import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShoppingBag, Search, Heart, Eye, Filter, RotateCcw, ChevronRight } from "lucide-react";
import { MenuCategory, MenuItem } from "../types/menu";
import { QuantityStepper } from "../components/QuantityStepper";
import { useItemCartQuantity } from "../hooks/useCartQuantity";
import useCartStore from "../stores/cartStore";
import { fetchJson } from "../lib/apiConfig";
import { useMenuData } from "../hooks/useMenuData";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { useWishlist } from "../hooks/useWishlist";

interface StoreStatus {
  id: number;
  isOpen: boolean;
  closedMessage: string | null;
  reopenTime: string | null;
}

const MenuItemCard = ({ item, placeholderImg, isStoreClosed }: { item: MenuItem, placeholderImg: string, isStoreClosed: boolean }) => {
  const { tLegacy } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  
  const cartQuantity = useItemCartQuantity(item);
  const isInCart = cartQuantity > 0;
  
  const items = useCartStore(state => state.items);
  const cartItemId = items.find(cartItem => cartItem.menuItem.id === item.id)?.id;

  const displayName = tLegacy(item.name, item.namePt);
  const displayDescription = tLegacy(item.description || '', item.descriptionPt);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem(item, 1);
  };

  const handleIncrement = () => {
    if (cartItemId) {
      const currentCartItem = items.find(ci => ci.id === cartItemId);
      if (currentCartItem) {
        updateQuantity(cartItemId, currentCartItem.quantity + 1);
      }
    }
  };

  const handleDecrement = () => {
    if (cartItemId) {
      const currentCartItem = items.find(ci => ci.id === cartItemId);
      if (currentCartItem) {
        if (currentCartItem.quantity > 1) {
          updateQuantity(cartItemId, currentCartItem.quantity - 1);
        } else {
          removeItem(cartItemId);
        }
      }
    }
  };

  const imageUrl = item.imageUrl && !item.imageUrl.includes('placeholder') ? item.imageUrl : placeholderImg;
  const wishlisted = item.id ? isWishlisted(item.id) : false;

  return (
    <>
      {/* Product Card Container */}
      <div className="bg-[#11141A] border border-white/10 rounded-[10px] overflow-hidden group hover:-translate-y-0.5 hover:border-white/20 transition-all duration-180 flex flex-col justify-between h-full shadow-md">
        
        {/* Product Image Box */}
        <div 
          className="relative aspect-square w-full overflow-hidden bg-[#0E1117] p-4 flex items-center justify-center cursor-pointer group/img" 
          onClick={() => setShowModal(true)}
        >
          <img
            src={imageUrl}
            alt={displayName}
            className="w-full h-full object-contain rounded-md transition-transform duration-300 group-hover/img:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.src = placeholderImg;
            }}
          />

          {/* Wishlist & Quick View Overlay Controls (Upper Right) */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (item.id) toggleWishlist(item.id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all glass-control ${
                wishlisted 
                  ? "bg-[#6838FF]/30 border-[#6838FF] text-[#6838FF]" 
                  : "text-white/80 hover:text-white hover:border-white/30"
              }`}
              title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-[#6838FF]" : ""}`} />
            </button>

            {/* Quick View Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all glass-control hover:border-white/30"
              title="Quick view"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        {/* Product Info Section */}
        <div className="p-4 flex flex-col flex-grow text-left">
          <div className="mb-1 cursor-pointer" onClick={() => setShowModal(true)}>
            <h3 className="text-[15px] font-semibold text-white line-clamp-1 hover:text-[#6838FF] transition-colors leading-snug">
              {displayName}
            </h3>
            {item.brand && (
              <p className="text-[10px] font-medium text-[#9BA1B0] uppercase tracking-wider mt-0.5">
                {item.brand}
              </p>
            )}
          </div>
          
          <p className="text-xs text-[#9BA1B0] line-clamp-2 mb-4 flex-grow leading-relaxed mt-1">
            {displayDescription}
          </p>
          
          {/* Bottom Bar: Price & Add to Bag */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
            <span className="text-[17px] font-bold text-white tracking-tight">
              ₹{(item.price / 100).toFixed(2)}
            </span>
            
            {!isStoreClosed && (
              <div className="flex-shrink-0">
                {isInCart ? (
                  <QuantityStepper
                    quantity={cartQuantity}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    size="sm"
                  />
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    className="h-9 px-3.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-[#4B35E8] to-[#6638FF] hover:brightness-110 active:scale-[0.98] transition-all duration-180 flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_15px_rgba(104,56,255,0.4)]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Product Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[480px] bg-[#11141A] border border-white/10 text-white rounded-[12px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">{displayName}</DialogTitle>
            {item.brand && (
              <DialogDescription className="text-xs font-medium text-[#9BA1B0] uppercase tracking-wider">
                BY {item.brand}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4 pt-2">
            {/* Product Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#0E1117] p-6 flex items-center justify-center border border-white/5">
              <img
                src={imageUrl}
                alt={displayName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = placeholderImg;
                }}
              />
            </div>

            {/* Price & Specs */}
            <div className="flex items-center justify-between py-2 border-y border-white/10">
              <span className="text-2xl font-bold text-white">₹{(item.price / 100).toFixed(2)}</span>
              {item.volume && (
                <span className="text-xs text-[#9BA1B0] bg-white/5 px-2.5 py-1 rounded-md">{item.volume}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1.5">Description</h4>
              <p className="text-xs text-[#9BA1B0] leading-relaxed">{displayDescription}</p>
            </div>

            {/* Additional Spec Details */}
            {(item.concentration || item.gender || item.fragranceFamily) && (
              <div className="space-y-1.5 text-xs pt-1">
                <h4 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-2">Specifications</h4>
                {item.concentration && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#9BA1B0]">Type:</span>
                    <span className="font-medium text-white">{item.concentration}</span>
                  </div>
                )}
                {item.gender && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#9BA1B0]">Gender:</span>
                    <span className="font-medium text-white">{item.gender}</span>
                  </div>
                )}
                {item.fragranceFamily && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#9BA1B0]">Family:</span>
                    <span className="font-medium text-white">{item.fragranceFamily}</span>
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart Section */}
            {!isStoreClosed && (
              <div className="flex items-center justify-between gap-4 pt-3 mt-4 border-t border-white/10">
                {isInCart ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-[#9BA1B0]">Quantity in bag:</span>
                    <QuantityStepper
                      quantity={cartQuantity}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      size="default"
                    />
                  </div>
                ) : (
                  <button 
                    onClick={(e) => {
                      handleAddToCart(e);
                      setShowModal(false);
                    }}
                    className="w-full h-11 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#4B35E8] to-[#6638FF] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(104,56,255,0.4)]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag — ₹{(item.price / 100).toFixed(2)}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Menu = () => {
  const { data: menuData = [], isLoading: loading, error: queryError } = useMenuData();
  const error = queryError?.message || null;
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

  // Active Category & Filter states
  const [activeTab, setActiveTab] = useState<string>("electronics");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Synchronize search params tab
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      if (tabParam.toLowerCase() === "fragrances") setActiveTab("fragrances");
      else if (tabParam.toLowerCase() === "electronics") setActiveTab("electronics");
      else if (tabParam.toLowerCase() === "all") setActiveTab("all");
    }
  }, [searchParams]);

  // Listen to custom header search events
  useEffect(() => {
    const handleSearchEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (typeof customEvent.detail === 'string') {
        setSearchQuery(customEvent.detail);
      }
    };
    window.addEventListener('poshlane-search', handleSearchEvent);
    return () => window.removeEventListener('poshlane-search', handleSearchEvent);
  }, []);

  // Fetch store status
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

  // Extract all available brands
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    menuData.forEach(cat => {
      cat.items?.forEach(item => {
        if (item.brand) brandsSet.add(item.brand);
      });
    });
    return Array.from(brandsSet).sort();
  }, [menuData]);

  // Filter and sort items function
  const processItems = (items: MenuItem[]) => {
    let result = items.filter(item => {
      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchBrand = item.brand ? item.brand.toLowerCase().includes(q) : false;
        const matchDesc = item.description ? item.description.toLowerCase().includes(q) : false;
        if (!matchName && !matchBrand && !matchDesc) return false;
      }

      // Brand filter
      if (selectedBrand !== "all" && item.brand !== selectedBrand) {
        return false;
      }
      
      const priceVal = item.price / 100; // in Rupees
      
      // Preset Price Range filter
      if (priceRange === "under3k" && priceVal > 3000) return false;
      if (priceRange === "3k-10k" && (priceVal < 3000 || priceVal > 10000)) return false;
      if (priceRange === "10k-25k" && (priceVal < 10000 || priceVal > 25000)) return false;
      if (priceRange === "above25k" && priceVal < 25000) return false;

      return true;
    });

    // Sort items
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  };

  // Get active items according to selected tab (Electronics, Fragrances, or All)
  const categoryItems = useMemo(() => {
    if (activeTab === "electronics") {
      const elecCat = menuData.find(c => c.name.toLowerCase().includes("electronics"));
      return elecCat ? elecCat.items || [] : [];
    } else if (activeTab === "fragrances") {
      const fragCat = menuData.find(c => c.name.toLowerCase().includes("fragrances"));
      return fragCat ? fragCat.items || [] : [];
    } else {
      // All items combined
      return menuData.flatMap(c => c.items || []);
    }
  }, [menuData, activeTab]);

  const displayedItems = useMemo(() => processItems(categoryItems), [categoryItems, selectedBrand, priceRange, searchQuery, sortBy]);

  const activeCategoryTitle = useMemo(() => {
    if (activeTab === "electronics") return "Electronics";
    if (activeTab === "fragrances") return "Fragrances";
    return "Shop All";
  }, [activeTab]);

  const activeCategorySubtitle = useMemo(() => {
    if (activeTab === "electronics") {
      return "Smart tech for a better everyday. Discover premium electronics from top brands at poshlane.";
    }
    if (activeTab === "fragrances") {
      return "Exclusive designer perfumes and luxury scents for an unmistakable presence.";
    }
    return "Explore our complete curated selection of premium electronics and luxury fragrances.";
  }, [activeTab]);

  const resetFilters = () => {
    setSelectedBrand("all");
    setPriceRange("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  const isFilterActive = selectedBrand !== "all" || priceRange !== "all" || searchQuery !== "" || sortBy !== "featured";

  const placeholderImg = "/images/placeholder-product.svg";

  return (
    <div className="min-h-screen bg-[#08090C] text-white">
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {loading ? (
          <div className="text-center py-24 text-[#9BA1B0] text-sm animate-pulse">
            Loading products...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400 text-sm">{error}</div>
        ) : (
          <>
            {/* Page Introduction (Breadcrumb + Category Header) */}
            <div className="space-y-2">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-1.5 text-xs text-[#9BA1B0]">
                <span>Home</span>
                <ChevronRight className="w-3 h-3 text-[#9BA1B0]/60" />
                <span>Shop</span>
                <ChevronRight className="w-3 h-3 text-[#9BA1B0]/60" />
                <span className="text-white font-medium">{activeCategoryTitle}</span>
              </nav>

              {/* Title & Count Row */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-1">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {activeCategoryTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#9BA1B0] mt-1.5 max-w-2xl leading-relaxed">
                    {activeCategorySubtitle}
                  </p>
                </div>
                <div className="text-xs text-[#9BA1B0] font-medium self-end sm:self-auto pb-0.5">
                  {displayedItems.length} {displayedItems.length === 1 ? "product" : "products"}
                </div>
              </div>
            </div>

            {/* Filter / Search Toolbar (Single Rounded Control Panel) */}
            <div className="bg-[#11141A] border border-white/10 rounded-full px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
              
              {/* Left Controls: Dropdowns + Category Pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                {/* Brand Dropdown */}
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-[#181C24] border border-white/10 rounded-full text-xs text-white px-3.5 py-1.5 focus:outline-none focus:border-[#4B35E8] cursor-pointer transition-colors"
                >
                  <option value="all">All Brands</option>
                  {availableBrands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                {/* Price Dropdown */}
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-[#181C24] border border-white/10 rounded-full text-xs text-white px-3.5 py-1.5 focus:outline-none focus:border-[#4B35E8] cursor-pointer transition-colors"
                >
                  <option value="all">All Prices</option>
                  <option value="under3k">Under ₹3,000</option>
                  <option value="3k-10k">₹3,000 - ₹10,000</option>
                  <option value="10k-25k">₹10,000 - ₹25,000</option>
                  <option value="above25k">Above ₹25,000</option>
                </select>

                {/* Divider */}
                <div className="w-[1px] h-4 bg-white/10 hidden sm:block mx-0.5" />

                {/* Category Pills */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab("electronics")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === "electronics"
                        ? "bg-gradient-to-r from-[#4934E8] to-[#6838FF] text-white shadow-md shadow-indigo-950/50"
                        : "bg-[#181C24] text-[#9BA1B0] hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Electronics
                  </button>

                  <button
                    onClick={() => setActiveTab("fragrances")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === "fragrances"
                        ? "bg-gradient-to-r from-[#4934E8] to-[#6838FF] text-white shadow-md shadow-indigo-950/50"
                        : "bg-[#181C24] text-[#9BA1B0] hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Fragrances
                  </button>

                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === "all"
                        ? "bg-gradient-to-r from-[#4934E8] to-[#6838FF] text-white shadow-md shadow-indigo-950/50"
                        : "bg-[#181C24] text-[#9BA1B0] hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Shop All
                  </button>
                </div>
              </div>

              {/* Right Controls: Toolbar Search + Sort */}
              <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Search Input within category */}
                <div className="relative flex-1 md:w-48">
                  <input
                    type="text"
                    placeholder={`Search in ${activeCategoryTitle}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#181C24] border border-white/10 rounded-full py-1.5 pl-8 pr-3 text-xs text-white placeholder-[#9BA1B0] focus:outline-none focus:border-[#4B35E8]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#9BA1B0] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#181C24] border border-white/10 rounded-full text-xs text-white px-3.5 py-1.5 focus:outline-none focus:border-[#4B35E8] cursor-pointer"
                >
                  <option value="featured">Sort by Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                </select>

                {/* Reset Filters button if active */}
                {isFilterActive && (
                  <button
                    onClick={resetFilters}
                    className="p-1.5 rounded-full text-[#9BA1B0] hover:text-white hover:bg-white/10"
                    title="Reset filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Product Grid Section (4 Columns on Desktop) */}
            {displayedItems.length === 0 ? (
              <div className="text-center py-20 bg-[#11141A] border border-white/10 rounded-[10px]">
                <p className="text-sm text-[#9BA1B0]">No products match your selected filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-3 text-xs font-semibold text-[#6838FF] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[18px]">
                {displayedItems.map((item, index) => (
                  <MenuItemCard
                    key={`${item.id || item.name}-${index}`}
                    item={item}
                    placeholderImg={placeholderImg}
                    isStoreClosed={isStoreClosed}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Menu;
