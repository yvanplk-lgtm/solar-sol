import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const WhatsAppButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    loadWhatsAppNumber();
  }, []);

  const loadWhatsAppNumber = async () => {
    const { data } = await supabase
      .from("contact_info")
      .select("whatsapp")
      .maybeSingle();

    if (data?.whatsapp) {
      setWhatsappNumber(data.whatsapp);
    }
  };

  const handleWhatsAppClick = () => {
    const cleanNumber = whatsappNumber.replace(/\s+/g, "").replace(/\+/g, "");
    const url = `https://wa.me/${cleanNumber}`;
    window.open(url, "_blank");
  };

  if (!whatsappNumber) return null;

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg z-50 flex items-center justify-center transition-all duration-200 hover:scale-110"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="h-6 w-6" fill="currentColor" />
    </button>
  );
};
