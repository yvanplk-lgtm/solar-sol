import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_type: "visitor" | "admin";
  message: string;
  created_at: string;
}

export const ChatManagement = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!selectedConv) return;

    const channel = supabase
      .channel(`admin_chat_${selectedConv.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${selectedConv.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConv]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadConversations = async () => {
    const { data } = await supabase
      .from("chat_conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (data) {
      setConversations(data);
    }
  };

  const loadMessages = async (convId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data as Message[]);
    }
  };

  const selectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    loadMessages(conv.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv || !user) return;

    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: selectedConv.id,
      sender_type: "admin",
      sender_id: user.id,
      message: newMessage.trim(),
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Message non envoyé",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
  };

  const closeConversation = async () => {
    if (!selectedConv) return;

    const { error } = await supabase
      .from("chat_conversations")
      .update({ status: "closed" })
      .eq("id", selectedConv.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de fermer la conversation",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Conversation fermée",
    });

    loadConversations();
    setSelectedConv(null);
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConv?.id === conv.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">
                    {conv.visitor_name || `Visiteur ${conv.visitor_id.slice(0, 8)}`}
                  </p>
                  <Badge variant={conv.status === "open" ? "default" : "secondary"}>
                    {conv.status === "open" ? "Ouvert" : "Fermé"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(conv.created_at).toLocaleDateString("fr-FR")} à{" "}
                  {new Date(conv.created_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {selectedConv
              ? selectedConv.visitor_name || `Visiteur ${selectedConv.visitor_id.slice(0, 8)}`
              : "Sélectionnez une conversation"}
          </CardTitle>
          {selectedConv && selectedConv.status === "open" && (
            <Button onClick={closeConversation} variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Fermer
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {selectedConv ? (
            <>
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_type === "admin" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.sender_type === "admin"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              {selectedConv.status === "open" && (
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre réponse..."
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Sélectionnez une conversation pour commencer
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
