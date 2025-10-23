import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url?: string;
}

export const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (data && data.length > 0) {
      setTeamMembers(data);
    } else {
      // Default team members if none exist
      setTeamMembers([
        { id: "1", name: "Direction Générale", role: "Gestion & Stratégie" },
        { id: "2", name: "Équipe Technique", role: "Installation & Maintenance" },
        { id: "3", name: "Service Commercial", role: "Conseil & Ventes" },
      ]);
    }
  };

  return (
    <section id="team" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Notre Équipe</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des professionnels dévoués à votre service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <Card key={member.id} className="text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardContent className="p-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.photo_url} alt={member.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl">
                    {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
