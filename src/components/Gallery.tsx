import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MediaItem {
  id: string;
  type: "photo" | "video";
  url: string;
  title?: string;
}

export const Gallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setMediaItems(data as MediaItem[]);
    }
  };

  if (mediaItems.length === 0) {
    return (
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Galerie</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos réalisations
            </p>
          </div>
          <div className="text-center text-muted-foreground">
            Aucun média pour le moment. Connectez-vous à l'espace admin pour en ajouter.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Galerie</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos réalisations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <Card 
              key={item.id} 
              onClick={() => setSelectedMedia(item)}
              className="overflow-hidden group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300"
            >
              <div className="relative aspect-video">
                {item.type === "photo" ? (
                  <img
                    src={item.url}
                    alt="Galerie"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <>
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-0">
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-4 z-50 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>
            <div className="relative w-full min-h-[60vh] flex items-center justify-center p-4">
              {selectedMedia?.type === "photo" ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title || "Galerie"}
                  className="max-w-full max-h-[85vh] object-contain animate-scale-in"
                />
              ) : selectedMedia?.type === "video" ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] object-contain animate-scale-in"
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
