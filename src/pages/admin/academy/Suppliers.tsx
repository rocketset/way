// Página de Lista de Fornecedores da Academy
// Placeholder - Em breve

import { Construction, Clock } from 'lucide-react';

export default function Suppliers() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <Construction className="h-12 w-12 text-muted-foreground" />
        </div>
        {/* Ícone vermelho de "Em breve" */}
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
          <Clock className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Lista de Fornecedores</h1>
        <p className="text-muted-foreground max-w-md">
          Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
        </p>
        <p className="text-sm text-muted-foreground">
          Aqui você poderá encontrar uma lista completa de fornecedores parceiros.
        </p>
      </div>
    </div>
  );
}
