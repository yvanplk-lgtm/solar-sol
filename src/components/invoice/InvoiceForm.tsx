import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { Invoice, InvoiceItem, Client, Product } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

interface InvoiceFormProps {
  type: "invoice" | "quote";
  clients: Client[];
  products: Product[];
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  initialInvoice?: Invoice;
}

export const InvoiceForm = ({ type, clients, products, onSave, onCancel, initialInvoice }: InvoiceFormProps) => {
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState(initialInvoice?.clientId || "");
  const [clientContact, setClientContact] = useState(initialInvoice?.clientContact || "");
  const [items, setItems] = useState<InvoiceItem[]>(initialInvoice?.items || []);
  const [labor, setLabor] = useState(initialInvoice?.labor || 0);
  const [discount, setDiscount] = useState(initialInvoice?.discount || 0);

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClientContact(client.contact);
    }
  };

  const handleAddItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setItems([...items, {
      productId: product.id,
      designation: product.designation,
      quantity: 1,
      unitPrice: product.unitPrice,
    }]);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const client = clients.find(c => c.id === selectedClientId);
    if (!client) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un article",
        variant: "destructive",
      });
      return;
    }

    const prefix = type === "invoice" ? "FAC" : "DEV";
    const number = initialInvoice?.number || `${prefix}-${String(Date.now()).slice(-4)}`;

    const invoice: Invoice = {
      id: initialInvoice?.id || Date.now().toString(),
      number,
      type,
      clientId: client.id,
      clientName: client.name,
      clientAddress: client.address,
      clientContact: clientContact || client.contact,
      items,
      labor,
      discount,
      date: new Date().toISOString(),
    };

    onSave(invoice);
    const isEdit = !!initialInvoice;
    toast({
      title: isEdit ? (type === "invoice" ? "Facture modifiée" : "Devis modifié") : (type === "invoice" ? "Facture créée" : "Devis créé"),
      description: `${type === "invoice" ? "La facture" : "Le devis"} ${number} a été ${isEdit ? "modifié" : "créé"} avec succès`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialInvoice 
            ? (type === "invoice" ? "Modifier la Facture" : "Modifier le Devis")
            : (type === "invoice" ? "Nouvelle Facture" : "Nouveau Devis")
          }
        </CardTitle>
        <CardDescription>Remplissez les informations</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={selectedClientId} onValueChange={handleClientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="clientContact">Contact</Label>
              <Input
                id="clientContact"
                type="text"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder="Numéro de téléphone ou email"
                disabled={!selectedClientId}
              />
            </div>
          </div>

          <div>
            <Label>Articles</Label>
            <div className="space-y-2">
              <Select onValueChange={handleAddItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter un article" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.designation} - {product.unitPrice.toLocaleString("fr-FR")} FCFA
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Désignation</TableHead>
                      <TableHead className="w-32">Quantité</TableHead>
                      <TableHead className="text-right">Prix Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.designation}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value))}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {item.unitPrice.toLocaleString("fr-FR")} FCFA
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.quantity * item.unitPrice).toLocaleString("fr-FR")} FCFA
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="labor">Main d'œuvre (FCFA)</Label>
              <Input
                id="labor"
                type="number"
                min="0"
                value={labor}
                onChange={(e) => setLabor(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="discount">Remise (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="hero">
              {initialInvoice 
                ? `Modifier ${type === "invoice" ? "la Facture" : "le Devis"}`
                : `Créer ${type === "invoice" ? "la Facture" : "le Devis"}`
              }
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
