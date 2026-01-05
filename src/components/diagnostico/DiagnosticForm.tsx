import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface DiagnosticFormData {
  name: string;
  email: string;
  storeUrl: string;
  instagram: string;
  whatsapp: string;
}

interface DiagnosticFormProps {
  onSubmit: (data: DiagnosticFormData) => void;
  onBack: () => void;
}

export const DiagnosticForm = ({ onSubmit, onBack }: DiagnosticFormProps) => {
  const [formData, setFormData] = useState<DiagnosticFormData>({
    name: '',
    email: '',
    storeUrl: '',
    instagram: '',
    whatsapp: ''
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

  const isValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const whatsappClean = formData.whatsapp.replace(/\D/g, '');
    
    return (
      formData.name.trim().length >= 2 &&
      emailRegex.test(formData.email) &&
      formData.storeUrl.trim().length > 0 &&
      formData.instagram.trim().length > 0 &&
      whatsappClean.length >= 10
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
      <div className="container mx-auto max-w-lg">
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
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome completo</Label>
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
              <Label htmlFor="email" className="text-white">E-mail</Label>
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
              <Label htmlFor="storeUrl" className="text-white">Link da loja virtual</Label>
              <Input
                id="storeUrl"
                type="text"
                placeholder="sualoja.com.br"
                value={formData.storeUrl}
                onChange={(e) => handleChange('storeUrl', e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                required
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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-white">WhatsApp</Label>
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
