import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
}

export const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  const loadPartners = async () => {
    const { data } = await supabase
      .from("partners")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) {
      setPartners(data);
    }
  };

  if (partners.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Nos Partenaires</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ils nous font confiance
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {partners.map((partner) => (
              <CarouselItem key={partner.id} className="md:basis-1/3 lg:basis-1/4">
                <div className="p-4 flex items-center justify-center h-32">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
