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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          cart_id: number
          created_at: string
          id: number
          product_id: number
          product_option_id: number | null
          quantity: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          cart_id: number
          created_at?: string
          id?: number
          product_id: number
          product_option_id?: number | null
          quantity?: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          cart_id?: number
          created_at?: string
          id?: number
          product_id?: number
          product_option_id?: number | null
          quantity?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "shopping_carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_option_fkey"
            columns: ["product_option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: number
          order_id: number
          product_id: number
          product_name: string
          product_option_details: Json | null
          product_option_id: number | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          product_id: number
          product_name: string
          product_option_details?: Json | null
          product_option_id?: number | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          product_id?: number
          product_name?: string
          product_option_details?: Json | null
          product_option_id?: number | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_option_fkey"
            columns: ["product_option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          id: number
          new_status: string
          notes: string | null
          old_status: string | null
          order_id: number
          updated_by: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          new_status: string
          notes?: string | null
          old_status?: string | null
          order_id: number
          updated_by?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          new_status?: string
          notes?: string | null
          old_status?: string | null
          order_id?: number
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_admin_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          discount_amount: number | null
          id: number
          notes: string | null
          order_number: string
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: string
          shipping_amount: number | null
          shipping_city: string | null
          shipping_first_name: string
          shipping_last_name: string
          shipping_phone: string | null
          shipping_postal_code: string | null
          status: string
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          id?: number
          notes?: string | null
          order_number: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address: string
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_first_name: string
          shipping_last_name: string
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          status?: string
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          id?: number
          notes?: string | null
          order_number?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: string
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_first_name?: string
          shipping_last_name?: string
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number | null
          id: number
          image_url: string
          is_primary: boolean | null
          product_id: number
          product_option_id: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: number
          image_url: string
          is_primary?: boolean | null
          product_id: number
          product_option_id?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: number
          image_url?: string
          is_primary?: boolean | null
          product_id?: number
          product_option_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_option_fkey"
            columns: ["product_option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          additional_price: number | null
          created_at: string
          id: number
          is_available: boolean | null
          option_name: string
          option_value: string
          product_id: number
          sku: string | null
          stock_quantity: number | null
        }
        Insert: {
          additional_price?: number | null
          created_at?: string
          id?: number
          is_available?: boolean | null
          option_name: string
          option_value: string
          product_id: number
          sku?: string | null
          stock_quantity?: number | null
        }
        Update: {
          additional_price?: number | null
          created_at?: string
          id?: number
          is_available?: boolean | null
          option_name?: string
          option_value?: string
          product_id?: number
          sku?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_prices: {
        Row: {
          base_price: number
          cost_price: number | null
          created_at: string
          id: number
          is_on_sale: boolean | null
          product_id: number
          sale_end_date: string | null
          sale_price: number | null
          sale_start_date: string | null
        }
        Insert: {
          base_price: number
          cost_price?: number | null
          created_at?: string
          id?: number
          is_on_sale?: boolean | null
          product_id: number
          sale_end_date?: string | null
          sale_price?: number | null
          sale_start_date?: string | null
        }
        Update: {
          base_price?: number
          cost_price?: number | null
          created_at?: string
          id?: number
          is_on_sale?: boolean | null
          product_id?: number
          sale_end_date?: string | null
          sale_price?: number | null
          sale_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_prices_product_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: number | null
          created_at: string
          description: string | null
          dimensions: Json | null
          id: number
          is_active: boolean | null
          name: string
          short_description: string | null
          sku: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          brand?: string | null
          category_id?: number | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          id?: number
          is_active?: boolean | null
          name: string
          short_description?: string | null
          sku?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          brand?: string | null
          category_id?: number | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          id?: number
          is_active?: boolean | null
          name?: string
          short_description?: string | null
          sku?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_carts: {
        Row: {
          created_at: string
          id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "shopping_carts_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          created_at: string
          first_name: string | null
          id: number
          last_name: string | null
          role: string | null
          telephone: string | null
          userId: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          role?: string | null
          telephone?: string | null
          userId?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          role?: string | null
          telephone?: string | null
          userId?: string | null
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
