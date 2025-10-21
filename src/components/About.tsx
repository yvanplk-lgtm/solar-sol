import { Card, CardContent } from "@/components/ui/card";
import { Target, Award, Users, Leaf } from "lucide-react";

export const About = () => {
  const values = [
    {
      icon: Target,
      title: "Notre Mission",
      description: "Rendre l'énergie solaire accessible à tous en Côte d'Ivoire",
    },
    {
      icon: Award,
      title: "Expertise Locale",
      description: "Solutions adaptées au climat ivoirien et aux besoins réels",
    },
    {
      icon: Users,
      title: "Impact Social",
      description: "Contribuer à l'électrification et l'accès à l'eau dans les villages",
    },
    {
      icon: Leaf,
      title: "Développement Durable",
      description: "Énergie propre pour une croissance responsable",
    },
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">À Propos de MHSHS-CI</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Acteur fiable et innovant des solutions solaires en Côte d'Ivoire
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title} className="border-2 hover:border-primary transition-colors duration-300">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-secondary to-primary rounded-2xl p-8 md:p-12 text-primary-foreground">
          <div className="max-w-3xl">
            <h3 className="text-3xl font-bold mb-4">Notre Engagement</h3>
            <p className="text-lg mb-6 opacity-90">
              MHSHS-CI SARL se positionne comme partenaire de confiance pour la transition énergétique. 
              Nous offrons des solutions clé en main couvrant la conception, l'installation et la maintenance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold mb-1">✓ Proximité</div>
                <p className="text-sm opacity-80">Entreprise locale, réactivité immédiate</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">✓ Qualité</div>
                <p className="text-sm opacity-80">Équipements certifiés, garantie long terme</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">✓ Innovation</div>
                <p className="text-sm opacity-80">Solutions évolutives à faible coût</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
