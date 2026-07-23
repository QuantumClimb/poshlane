
import { Link } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Brand */}
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              {/* Light Mode Logos */}
              <img 
                src="/logo.svg" 
                alt="poshlane Logo Mobile" 
                className="h-12 w-12 object-contain block md:hidden dark:hidden"
              />
              <img 
                src="/logo-desktop.svg" 
                alt="poshlane Logo Desktop" 
                className="h-12 w-auto max-w-[200px] object-contain hidden md:block dark:hidden"
              />
              {/* Dark Mode Logos */}
              <img 
                src="/logo-dark.svg" 
                alt="poshlane Logo Mobile Dark" 
                className="h-12 w-12 object-contain hidden dark:block dark:md:hidden"
              />
              <img 
                src="/logo-desktop-dark.svg" 
                alt="poshlane Logo Desktop Dark" 
                className="h-12 w-auto max-w-[200px] object-contain hidden dark:md:block"
              />
            </div>
            <p className="mb-6 max-w-md mx-auto md:mx-0 text-gray-600 dark:text-gray-500">
              {t('footer.aboutText')}
            </p>
            {/* Social media hidden for now */}
          </div>

          {/* Legal & Support Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li><Link to="/customer-support" className="text-gray-600 dark:text-gray-500 transition-colors hover:text-gray-900">{t('customerSupport.title')}</Link></li>
              <li><Link to="/terms-and-conditions" className="text-gray-600 dark:text-gray-500 transition-colors hover:text-gray-900">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 dark:text-gray-500 transition-colors hover:text-gray-900">{t('footer.privacy')}</Link></li>
              <li><Link to="/cancellation-refund" className="text-gray-600 dark:text-gray-500 transition-colors hover:text-gray-900">{t('footer.cancellation')}</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2025 poshlane. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {t('footer.poweredBy')}
          </p>
        </div>
      </div>
    </footer>
  );
};
