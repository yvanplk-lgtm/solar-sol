import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Droplets, Zap } from "lucide-react";
import streetlampsImage from "@/assets/service-streetlamps.jpg";
import pumpingImage from "@/assets/service-pumping.jpg";
import photovoltaicImage from "@/assets/service-photovoltaic.jpg";

export const Services = () => {
  const services = [
    {
      icon: Lightbulb,
      title: "Lampadaires Solaires",
      description: "Éclairage public autonome pour collectivités, routes et villages",
      image: streetlampsImage,
      features: [
        "Installation clé en main",
        "Maintenance incluse",
        "Économies d'énergie garanties",
        "Sécurité accrue",
      ],
    },
    {
      icon: Droplets,
      title: "Pompage d'Eau Solaire",
      description: "Systèmes de pompage depuis forages pour zones rurales et agricoles",
      image: pumpingImage,
      features: [
        "Accès à l'eau potable",
        "Solutions hors réseau",
        "Fiabilité éprouvée",
        "Impact social positif",
      ],
    },
    {
      icon: Zap,
      title: "Installations Photovoltaïques",
      description: "Autonomie énergétique pour particuliers, entreprises et administrations",
      image: photovoltaicImage,
      features: [
        "Conception sur mesure",
        "Équipements certifiés",
        "Garantie long terme",
        "Transition énergétique",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Nos Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des solutions solaires complètes adaptées à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
