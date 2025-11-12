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

interface Invoice {
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

interface InvoicesTabProps {
  logo: string;
  onLogoChange: (logo: string) => void;
}

export const InvoicesTab = ({ logo, onLogoChange }: InvoicesTabProps) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [invoicesRes, clientsRes, productsRes] = await Promise.all([
      supabase.from("invoices").select("*").eq("type", "invoice").order("created_at", { ascending: false }),
      supabase.from("clients").select("*"),
      supabase.from("products").select("*"),
    ]);

    if (invoicesRes.data) setInvoices(invoicesRes.data);
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

  const handleCreateInvoice = async (invoice: any) => {
    const invoiceData = {
      number: invoice.number,
      type: "invoice",
      client_id: invoice.clientId,
      client_name: invoice.clientName,
      client_address: invoice.clientAddress,
      client_contact: invoice.clientContact,
      items: invoice.items,
      labor: invoice.labor,
      discount: invoice.discount,
      date: invoice.date,
      logo: logo,
    };

    let error;
    if (editingInvoice) {
      const result = await supabase
        .from("invoices")
        .update(invoiceData)
        .eq("id", editingInvoice.id);
      error = result.error;
    } else {
      const result = await supabase.from("invoices").insert(invoiceData);
      error = result.error;
    }

    if (error) {
      toast({
        title: "Erreur",
        description: editingInvoice ? "Impossible de modifier la facture" : "Impossible de créer la facture",
        variant: "destructive",
      });
    } else {
      toast({
        title: editingInvoice ? "Facture modifiée" : "Facture créée",
        description: editingInvoice ? "La facture a été modifiée avec succès" : "La facture a été créée avec succès",
      });
      setShowForm(false);
      setEditingInvoice(null);
      loadData();
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    const displayInvoice = {
      id: invoice.id,
      number: invoice.number,
      type: "invoice",
      clientId: invoice.client_id,
      clientName: invoice.client_name,
      clientAddress: invoice.client_address,
      clientContact: invoice.client_contact,
      items: invoice.items,
      labor: invoice.labor,
      discount: invoice.discount,
      date: invoice.date,
      logo: invoice.logo || logo,
    };
    setEditingInvoice(displayInvoice);
    setShowForm(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Convert database format to display format
    const displayInvoice = {
      id: invoice.id,
      number: invoice.number,
      type: "invoice",
      clientId: invoice.client_id,
      clientName: invoice.client_name,
      clientAddress: invoice.client_address,
      clientContact: invoice.client_contact,
      items: invoice.items,
      labor: invoice.labor,
      discount: invoice.discount,
      date: invoice.date,
      logo: invoice.logo || logo,
    };
    setSelectedInvoice(displayInvoice);
    setShowPreview(true);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

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
          <Button onClick={() => { setShowForm(!showForm); setEditingInvoice(null); }} variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Facture
          </Button>
        </div>
      </div>

      {showForm && (
        <InvoiceForm
          type="invoice"
          clients={clients.map(c => ({ ...c, unitPrice: 0 }))}
          products={products.map(p => ({ ...p, unitPrice: p.unit_price }))}
          onSave={handleCreateInvoice}
          onCancel={() => { setShowForm(false); setEditingInvoice(null); }}
          initialInvoice={editingInvoice}
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
                const items = invoice.items || [];
                const calc = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
                const totalAfterLabor = calc + (invoice.labor || 0);
                const afterDiscount = totalAfterLabor - (totalAfterLabor * (invoice.discount || 0) / 100);
                const total = afterDiscount + (afterDiscount * 0.02);
                
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.client_name}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right">{total.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditInvoice(invoice)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
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
