// ============================================
// UTILITÁRIOS PARA GERAÇÃO E VALIDAÇÃO DE SLUGS
// ============================================
// Funções auxiliares para trabalhar com slugs de URLs amigáveis
// Para personalizar o comportamento, edite as funções abaixo

import { supabase } from '@/integrations/supabase/client';

/**
 * Gera um slug baseado em um texto (título)
 * Remove acentos, caracteres especiais, e converte para lowercase
 * 
 * @param text - Texto para converter em slug
 * @returns Slug gerado (ex: "meu-titulo-de-post")
 * 
 * Como modificar:
 * - Para manter caracteres especiais específicos, ajuste o regexp na linha de remoção
 * - Para mudar o separador (ex: usar _ ao invés de -), altere o replace de espaços
 */
export function generateSlug(text: string): string {
  let slug = text.toLowerCase().trim();
  
  // Remove acentos e caracteres especiais do português
  const accentMap: Record<string, string> = {
    'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
    'ç': 'c', 'ñ': 'n'
  };
  
  // Substitui cada caractere acentuado pelo equivalente sem acento
  slug = slug.split('').map(char => accentMap[char] || char).join('');
  
  // Remove caracteres que não sejam letras, números, espaços ou hífens
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  
  // Substitui espaços por hífens
  slug = slug.replace(/\s+/g, '-');
  
  // Remove múltiplos hífens consecutivos
  slug = slug.replace(/-+/g, '-');
  
  // Remove hífens do início e fim
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
}

/**
 * Verifica se um slug já existe no banco de dados
 * Útil para evitar slugs duplicados
 * 
 * @param slug - Slug a ser verificado
 * @param excludePostId - ID do post a ser excluído da verificação (para edição)
 * @returns true se o slug já existe, false caso contrário
 * 
 * Como usar:
 * - Chame antes de salvar um post para garantir unicidade
 * - Para editar um post existente, passe o ID dele em excludePostId
 */
export async function checkSlugExists(
  slug: string,
  excludePostId?: string
): Promise<boolean> {
  try {
    let query = supabase
      .from('posts')
      .select('id')
      .eq('slug', slug);
    
    // Se estiver editando um post, exclui ele da verificação
    if (excludePostId) {
      query = query.neq('id', excludePostId);
    }
    
    const { data, error } = await query.single();
    
    // Se não encontrou nada, o slug está disponível
    if (error && error.code === 'PGRST116') {
      return false;
    }
    
    if (error) throw error;
    
    // Se encontrou algo, o slug já existe
    return !!data;
  } catch (error) {
    console.error('Erro ao verificar slug:', error);
    return false;
  }
}

/**
 * Gera um slug único adicionando um número ao final se necessário
 * Usa a função do banco de dados para garantir unicidade
 * 
 * @param title - Título do post
 * @param postId - ID do post (para edição, opcional)
 * @returns Promise com o slug único gerado
 * 
 * Como funciona:
 * 1. Chama a função generate_unique_slug do banco
 * 2. A função adiciona -1, -2, -3... até encontrar um slug disponível
 * 3. Retorna o slug único
 */
export async function generateUniqueSlug(
  title: string,
  postId?: string
): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('generate_unique_slug', {
      p_title: title,
      p_post_id: postId || null
    });
    
    if (error) throw error;
    
    return data || generateSlug(title);
  } catch (error) {
    console.error('Erro ao gerar slug único:', error);
    // Fallback para geração local se a função do banco falhar
    return generateSlug(title);
  }
}

/**
 * Valida se um slug tem formato válido
 * 
 * @param slug - Slug a ser validado
 * @returns true se o slug é válido, false caso contrário
 * 
 * Regras de validação:
 * - Apenas letras minúsculas, números e hífens
 * - Não pode começar ou terminar com hífen
 * - Não pode ter hífens consecutivos
 * - Mínimo 3 caracteres, máximo 200
 */
export function isValidSlug(slug: string): boolean {
  // Verifica tamanho
  if (slug.length < 3 || slug.length > 200) {
    return false;
  }
  
  // Verifica formato (apenas lowercase, números e hífens)
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Extrai o slug de uma URL completa
 * 
 * @param url - URL completa do post
 * @returns Slug extraído da URL
 * 
 * Exemplo:
 * extractSlugFromUrl('https://meusite.com/blog/meu-post') => 'meu-post'
 */
export function extractSlugFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    return pathParts[pathParts.length - 1] || '';
  } catch {
    // Se não for uma URL válida, retorna a string como está
    return url;
  }
}
