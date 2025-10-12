// Contexto centralizado de autenticação
// Gerencia um único listener para eventos de auth do Supabase

import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type UserRole = 'administrador' | 'colunista' | 'membro' | 'gestor_conteudo';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole | null;
  isAdmin: boolean;
  isColunista: boolean;
  isMembro: boolean;
  isGestorConteudo: boolean;
  viewMode: UserRole | null;
  setViewMode: (role: UserRole | null) => void;
  effectiveRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isColunista, setIsColunista] = useState(false);
  const [isMembro, setIsMembro] = useState(false);
  const [isGestorConteudo, setIsGestorConteudo] = useState(false);
  const [viewMode, setViewMode] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  // Role efetivo: viewMode se admin estiver simulando, senão o role real
  const effectiveRole = (isAdmin && viewMode) ? viewMode : userRole;

  // Controle para evitar múltiplas chamadas simultâneas
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [lastCheckedUserId, setLastCheckedUserId] = useState<string | null>(null);

  // Função para verificar role do usuário
  const checkUserRole = async (userId: string) => {
    // Evita chamadas duplicadas para o mesmo usuário
    if (isCheckingAdmin || lastCheckedUserId === userId) {
      return;
    }

    setIsCheckingAdmin(true);
    setLastCheckedUserId(userId);

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao verificar role do usuário:', error);
        setUserRole(null);
        setIsAdmin(false);
        setIsColunista(false);
        setIsMembro(false);
        setIsGestorConteudo(false);
        return;
      }

      const role = data?.role as UserRole | null;
      setUserRole(role);
      setIsAdmin(role === 'administrador');
      setIsColunista(role === 'colunista');
      setIsMembro(role === 'membro');
      setIsGestorConteudo(role === 'gestor_conteudo');
    } catch (error) {
      console.error('Erro ao verificar role:', error);
      setUserRole(null);
      setIsAdmin(false);
      setIsColunista(false);
      setIsMembro(false);
      setIsGestorConteudo(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  useEffect(() => {
    // Listener único para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Verifica role apenas no evento SIGNED_IN
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            checkUserRole(session.user.id);
          }, 150);
        } else if (!session?.user) {
          setUserRole(null);
          setIsAdmin(false);
          setIsColunista(false);
          setIsMembro(false);
          setIsGestorConteudo(false);
          setLastCheckedUserId(null);
        }
      }
    );

    // Busca sessão existente ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        checkUserRole(session.user.id);
      }
    });

    // Limpa o listener quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  // Função para realizar login
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Registra atividade de login
      if (data.user) {
        await supabase.from('user_activity_logs').insert({
          user_id: data.user.id,
          activity_type: 'login',
          activity_data: { timestamp: new Date().toISOString() }
        });
      }

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
            nome,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userRole,
        isAdmin,
        isColunista,
        isMembro,
        isGestorConteudo,
        viewMode,
        setViewMode,
        effectiveRole,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
