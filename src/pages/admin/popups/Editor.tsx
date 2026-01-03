import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  usePopup,
  useCreatePopup,
  useUpdatePopup,
  useDeletePopup,
  Popup,
} from "@/hooks/usePopups";

const paginasDisponiveis = [
  { value: "todas", label: "Todas as páginas" },
  { value: "/", label: "Home" },
  { value: "/blog", label: "Blog" },
  { value: "/cases", label: "Cases" },
  { value: "/contato", label: "Contato" },
  { value: "/carreiras", label: "Carreiras" },
  { value: "/por-que-way", label: "Por que Way" },
  { value: "/solucoes/implementacao", label: "Implementação" },
  { value: "/solucoes/performance", label: "Performance" },
  { value: "/solucoes/consultoria", label: "Consultoria" },
  { value: "/solucoes/jornada", label: "Jornada" },
];

const camposDisponiveis = [
  { value: "nome", label: "Nome" },
  { value: "email", label: "E-mail" },
  { value: "telefone", label: "Telefone" },
];

const defaultPopup: Partial<Popup> = {
  nome: "",
  tipo: "anuncio",
  ativo: false,
  titulo: "",
  subtitulo: "",
  descricao: "",
  imagem_url: "",
  cor_fundo: "#ffffff",
  cor_texto: "#000000",
  cor_botao: "#000000",
  cor_texto_botao: "#ffffff",
  texto_botao: "Saiba mais",
  link_botao: "",
  abrir_nova_aba: false,
  campos_formulario: ["nome", "email"],
  texto_sucesso: "Obrigado! Entraremos em contato.",
  gatilho: "ao_carregar",
  delay_segundos: 0,
  paginas_alvo: ["todas"],
  exibir_uma_vez: true,
  exibir_para_logados: true,
  exibir_para_visitantes: true,
  prioridade: 0,
};

export default function PopupEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const { data: existingPopup, isLoading } = usePopup(id || "");
  const createPopup = useCreatePopup();
  const updatePopup = useUpdatePopup();
  const deletePopup = useDeletePopup();

  const [popup, setPopup] = useState<Partial<Popup>>(defaultPopup);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (existingPopup) {
      setPopup(existingPopup);
    }
  }, [existingPopup]);

  const handleSave = async () => {
    if (!popup.nome) {
      toast({
        title: "Erro",
        description: "O nome do popup é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing) {
        await updatePopup.mutateAsync({ id, ...popup } as Popup);
        toast({
          title: "Popup atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        await createPopup.mutateAsync(popup);
        toast({
          title: "Popup criado",
          description: "O popup foi criado com sucesso.",
        });
        navigate("/admin/popups");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o popup.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePopup.mutateAsync(id);
      toast({
        title: "Popup excluído",
        description: "O popup foi removido com sucesso.",
      });
      navigate("/admin/popups");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o popup.",
        variant: "destructive",
      });
    }
  };

  const handlePaginaToggle = (pagina: string) => {
    const paginas = popup.paginas_alvo || [];
    
    if (pagina === "todas") {
      setPopup({ ...popup, paginas_alvo: ["todas"] });
    } else {
      let novasPaginas = paginas.filter(p => p !== "todas");
      
      if (novasPaginas.includes(pagina)) {
        novasPaginas = novasPaginas.filter(p => p !== pagina);
      } else {
        novasPaginas.push(pagina);
      }
      
      if (novasPaginas.length === 0) {
        novasPaginas = ["todas"];
      }
      
      setPopup({ ...popup, paginas_alvo: novasPaginas });
    }
  };

  const handleCampoToggle = (campo: string) => {
    const campos = popup.campos_formulario || [];
    
    if (campos.includes(campo)) {
      setPopup({
        ...popup,
        campos_formulario: campos.filter(c => c !== campo),
      });
    } else {
      setPopup({
        ...popup,
        campos_formulario: [...campos, campo],
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/popups")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? "Editar Popup" : "Novo Popup"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? "Modifique as configurações do popup" : "Configure um novo popup para o site"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Pré-visualizar
          </Button>
          {isEditing && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          )}
          <Button onClick={handleSave} disabled={createPopup.isPending || updatePopup.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="conteudo" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
              <TabsTrigger value="aparencia">Aparência</TabsTrigger>
              <TabsTrigger value="gatilho">Gatilho</TabsTrigger>
              <TabsTrigger value="avancado">Avançado</TabsTrigger>
            </TabsList>

            <TabsContent value="conteudo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome do Popup *</Label>
                      <Input
                        id="nome"
                        value={popup.nome}
                        onChange={(e) => setPopup({ ...popup, nome: e.target.value })}
                        placeholder="Ex: Promoção de Verão"
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Apenas para identificação interna
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo de Popup</Label>
                      <Select
                        value={popup.tipo}
                        onValueChange={(value) => setPopup({ ...popup, tipo: value as Popup['tipo'] })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anuncio">Anúncio / Promoção</SelectItem>
                          <SelectItem value="lead">Captura de Lead</SelectItem>
                          <SelectItem value="cookie">Cookies / LGPD</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                      id="titulo"
                      value={popup.titulo || ""}
                      onChange={(e) => setPopup({ ...popup, titulo: e.target.value })}
                      placeholder="Ex: Não perca essa oportunidade!"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitulo">Subtítulo</Label>
                    <Input
                      id="subtitulo"
                      value={popup.subtitulo || ""}
                      onChange={(e) => setPopup({ ...popup, subtitulo: e.target.value })}
                      placeholder="Ex: Apenas por tempo limitado"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={popup.descricao || ""}
                      onChange={(e) => setPopup({ ...popup, descricao: e.target.value })}
                      placeholder="Texto adicional do popup..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="imagem_url">URL da Imagem</Label>
                    <Input
                      id="imagem_url"
                      value={popup.imagem_url || ""}
                      onChange={(e) => setPopup({ ...popup, imagem_url: e.target.value })}
                      placeholder="https://..."
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {popup.tipo === "lead" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Formulário de Captura</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Campos do Formulário</Label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {camposDisponiveis.map((campo) => (
                          <div key={campo.value} className="flex items-center gap-2">
                            <Checkbox
                              id={`campo-${campo.value}`}
                              checked={popup.campos_formulario?.includes(campo.value)}
                              onCheckedChange={() => handleCampoToggle(campo.value)}
                            />
                            <Label htmlFor={`campo-${campo.value}`} className="font-normal">
                              {campo.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="texto_sucesso">Mensagem de Sucesso</Label>
                      <Input
                        id="texto_sucesso"
                        value={popup.texto_sucesso || ""}
                        onChange={(e) => setPopup({ ...popup, texto_sucesso: e.target.value })}
                        placeholder="Obrigado! Entraremos em contato."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="texto_botao">Texto do Botão</Label>
                      <Input
                        id="texto_botao"
                        value={popup.texto_botao || ""}
                        onChange={(e) => setPopup({ ...popup, texto_botao: e.target.value })}
                        placeholder="Enviar"
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Botão de Ação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="texto_botao">Texto do Botão</Label>
                        <Input
                          id="texto_botao"
                          value={popup.texto_botao || ""}
                          onChange={(e) => setPopup({ ...popup, texto_botao: e.target.value })}
                          placeholder="Saiba mais"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="link_botao">Link do Botão</Label>
                        <Input
                          id="link_botao"
                          value={popup.link_botao || ""}
                          onChange={(e) => setPopup({ ...popup, link_botao: e.target.value })}
                          placeholder="https://... ou /pagina"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="abrir_nova_aba"
                        checked={popup.abrir_nova_aba}
                        onCheckedChange={(checked) => setPopup({ ...popup, abrir_nova_aba: checked })}
                      />
                      <Label htmlFor="abrir_nova_aba">Abrir em nova aba</Label>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="aparencia" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cor_fundo">Cor de Fundo</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          id="cor_fundo"
                          value={popup.cor_fundo}
                          onChange={(e) => setPopup({ ...popup, cor_fundo: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={popup.cor_fundo}
                          onChange={(e) => setPopup({ ...popup, cor_fundo: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cor_texto">Cor do Texto</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          id="cor_texto"
                          value={popup.cor_texto}
                          onChange={(e) => setPopup({ ...popup, cor_texto: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={popup.cor_texto}
                          onChange={(e) => setPopup({ ...popup, cor_texto: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cor_botao">Cor do Botão</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          id="cor_botao"
                          value={popup.cor_botao}
                          onChange={(e) => setPopup({ ...popup, cor_botao: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={popup.cor_botao}
                          onChange={(e) => setPopup({ ...popup, cor_botao: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cor_texto_botao">Cor do Texto do Botão</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          id="cor_texto_botao"
                          value={popup.cor_texto_botao}
                          onChange={(e) => setPopup({ ...popup, cor_texto_botao: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={popup.cor_texto_botao}
                          onChange={(e) => setPopup({ ...popup, cor_texto_botao: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gatilho" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quando Exibir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="gatilho">Gatilho de Exibição</Label>
                    <Select
                      value={popup.gatilho}
                      onValueChange={(value) => setPopup({ ...popup, gatilho: value as Popup['gatilho'] })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ao_carregar">Ao carregar a página</SelectItem>
                        <SelectItem value="apos_segundos">Após X segundos</SelectItem>
                        <SelectItem value="exit_intent">Exit Intent (ao tentar sair)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {popup.gatilho === "apos_segundos" && (
                    <div>
                      <Label htmlFor="delay_segundos">Delay em segundos</Label>
                      <Input
                        id="delay_segundos"
                        type="number"
                        min="0"
                        value={popup.delay_segundos}
                        onChange={(e) => setPopup({ ...popup, delay_segundos: parseInt(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Onde Exibir</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {paginasDisponiveis.map((pagina) => (
                      <div key={pagina.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`pagina-${pagina.value}`}
                          checked={
                            pagina.value === "todas"
                              ? popup.paginas_alvo?.includes("todas")
                              : popup.paginas_alvo?.includes(pagina.value) && !popup.paginas_alvo?.includes("todas")
                          }
                          onCheckedChange={() => handlePaginaToggle(pagina.value)}
                        />
                        <Label htmlFor={`pagina-${pagina.value}`} className="font-normal">
                          {pagina.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="avancado" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Controle de Exibição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Exibir apenas uma vez</Label>
                      <p className="text-xs text-muted-foreground">
                        Não mostrar novamente após o usuário fechar
                      </p>
                    </div>
                    <Switch
                      checked={popup.exibir_uma_vez}
                      onCheckedChange={(checked) => setPopup({ ...popup, exibir_uma_vez: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Exibir para usuários logados</Label>
                      <p className="text-xs text-muted-foreground">
                        Mostrar para quem está autenticado
                      </p>
                    </div>
                    <Switch
                      checked={popup.exibir_para_logados}
                      onCheckedChange={(checked) => setPopup({ ...popup, exibir_para_logados: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Exibir para visitantes</Label>
                      <p className="text-xs text-muted-foreground">
                        Mostrar para quem não está logado
                      </p>
                    </div>
                    <Switch
                      checked={popup.exibir_para_visitantes}
                      onCheckedChange={(checked) => setPopup({ ...popup, exibir_para_visitantes: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Período de Exibição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data_inicio">Data de Início</Label>
                      <Input
                        id="data_inicio"
                        type="datetime-local"
                        value={popup.data_inicio?.slice(0, 16) || ""}
                        onChange={(e) => setPopup({ ...popup, data_inicio: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="data_fim">Data de Término</Label>
                      <Input
                        id="data_fim"
                        type="datetime-local"
                        value={popup.data_fim?.slice(0, 16) || ""}
                        onChange={(e) => setPopup({ ...popup, data_fim: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deixe em branco para exibir sempre (enquanto ativo)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prioridade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="prioridade">Ordem de Prioridade</Label>
                    <Input
                      id="prioridade"
                      type="number"
                      min="0"
                      value={popup.prioridade}
                      onChange={(e) => setPopup({ ...popup, prioridade: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Menor número = maior prioridade. Apenas um popup é exibido por vez.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Popup Ativo</Label>
                  <p className="text-xs text-muted-foreground">
                    {popup.ativo ? "Visível no site" : "Não está visível"}
                  </p>
                </div>
                <Switch
                  checked={popup.ativo}
                  onCheckedChange={(checked) => setPopup({ ...popup, ativo: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg p-4 text-center"
                style={{
                  backgroundColor: popup.cor_fundo,
                  color: popup.cor_texto,
                }}
              >
                {popup.imagem_url && (
                  <img
                    src={popup.imagem_url}
                    alt="Preview"
                    className="w-full h-24 object-cover rounded mb-3"
                  />
                )}
                {popup.titulo && (
                  <h3 className="font-bold text-lg">{popup.titulo}</h3>
                )}
                {popup.subtitulo && (
                  <p className="text-sm opacity-80">{popup.subtitulo}</p>
                )}
                <button
                  className="mt-3 px-4 py-2 rounded text-sm font-medium"
                  style={{
                    backgroundColor: popup.cor_botao,
                    color: popup.cor_texto_botao,
                  }}
                >
                  {popup.texto_botao}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent
          className="max-w-md p-0 overflow-hidden border-0"
          style={{
            backgroundColor: popup.cor_fundo,
            color: popup.cor_texto,
          }}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Pré-visualização do Popup</DialogTitle>
          </DialogHeader>
          {popup.imagem_url && (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={popup.imagem_url}
                alt={popup.titulo || "Popup"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            {popup.titulo && (
              <h2 className="text-2xl font-bold mb-2">{popup.titulo}</h2>
            )}
            {popup.subtitulo && (
              <p className="text-lg opacity-80 mb-2">{popup.subtitulo}</p>
            )}
            {popup.descricao && (
              <p className="opacity-70 mb-6">{popup.descricao}</p>
            )}
            <Button
              className="w-full"
              style={{
                backgroundColor: popup.cor_botao,
                color: popup.cor_texto_botao,
              }}
            >
              {popup.texto_botao}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
