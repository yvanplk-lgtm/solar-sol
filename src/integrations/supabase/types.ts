export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          id: string
          password: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          password?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          password?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string
          contact: string
          created_at: string | null
          email: string
          id: string
          name: string
        }
        Insert: {
          address: string
          contact: string
          created_at?: string | null
          email: string
          id?: string
          name: string
        }
        Update: {
          address?: string
          contact?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          id: string
          logo: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          logo?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          logo?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string
          email: string
          id: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          address?: string
          email?: string
          id?: string
          phone?: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          email?: string
          id?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          type?: string
          url?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_address: string
          client_contact: string
          client_id: string | null
          client_name: string
          created_at: string | null
          date: string
          discount: number | null
          id: string
          items: Json
          labor: number | null
          logo: string | null
          number: string
          type: string
        }
        Insert: {
          client_address: string
          client_contact: string
          client_id?: string | null
          client_name: string
          created_at?: string | null
          date: string
          discount?: number | null
          id?: string
          items?: Json
          labor?: number | null
          logo?: string | null
          number: string
          type: string
        }
        Update: {
          client_address?: string
          client_contact?: string
          client_id?: string | null
          client_name?: string
          created_at?: string | null
          date?: string
          discount?: number | null
          id?: string
          items?: Json
          labor?: number | null
          logo?: string | null
          number?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          logo_url: string
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          logo_url: string
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          logo_url?: string
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          designation: string
          id: string
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          designation: string
          id?: string
          unit_price: number
        }
        Update: {
          created_at?: string | null
          designation?: string
          id?: string
          unit_price?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          id: string
          name: string
          photo_url: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          photo_url?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
