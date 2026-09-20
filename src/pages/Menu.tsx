import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShoppingCart, AlertCircle, Clock, X, Filter, Tag, IndianRupee, RotateCcw } from "lucide-react";
import { MenuCategory, MenuItem } from "../types/menu";
import { QuantityStepper } from "../components/QuantityStepper";
import { useItemCartQuantity } from "../hooks/useCartQuantity";
import useCartStore from "../stores/cartStore";
import { fetchJson } from "../lib/apiConfig";
import { useMenuData } from "../hooks/useMenuData";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";

// Store status type
interface StoreStatus {
  id: number;
  isOpen: boolean;
  closedMessage: string | null;
  reopenTime: string | null;
}

const MenuSection = ({ items, title, isStoreClosed }: { items: MenuItem[], title: string, isStoreClosed: boolean }) => {
  const placeholderImg = "/images/placeholder-product.svg";
  
  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-foreground mb-8">{title}</h3>
        <div className="text-center py-12 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-[5px]">
          <p className="text-neutral-500">No products match your selected filters in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-foreground mb-8">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <MenuItemCard
            key={`${item.id || item.name || 'item'}-${index}`}
            item={item}
            placeholderImg={placeholderImg}
            isStoreClosed={isStoreClosed}
          />
        ))}
      </div>
    </div>
  );
};

const MenuItemCard = ({ item, placeholderImg, isStoreClosed }: { item: MenuItem, placeholderImg: string, isStoreClosed: boolean }) => {
  const { t, tLegacy } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  
  // Only subscribe to actions, not items (to avoid re-renders)
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  
  // Get cart-specific info for this item
  const cartQuantity = useItemCartQuantity(item);
  const isInCart = cartQuantity > 0;
  
  // Get the first cart item ID for this menu item (for updateQuantity/removeItem)
  const items = useCartStore(state => state.items);
  const cartItemId = items.find(cartItem => cartItem.menuItem.id === item.id)?.id;

  // Get translated name and description using tLegacy for menu items
  const displayName = tLegacy(item.name, item.namePt);
  const displayDescription = tLegacy(item.description || '', item.descriptionPt);

  const handleAddToCart = () => {
    // Simply add item to cart - no customization needed for perfumes
    addItem(item, 1);
  };

  const handleIncrement = () => {
    // Directly increment quantity
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
          // Remove item when quantity reaches 0
          removeItem(cartItemId);
        }
      }
    }
  };

  const imageUrl = (() => {
    try {
      // Use imageUrl from database if available
      if (item.imageUrl && !item.imageUrl.includes('placeholder')) {
        return item.imageUrl;
      }
      // Fallback to placeholder
      return placeholderImg;
    } catch (error) {
      return placeholderImg;
    }
  })();

  return (
    <>
      {/* Mobile Layout - Vertical Card (Clickable) */}
      <Card 
        className="md:hidden flex flex-col rounded-[5px] bg-card border-border overflow-hidden group menu-item-card shadow-sm cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-50 dark:bg-neutral-900/20 p-4 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={displayName}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = placeholderImg;
            }}
          />
        </div>

        {/* Content */}
        <CardContent className="p-3 flex flex-col flex-grow text-left">
          <div className="mb-1">
            <h4 className="text-sm font-semibold text-foreground dark:text-neutral-200 line-clamp-1">{displayName}</h4>
            {item.brand && <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.brand}</p>}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow leading-relaxed">{displayDescription}</p>
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            <span className="text-sm font-bold text-foreground">₹{(item.price / 100).toFixed(2)}</span>
            <div className="w-7 h-7 rounded-[5px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:bg-black group-hover:text-white transition-colors">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Product Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto rounded-[5px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{displayName}</DialogTitle>
            {item.brand && (
              <DialogDescription className="text-base font-medium">
                by {item.brand}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Product Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-[5px]">
              <img
                src={imageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = placeholderImg;
                }}
              />
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">₹{(item.price / 100).toFixed(2)}</span>
              {item.volume && (
                <span className="text-sm text-muted-foreground">{item.volume}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-foreground/80 dark:text-neutral-300">{displayDescription}</p>
            </div>

            {/* Fragrance Details */}
            {(item.concentration || item.gender || item.fragranceFamily) && (
              <div className="space-y-2">
                <h4 className="font-semibold dark:text-white">Details</h4>
                {item.concentration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-neutral-300">Concentration:</span>
                    <span className="font-medium dark:text-white">{item.concentration}</span>
                  </div>
                )}
                {item.gender && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-neutral-300">Gender:</span>
                    <span className="font-medium dark:text-white">{item.gender}</span>
                  </div>
                )}
                {item.fragranceFamily && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-neutral-300">Family:</span>
                    <span className="font-medium dark:text-white">{item.fragranceFamily}</span>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {(item.topNotes || item.middleNotes || item.baseNotes) && (
              <div className="space-y-3">
                <h4 className="font-semibold dark:text-white">Fragrance Notes</h4>
                {item.topNotes && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground dark:text-neutral-300">Top Notes: </span>
                    <span className="text-sm dark:text-white">{item.topNotes}</span>
                  </div>
                )}
                {item.middleNotes && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground dark:text-neutral-300">Middle Notes: </span>
                    <span className="text-sm dark:text-white">{item.middleNotes}</span>
                  </div>
                )}
                {item.baseNotes && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground dark:text-neutral-300">Base Notes: </span>
                    <span className="text-sm dark:text-white">{item.baseNotes}</span>
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart Section */}
            {!isStoreClosed && (
              <div className="flex items-center justify-between gap-4 pt-4 border-t">
                {isInCart ? (
                  <>
                    <span className="text-sm font-medium">Quantity:</span>
                    <QuantityStepper
                      quantity={cartQuantity}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      size="default"
                    />
                  </>
                ) : (
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                    className="w-full gap-2 bg-neutral-700 text-white hover:bg-black transition-colors rounded-[5px]"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart - ₹{(item.price / 100).toFixed(2)}
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop Layout - Vertical Card */}
      <Card className="hidden md:flex flex-col rounded-[5px] bg-card border-border overflow-hidden group menu-item-card shadow-sm hover:shadow-md transition-all duration-300">
        {/* Product Image */}
        <div 
          className="relative aspect-square overflow-hidden bg-neutral-50 dark:bg-neutral-900/20 p-8 flex items-center justify-center cursor-pointer" 
          onClick={() => setShowModal(true)}
        >
          <img
            src={imageUrl}
            alt={displayName}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = placeholderImg;
            }}
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-5 flex flex-col flex-grow text-left">
          <div className="mb-2 cursor-pointer" onClick={() => setShowModal(true)}>
            <h4 className="text-lg font-semibold text-foreground dark:text-neutral-200 line-clamp-1 hover:text-black dark:hover:text-white transition-colors">{displayName}</h4>
            {item.brand && <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{item.brand}</p>}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow leading-relaxed">{displayDescription}</p>
          
          <div className="flex justify-between items-center pt-4 border-t border-border/50 mt-auto">
            <span className="text-xl font-bold text-foreground">₹{(item.price / 100).toFixed(2)}</span>
            
            {/* Conditional rendering: Stepper if in cart, Add button otherwise */}
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
                  <Button 
                    onClick={handleAddToCart}
                    size="sm"
                    className="rounded-[5px] px-6 font-semibold bg-neutral-700 text-white hover:bg-black transition-colors"
                  >
                    Add to Bag
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const Menu = () => {
  const { data: menuData = [], isLoading: loading, error: queryError } = useMenuData();
  const error = queryError?.message || null;
  const { t } = useLanguage();
  
  // Store status state
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

  // Filter state
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

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

  // Filter items function
  const filterItems = (items: MenuItem[]) => {
    return items.filter(item => {
      // Brand filter
      if (selectedBrand !== "all" && item.brand !== selectedBrand) {
        return false;
      }
      
      const priceVal = item.price / 100; // in Rupees
      
      // Preset Price Range filter
      if (priceRange === "under10k" && priceVal > 10000) return false;
      if (priceRange === "10k-25k" && (priceVal < 10000 || priceVal > 25000)) return false;
      if (priceRange === "25k-50k" && (priceVal < 25000 || priceVal > 50000)) return false;
      if (priceRange === "above50k" && priceVal < 50000) return false;
      
      // Custom Min/Max price filter
      if (minPrice !== "" && !isNaN(parseFloat(minPrice)) && priceVal < parseFloat(minPrice)) return false;
      if (maxPrice !== "" && !isNaN(parseFloat(maxPrice)) && priceVal > parseFloat(maxPrice)) return false;

      return true;
    });
  };

  const isFilterActive = selectedBrand !== "all" || priceRange !== "all" || minPrice !== "" || maxPrice !== "";

  const resetFilters = () => {
    setSelectedBrand("all");
    setPriceRange("all");
    setMinPrice("");
    setMaxPrice("");
  };

  // Tabs: use categories from menuData
  const tabs = menuData
    .filter(category => category.items && category.items.length > 0)
    .map((category, index) => ({
      category,
      filteredItems: filterItems(category.items),
      key: `${category.name}-${index}`,
      value: `category-${index}`,
    }));
  const defaultTab = tabs[0]?.value || "menu";

  return (
    <div className="min-h-screen pt-16">
      {/* Menu Content */}
      <section className="py-8 px-4 max-w-7xl mx-auto menu-page-section">
        {loading ? (
          <div className="text-center py-20 text-xl">{t('common.loading')}</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[5px] bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </div>
                
                {/* Brand Filter */}
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-neutral-500" />
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="text-sm rounded-[5px] border border-neutral-300 dark:border-neutral-700 bg-background text-foreground px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors cursor-pointer"
                  >
                    <option value="all">All Brands</option>
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div className="flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-neutral-500" />
                  <select
                    value={priceRange}
                    onChange={(e) => {
                      setPriceRange(e.target.value);
                      if (e.target.value !== "custom") {
                        setMinPrice("");
                        setMaxPrice("");
                      }
                    }}
                    className="text-sm rounded-[5px] border border-neutral-300 dark:border-neutral-700 bg-background text-foreground px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors cursor-pointer"
                  >
                    <option value="all">All Prices</option>
                    <option value="under10k">Under ₹10,000</option>
                    <option value="10k-25k">₹10,000 - ₹25,000</option>
                    <option value="25k-50k">₹25,000 - ₹50,000</option>
                    <option value="above50k">Above ₹50,000</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {/* Custom Min/Max Inputs */}
                {priceRange === "custom" && (
                  <div className="flex items-center gap-2 animate-in fade-in-0 duration-200">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-24 text-sm rounded-[5px] border border-neutral-300 dark:border-neutral-700 bg-background text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <span className="text-xs text-neutral-400">-</span>
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-24 text-sm rounded-[5px] border border-neutral-300 dark:border-neutral-700 bg-background text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                )}
              </div>

              {/* Reset Button */}
              {isFilterActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:bg-black hover:text-white rounded-[5px] self-start md:self-auto transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Reset Filters
                </Button>
              )}
            </div>

            {/* Category Tabs */}
            <Tabs defaultValue={defaultTab} className="space-y-8">
              <TabsList className="inline-flex w-full justify-start overflow-x-auto bg-transparent border-none md:flex-wrap gap-2 md:gap-3 p-1.5 mb-2 scrollbar-hide min-h-[48px] items-center">
                {tabs.map(({ key, value, category }) => (
                  <TabsTrigger 
                    key={key} 
                    value={value} 
                    className="rounded-[5px] px-6 py-2.5 text-sm font-medium border border-neutral-300 dark:border-neutral-700 bg-card text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:bg-black hover:text-white hover:border-black data-[state=active]:bg-neutral-800 data-[state=active]:text-white data-[state=active]:border-neutral-800 data-[state=active]:shadow-sm whitespace-nowrap flex-shrink-0 cursor-pointer"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map(({ key, value, category, filteredItems }) => (
                <TabsContent key={key} value={value} className="space-y-8">
                  <MenuSection items={filteredItems} title={category.name} isStoreClosed={isStoreClosed} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </section>
    </div>
  );
};

export default Menu;
