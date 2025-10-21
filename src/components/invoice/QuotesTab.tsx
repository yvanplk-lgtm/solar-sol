import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Upload } from "lucide-react";
import { Invoice, Client, Product } from "@/types/invoice";
import { InvoiceForm } from "./InvoiceForm";
import { InvoicePreview } from "./InvoicePreview";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface QuotesTabProps {
  quotes: Invoice[];
  clients: Client[];
  products: Product[];
  onSave: (quotes: Invoice[]) => void;
  logo: string;
  onLogoChange: (logo: string) => void;
}

export const QuotesTab = ({ quotes, clients, products, onSave, logo, onLogoChange }: QuotesTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Invoice | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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

  const handleCreateQuote = (quote: Invoice) => {
    onSave([...quotes, quote]);
    setShowForm(false);
  };

  const handleViewQuote = (quote: Invoice) => {
    setSelectedQuote(quote);
    setShowPreview(true);
  };

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
          <Button onClick={() => setShowForm(!showForm)} variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Devis
          </Button>
        </div>
      </div>

      {showForm && (
        <InvoiceForm
          type="quote"
          clients={clients}
          products={products}
          onSave={handleCreateQuote}
          onCancel={() => setShowForm(false)}
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
                const calc = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
                const totalAfterLabor = calc + quote.labor;
                const afterDiscount = totalAfterLabor - (totalAfterLabor * quote.discount / 100);
                const total = afterDiscount + (afterDiscount * 0.02);
                
                return (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.number}</TableCell>
                    <TableCell>{quote.clientName}</TableCell>
                    <TableCell>{new Date(quote.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right">{total.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewQuote(quote)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
