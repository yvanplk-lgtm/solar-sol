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

interface InvoicesTabProps {
  invoices: Invoice[];
  clients: Client[];
  products: Product[];
  onSave: (invoices: Invoice[]) => void;
  logo: string;
  onLogoChange: (logo: string) => void;
}

export const InvoicesTab = ({ invoices, clients, products, onSave, logo, onLogoChange }: InvoicesTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
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

  const handleCreateInvoice = (invoice: Invoice) => {
    onSave([...invoices, invoice]);
    setShowForm(false);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Factures</h2>
        <div className="flex gap-2">
          <Label htmlFor="logo-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
              <Upload className="w-4 h-4" />
              Logo Entreprise
            </div>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </Label>
          <Button onClick={() => setShowForm(!showForm)} variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Facture
          </Button>
        </div>
      </div>

      {showForm && (
        <InvoiceForm
          type="invoice"
          clients={clients}
          products={products}
          onSave={handleCreateInvoice}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showPreview && selectedInvoice && (
        <InvoicePreview
          invoice={selectedInvoice}
          logo={logo}
          onClose={() => setShowPreview(false)}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des Factures</CardTitle>
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
              {invoices.map((invoice) => {
                const calc = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
                const totalAfterLabor = calc + invoice.labor;
                const afterDiscount = totalAfterLabor - (totalAfterLabor * invoice.discount / 100);
                const total = afterDiscount + (afterDiscount * 0.02);
                
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right">{total.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
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
