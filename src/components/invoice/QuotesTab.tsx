import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Upload, Pencil } from "lucide-react";
import { InvoiceForm } from "./InvoiceForm";
import { InvoicePreview } from "./InvoicePreview";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  name: string;
  address: string;
  contact: string;
  email: string;
}

interface Product {
  id: string;
  designation: string;
  unit_price: number;
}

interface Quote {
  id: string;
  number: string;
  type: string;
  client_id: string;
  client_name: string;
  client_address: string;
  client_contact: string;
  items: any;
  labor: number;
  discount: number;
  date: string;
  logo?: string;
}

interface QuotesTabProps {
  logo: string;
  onLogoChange: (logo: string) => void;
}

export const QuotesTab = ({ logo, onLogoChange }: QuotesTabProps) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [quotesRes, clientsRes, productsRes] = await Promise.all([
      supabase.from("invoices").select("*").eq("type", "quote").order("created_at", { ascending: false }),
      supabase.from("clients").select("*"),
      supabase.from("products").select("*"),
    ]);

    if (quotesRes.data) setQuotes(quotesRes.data);
    if (clientsRes.data) setClients(clientsRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    setLoading(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateQuote = async (quote: any) => {
    const quoteData = {
      number: quote.number,
      type: "quote",
      client_id: quote.clientId,
      client_name: quote.clientName,
      client_address: quote.clientAddress,
      client_contact: quote.clientContact,
      items: quote.items,
      labor: quote.labor,
      discount: quote.discount,
      date: quote.date,
      logo: logo,
    };

    let error;
    if (editingQuote) {
      const result = await supabase
        .from("invoices")
        .update(quoteData)
        .eq("id", editingQuote.id);
      error = result.error;
    } else {
      const result = await supabase.from("invoices").insert(quoteData);
      error = result.error;
    }

    if (error) {
      toast({
        title: "Erreur",
        description: editingQuote ? "Impossible de modifier le devis" : "Impossible de créer le devis",
        variant: "destructive",
      });
    } else {
      toast({
        title: editingQuote ? "Devis modifié" : "Devis créé",
        description: editingQuote ? "Le devis a été modifié avec succès" : "Le devis a été créé avec succès",
      });
      setShowForm(false);
      setEditingQuote(null);
      loadData();
    }
  };

  const handleEditQuote = (quote: Quote) => {
    const displayQuote = {
      id: quote.id,
      number: quote.number,
      type: "quote",
      clientId: quote.client_id,
      clientName: quote.client_name,
      clientAddress: quote.client_address,
      clientContact: quote.client_contact,
      items: quote.items,
      labor: quote.labor,
      discount: quote.discount,
      date: quote.date,
      logo: quote.logo || logo,
    };
    setEditingQuote(displayQuote);
    setShowForm(true);
  };

  const handleViewQuote = (quote: Quote) => {
    // Convert database format to display format
    const displayQuote = {
      id: quote.id,
      number: quote.number,
      type: "quote",
      clientId: quote.client_id,
      clientName: quote.client_name,
      clientAddress: quote.client_address,
      clientContact: quote.client_contact,
      items: quote.items,
      labor: quote.labor,
      discount: quote.discount,
      date: quote.date,
      logo: quote.logo || logo,
    };
    setSelectedQuote(displayQuote);
    setShowPreview(true);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Devis</h2>
        <div className="flex gap-2">
          <Label htmlFor="logo-upload-quote" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
              <Upload className="w-4 h-4" />
              Logo Entreprise
            </div>
            <Input
              id="logo-upload-quote"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </Label>
          <Button onClick={() => { setShowForm(!showForm); setEditingQuote(null); }} variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Devis
          </Button>
        </div>
      </div>

      {showForm && (
        <InvoiceForm
          type="quote"
          clients={clients.map(c => ({ ...c, unitPrice: 0 }))}
          products={products.map(p => ({ ...p, unitPrice: p.unit_price }))}
          onSave={handleCreateQuote}
          onCancel={() => { setShowForm(false); setEditingQuote(null); }}
          initialInvoice={editingQuote}
        />
      )}

      {showPreview && selectedQuote && (
        <InvoicePreview
          invoice={selectedQuote}
          logo={logo}
          onClose={() => setShowPreview(false)}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des Devis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Montant TTC</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => {
                const items = quote.items || [];
                const calc = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
                const totalAfterLabor = calc + (quote.labor || 0);
                const afterDiscount = totalAfterLabor - (totalAfterLabor * (quote.discount || 0) / 100);
                const total = afterDiscount + (afterDiscount * 0.02);
                
                return (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.number}</TableCell>
                    <TableCell>{quote.client_name}</TableCell>
                    <TableCell>{new Date(quote.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right">{total.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuote(quote)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewQuote(quote)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
