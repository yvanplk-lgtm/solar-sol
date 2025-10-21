import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { Client } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

interface ClientsTabProps {
  clients: Client[];
  onSave: (clients: Client[]) => void;
}

export const ClientsTab = ({ clients, onSave }: ClientsTabProps) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      contact: formData.get("contact") as string,
      email: formData.get("email") as string,
    };

    onSave([...clients, newClient]);
    setShowForm(false);
    toast({
      title: "Client ajouté",
      description: "Le client a été ajouté avec succès",
    });
    e.currentTarget.reset();
  };

  const handleDelete = (id: string) => {
    onSave(clients.filter(c => c.id !== id));
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Clients</h2>
        <Button onClick={() => setShowForm(!showForm)} variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un Client</CardTitle>
            <CardDescription>Remplissez les informations du client</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du client</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input id="contact" name="contact" required />
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" name="address" required />
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
          <CardTitle>Liste des Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.contact}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
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
