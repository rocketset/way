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
      academy_categories: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          criado_em: string
          descricao: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      academy_content: {
        Row: {
          arquivo_url: string | null
          atualizado_em: string
          autor_id: string | null
          capa_url: string | null
          categoria_id: string | null
          criado_em: string
          descricao: string
          duracao: string | null
          formato: string
          id: string
          ordem: number | null
          publicado: boolean | null
          tipo: string
          titulo: string
        }
        Insert: {
          arquivo_url?: string | null
          atualizado_em?: string
          autor_id?: string | null
          capa_url?: string | null
          categoria_id?: string | null
          criado_em?: string
          descricao: string
          duracao?: string | null
          formato: string
          id?: string
          ordem?: number | null
          publicado?: boolean | null
          tipo: string
          titulo: string
        }
        Update: {
          arquivo_url?: string | null
          atualizado_em?: string
          autor_id?: string | null
          capa_url?: string | null
          categoria_id?: string | null
          criado_em?: string
          descricao?: string
          duracao?: string | null
          formato?: string
          id?: string
          ordem?: number | null
          publicado?: boolean | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_content_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "academy_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_materials: {
        Row: {
          arquivo_url: string | null
          atualizado_em: string
          content_id: string
          criado_em: string
          duracao: string | null
          formato: string
          id: string
          nome: string
          ordem: number | null
          tipo_material: string
        }
        Insert: {
          arquivo_url?: string | null
          atualizado_em?: string
          content_id: string
          criado_em?: string
          duracao?: string | null
          formato: string
          id?: string
          nome: string
          ordem?: number | null
          tipo_material: string
        }
        Update: {
          arquivo_url?: string | null
          atualizado_em?: string
          content_id?: string
          criado_em?: string
          duracao?: string | null
          formato?: string
          id?: string
          nome?: string
          ordem?: number | null
          tipo_material?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_materials_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "academy_content"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_progress: {
        Row: {
          atualizado_em: string
          concluido: boolean | null
          content_id: string
          criado_em: string
          id: string
          material_id: string | null
          progresso: number | null
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          concluido?: boolean | null
          content_id: string
          criado_em?: string
          id?: string
          material_id?: string | null
          progresso?: number | null
          user_id: string
        }
        Update: {
          atualizado_em?: string
          concluido?: boolean | null
          content_id?: string
          criado_em?: string
          id?: string
          material_id?: string | null
          progresso?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "academy_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_progress_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "academy_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_settings: {
        Row: {
          atualizado_em: string
          banner_descricao: string | null
          banner_titulo: string | null
          banner_url: string | null
          id: string
        }
        Insert: {
          atualizado_em?: string
          banner_descricao?: string | null
          banner_titulo?: string | null
          banner_url?: string | null
          id?: string
        }
        Update: {
          atualizado_em?: string
          banner_descricao?: string | null
          banner_titulo?: string | null
          banner_url?: string | null
          id?: string
        }
        Relationships: []
      }
      briefings: {
        Row: {
          atualizado_em: string
          cargo_funcao: string | null
          cidade: string | null
          cnpj: string
          comunicacao_relacionamento: Json
          contato: string
          criado_em: string
          data_inicio_projeto: string | null
          endereco: string | null
          estado: string | null
          estrutura_organizacao: Json
          forma_juridica: string | null
          id: string
          lido: boolean | null
          mercado_estrategia: Json
          nome_empresa: string
          observacoes_gerais: string | null
          operacao_logistica: Json
          produtos_fornecimento: Json
          responsavel_projeto: string
          segmento: string
          sistemas_integracoes: Json
          site_atual: string | null
          status: string
        }
        Insert: {
          atualizado_em?: string
          cargo_funcao?: string | null
          cidade?: string | null
          cnpj: string
          comunicacao_relacionamento?: Json
          contato: string
          criado_em?: string
          data_inicio_projeto?: string | null
          endereco?: string | null
          estado?: string | null
          estrutura_organizacao?: Json
          forma_juridica?: string | null
          id?: string
          lido?: boolean | null
          mercado_estrategia?: Json
          nome_empresa: string
          observacoes_gerais?: string | null
          operacao_logistica?: Json
          produtos_fornecimento?: Json
          responsavel_projeto: string
          segmento: string
          sistemas_integracoes?: Json
          site_atual?: string | null
          status?: string
        }
        Update: {
          atualizado_em?: string
          cargo_funcao?: string | null
          cidade?: string | null
          cnpj?: string
          comunicacao_relacionamento?: Json
          contato?: string
          criado_em?: string
          data_inicio_projeto?: string | null
          endereco?: string | null
          estado?: string | null
          estrutura_organizacao?: Json
          forma_juridica?: string | null
          id?: string
          lido?: boolean | null
          mercado_estrategia?: Json
          nome_empresa?: string
          observacoes_gerais?: string | null
          operacao_logistica?: Json
          produtos_fornecimento?: Json
          responsavel_projeto?: string
          segmento?: string
          sistemas_integracoes?: Json
          site_atual?: string | null
          status?: string
        }
        Relationships: []
      }
      candidaturas: {
        Row: {
          atualizado_em: string
          criado_em: string
          curriculo_url: string | null
          email: string
          id: string
          lido: boolean | null
          linkedin_url: string | null
          mensagem: string | null
          nivel_experiencia: string | null
          nome: string
          notas_internas: string | null
          portfolio_url: string | null
          pretensao_salarial: string | null
          status: string
          telefone: string | null
          vaga_id: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          curriculo_url?: string | null
          email: string
          id?: string
          lido?: boolean | null
          linkedin_url?: string | null
          mensagem?: string | null
          nivel_experiencia?: string | null
          nome: string
          notas_internas?: string | null
          portfolio_url?: string | null
          pretensao_salarial?: string | null
          status?: string
          telefone?: string | null
          vaga_id?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          curriculo_url?: string | null
          email?: string
          id?: string
          lido?: boolean | null
          linkedin_url?: string | null
          mensagem?: string | null
          nivel_experiencia?: string | null
          nome?: string
          notas_internas?: string | null
          portfolio_url?: string | null
          pretensao_salarial?: string | null
          status?: string
          telefone?: string | null
          vaga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidaturas_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
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
          content_status: Database["public"]["Enums"]["case_status"] | null
          criado_em: string
          descricao: string
          id: string
          imagem_url: string | null
          is_featured: boolean | null
          mockup_screenshot_url: string | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_status: string | null
          ordem: number | null
          publicado: boolean | null
          titulo: string
        }
        Insert: {
          atualizado_em?: string
          categoria_id?: string | null
          content_status?: Database["public"]["Enums"]["case_status"] | null
          criado_em?: string
          descricao: string
          id?: string
          imagem_url?: string | null
          is_featured?: boolean | null
          mockup_screenshot_url?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_status?: string | null
          ordem?: number | null
          publicado?: boolean | null
          titulo: string
        }
        Update: {
          atualizado_em?: string
          categoria_id?: string | null
          content_status?: Database["public"]["Enums"]["case_status"] | null
          criado_em?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          is_featured?: boolean | null
          mockup_screenshot_url?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_status?: string | null
          ordem?: number | null
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
      client_logos: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          case_id: string | null
          criado_em: string
          exibir_em: string
          id: string
          logo_url: string
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          case_id?: string | null
          criado_em?: string
          exibir_em?: string
          id?: string
          logo_url: string
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          case_id?: string | null
          criado_em?: string
          exibir_em?: string
          id?: string
          logo_url?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_logos_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          approved: boolean
          atualizado_em: string
          author_email: string
          author_name: string
          content: string
          criado_em: string
          id: string
          parent_id: string | null
          post_id: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean
          atualizado_em?: string
          author_email: string
          author_name: string
          content: string
          criado_em?: string
          id?: string
          parent_id?: string | null
          post_id: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean
          atualizado_em?: string
          author_email?: string
          author_name?: string
          content?: string
          criado_em?: string
          id?: string
          parent_id?: string | null
          post_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      conduct_guide_content: {
        Row: {
          ativo: boolean
          atualizado_em: string
          content: Json
          criado_em: string
          id: string
          ordem: number
          section_description: string | null
          section_key: string
          section_title: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          content?: Json
          criado_em?: string
          id?: string
          ordem?: number
          section_description?: string | null
          section_key: string
          section_title: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          content?: Json
          criado_em?: string
          id?: string
          ordem?: number
          section_description?: string | null
          section_key?: string
          section_title?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          assunto: string | null
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
          assunto?: string | null
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
          assunto?: string | null
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
      form_configs: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          criado_em: string
          descricao: string | null
          id: string
          mostrar_whatsapp: boolean | null
          nome: string
          slug: string
          subtitulo_formulario: string | null
          texto_botao_enviar: string | null
          titulo_formulario: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          mostrar_whatsapp?: boolean | null
          nome: string
          slug: string
          subtitulo_formulario?: string | null
          texto_botao_enviar?: string | null
          titulo_formulario?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          mostrar_whatsapp?: boolean | null
          nome?: string
          slug?: string
          subtitulo_formulario?: string | null
          texto_botao_enviar?: string | null
          titulo_formulario?: string | null
        }
        Relationships: []
      }
      form_fields: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          criado_em: string
          dica: string | null
          form_config_id: string
          id: string
          label: string
          largura: string | null
          nome_campo: string
          obrigatorio: boolean | null
          opcoes: Json | null
          ordem: number | null
          placeholder: string | null
          tipo_campo: string
          validacao: Json | null
          valor_padrao: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          dica?: string | null
          form_config_id: string
          id?: string
          label: string
          largura?: string | null
          nome_campo: string
          obrigatorio?: boolean | null
          opcoes?: Json | null
          ordem?: number | null
          placeholder?: string | null
          tipo_campo?: string
          validacao?: Json | null
          valor_padrao?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          dica?: string | null
          form_config_id?: string
          id?: string
          label?: string
          largura?: string | null
          nome_campo?: string
          obrigatorio?: boolean | null
          opcoes?: Json | null
          ordem?: number | null
          placeholder?: string | null
          tipo_campo?: string
          validacao?: Json | null
          valor_padrao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_fields_form_config_id_fkey"
            columns: ["form_config_id"]
            isOneToOne: false
            referencedRelation: "form_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_photos: {
        Row: {
          alt_text: string | null
          ativo: boolean | null
          atualizado_em: string
          criado_em: string
          id: string
          image_url: string
          object_fit: string | null
          object_position: string | null
          ordem: number | null
          row_span: number | null
        }
        Insert: {
          alt_text?: string | null
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          id?: string
          image_url: string
          object_fit?: string | null
          object_position?: string | null
          ordem?: number | null
          row_span?: number | null
        }
        Update: {
          alt_text?: string | null
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          id?: string
          image_url?: string
          object_fit?: string | null
          object_position?: string | null
          ordem?: number | null
          row_span?: number | null
        }
        Relationships: []
      }
      global_seo_settings: {
        Row: {
          atualizado_em: string
          bing_site_verification: string | null
          criado_em: string
          default_og_image: string | null
          google_site_verification: string | null
          id: string
          robots_txt: string | null
          site_name: string | null
          site_title_suffix: string | null
          twitter_site: string | null
        }
        Insert: {
          atualizado_em?: string
          bing_site_verification?: string | null
          criado_em?: string
          default_og_image?: string | null
          google_site_verification?: string | null
          id?: string
          robots_txt?: string | null
          site_name?: string | null
          site_title_suffix?: string | null
          twitter_site?: string | null
        }
        Update: {
          atualizado_em?: string
          bing_site_verification?: string | null
          criado_em?: string
          default_og_image?: string | null
          google_site_verification?: string | null
          id?: string
          robots_txt?: string | null
          site_name?: string | null
          site_title_suffix?: string | null
          twitter_site?: string | null
        }
        Relationships: []
      }
      google_integrations: {
        Row: {
          analytics_id: string | null
          created_at: string
          id: string
          search_console_verification: string | null
          tag_manager_id: string | null
          updated_at: string
        }
        Insert: {
          analytics_id?: string | null
          created_at?: string
          id?: string
          search_console_verification?: string | null
          tag_manager_id?: string | null
          updated_at?: string
        }
        Update: {
          analytics_id?: string | null
          created_at?: string
          id?: string
          search_console_verification?: string | null
          tag_manager_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      google_place_config: {
        Row: {
          created_at: string
          id: string
          last_synced_at: string | null
          place_id: string
          place_name: string | null
          rating: number | null
          updated_at: string
          user_ratings_total: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_synced_at?: string | null
          place_id: string
          place_name?: string | null
          rating?: number | null
          updated_at?: string
          user_ratings_total?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_synced_at?: string | null
          place_id?: string
          place_name?: string | null
          rating?: number | null
          updated_at?: string
          user_ratings_total?: number | null
        }
        Relationships: []
      }
      google_reviews: {
        Row: {
          author_name: string
          author_url: string | null
          created_at: string
          id: string
          profile_photo_url: string | null
          rating: number
          relative_time_description: string | null
          text: string | null
          time: string
          updated_at: string
        }
        Insert: {
          author_name: string
          author_url?: string | null
          created_at?: string
          id?: string
          profile_photo_url?: string | null
          rating: number
          relative_time_description?: string | null
          text?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_url?: string | null
          created_at?: string
          id?: string
          profile_photo_url?: string | null
          rating?: number
          relative_time_description?: string | null
          text?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
      intencoes_cadastro: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          cor_destaque: string | null
          criado_em: string
          descricao: string | null
          exibir_em: string[] | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          valor_slug: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          cor_destaque?: string | null
          criado_em?: string
          descricao?: string | null
          exibir_em?: string[] | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          valor_slug?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          cor_destaque?: string | null
          criado_em?: string
          descricao?: string | null
          exibir_em?: string[] | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          valor_slug?: string | null
        }
        Relationships: []
      }
      landing_page_blocks: {
        Row: {
          atualizado_em: string
          block_type: string
          content: Json
          criado_em: string
          id: string
          landing_page_id: string
          position: number
        }
        Insert: {
          atualizado_em?: string
          block_type: string
          content?: Json
          criado_em?: string
          id?: string
          landing_page_id: string
          position?: number
        }
        Update: {
          atualizado_em?: string
          block_type?: string
          content?: Json
          criado_em?: string
          id?: string
          landing_page_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_blocks_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_leads: {
        Row: {
          criado_em: string
          email: string
          id: string
          landing_page_id: string
          mensagem: string | null
          metadata: Json | null
          nome: string
          telefone: string | null
        }
        Insert: {
          criado_em?: string
          email: string
          id?: string
          landing_page_id: string
          mensagem?: string | null
          metadata?: Json | null
          nome: string
          telefone?: string | null
        }
        Update: {
          criado_em?: string
          email?: string
          id?: string
          landing_page_id?: string
          mensagem?: string | null
          metadata?: Json | null
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_leads_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          atualizado_em: string
          autor_id: string | null
          criado_em: string
          descricao: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          publicado: boolean | null
          slug: string
          titulo: string
        }
        Insert: {
          atualizado_em?: string
          autor_id?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          publicado?: boolean | null
          slug: string
          titulo: string
        }
        Update: {
          atualizado_em?: string
          autor_id?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          publicado?: boolean | null
          slug?: string
          titulo?: string
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
      notifications: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          icon: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          canonical_url: string | null
          criado_em: string
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          nofollow: boolean | null
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_key: string
          page_name: string
          schema_markup: Json | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_site: string | null
          twitter_title: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          canonical_url?: string | null
          criado_em?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          nofollow?: boolean | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_key: string
          page_name: string
          schema_markup?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_site?: string | null
          twitter_title?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          canonical_url?: string | null
          criado_em?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          nofollow?: boolean | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_key?: string
          page_name?: string
          schema_markup?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_site?: string | null
          twitter_title?: string | null
        }
        Relationships: []
      }
      partner_logos: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          criado_em: string
          id: string
          logo_url: string
          nome: string
          ordem: number | null
          site_url: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          id?: string
          logo_url: string
          nome: string
          ordem?: number | null
          site_url?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          id?: string
          logo_url?: string
          nome?: string
          ordem?: number | null
          site_url?: string | null
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
      popup_leads: {
        Row: {
          criado_em: string
          dados_extras: Json | null
          email: string | null
          id: string
          nome: string | null
          popup_id: string
          telefone: string | null
        }
        Insert: {
          criado_em?: string
          dados_extras?: Json | null
          email?: string | null
          id?: string
          nome?: string | null
          popup_id: string
          telefone?: string | null
        }
        Update: {
          criado_em?: string
          dados_extras?: Json | null
          email?: string | null
          id?: string
          nome?: string | null
          popup_id?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "popup_leads_popup_id_fkey"
            columns: ["popup_id"]
            isOneToOne: false
            referencedRelation: "popups"
            referencedColumns: ["id"]
          },
        ]
      }
      popup_views: {
        Row: {
          criado_em: string
          id: string
          popup_id: string
          user_id: string | null
          visitor_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          popup_id: string
          user_id?: string | null
          visitor_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          popup_id?: string
          user_id?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "popup_views_popup_id_fkey"
            columns: ["popup_id"]
            isOneToOne: false
            referencedRelation: "popups"
            referencedColumns: ["id"]
          },
        ]
      }
      popups: {
        Row: {
          abrir_nova_aba: boolean | null
          ativo: boolean
          atualizado_em: string
          campos_formulario: Json | null
          cor_botao: string | null
          cor_fundo: string | null
          cor_texto: string | null
          cor_texto_botao: string | null
          criado_em: string
          data_fim: string | null
          data_inicio: string | null
          delay_segundos: number | null
          descricao: string | null
          exibir_para_logados: boolean | null
          exibir_para_visitantes: boolean | null
          exibir_uma_vez: boolean | null
          gatilho: string
          id: string
          imagem_url: string | null
          link_botao: string | null
          nome: string
          paginas_alvo: Json | null
          prioridade: number | null
          subtitulo: string | null
          texto_botao: string | null
          texto_sucesso: string | null
          tipo: string
          titulo: string | null
        }
        Insert: {
          abrir_nova_aba?: boolean | null
          ativo?: boolean
          atualizado_em?: string
          campos_formulario?: Json | null
          cor_botao?: string | null
          cor_fundo?: string | null
          cor_texto?: string | null
          cor_texto_botao?: string | null
          criado_em?: string
          data_fim?: string | null
          data_inicio?: string | null
          delay_segundos?: number | null
          descricao?: string | null
          exibir_para_logados?: boolean | null
          exibir_para_visitantes?: boolean | null
          exibir_uma_vez?: boolean | null
          gatilho?: string
          id?: string
          imagem_url?: string | null
          link_botao?: string | null
          nome: string
          paginas_alvo?: Json | null
          prioridade?: number | null
          subtitulo?: string | null
          texto_botao?: string | null
          texto_sucesso?: string | null
          tipo?: string
          titulo?: string | null
        }
        Update: {
          abrir_nova_aba?: boolean | null
          ativo?: boolean
          atualizado_em?: string
          campos_formulario?: Json | null
          cor_botao?: string | null
          cor_fundo?: string | null
          cor_texto?: string | null
          cor_texto_botao?: string | null
          criado_em?: string
          data_fim?: string | null
          data_inicio?: string | null
          delay_segundos?: number | null
          descricao?: string | null
          exibir_para_logados?: boolean | null
          exibir_para_visitantes?: boolean | null
          exibir_uma_vez?: boolean | null
          gatilho?: string
          id?: string
          imagem_url?: string | null
          link_botao?: string | null
          nome?: string
          paginas_alvo?: Json | null
          prioridade?: number | null
          subtitulo?: string | null
          texto_botao?: string | null
          texto_sucesso?: string | null
          tipo?: string
          titulo?: string | null
        }
        Relationships: []
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
          destaque: boolean | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_status: string | null
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
          destaque?: boolean | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_status?: string | null
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
          destaque?: boolean | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_status?: string | null
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
          account_status: string | null
          approved_at: string | null
          approved_by: string | null
          atualizado_em: string
          avatar_url: string | null
          bio: string | null
          cargo: string | null
          criado_em: string
          email: string
          email_principal: string | null
          empresa: string | null
          id: string
          instagram: string | null
          intencao_cadastro: string | null
          is_colunista: boolean | null
          linkedin: string | null
          nome: string
          rejection_reason: string | null
          site_empresa: string | null
          site_pessoal: string | null
          twitter: string | null
          whatsapp: string | null
        }
        Insert: {
          account_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          atualizado_em?: string
          avatar_url?: string | null
          bio?: string | null
          cargo?: string | null
          criado_em?: string
          email: string
          email_principal?: string | null
          empresa?: string | null
          id: string
          instagram?: string | null
          intencao_cadastro?: string | null
          is_colunista?: boolean | null
          linkedin?: string | null
          nome: string
          rejection_reason?: string | null
          site_empresa?: string | null
          site_pessoal?: string | null
          twitter?: string | null
          whatsapp?: string | null
        }
        Update: {
          account_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          atualizado_em?: string
          avatar_url?: string | null
          bio?: string | null
          cargo?: string | null
          criado_em?: string
          email?: string
          email_principal?: string | null
          empresa?: string | null
          id?: string
          instagram?: string | null
          intencao_cadastro?: string | null
          is_colunista?: boolean | null
          linkedin?: string | null
          nome?: string
          rejection_reason?: string | null
          site_empresa?: string | null
          site_pessoal?: string | null
          twitter?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          criado_em: string
          id: string
          modulo: string
          permissao: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          id?: string
          modulo: string
          permissao: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          id?: string
          modulo?: string
          permissao?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          atualizado_em: string
          city: string | null
          company_description: string | null
          company_founding_year: string | null
          company_name: string
          country: string | null
          criado_em: string
          email: string | null
          facebook_url: string | null
          google_reviews_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          phone: string | null
          rating_value: number | null
          review_count: number | null
          site_url: string | null
          state: string | null
          twitter_url: string | null
          whatsapp: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          atualizado_em?: string
          city?: string | null
          company_description?: string | null
          company_founding_year?: string | null
          company_name?: string
          country?: string | null
          criado_em?: string
          email?: string | null
          facebook_url?: string | null
          google_reviews_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone?: string | null
          rating_value?: number | null
          review_count?: number | null
          site_url?: string | null
          state?: string | null
          twitter_url?: string | null
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          atualizado_em?: string
          city?: string | null
          company_description?: string | null
          company_founding_year?: string | null
          company_name?: string
          country?: string | null
          criado_em?: string
          email?: string | null
          facebook_url?: string | null
          google_reviews_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone?: string | null
          rating_value?: number | null
          review_count?: number | null
          site_url?: string | null
          state?: string | null
          twitter_url?: string | null
          whatsapp?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      sitemap_config: {
        Row: {
          created_at: string
          id: string
          last_generated_at: string | null
          status: string | null
          total_urls: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_generated_at?: string | null
          status?: string | null
          total_urls?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_generated_at?: string | null
          status?: string | null
          total_urls?: number | null
          updated_at?: string
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
      user_activity_logs: {
        Row: {
          activity_data: Json | null
          activity_type: string
          criado_em: string
          id: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          criado_em?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          criado_em?: string
          id?: string
          user_id?: string
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
      vagas: {
        Row: {
          area: string | null
          ativo: boolean | null
          atualizado_em: string
          beneficios: string | null
          criado_em: string
          descricao: string
          faixa_salarial: string | null
          id: string
          modalidade: string
          nivel: string | null
          ordem: number | null
          requisitos: string | null
          salario_visivel: boolean | null
          tipo_contratacao: string
          titulo: string
        }
        Insert: {
          area?: string | null
          ativo?: boolean | null
          atualizado_em?: string
          beneficios?: string | null
          criado_em?: string
          descricao: string
          faixa_salarial?: string | null
          id?: string
          modalidade?: string
          nivel?: string | null
          ordem?: number | null
          requisitos?: string | null
          salario_visivel?: boolean | null
          tipo_contratacao?: string
          titulo: string
        }
        Update: {
          area?: string | null
          ativo?: boolean | null
          atualizado_em?: string
          beneficios?: string | null
          criado_em?: string
          descricao?: string
          faixa_salarial?: string | null
          id?: string
          modalidade?: string
          nivel?: string | null
          ordem?: number | null
          requisitos?: string | null
          salario_visivel?: boolean | null
          tipo_contratacao?: string
          titulo?: string
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
      notify_all_clients: {
        Args: {
          p_icon?: string
          p_link?: string
          p_message: string
          p_title: string
          p_type: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "administrador"
        | "colunista"
        | "membro"
        | "gestor_conteudo"
        | "cliente"
      case_status: "rascunho" | "em_edicao" | "publicado" | "excluido"
      post_status:
        | "draft"
        | "scheduled"
        | "published"
        | "archived"
        | "rascunho"
        | "em_edicao"
        | "excluido"
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
      app_role: [
        "administrador",
        "colunista",
        "membro",
        "gestor_conteudo",
        "cliente",
      ],
      case_status: ["rascunho", "em_edicao", "publicado", "excluido"],
      post_status: [
        "draft",
        "scheduled",
        "published",
        "archived",
        "rascunho",
        "em_edicao",
        "excluido",
      ],
    },
  },
} as const
