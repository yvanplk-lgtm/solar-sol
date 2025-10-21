import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Plus } from "lucide-react";
import { ClientsTab } from "@/components/invoice/ClientsTab";
import { ProductsTab } from "@/components/invoice/ProductsTab";
import { InvoicesTab } from "@/components/invoice/InvoicesTab";
import { QuotesTab } from "@/components/invoice/QuotesTab";
import { Client, Product, Invoice } from "@/types/invoice";

const Invoices = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Invoice[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string>("");

  useEffect(() => {
    const savedClients = localStorage.getItem("invoice-clients");
    const savedProducts = localStorage.getItem("invoice-products");
    const savedInvoices = localStorage.getItem("invoice-invoices");
    const savedQuotes = localStorage.getItem("invoice-quotes");
    const savedLogo = localStorage.getItem("company-logo");

    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
    if (savedQuotes) setQuotes(JSON.parse(savedQuotes));
    if (savedLogo) setCompanyLogo(savedLogo);
  }, []);

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem("invoice-clients", JSON.stringify(newClients));
  };

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("invoice-products", JSON.stringify(newProducts));
  };

  const saveInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    localStorage.setItem("invoice-invoices", JSON.stringify(newInvoices));
  };

  const saveQuotes = (newQuotes: Invoice[]) => {
    setQuotes(newQuotes);
    localStorage.setItem("invoice-quotes", JSON.stringify(newQuotes));
  };

  const saveLogo = (logo: string) => {
    setCompanyLogo(logo);
    localStorage.setItem("company-logo", logo);
  };

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
            <ClientsTab clients={clients} onSave={saveClients} />
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab products={products} onSave={saveProducts} />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoicesTab
              invoices={invoices}
              clients={clients}
              products={products}
              onSave={saveInvoices}
              logo={companyLogo}
              onLogoChange={saveLogo}
            />
          </TabsContent>

          <TabsContent value="quotes">
            <QuotesTab
              quotes={quotes}
              clients={clients}
              products={products}
              onSave={saveQuotes}
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
