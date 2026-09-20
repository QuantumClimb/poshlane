import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Youtube, Facebook, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#08090C] border-t border-white/10 text-white pt-12 pb-8 mt-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid (5 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          
          {/* Column 1: Logo + Bio + Socials */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo-dark.svg"
                alt="poshlane Logo"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/logo-desktop.svg";
                }}
              />
            </Link>
            <p className="text-xs text-[#9BA1B0] leading-relaxed max-w-xs">
              Discover curated products at poshlane. A cleaner, smarter way to shop online.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-[#11141A] border border-white/10 flex items-center justify-center text-[#9BA1B0] hover:text-white hover:border-[#6838FF] transition-all">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#11141A] border border-white/10 flex items-center justify-center text-[#9BA1B0] hover:text-white hover:border-[#6838FF] transition-all">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#11141A] border border-white/10 flex items-center justify-center text-[#9BA1B0] hover:text-white hover:border-[#6838FF] transition-all">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#11141A] border border-white/10 flex items-center justify-center text-[#9BA1B0] hover:text-white hover:border-[#6838FF] transition-all">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#11141A] border border-white/10 flex items-center justify-center text-[#9BA1B0] hover:text-white hover:border-[#6838FF] transition-all">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-xs text-[#9BA1B0]">
              <li>
                <Link to="/?tab=all" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/?tab=electronics" className="hover:text-white transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/?tab=fragrances" className="hover:text-white transition-colors">Fragrances</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Help & Support</h4>
            <ul className="space-y-2 text-xs text-[#9BA1B0]">
              <li>
                <Link to="/customer-support" className="hover:text-white transition-colors">Customer Support</Link>
              </li>
              <li>
                <Link to="/customer-support" className="hover:text-white transition-colors">Shipping & Delivery</Link>
              </li>
              <li>
                <Link to="/cancellation-refund" className="hover:text-white transition-colors">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/customer-support" className="hover:text-white transition-colors">Track Order</Link>
              </li>
              <li>
                <Link to="/customer-support" className="hover:text-white transition-colors">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">About</h4>
            <ul className="space-y-2 text-xs text-[#9BA1B0]">
              <li>
                <Link to="/customer-support" className="hover:text-white transition-colors">About poshlane</Link>
              </li>
              <li>
                <Link to="/customer-support" className="hover:text-white transition-colors">Our Promise</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cancellation-refund" className="hover:text-white transition-colors">Cancellation & Refund</Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Get the latest updates</h4>
            <p className="text-xs text-[#9BA1B0]">
              New products, offers and more.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 pt-1">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#11141A] border border-white/10 rounded-md text-xs text-white px-3 py-2 flex-1 focus:outline-none focus:border-[#4B35E8]"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#4B35E8] to-[#6638FF] text-white p-2 rounded-md hover:brightness-110 transition-all flex items-center justify-center flex-shrink-0"
                title="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-emerald-400 font-medium">Thanks for subscribing!</p>
            )}
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9BA1B0]">
          <div>
            © 2025 poshlane. All rights reserved.
          </div>
          <div className="text-[11px] font-medium tracking-wider uppercase">
            Powered by <span className="text-white font-semibold">QUANTUM CLIMB</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
