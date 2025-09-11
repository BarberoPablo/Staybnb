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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          category: Database["public"]["Enums"]["amenity_category"]
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["amenity_category"]
          created_at?: string | null
          id?: never
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["amenity_category"]
          created_at?: string | null
          id?: never
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: number
          listing_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          listing_id?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          listing_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_amenities: {
        Row: {
          amenity_id: number
          listing_id: number
        }
        Insert: {
          amenity_id: number
          listing_id: number
        }
        Update: {
          amenity_id?: number
          listing_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "listing_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_amenities_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          check_in_time: string
          check_out_time: string
          created_at: string | null
          description: string
          guest_limits: Json
          host_id: string
          id: number
          images: string[]
          location: Json
          min_cancel_days: number
          night_price: number
          privacy_type: Database["public"]["Enums"]["privacy_type"]
          promotions: Json
          property_type: Database["public"]["Enums"]["property_type"]
          safety_items: string[]
          score: Json
          status: Database["public"]["Enums"]["listing_status"]
          structure: Json
          title: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string
          created_at?: string | null
          description: string
          guest_limits: Json
          host_id: string
          id?: number
          images: string[]
          location: Json
          min_cancel_days?: number
          night_price: number
          privacy_type?: Database["public"]["Enums"]["privacy_type"]
          promotions: Json
          property_type: Database["public"]["Enums"]["property_type"]
          safety_items?: string[]
          score: Json
          status?: Database["public"]["Enums"]["listing_status"]
          structure: Json
          title: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string
          created_at?: string | null
          description?: string
          guest_limits?: Json
          host_id?: string
          id?: number
          images?: string[]
          location?: Json
          min_cancel_days?: number
          night_price?: number
          privacy_type?: Database["public"]["Enums"]["privacy_type"]
          promotions?: Json
          property_type?: Database["public"]["Enums"]["property_type"]
          safety_items?: string[]
          score?: Json
          status?: Database["public"]["Enums"]["listing_status"]
          structure?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          canceled_at: string | null
          created_at: string | null
          discount: number | null
          discount_percentage: number | null
          end_date: string
          guests: Json
          id: string
          listing_id: number
          night_price: number
          start_date: string
          status: Database["public"]["Enums"]["reservation_status"]
          total_nights: number
          total_price: number
          user_id: string
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string | null
          discount?: number | null
          discount_percentage?: number | null
          end_date: string
          guests: Json
          id?: string
          listing_id: number
          night_price: number
          start_date: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_nights: number
          total_price: number
          user_id: string
        }
        Update: {
          canceled_at?: string | null
          created_at?: string | null
          discount?: number | null
          discount_percentage?: number | null
          end_date?: string
          guests?: Json
          id?: string
          listing_id?: number
          night_price?: number
          start_date?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_nights?: number
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_listing"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      amenity_category:
        | "general"
        | "kitchen"
        | "dining"
        | "bedroom"
        | "bathroom"
        | "entertainment"
        | "security"
        | "activities"
      listing_status: "draft" | "published" | "paused" | "pending"
      privacy_type: "Entire" | "Private" | "Shared"
      property_type: "House" | "Apartment" | "Cabin" | "Boat"
      reservation_status:
        | "upcoming"
        | "completed"
        | "canceled"
        | "canceled_by_host"
      user_role: "user" | "admin"
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
      amenity_category: [
        "general",
        "kitchen",
        "dining",
        "bedroom",
        "bathroom",
        "entertainment",
        "security",
        "activities",
      ],
      listing_status: ["draft", "published", "paused", "pending"],
      privacy_type: ["Entire", "Private", "Shared"],
      property_type: ["House", "Apartment", "Cabin", "Boat"],
      reservation_status: [
        "upcoming",
        "completed",
        "canceled",
        "canceled_by_host",
      ],
      user_role: ["user", "admin"],
    },
  },
} as const
