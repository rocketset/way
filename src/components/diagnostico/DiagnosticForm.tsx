import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface DiagnosticFormData {
  name: string;
  email: string;
  whatsapp: string;
  storeUrl: string;
  instagram: string;
  segments: string[];
  sellsOnline: string;
  salesChannels: string[];
  averageTicket: string;
  monthlyRevenue: string;
}

interface DiagnosticFormProps {
  onSubmit: (data: DiagnosticFormData) => void;
  onBack: () => void;
}

const segmentOptions = [
  'Alimentação', 'Animais', 'Arte e Cultura',
  'Automotivo', 'Bebê', 'Beleza',
  'Casa e Decoração', 'Construção', 'Educação',
  'Eletrônicos', 'Esporte', 'Ferramentas',
  'Flores e Jardim', 'Informática', 'Instrumentos Musicais',
  'Joias e Relógios', 'Livros', 'Moda',
  'Presente', 'Saúde', 'Serviços',
  'Telefonia', 'Turismo', 'Outros'
];

const salesChannelOptions = [
  { id: 'loja_virtual', label: 'Loja virtual' },
  { id: 'loja_fisica', label: 'Loja física' },
  { id: 'marketplace', label: 'Marketplace (Mercado Livre, Amazon, etc.)' },
  { id: 'redes_sociais', label: 'Redes sociais' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'vendas_diretas', label: 'Vendas diretas' },
  { id: 'outros', label: 'Outros' }
];

const revenueOptions = [
  'Até R$ 5 mil',
  'Entre R$ 5 mil e R$ 20 mil',
  'Entre R$ 20 mil e R$ 50 mil',
  'Entre R$ 50 mil e R$ 100 mil',
  'Entre R$ 100 mil e R$ 400 mil',
  'Entre R$ 400 mil e R$ 800 mil',
  'Acima de R$ 800 mil'
];

export const DiagnosticForm = ({ onSubmit, onBack }: DiagnosticFormProps) => {
  const [formData, setFormData] = useState<DiagnosticFormData>({
    name: '',
    email: '',
    whatsapp: '',
    storeUrl: '',
    instagram: '',
    segments: [],
    sellsOnline: '',
    salesChannels: [],
    averageTicket: '',
    monthlyRevenue: ''
  });

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatInstagram = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();
    return cleaned.slice(0, 30);
  };

  const handleChange = (field: keyof DiagnosticFormData, value: string) => {
    let formattedValue = value;
    
    if (field === 'whatsapp') {
      formattedValue = formatWhatsApp(value);
    } else if (field === 'instagram') {
      formattedValue = formatInstagram(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSegmentToggle = (segment: string) => {
    setFormData(prev => ({
      ...prev,
      segments: prev.segments.includes(segment)
        ? prev.segments.filter(s => s !== segment)
        : [...prev.segments, segment]
    }));
  };

  const handleChannelToggle = (channelId: string) => {
    setFormData(prev => ({
      ...prev,
      salesChannels: prev.salesChannels.includes(channelId)
        ? prev.salesChannels.filter(c => c !== channelId)
        : [...prev.salesChannels, channelId]
    }));
  };

  const isValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const whatsappClean = formData.whatsapp.replace(/\D/g, '');
    
    return (
      formData.name.trim().length >= 2 &&
      emailRegex.test(formData.email) &&
      whatsappClean.length >= 10 &&
      formData.segments.length > 0 &&
      formData.sellsOnline !== '' &&
      formData.salesChannels.length > 0 &&
      formData.averageTicket.trim().length > 0 &&
      formData.monthlyRevenue !== ''
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="bg-gray-800/50 border-gray-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Vamos começar!
            </h1>
            <p className="text-gray-400">
              Preencha seus dados para personalizar seu diagnóstico
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados pessoais */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome completo *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-white">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Segmento */}
            <div className="space-y-3">
              <Label className="text-white">Em qual segmento você atua ou pretende atuar? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {segmentOptions.map((segment) => (
                  <div key={segment} className="flex items-center space-x-2">
                    <Checkbox
                      id={`segment-${segment}`}
                      checked={formData.segments.includes(segment)}
                      onCheckedChange={() => handleSegmentToggle(segment)}
                      className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor={`segment-${segment}`}
                      className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                    >
                      {segment}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Vende pela internet */}
            <div className="space-y-3">
              <Label className="text-white">Você vende pela internet? *</Label>
              <RadioGroup
                value={formData.sellsOnline}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sellsOnline: value }))}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="sells-sim" className="border-gray-600 text-primary" />
                  <Label htmlFor="sells-sim" className="text-gray-300 cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="sells-nao" className="border-gray-600 text-primary" />
                  <Label htmlFor="sells-nao" className="text-gray-300 cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Canais de venda */}
            <div className="space-y-3">
              <Label className="text-white">Quais canais de venda você utiliza? *</Label>
              <div className="grid grid-cols-2 gap-2">
                {salesChannelOptions.map((channel) => (
                  <div key={channel.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`channel-${channel.id}`}
                      checked={formData.salesChannels.includes(channel.id)}
                      onCheckedChange={() => handleChannelToggle(channel.id)}
                      className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor={`channel-${channel.id}`}
                      className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                    >
                      {channel.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket médio */}
            <div className="space-y-2">
              <Label htmlFor="averageTicket" className="text-white">Qual o ticket médio dos seus produtos? *</Label>
              <Input
                id="averageTicket"
                type="text"
                placeholder="Ex: 150"
                value={formData.averageTicket}
                onChange={(e) => handleChange('averageTicket', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
            </div>

            {/* Faturamento mensal */}
            <div className="space-y-2">
              <Label htmlFor="monthlyRevenue" className="text-white">Qual o faturamento médio mensal do seu negócio? *</Label>
              <Select
                value={formData.monthlyRevenue}
                onValueChange={(value) => setFormData(prev => ({ ...prev, monthlyRevenue: value }))}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione o faturamento" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 z-50">
                  {revenueOptions.map((option) => (
                    <SelectItem 
                      key={option} 
                      value={option}
                      className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white cursor-pointer"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dados da loja (opcionais) */}
            <div className="space-y-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">Dados da loja (opcional)</p>
              
              <div className="space-y-2">
                <Label htmlFor="storeUrl" className="text-white">Link da loja virtual</Label>
                <Input
                  id="storeUrl"
                  type="text"
                  placeholder="sualoja.com.br"
                  value={formData.storeUrl}
                  onChange={(e) => handleChange('storeUrl', e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-white">Instagram da loja</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <Input
                    id="instagram"
                    type="text"
                    placeholder="sualoja"
                    value={formData.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 pl-8"
                    maxLength={30}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!isValid()}
            >
              Continuar para o Diagnóstico
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
