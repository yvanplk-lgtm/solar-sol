import { Sun } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Sun className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MHSHS-CI SARL</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm opacity-80">
              © 2025 MHSHS-CI SARL. Tous droits réservés.
            </p>
            <p className="text-sm opacity-80">
              Solutions solaires en Côte d'Ivoire
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
