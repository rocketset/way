import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  platform: string;
  businessPhase: string;
  mainSalesSources: string[];
  challengingAreas: string[];
  sixMonthObjective: string;
  termsAccepted: boolean;
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

const platformOptions = [
  'Bagy', 'EZCommerce', 'Jet', 'Loja Integrada', 'Magento',
  'Shopify', 'Tray', 'Vtex', 'Wake Commerce', 'Wix',
  'WooCommerce', 'Nuvemshop', 'Outra', 'Não tenho loja virtual'
];

const businessPhaseOptions = [
  'Ainda estou estruturando o negócio',
  'Quero validar e fazer as primeiras vendas',
  'Já vendo, mas preciso crescer',
  'Quero escalar e profissionalizar',
  'Meu negócio já está consolidado, quero otimizá-lo',
  'Ainda estou decidindo'
];

const mainSalesSourceOptions = [
  { id: 'loja_virtual_propria', label: 'Loja virtual própria' },
  { id: 'marketplaces', label: 'Marketplaces' },
  { id: 'redes_sociais', label: 'Redes sociais' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'loja_fisica', label: 'Loja física' },
  { id: 'vendas_diretas', label: 'Vendas diretas' },
  { id: 'indicacoes', label: 'Indicações' },
  { id: 'outros', label: 'Outros' }
];

const challengingAreasOptions = [
  { id: 'marketing', label: 'Marketing e divulgação' },
  { id: 'vendas', label: 'Vendas e conversão' },
  { id: 'logistica', label: 'Logística e entrega' },
  { id: 'atendimento', label: 'Atendimento ao cliente' },
  { id: 'financeiro', label: 'Gestão financeira' },
  { id: 'estoque', label: 'Estoque e produtos' },
  { id: 'tecnologia', label: 'Tecnologia e sistemas' },
  { id: 'rh', label: 'Recursos humanos' },
  { id: 'estrategia', label: 'Estratégia e planejamento' },
  { id: 'precificacao', label: 'Precificação' },
  { id: 'outros', label: 'Outros' }
];

export const DiagnosticForm = ({ onSubmit, onBack }: DiagnosticFormProps) => {
  const [step, setStep] = useState(1);
  const [segmentDropdownOpen, setSegmentDropdownOpen] = useState(false);
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
    monthlyRevenue: '',
    platform: '',
    businessPhase: '',
    mainSalesSources: [],
    challengingAreas: [],
    sixMonthObjective: '',
    termsAccepted: false
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

  const handleArrayToggle = (field: 'segments' | 'salesChannels' | 'mainSalesSources' | 'challengingAreas', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const isStep1Valid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const whatsappClean = formData.whatsapp.replace(/\D/g, '');
    
    return (
      formData.name.trim().length >= 2 &&
      emailRegex.test(formData.email) &&
      whatsappClean.length >= 10
    );
  };

  const isStep2Valid = () => {
    return (
      formData.segments.length > 0 &&
      formData.sellsOnline !== '' &&
      formData.salesChannels.length > 0 &&
      formData.averageTicket.trim().length > 0 &&
      formData.monthlyRevenue !== '' &&
      formData.platform !== '' &&
      formData.businessPhase !== '' &&
      formData.mainSalesSources.length > 0 &&
      formData.challengingAreas.length > 0 &&
      formData.sixMonthObjective.trim().length > 0 &&
      formData.termsAccepted
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && isStep1Valid()) {
      setStep(2);
    } else if (step === 2 && isStep2Valid()) {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else {
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-600'}`} />
          <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-600'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-600'}`} />
        </div>

        <Card className="bg-gray-800/50 border-gray-700 p-8">
          <div className="text-center mb-8">
            <span className="text-sm text-primary font-medium">Etapa {step} de 2</span>
            <h1 className="text-2xl font-bold text-white mt-2 mb-2">
              {step === 1 ? 'Dados básicos' : 'Sobre seu negócio'}
            </h1>
            <p className="text-gray-400">
              {step === 1 
                ? 'Preencha suas informações de contato' 
                : 'Nos conte mais sobre sua operação'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
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
                  disabled={!isStep1Valid()}
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Segmento */}
                <div className="space-y-2">
                  <Label className="text-white">Em qual segmento você atua ou pretende atuar? *</Label>
                  <div className="relative">
                    <div 
                      className="bg-gray-900 border border-gray-700 rounded-md p-3 cursor-pointer flex items-center justify-between min-h-[42px]"
                      onClick={() => setSegmentDropdownOpen(!segmentDropdownOpen)}
                    >
                      <span className={formData.segments.length > 0 ? 'text-white text-sm truncate pr-2' : 'text-gray-500 text-sm'}>
                        {formData.segments.length > 0 
                          ? formData.segments.slice(0, 3).join(', ') + (formData.segments.length > 3 ? ` +${formData.segments.length - 3}` : '')
                          : 'Selecione os segmentos'}
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${segmentDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {segmentDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {segmentOptions.map((segment) => (
                          <div 
                            key={segment} 
                            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 cursor-pointer"
                            onClick={() => handleArrayToggle('segments', segment)}
                          >
                            <Checkbox
                              checked={formData.segments.includes(segment)}
                              className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary pointer-events-none"
                            />
                            <span className="text-sm text-white cursor-pointer flex-1">
                              {segment}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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

                {/* Plataforma */}
                <div className="space-y-2">
                  <Label className="text-white">Qual a plataforma da sua loja virtual? *</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50 max-h-60">
                      {platformOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white hover:text-white">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fase do negócio */}
                <div className="space-y-2">
                  <Label className="text-white">Em que fase seu negócio se encontra? *</Label>
                  <Select
                    value={formData.businessPhase}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, businessPhase: value }))}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione a fase" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      {businessPhaseOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white hover:text-white">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                          onCheckedChange={() => handleArrayToggle('salesChannels', channel.id)}
                          className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label htmlFor={`channel-${channel.id}`} className="text-sm text-gray-300 cursor-pointer hover:text-white">
                          {channel.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* De onde vem a maior parte das vendas */}
                <div className="space-y-3">
                  <Label className="text-white">De onde vem a maior parte das suas vendas? *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {mainSalesSourceOptions.map((source) => (
                      <div key={source.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`source-${source.id}`}
                          checked={formData.mainSalesSources.includes(source.id)}
                          onCheckedChange={() => handleArrayToggle('mainSalesSources', source.id)}
                          className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label htmlFor={`source-${source.id}`} className="text-sm text-gray-300 cursor-pointer hover:text-white">
                          {source.label}
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
                  <Label className="text-white">Qual o faturamento médio mensal do seu negócio? *</Label>
                  <Select
                    value={formData.monthlyRevenue}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, monthlyRevenue: value }))}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione o faturamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      {revenueOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white hover:text-white">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Áreas desafiadoras */}
                <div className="space-y-3">
                  <Label className="text-white">Quais são as áreas mais desafiadoras do seu negócio? *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {challengingAreasOptions.map((area) => (
                      <div key={area.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`area-${area.id}`}
                          checked={formData.challengingAreas.includes(area.id)}
                          onCheckedChange={() => handleArrayToggle('challengingAreas', area.id)}
                          className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label htmlFor={`area-${area.id}`} className="text-sm text-gray-300 cursor-pointer hover:text-white">
                          {area.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Objetivo 6 meses */}
                <div className="space-y-2">
                  <Label htmlFor="sixMonthObjective" className="text-white">Qual é seu principal objetivo para os próximos 6 meses? *</Label>
                  <Textarea
                    id="sixMonthObjective"
                    placeholder="Descreva qual é seu principal objetivo para os próximos 6 meses..."
                    value={formData.sixMonthObjective}
                    onChange={(e) => handleChange('sixMonthObjective', e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                    required
                  />
                </div>

                {/* Termos de uso */}
                <div className="flex items-start space-x-2 pt-4 border-t border-gray-700">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAccepted: !!checked }))}
                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
                    Li e estou de acordo com os{' '}
                    <Link to="/termos" className="text-primary hover:underline">termos de uso</Link>
                    {' '}e{' '}
                    <Link to="/privacidade" className="text-primary hover:underline">políticas de privacidade</Link>
                    {' '}da Way E-commerce. *
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!isStep2Valid()}
                >
                  Continuar para o Diagnóstico
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
