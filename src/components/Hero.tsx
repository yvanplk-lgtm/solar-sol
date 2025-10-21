import { Button } from "@/components/ui/button";
import { Sun, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-solar.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-primary/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6">
            <Sun className="w-5 h-5 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Solutions Solaires en Côte d'Ivoire</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 max-w-4xl mx-auto leading-tight">
            L'Énergie Solaire au Service de Votre Développement
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            MHSHS-CI SARL, votre partenaire de confiance pour les installations solaires clé en main
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="group">
              Nos Services
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="bg-background/20 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/30">
              Nous Contacter
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          {[
            { number: "100+", label: "Projets Réalisés" },
            { number: "50+", label: "Clients Satisfaits" },
            { number: "24/7", label: "Support Client" },
          ].map((stat) => (
            <div key={stat.label} className="bg-background/10 backdrop-blur-md rounded-lg p-6 border border-primary-foreground/20">
              <div className="text-4xl font-bold text-primary-foreground mb-2">{stat.number}</div>
              <div className="text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
        </div>
      </div>
    </section>
  );
};
