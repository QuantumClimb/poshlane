import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hi poshlane! I have a question about your products and would like some help."
    );
    window.open(`https://wa.me/919884050857?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleWhatsApp}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-[#4B35E8] to-[#6638FF] text-white flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(104,56,255,0.5)] hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Customer Support Chat"
      title="Contact Customer Support"
    >
      <MessageCircle className="w-5 h-5 text-white" />
    </button>
  );
};
