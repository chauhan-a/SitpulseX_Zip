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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_providers: {
        Row: {
          api_key: string
          created_at: string
          id: string
          is_active: boolean
          model_name: string | null
          provider_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          is_active?: boolean
          model_name?: string | null
          provider_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          is_active?: boolean
          model_name?: string | null
          provider_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          api_endpoint: string | null
          config: Json
          created_at: string | null
          id: string
          last_sync: string | null
          name: string
          status: Database["public"]["Enums"]["integration_status"] | null
          type: Database["public"]["Enums"]["integration_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_endpoint?: string | null
          config?: Json
          created_at?: string | null
          id?: string
          last_sync?: string | null
          name: string
          status?: Database["public"]["Enums"]["integration_status"] | null
          type: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_endpoint?: string | null
          config?: Json
          created_at?: string | null
          id?: string
          last_sync?: string | null
          name?: string
          status?: Database["public"]["Enums"]["integration_status"] | null
          type?: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      knowledge_articles: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      sites: {
        Row: {
          created_at: string | null
          details: Json | null
          equipment_count: number | null
          id: string
          last_maintenance: string | null
          location: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          equipment_count?: number | null
          id?: string
          last_maintenance?: string | null
          location?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          equipment_count?: number | null
          id?: string
          last_maintenance?: string | null
          location?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sops: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          description: string | null
          equipment_types: string[] | null
          id: string
          industry_standards: string[] | null
          safety_requirements: string[] | null
          status: string | null
          steps: Json | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_types?: string[] | null
          id?: string
          industry_standards?: string[] | null
          safety_requirements?: string[] | null
          status?: string | null
          steps?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_types?: string[] | null
          id?: string
          industry_standards?: string[] | null
          safety_requirements?: string[] | null
          status?: string | null
          steps?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          servicenow_id: string | null
          site_id: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          servicenow_id?: string | null
          site_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          servicenow_id?: string | null
          site_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
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
      integration_status: "connected" | "pending" | "disconnected" | "error"
      integration_type:
        | "servicenow"
        | "database"
        | "custom_app"
        | "ai_tool"
        | "scada"
        | "erp"
        | "cmms"
        | "communication"
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
    Enums: {
      integration_status: ["connected", "pending", "disconnected", "error"],
      integration_type: [
        "servicenow",
        "database",
        "custom_app",
        "ai_tool",
        "scada",
        "erp",
        "cmms",
        "communication",
      ],
    },
  },
} as const
