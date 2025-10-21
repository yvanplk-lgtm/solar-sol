import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { Product } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

interface ProductsTabProps {
  products: Product[];
  onSave: (products: Product[]) => void;
}

export const ProductsTab = ({ products, onSave }: ProductsTabProps) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct: Product = {
      id: Date.now().toString(),
      designation: formData.get("designation") as string,
      unitPrice: parseFloat(formData.get("unitPrice") as string),
    };

    onSave([...products, newProduct]);
    setShowForm(false);
    toast({
      title: "Produit ajouté",
      description: "Le produit/service a été ajouté avec succès",
    });
    e.currentTarget.reset();
  };

  const handleDelete = (id: string) => {
    onSave(products.filter(p => p.id !== id));
    toast({
      title: "Produit supprimé",
      description: "Le produit/service a été supprimé",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Produits & Services</h2>
        <Button onClick={() => setShowForm(!showForm)} variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Produit
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un Produit/Service</CardTitle>
            <CardDescription>Remplissez les informations du produit ou service</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="designation">Désignation</Label>
                  <Input id="designation" name="designation" required />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Prix Unitaire HT (FCFA)</Label>
                  <Input id="unitPrice" name="unitPrice" type="number" min="0" step="0.01" required />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="hero">Ajouter</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits & Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Désignation</TableHead>
                <TableHead className="text-right">Prix Unitaire HT</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.designation}</TableCell>
                  <TableCell className="text-right">{product.unitPrice.toLocaleString("fr-FR")} FCFA</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
