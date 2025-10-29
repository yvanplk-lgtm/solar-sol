import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Users, Image, Video, FileText, Home, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { z } from "zod";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url?: string;
}

interface Partner {
  id: string;
  name: string;
  logo_url: string;
}

interface ContactInfo {
  id: string;
  address: string;
  phone: string;
  email: string;
  footer_text: string;
}

const teamMemberSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100, "Nom trop long"),
  role: z.string().trim().min(2, "Rôle trop court").max(100, "Rôle trop long"),
});

const partnerSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100, "Nom trop long"),
});

const contactSchema = z.object({
  address: z.string().trim().min(5, "Adresse trop courte").max(500, "Adresse trop longue"),
  phone: z.string().trim().min(8, "Téléphone invalide").max(20, "Téléphone trop long"),
  email: z.string().email("Email invalide").max(255, "Email trop long"),
  footer_text: z.string().trim().max(500, "Texte du pied de page trop long"),
});

const adminEmailSchema = z.object({
  email: z.string().email("Email invalide").max(255, "Email trop long"),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; email: string }>>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

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
      setLoading(false);
      
      // Load data
      loadTeamMembers();
      loadPartners();
      loadContactInfo();
      loadAdminUsers();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleMediaUpload = async (type: "photo" | "video", e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 5MB",
        });
        return;
      }

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

  const loadTeamMembers = async () => {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (data) {
      setTeamMembers(data);
    }
  };

  const handleAddTeamMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const photoFile = (formData.get("photo") as File);

    // Validate inputs
    try {
      teamMemberSchema.parse({ name, role });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: error.errors[0].message,
        });
        return;
      }
    }

    if (photoFile && photoFile.size > 0) {
      if (photoFile.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "Photo trop volumineuse",
          description: "La taille maximale est de 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        saveTeamMember(name, role, reader.result as string);
      };
      reader.readAsDataURL(photoFile);
    } else {
      saveTeamMember(name, role);
    }
    
    e.currentTarget.reset();
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
      loadTeamMembers();
    }
  };

  const deleteTeamMember = async (id: string) => {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Membre supprimé",
        description: "Le membre a été supprimé avec succès",
      });
      loadTeamMembers();
    }
  };

  const loadPartners = async () => {
    const { data } = await supabase
      .from("partners")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) {
      setPartners(data);
    }
  };

  const handleAddPartner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("partnerName") as string;
    const logo = formData.get("partnerLogo") as File;

    // Validate name
    try {
      partnerSchema.parse({ name });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: error.errors[0].message,
        });
        return;
      }
    }

    if (!logo || logo.size === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un logo",
        variant: "destructive",
      });
      return;
    }

    if (logo.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "Logo trop volumineux",
        description: "La taille maximale est de 5MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const logoUrl = reader.result as string;
      const { error } = await supabase.from("partners").insert({
        name,
        logo_url: logoUrl,
      });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le partenaire",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Partenaire ajouté",
          description: "Le partenaire a été ajouté avec succès",
        });
        loadPartners();
        e.currentTarget.reset();
      }
    };
    reader.readAsDataURL(logo);
  };

  const deletePartner = async (id: string) => {
    const { error } = await supabase
      .from("partners")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le partenaire",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Partenaire supprimé",
        description: "Le partenaire a été supprimé avec succès",
      });
      loadPartners();
    }
  };

  const loadContactInfo = async () => {
    const { data } = await supabase
      .from("contact_info")
      .select("*")
      .single();
    
    if (data) {
      setContactInfo(data);
    }
  };

  const handleUpdateContactInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const footer_text = formData.get("footer_text") as string;

    // Validate inputs
    try {
      contactSchema.parse({ address, phone, email, footer_text });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: error.errors[0].message,
        });
        return;
      }
    }

    if (!contactInfo?.id) {
      toast({
        title: "Erreur",
        description: "Informations de contact non chargées",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("contact_info")
      .update({
        address,
        phone,
        email,
        footer_text,
        updated_at: new Date().toISOString()
      })
      .eq("id", contactInfo.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Informations mises à jour",
        description: "Les informations de contact ont été modifiées avec succès",
      });
      loadContactInfo();
    }
  };

  const loadAdminUsers = async () => {
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesData) {
      // Note: We can only show user IDs here since auth.users is not accessible from client
      // In a production app, consider storing user emails in a profiles table
      setAdminUsers(rolesData.map(role => ({ id: role.user_id, email: role.user_id })));
    }
  };

  const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("adminEmail") as string;

    // Validate email
    try {
      adminEmailSchema.parse({ email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: error.errors[0].message,
        });
        return;
      }
    }

    // Use RPC query to find user and insert admin role
    const { error } = await (supabase.rpc as any)('add_admin_role', { user_email: email });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'administrateur. Vérifiez que l'utilisateur existe.",
      });
    } else {
      toast({
        title: "Administrateur ajouté",
        description: `${email} est maintenant administrateur`,
      });
      loadAdminUsers();
      e.currentTarget.reset();
    }
  };

  const handleRemoveAdmin = async (userId: string, email: string) => {
    // Prevent removing self
    if (userId === user?.id) {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Vous ne pouvez pas retirer vos propres droits d'administrateur",
      });
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "admin");

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer l'administrateur",
      });
    } else {
      toast({
        title: "Administrateur retiré",
        description: `${email} n'est plus administrateur`,
      });
      loadAdminUsers();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
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
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="media" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-5xl">
            <TabsTrigger value="media">Médias</TabsTrigger>
            <TabsTrigger value="team">Équipe</TabsTrigger>
            <TabsTrigger value="partners">Partenaires</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Ajouter une Photo
                  </CardTitle>
                  <CardDescription>Téléchargez des photos pour la galerie (max 5MB)</CardDescription>
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
                  <CardDescription>Téléchargez des vidéos pour la galerie (max 5MB)</CardDescription>
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

          <TabsContent value="team" className="space-y-4">
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
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Jean Dupont" 
                      required 
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle / Fonction</Label>
                    <Input 
                      id="role" 
                      name="role" 
                      placeholder="Directeur Technique" 
                      required 
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="photo">Photo (optionnel, max 5MB)</Label>
                    <Input id="photo" name="photo" type="file" accept="image/*" />
                  </div>
                  <Button type="submit" variant="hero">
                    Ajouter le Membre
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membres actuels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teamMembers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Aucun membre pour le moment</p>
                  ) : (
                    teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTeamMember(member.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un partenaire</CardTitle>
                <CardDescription>Gérez les logos de vos partenaires (max 5MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPartner} className="space-y-4">
                  <div>
                    <Label htmlFor="partnerName">Nom du partenaire</Label>
                    <Input
                      id="partnerName"
                      name="partnerName"
                      placeholder="Nom de l'entreprise"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerLogo">Logo</Label>
                    <Input
                      id="partnerLogo"
                      name="partnerLogo"
                      type="file"
                      accept="image/*"
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero">
                    Ajouter le partenaire
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partenaires actuels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {partners.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Aucun partenaire pour le moment</p>
                  ) : (
                    partners.map((partner) => (
                      <div key={partner.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <img 
                            src={partner.logo_url} 
                            alt={partner.name} 
                            className="h-12 w-12 object-contain"
                          />
                          <p className="font-medium">{partner.name}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePartner(partner.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informations de Contact</CardTitle>
                <CardDescription>Modifiez les informations de contact affichées sur le site</CardDescription>
              </CardHeader>
              <CardContent>
                {contactInfo && (
                  <form onSubmit={handleUpdateContactInfo} className="space-y-4">
                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={contactInfo.address}
                        placeholder="Abidjan, Côte d'Ivoire"
                        required
                        maxLength={500}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={contactInfo.phone}
                        placeholder="+225 XX XX XX XX XX"
                        required
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={contactInfo.email}
                        placeholder="contact@mhshs-ci.com"
                        required
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <Label htmlFor="footer_text">Texte du pied de page (factures et devis)</Label>
                      <Textarea
                        id="footer_text"
                        name="footer_text"
                        defaultValue={contactInfo.footer_text}
                        placeholder="Merci pour votre confiance"
                        maxLength={500}
                        rows={3}
                      />
                    </div>
                    <Button type="submit" variant="hero">
                      Mettre à jour
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Ajouter un administrateur
                </CardTitle>
                <CardDescription>Donnez les droits d'administrateur à un utilisateur existant</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div>
                    <Label htmlFor="adminEmail">Email de l'utilisateur</Label>
                    <Input
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      placeholder="utilisateur@example.com"
                      required
                      maxLength={255}
                    />
                  </div>
                  <Button type="submit" variant="hero">
                    Ajouter comme admin
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Administrateurs actuels</CardTitle>
                <CardDescription>Liste des utilisateurs ayant les droits d'administrateur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {adminUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Aucun administrateur</p>
                  ) : (
                    adminUsers.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium text-sm font-mono">{admin.email}</p>
                          {admin.id === user?.id && (
                            <p className="text-xs text-muted-foreground">(Vous)</p>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                          disabled={admin.id === user?.id}
                        >
                          Retirer
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
