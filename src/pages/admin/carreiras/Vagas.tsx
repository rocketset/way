import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useVagas, useCreateVaga, useUpdateVaga, useDeleteVaga, Vaga } from "@/hooks/useVagas";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const vagaSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  requisitos: z.string().optional(),
  beneficios: z.string().optional(),
  tipo_contratacao: z.string(),
  modalidade: z.string(),
  area: z.string().optional(),
  nivel: z.string(),
  salario_visivel: z.boolean(),
  faixa_salarial: z.string().optional(),
  ativo: z.boolean(),
});

type VagaForm = z.infer<typeof vagaSchema>;

export default function AdminVagas() {
  const { data: vagas, isLoading } = useVagas();
  const createVaga = useCreateVaga();
  const updateVaga = useUpdateVaga();
  const deleteVaga = useDeleteVaga();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VagaForm>({
    resolver: zodResolver(vagaSchema),
    defaultValues: {
      tipo_contratacao: "CLT",
      modalidade: "presencial",
      nivel: "pleno",
      salario_visivel: false,
      ativo: true,
    },
  });

  const salarioVisivel = watch("salario_visivel");

  const openNew = () => {
    setEditingVaga(null);
    reset({
      titulo: "",
      descricao: "",
      requisitos: "",
      beneficios: "",
      tipo_contratacao: "CLT",
      modalidade: "presencial",
      area: "",
      nivel: "pleno",
      salario_visivel: false,
      faixa_salarial: "",
      ativo: true,
    });
    setIsFormOpen(true);
  };

  const openEdit = (vaga: Vaga) => {
    setEditingVaga(vaga);
    reset({
      titulo: vaga.titulo,
      descricao: vaga.descricao,
      requisitos: vaga.requisitos || "",
      beneficios: vaga.beneficios || "",
      tipo_contratacao: vaga.tipo_contratacao,
      modalidade: vaga.modalidade,
      area: vaga.area || "",
      nivel: vaga.nivel || "pleno",
      salario_visivel: vaga.salario_visivel || false,
      faixa_salarial: vaga.faixa_salarial || "",
      ativo: vaga.ativo ?? true,
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: VagaForm) => {
    if (editingVaga) {
      await updateVaga.mutateAsync({ id: editingVaga.id, ...data });
    } else {
      await createVaga.mutateAsync({
        titulo: data.titulo,
        descricao: data.descricao,
        ...data
      });
    }
    setIsFormOpen(false);
    reset();
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteVaga.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Vagas</h1>
            <p className="text-muted-foreground">
              Crie e gerencie as vagas disponíveis
            </p>
          </div>
          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Vaga
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vagas?.map((vaga) => (
                  <TableRow key={vaga.id}>
                    <TableCell className="font-medium">{vaga.titulo}</TableCell>
                    <TableCell>{vaga.tipo_contratacao}</TableCell>
                    <TableCell className="capitalize">{vaga.modalidade}</TableCell>
                    <TableCell className="capitalize">{vaga.nivel}</TableCell>
                    <TableCell>
                      <Badge variant={vaga.ativo ? "default" : "secondary"}>
                        {vaga.ativo ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(vaga)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(vaga.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!vagas || vagas.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma vaga cadastrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVaga ? "Editar Vaga" : "Nova Vaga"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da vaga *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Desenvolvedor Front-end"
                {...register("titulo")}
              />
              {errors.titulo && (
                <p className="text-sm text-destructive">{errors.titulo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva a vaga, responsabilidades, etc."
                rows={4}
                {...register("descricao")}
              />
              {errors.descricao && (
                <p className="text-sm text-destructive">{errors.descricao.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipo_contratacao">Tipo de contratação</Label>
                <Select
                  defaultValue="CLT"
                  onValueChange={(value) => setValue("tipo_contratacao", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLT">CLT</SelectItem>
                    <SelectItem value="PJ">PJ</SelectItem>
                    <SelectItem value="estagio">Estágio</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade</Label>
                <Select
                  defaultValue="presencial"
                  onValueChange={(value) => setValue("modalidade", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="remoto">Remoto</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nivel">Nível</Label>
                <Select
                  defaultValue="pleno"
                  onValueChange={(value) => setValue("nivel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estagio">Estágio</SelectItem>
                    <SelectItem value="junior">Júnior</SelectItem>
                    <SelectItem value="pleno">Pleno</SelectItem>
                    <SelectItem value="senior">Sênior</SelectItem>
                    <SelectItem value="especialista">Especialista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área</Label>
                <Input
                  id="area"
                  placeholder="Ex: Desenvolvimento, Marketing"
                  {...register("area")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requisitos">Requisitos</Label>
              <Textarea
                id="requisitos"
                placeholder="Liste os requisitos da vaga..."
                rows={3}
                {...register("requisitos")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficios">Benefícios</Label>
              <Textarea
                id="beneficios"
                placeholder="Liste os benefícios oferecidos..."
                rows={3}
                {...register("beneficios")}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="salario_visivel"
                  checked={salarioVisivel}
                  onCheckedChange={(checked) => setValue("salario_visivel", checked)}
                />
                <Label htmlFor="salario_visivel">Exibir faixa salarial</Label>
              </div>
            </div>

            {salarioVisivel && (
              <div className="space-y-2">
                <Label htmlFor="faixa_salarial">Faixa salarial</Label>
                <Input
                  id="faixa_salarial"
                  placeholder="Ex: R$ 5.000 - R$ 8.000"
                  {...register("faixa_salarial")}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Switch
                id="ativo"
                checked={watch("ativo")}
                onCheckedChange={(checked) => setValue("ativo", checked)}
              />
              <Label htmlFor="ativo">Vaga ativa</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createVaga.isPending || updateVaga.isPending}>
                {(createVaga.isPending || updateVaga.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir vaga?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A vaga será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
