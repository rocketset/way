// Página de gerenciamento de Solicitações de Contato
// Visualização e gerenciamento de mensagens enviadas pelo formulário do site

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string | null;
  mensagem: string;
  lido: boolean;
  criado_em: string;
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Carrega contatos ao montar o componente
  useEffect(() => {
    fetchContacts();
  }, []);

  // Função para buscar todas as solicitações de contato
  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar contatos');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Abre o dialog para visualizar detalhes do contato
  const handleView = async (contact: Contact) => {
    setSelectedContact(contact);
    setDialogOpen(true);

    // Marca como lido se ainda não foi lido
    if (!contact.lido) {
      try {
        const { error } = await supabase
          .from('contacts')
          .update({ lido: true })
          .eq('id', contact.id);

        if (error) throw error;
        
        // Atualiza o estado local
        setContacts(contacts.map(c => 
          c.id === contact.id ? { ...c, lido: true } : c
        ));
      } catch (error: any) {
        console.error('Erro ao marcar como lido:', error);
      }
    }
  };

  // Função para deletar solicitação de contato
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta solicitação?')) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Solicitação excluída com sucesso!');
      fetchContacts();
    } catch (error: any) {
      toast.error('Erro ao excluir solicitação');
      console.error('Erro:', error);
    }
  };

  // Função para alternar status de lido/não lido
  const toggleRead = async (contact: Contact) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ lido: !contact.lido })
        .eq('id', contact.id);

      if (error) throw error;
      
      toast.success(contact.lido ? 'Marcado como não lido' : 'Marcado como lido');
      fetchContacts();
    } catch (error: any) {
      toast.error('Erro ao atualizar status');
      console.error('Erro:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div>
        <h1 className="text-3xl font-bold">Solicitações de Contato</h1>
        <p className="text-muted-foreground mt-2">
          Mensagens enviadas pelos visitantes do site
        </p>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{contacts.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Não Lidas</p>
          <p className="text-2xl font-bold text-blue-600">
            {contacts.filter(c => !c.lido).length}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Lidas</p>
          <p className="text-2xl font-bold text-green-600">
            {contacts.filter(c => c.lido).length}
          </p>
        </div>
      </div>

      {/* Tabela de contatos */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhuma solicitação de contato
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow 
                  key={contact.id}
                  className={!contact.lido ? 'bg-blue-50/50' : ''}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRead(contact)}
                    >
                      {contact.lido ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{contact.nome}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.empresa || '-'}</TableCell>
                  <TableCell>
                    {new Date(contact.criado_em).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(contact)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para visualizar detalhes */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Enviada em {selectedContact && new Date(selectedContact.criado_em).toLocaleDateString('pt-BR')}
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4">
              {/* Informações do remetente */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="mt-1">{selectedContact.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                  <p className="mt-1">{selectedContact.email}</p>
                </div>
                {selectedContact.telefone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="mt-1">{selectedContact.telefone}</p>
                  </div>
                )}
                {selectedContact.empresa && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                    <p className="mt-1">{selectedContact.empresa}</p>
                  </div>
                )}
              </div>

              {/* Mensagem */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Mensagem</p>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="whitespace-pre-wrap">{selectedContact.mensagem}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
