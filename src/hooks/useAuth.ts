// Hook customizado para gerenciar autenticação de usuários
// Gerencia estado de sessão, login, logout e registro

import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useAuth() {
  // Estados para armazenar dados do usuário e sessão
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Verifica se o usuário é admin após login
        if (session?.user) {
          setTimeout(async () => {
            await checkIfAdmin(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Busca sessão existente ao carregar a página
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        await checkIfAdmin(session.user.id);
      }
    });

    // Limpa o listener quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  // Função para verificar se usuário tem papel de admin
  const checkIfAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Erro ao verificar role do usuário:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Erro ao verificar role:', error);
      setIsAdmin(false);
    }
  };

  // Função para realizar login
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      return { error };
    }
  };

  // Função para realizar registro de novo usuário
  const signUp = async (email: string, password: string, nome: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome, // Dados adicionais que serão salvos no perfil
          }
        }
      });

      if (error) throw error;

      toast.success('Conta criada com sucesso!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      return { error };
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Logout realizado com sucesso!');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
    }
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };
}
