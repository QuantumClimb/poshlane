
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShoppingCart, AlertCircle, Clock, X } from "lucide-react";
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
  
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-primary mb-8">{title}</h3>
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
        className="md:hidden flex flex-col rounded-xl bg-card border-border overflow-hidden group menu-item-card shadow-sm cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50/50 dark:bg-gray-900/20 p-4 flex items-center justify-center">
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
            <h4 className="text-sm font-semibold text-foreground dark:text-gray-200 line-clamp-1">{displayName}</h4>
            {item.brand && <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.brand}</p>}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow leading-relaxed">{displayDescription}</p>
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            <span className="text-sm font-bold text-foreground">₹{(item.price / 100).toFixed(2)}</span>
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Product Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
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
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
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
              <span className="text-2xl font-bold text-accent">₹{(item.price / 100).toFixed(2)}</span>
              {item.volume && (
                <span className="text-sm text-muted-foreground">{item.volume}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-foreground/80 dark:text-gray-300">{displayDescription}</p>
            </div>

            {/* Fragrance Details */}
            {(item.concentration || item.gender || item.fragranceFamily) && (
              <div className="space-y-2">
                <h4 className="font-semibold dark:text-white">Details</h4>
                {item.concentration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-gray-300">Concentration:</span>
                    <span className="font-medium dark:text-white">{item.concentration}</span>
                  </div>
                )}
                {item.gender && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-gray-300">Gender:</span>
                    <span className="font-medium dark:text-white">{item.gender}</span>
                  </div>
                )}
                {item.fragranceFamily && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-gray-300">Family:</span>
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
                    <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">Top Notes: </span>
                    <span className="text-sm dark:text-white">{item.topNotes}</span>
                  </div>
                )}
                {item.middleNotes && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">Middle Notes: </span>
                    <span className="text-sm dark:text-white">{item.middleNotes}</span>
                  </div>
                )}
                {item.baseNotes && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">Base Notes: </span>
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
                    className="w-full gap-2"
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
      <Card className="hidden md:flex flex-col rounded-2xl bg-card border-border overflow-hidden group menu-item-card shadow-sm hover:shadow-md transition-all duration-300">
        {/* Product Image */}
        <div 
          className="relative aspect-square overflow-hidden bg-gray-50/50 dark:bg-gray-900/20 p-8 flex items-center justify-center cursor-pointer" 
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
            <h4 className="text-lg font-semibold text-foreground dark:text-gray-200 line-clamp-1 hover:text-primary transition-colors">{displayName}</h4>
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
                    className="rounded-full px-6 font-semibold"
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

  // Tabs: use categories from menuData
  const tabs = menuData
    .filter(category => category.items && category.items.length > 0)
    .map((category, index) => ({
    category,
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
          <Tabs defaultValue={defaultTab} className="space-y-8">
            <TabsList className="inline-flex w-full justify-start overflow-x-auto bg-transparent border-none md:flex-wrap gap-2 md:gap-3 p-1 mb-2 scrollbar-hide">
              {tabs.map(({ key, value, category }) => (
                <TabsTrigger 
                  key={key} 
                  value={value} 
                  className="rounded-full px-6 py-2.5 text-sm font-medium border border-border/60 bg-card text-muted-foreground transition-all hover:bg-accent/5 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md whitespace-nowrap flex-shrink-0"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map(({ key, value, category }) => (
              <TabsContent key={key} value={value} className="space-y-8">
                <MenuSection items={category.items} title={category.name} isStoreClosed={isStoreClosed} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </section>
    </div>
  );
};

export default Menu;
