import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";
import { ClientsTab } from "@/components/invoice/ClientsTab";
import { ProductsTab } from "@/components/invoice/ProductsTab";
import { InvoicesTab } from "@/components/invoice/InvoicesTab";
import { QuotesTab } from "@/components/invoice/QuotesTab";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Invoices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions d'administrateur",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    loadCompanySettings();
  };

  const loadCompanySettings = async () => {
    const { data } = await supabase
      .from("company_settings")
      .select("logo")
      .single();
    
    if (data?.logo) {
      setCompanyLogo(data.logo);
    }
    setLoading(false);
  };

  const saveLogo = async (logo: string) => {
    setCompanyLogo(logo);
    
    const { data: settings } = await supabase
      .from("company_settings")
      .select("id")
      .single();
    
    if (settings) {
      await supabase
        .from("company_settings")
        .update({ logo, updated_at: new Date().toISOString() })
        .eq("id", settings.id);
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion Factures & Devis</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Retour au site
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
            <TabsTrigger value="quotes">Devis</TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientsTab />
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoicesTab
              logo={companyLogo}
              onLogoChange={saveLogo}
            />
          </TabsContent>

          <TabsContent value="quotes">
            <QuotesTab
              logo={companyLogo}
              onLogoChange={saveLogo}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Invoices;
