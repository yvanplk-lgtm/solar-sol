import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";

interface MediaItem {
  id: string;
  type: "photo" | "video";
  url: string;
  thumbnail?: string;
}

export const Gallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const savedMedia = localStorage.getItem("gallery-media");
    if (savedMedia) {
      setMediaItems(JSON.parse(savedMedia));
    }
  }, []);

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
            <Card key={item.id} className="overflow-hidden group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <div className="relative aspect-video">
                {item.type === "photo" ? (
                  <img
                    src={item.url}
                    alt="Galerie"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <>
                    <img
                      src={item.thumbnail || item.url}
                      alt="Vidéo"
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
      </div>
    </section>
  );
};
