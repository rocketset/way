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
      case_content_blocks: {
        Row: {
          atualizado_em: string
          block_type: string
          case_id: string
          content: Json
          criado_em: string
          id: string
          position: number
        }
        Insert: {
          atualizado_em?: string
          block_type: string
          case_id: string
          content?: Json
          criado_em?: string
          id?: string
          position?: number
        }
        Update: {
          atualizado_em?: string
          block_type?: string
          case_id?: string
          content?: Json
          criado_em?: string
          id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "case_content_blocks_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_tags: {
        Row: {
          case_id: string
          tag_id: string
        }
        Insert: {
          case_id: string
          tag_id: string
        }
        Update: {
          case_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_tags_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          atualizado_em: string
          categoria_id: string | null
          criado_em: string
          descricao: string
          id: string
          imagem_url: string | null
          is_featured: boolean | null
          publicado: boolean | null
          titulo: string
        }
        Insert: {
          atualizado_em?: string
          categoria_id?: string | null
          criado_em?: string
          descricao: string
          id?: string
          imagem_url?: string | null
          is_featured?: boolean | null
          publicado?: boolean | null
          titulo: string
        }
        Update: {
          atualizado_em?: string
          categoria_id?: string | null
          criado_em?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          is_featured?: boolean | null
          publicado?: boolean | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          criado_em: string
          email: string
          empresa: string | null
          id: string
          lido: boolean | null
          mensagem: string
          nome: string
          telefone: string | null
        }
        Insert: {
          criado_em?: string
          email: string
          empresa?: string | null
          id?: string
          lido?: boolean | null
          mensagem: string
          nome: string
          telefone?: string | null
        }
        Update: {
          criado_em?: string
          email?: string
          empresa?: string | null
          id?: string
          lido?: boolean | null
          mensagem?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          atualizado_em: string
          caption: string | null
          criado_em: string
          file_path: string
          file_size: number
          filename: string
          height: number | null
          id: string
          metadata: Json | null
          mime_type: string
          original_filename: string
          user_id: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          atualizado_em?: string
          caption?: string | null
          criado_em?: string
          file_path: string
          file_size: number
          filename: string
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type: string
          original_filename: string
          user_id?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          atualizado_em?: string
          caption?: string | null
          criado_em?: string
          file_path?: string
          file_size?: number
          filename?: string
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          user_id?: string | null
          width?: number | null
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          criado_em: string
          id: string
          option_ids: Json
          poll_id: string
          user_id: string | null
          voter_fingerprint: string | null
        }
        Insert: {
          criado_em?: string
          id?: string
          option_ids: Json
          poll_id: string
          user_id?: string | null
          voter_fingerprint?: string | null
        }
        Update: {
          criado_em?: string
          id?: string
          option_ids?: Json
          poll_id?: string
          user_id?: string | null
          voter_fingerprint?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          allow_anonymous: boolean | null
          atualizado_em: string
          block_id: string
          criado_em: string
          id: string
          options: Json
          poll_type: string
          post_id: string | null
          question: string
          require_login: boolean | null
          show_results_after_vote: boolean | null
        }
        Insert: {
          allow_anonymous?: boolean | null
          atualizado_em?: string
          block_id: string
          criado_em?: string
          id?: string
          options: Json
          poll_type: string
          post_id?: string | null
          question: string
          require_login?: boolean | null
          show_results_after_vote?: boolean | null
        }
        Update: {
          allow_anonymous?: boolean | null
          atualizado_em?: string
          block_id?: string
          criado_em?: string
          id?: string
          options?: Json
          poll_type?: string
          post_id?: string | null
          question?: string
          require_login?: boolean | null
          show_results_after_vote?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_categories: {
        Row: {
          category_id: string
          criado_em: string
          post_id: string
        }
        Insert: {
          category_id: string
          criado_em?: string
          post_id: string
        }
        Update: {
          category_id?: string
          criado_em?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_meta: {
        Row: {
          atualizado_em: string
          canonical_url: string | null
          criado_em: string
          id: string
          meta_description: string | null
          meta_title: string | null
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          post_id: string
          twitter_card_type: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
        }
        Insert: {
          atualizado_em?: string
          canonical_url?: string | null
          criado_em?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          post_id: string
          twitter_card_type?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
        }
        Update: {
          atualizado_em?: string
          canonical_url?: string | null
          criado_em?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          post_id?: string
          twitter_card_type?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_meta_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_revisions: {
        Row: {
          conteudo: Json
          criado_em: string
          excerpt: string | null
          id: string
          metadata: Json | null
          post_id: string
          revision_number: number
          titulo: string
          user_id: string | null
        }
        Insert: {
          conteudo: Json
          criado_em?: string
          excerpt?: string | null
          id?: string
          metadata?: Json | null
          post_id: string
          revision_number: number
          titulo: string
          user_id?: string | null
        }
        Update: {
          conteudo?: Json
          criado_em?: string
          excerpt?: string | null
          id?: string
          metadata?: Json | null
          post_id?: string
          revision_number?: number
          titulo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_revisions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          atualizado_em: string
          autor_id: string | null
          categoria_id: string | null
          conteudo: string
          criado_em: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          publicado: boolean | null
          reading_time: number | null
          scheduled_at: string | null
          slug: string | null
          status: Database["public"]["Enums"]["post_status"] | null
          titulo: string
          word_count: number | null
        }
        Insert: {
          atualizado_em?: string
          autor_id?: string | null
          categoria_id?: string | null
          conteudo: string
          criado_em?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          publicado?: boolean | null
          reading_time?: number | null
          scheduled_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          titulo: string
          word_count?: number | null
        }
        Update: {
          atualizado_em?: string
          autor_id?: string | null
          categoria_id?: string | null
          conteudo?: string
          criado_em?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          publicado?: boolean | null
          reading_time?: number | null
          scheduled_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          titulo?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_posts_autor"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          atualizado_em: string
          criado_em: string
          email: string
          id: string
          nome: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          email: string
          id: string
          nome: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          email?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          criado_em: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_reading_stats: {
        Args: { p_content: Json }
        Returns: {
          reading_time: number
          word_count: number
        }[]
      }
      generate_unique_slug: {
        Args: { p_post_id?: string; p_title: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      post_status: "draft" | "scheduled" | "published" | "archived"
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
      app_role: ["admin", "user"],
      post_status: ["draft", "scheduled", "published", "archived"],
    },
  },
} as const
