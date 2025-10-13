import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLandingPages } from "@/hooks/useLandingPages";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function LandingPagesList() {
  const navigate = useNavigate();
  const { data: landingPages, isLoading, refetch } = useLandingPages();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${titulo}"?`)) return;

    try {
      const { error } = await supabase
        .from("landing_pages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Landing page excluída com sucesso!");
      refetch();
    } catch (error: any) {
      toast.error("Erro ao excluir landing page");
      console.error("Erro:", error);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const { error } = await supabase
        .from("landing_pages")
        .update({ publicado: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(
        !currentStatus 
          ? "Landing page publicada!" 
          : "Landing page despublicada"
      );
      refetch();
    } catch (error: any) {
      toast.error("Erro ao atualizar status");
      console.error("Erro:", error);
    } finally {
      setTogglingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Landing Pages</h1>
          <p className="text-muted-foreground mt-2">
            Crie e gerencie landing pages para suas campanhas
          </p>
        </div>
        <Button onClick={() => navigate("/admin/landing/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Landing Page
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!landingPages || landingPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma landing page cadastrada
                </TableCell>
              </TableRow>
            ) : (
              landingPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.titulo}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      /{page.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={page.publicado}
                      onCheckedChange={() => handleTogglePublish(page.id, page.publicado)}
                      disabled={togglingId === page.id}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(page.criado_em).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {page.publicado && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/${page.slug}`, "_blank")}
                        title="Visualizar publicada"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/landing/${page.id}/preview`)}
                      title="Visualizar preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/landing/${page.id}/edit`)}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(page.id, page.titulo)}
                      title="Deletar"
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
    </div>
  );
}