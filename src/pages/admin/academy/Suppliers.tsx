// Página de Lista de Fornecedores da Academy
// Placeholder - Em construção

import { Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Suppliers() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
        <Construction className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">Lista de Fornecedores</h1>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Em construção
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-md">
          Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
        </p>
      </div>
    </div>
  );
}
