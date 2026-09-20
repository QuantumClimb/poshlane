import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import useCartStore from '../stores/cartStore';
import { CartItem } from '../types/cart';
import { MenuItemImage } from './MenuItemImage';
import { useLanguage } from '../contexts/LanguageContext';

interface CartDrawerProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CartItemComponentProps {
  item: CartItem;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({ 
  item
}) => {
  const { updateQuantity, removeItem } = useCartStore();
  const { t } = useLanguage();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(item.quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(item.quantity - 1);
  };

  return (
    <div className="flex items-start space-x-3 p-3 border rounded-lg">
      <MenuItemImage 
        menuItem={item.menuItem}
        size="small"
        className="rounded-md"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{item.menuItem.name}</h4>
        <p className="text-xs text-muted-foreground mb-2">₹{(item.menuItem.price / 100).toFixed(2)} {t('cart.each')}</p>
        
        {item.customization && (
          <div className="space-y-1 mb-2">
            {item.customization.extras && item.customization.extras.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.customization.extras.map((extra, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {extra}
                  </Badge>
                ))}
              </div>
            )}
            {item.customization.specialInstructions && (
              <p className="text-xs text-muted-foreground italic">
                "{item.customization.specialInstructions}"
              </p>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={handleDecrement}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="h-6 w-12 text-center text-xs p-1"
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={handleIncrement}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-medium text-sm">₹{(item.totalPrice / 100).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 mt-1 text-destructive hover:text-destructive"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}) => {
  const [open, setOpen] = useState(controlledOpen ?? false);
  const { items, total, itemCount, clearCart } = useCartStore();
  const { t } = useLanguage();
  
  useEffect(() => {
    if (typeof controlledOpen === 'boolean') setOpen(controlledOpen);
  }, [controlledOpen]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    controlledOnOpenChange?.(nextOpen);
  };

  const handleWhatsAppBooking = () => {
    const itemList = items
      .map((item) => {
        let name = item.menuItem.name;
        if (item.customization?.specialInstructions) {
          name += ` (${item.customization.specialInstructions})`;
        }
        return `${item.quantity} x ${name}`;
      })
      .join('\n');
    
    const grandTotal = total / 100 + 2.50;
    
    const message = encodeURIComponent(
      `Hi poshlane! I would like to book the following items:\n\n` +
      `${itemList}\n\n` +
      `Subtotal: ₹${(total / 100).toFixed(2)}\n` +
      `Delivery Fee: ₹2.50\n` +
      `Total: ₹${grandTotal.toFixed(2)}\n\n` +
      `Please let me know the next steps for payment and delivery address. Thank you!`
    );
    
    window.open(`https://wa.me/919884050857?text=${message}`, '_blank');
    setOpen(false);
  };

  const defaultTrigger = (
    <button className="relative p-2 text-white/80 hover:text-white transition-colors" title="Shopping Bag">
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute top-1 right-1 bg-[#6838FF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );

  return (
  <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-[#11141A] border-l border-white/10 text-white">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between text-white">
            <span>{t('cart.title')} ({itemCount} {t('cart.items')})</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 hover:bg-white/5"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {t('cart.clear')}
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-8rem)] mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#9BA1B0] mb-4" />
                <p className="text-[#9BA1B0] text-sm">{t('cart.emptyCart')}</p>
                <p className="text-xs text-[#9BA1B0]/70 mt-1">
                  {t('cart.emptyCartMessage')}
                </p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6 overflow-y-auto">
                <div className="space-y-3 py-4">
                  {items.map((item) => (
                    <CartItemComponent 
                      key={item.id} 
                      item={item}
                    />
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t border-white/10 pt-4 space-y-4 flex-shrink-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#9BA1B0]">
                    <span>{t('cart.subtotal')} ({itemCount} {t('cart.items')})</span>
                    <span className="text-white font-medium">₹{(total / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#9BA1B0]">
                    <span>{t('cart.deliveryFee')}</span>
                    <span className="text-white font-medium">₹2.50</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between font-bold text-base text-white pt-1">
                    <span>{t('cart.total')}</span>
                    <span className="text-[#6838FF]">₹{(total / 100 + 2.50).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleWhatsAppBooking}
                    className="w-full h-11 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#4B35E8] to-[#6638FF] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(104,56,255,0.4)]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('cart.bookViaWhatsApp')}</span>
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full h-10 rounded-lg text-xs font-medium text-[#9BA1B0] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    {t('cart.continueShopping')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};