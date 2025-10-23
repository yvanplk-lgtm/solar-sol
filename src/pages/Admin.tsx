import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Users, Image, Video, FileText, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, use proper authentication)
    if (password === "admin") {
      setIsLoggedIn(true);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'espace admin",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  const handleMediaUpload = async (type: "photo" | "video", e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const { error } = await supabase.from("gallery_items").insert({
          type,
          url: reader.result as string,
          title: file.name,
        });

        if (error) {
          toast({
            title: "Erreur",
            description: "Impossible d'ajouter le média",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Média ajouté",
            description: `${type === "photo" ? "Photo" : "Vidéo"} ajoutée avec succès`,
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleAddTeamMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const photoFile = (formData.get("photo") as File);

    if (!name || !role) return;

    if (photoFile && photoFile.size > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveTeamMember(name, role, reader.result as string);
      };
      reader.readAsDataURL(photoFile);
    } else {
      saveTeamMember(name, role);
    }
  };

  const saveTeamMember = async (name: string, role: string, photo?: string) => {
    const { error } = await supabase.from("team_members").insert({
      name,
      role,
      photo_url: photo,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Membre ajouté",
        description: "Membre de l'équipe ajouté avec succès",
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-primary p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Espace Admin</CardTitle>
            <CardDescription>Connectez-vous pour gérer le site</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                />
              </div>
              <Button type="submit" className="w-full" variant="hero">
                Se Connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Espace Admin - MHSHS-CI</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Retour au site
            </Button>
            <Button variant="outline" onClick={() => navigate("/invoices")}>
              <FileText className="w-4 h-4 mr-2" />
              Factures
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="media" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="media">Médias</TabsTrigger>
            <TabsTrigger value="team">Équipe</TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Ajouter une Photo
                  </CardTitle>
                  <CardDescription>Téléchargez des photos pour la galerie</CardDescription>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Cliquez pour sélectionner une photo</p>
                    </div>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleMediaUpload("photo", e)}
                    />
                  </Label>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Ajouter une Vidéo
                  </CardTitle>
                  <CardDescription>Téléchargez des vidéos pour la galerie</CardDescription>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="video-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Cliquez pour sélectionner une vidéo</p>
                    </div>
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleMediaUpload("video", e)}
                    />
                  </Label>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Ajouter un Membre de l'Équipe
                </CardTitle>
                <CardDescription>Ajoutez les membres de votre équipe</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTeamMember} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" name="name" placeholder="Jean Dupont" required />
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle / Fonction</Label>
                    <Input id="role" name="role" placeholder="Directeur Technique" required />
                  </div>
                  <div>
                    <Label htmlFor="photo">Photo (optionnel)</Label>
                    <Input id="photo" name="photo" type="file" accept="image/*" />
                  </div>
                  <Button type="submit" variant="hero">
                    Ajouter le Membre
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
