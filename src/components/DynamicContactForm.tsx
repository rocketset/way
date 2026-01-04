import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowRight, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import { useFormConfig, FormField as FormFieldType } from "@/hooks/useFormConfig";
import { useIntencoesCadastro } from "@/hooks/useIntencoesCadastro";

interface DynamicContactFormProps {
  formSlug: string;
  className?: string;
}

const DynamicContactForm = ({ formSlug, className = "" }: DynamicContactFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: formConfig, isLoading } = useFormConfig(formSlug);
  const { data: intencoes } = useIntencoesCadastro(formSlug as any);

  // Gerar schema Zod dinamicamente baseado nos campos
  const schema = useMemo(() => {
    if (!formConfig?.fields) return z.object({});

    const schemaFields: Record<string, z.ZodTypeAny> = {};

    formConfig.fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      const stringishTypes = new Set([
        "text",
        "email",
        "tel",
        "textarea",
        "select",
        "radio",
        "url",
        "date",
        "cnpj",
        "cpf",
      ]);

      switch (field.tipo_campo) {
        case "email":
          fieldSchema = z.string().trim().email({ message: "E-mail inválido" });
          break;
        case "tel":
          fieldSchema = z.string().trim().min(10, { message: "Telefone inválido" });
          break;
        case "number":
          fieldSchema = z.coerce.number();
          break;
        case "url":
          fieldSchema = z.string().trim().url({ message: "URL inválida" });
          break;
        case "date":
          fieldSchema = z.string().trim();
          break;
        case "checkbox":
          fieldSchema = z.boolean();
          break;
        default:
          fieldSchema = z.string().trim();
      }

      // Aplicar validações
      if (field.validacao) {
        const isStringField = stringishTypes.has(field.tipo_campo);
        if (isStringField) {
          if (field.validacao.minLength) {
            fieldSchema = (fieldSchema as z.ZodString).min(field.validacao.minLength);
          }
          if (field.validacao.maxLength) {
            fieldSchema = (fieldSchema as z.ZodString).max(field.validacao.maxLength);
          }
        }

        if (field.tipo_campo === "number") {
          if (typeof field.validacao.min === "number") {
            fieldSchema = (fieldSchema as z.ZodNumber).min(field.validacao.min);
          }
          if (typeof field.validacao.max === "number") {
            fieldSchema = (fieldSchema as z.ZodNumber).max(field.validacao.max);
          }
        }
      }

      // Obrigatório / opcional
      if (!field.obrigatorio) {
        if (field.tipo_campo === "checkbox") {
          fieldSchema = fieldSchema.optional();
        } else {
          // Mantém compatibilidade com inputs vazios ("")
          fieldSchema = fieldSchema.optional().or(z.literal(""));
        }
      } else {
        // Só aplicar validação de "não vazio" para campos string
        if (field.tipo_campo !== "checkbox" && field.tipo_campo !== "number") {
          fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${field.label} é obrigatório` });
        }
      }

      schemaFields[field.nome_campo] = fieldSchema;
    });

    return z.object(schemaFields);
  }, [formConfig?.fields]);

  // Gerar valores padrão
  const defaultValues = useMemo(() => {
    if (!formConfig?.fields) return {};
    
    const values: Record<string, any> = {};
    formConfig.fields.forEach((field) => {
      if (field.tipo_campo === 'checkbox') {
        values[field.nome_campo] = false;
      } else {
        values[field.nome_campo] = field.valor_padrao || "";
      }
    });
    return values;
  }, [formConfig?.fields]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);

    const sanitizeText = (value: unknown) =>
      DOMPurify.sanitize(String(value ?? ""), { ALLOWED_TAGS: [] });

    try {
      // Mapear campos para o formato do banco
      const contactData = {
        nome: sanitizeText(data.nome || data.name || "N/A"),
        email: sanitizeText(data.email || "nao-informado@example.com"),
        telefone: sanitizeText(data.telefone || data.phone || "") || null,
        empresa: sanitizeText(data.empresa || data.company || "") || null,
        assunto: sanitizeText(data.assunto || data.subject || formSlug),
        mensagem: sanitizeText(data.mensagem || data.message || JSON.stringify(data)),
      };

      const { error } = await supabase.from("contacts").insert([contactData]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Em breve entraremos em contato.",
        duration: 5000,
      });

      form.reset();
    } catch (error: any) {
      console.error("Erro ao enviar:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormFieldType) => {
    const widthClass = field.largura === 'half' 
      ? 'md:col-span-1' 
      : field.largura === 'third' 
        ? 'md:col-span-1 lg:col-span-1' 
        : 'md:col-span-2';

    return (
      <FormField
        key={field.id}
        control={form.control}
        name={field.nome_campo}
        render={({ field: formField }) => (
          <FormItem className={widthClass}>
            <FormLabel className="text-sm font-semibold text-white">
              {field.label} {field.obrigatorio && '*'}
            </FormLabel>
            <FormControl>
              {renderInput(field, formField)}
            </FormControl>
            {field.dica && <FormDescription>{field.dica}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderInput = (field: FormFieldType, formField: any) => {
    const baseClass = "h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50";

    switch (field.tipo_campo) {
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder || ""}
            {...formField}
            rows={5}
            className="resize-none bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50"
          />
        );

      case 'select':
        // Se for campo de assunto, usar as intenções do banco
        if (field.nome_campo === 'assunto') {
          return (
            <Select onValueChange={formField.onChange} value={formField.value}>
              <SelectTrigger className={baseClass}>
                <SelectValue placeholder={field.placeholder || "Selecione"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {intencoes?.map((intencao) => (
                  <SelectItem key={intencao.id} value={intencao.valor_slug || intencao.id}>
                    {intencao.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        // Usar opções do campo
        return (
          <Select onValueChange={formField.onChange} value={formField.value}>
            <SelectTrigger className={baseClass}>
              <SelectValue placeholder={field.placeholder || "Selecione"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {field.opcoes?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
            <span className="text-sm text-muted-foreground">{field.placeholder}</span>
          </div>
        );

      case 'radio':
        return (
          <RadioGroup onValueChange={formField.onChange} value={formField.value}>
            {field.opcoes?.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`${field.nome_campo}-${opt.value}`} />
                <label htmlFor={`${field.nome_campo}-${opt.value}`} className="text-sm">
                  {opt.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder={field.placeholder || ""}
            {...formField}
            className={baseClass}
          />
        );

      case 'tel':
        return (
          <Input
            type="tel"
            placeholder={field.placeholder || ""}
            {...formField}
            className={baseClass}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder || ""}
            {...formField}
            className={baseClass}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            placeholder={field.placeholder || ""}
            {...formField}
            className={baseClass}
          />
        );

      case 'url':
        return (
          <Input
            type="url"
            placeholder={field.placeholder || "https://"}
            {...formField}
            className={baseClass}
          />
        );

      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder || ""}
            {...formField}
            className={baseClass}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!formConfig) {
    return null;
  }

  return (
    <div className={`relative z-10 ${className}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">
            {formConfig.titulo_formulario || "Envie sua Mensagem"}
          </h3>
          {formConfig.subtitulo_formulario && (
            <p className="text-muted-foreground">{formConfig.subtitulo_formulario}</p>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {formConfig.fields?.map(renderField)}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-14 bg-primary text-background hover:bg-primary/90 transition-all duration-300 group text-lg font-medium rounded-lg"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Plus className="w-5 h-5 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  {formConfig.texto_botao_enviar || "Enviar Mensagem"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </Button>

            {formConfig.mostrar_whatsapp && (
              <a
                href="https://api.whatsapp.com/message/5AGVY5WZR56KA1?autoload=1&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 h-14 bg-gradient-to-r from-[#43E460] via-[#3ACC54] to-[#43E460] hover:from-[#3ACC54] hover:via-[#32B849] hover:to-[#3ACC54] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group text-lg font-medium"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="hidden sm:inline">Fale agora no WhatsApp</span>
                <span className="sm:hidden">WhatsApp</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DynamicContactForm;
