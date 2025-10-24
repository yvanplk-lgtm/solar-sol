import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export const Contact = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "Abidjan, Côte d'Ivoire",
    phone: "+225 XX XX XX XX XX",
    email: "contact@mhshs-ci.com"
  });

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    const { data } = await supabase
      .from("contact_info")
      .select("*")
      .single();
    
    if (data) {
      setContactInfo({
        address: data.address,
        phone: data.phone,
        email: data.email
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Contactez-Nous</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Parlons de votre projet solaire
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Adresse</h3>
                  <p className="text-muted-foreground">{contactInfo.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Téléphone</h3>
                  <p className="text-muted-foreground">{contactInfo.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-muted-foreground">{contactInfo.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input placeholder="Votre nom" required />
                </div>
                <div>
                  <Input type="email" placeholder="Votre email" required />
                </div>
                <div>
                  <Input type="tel" placeholder="Votre téléphone" />
                </div>
                <div>
                  <Textarea placeholder="Votre message" rows={5} required />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  Envoyer le Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
