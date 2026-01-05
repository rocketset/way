import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Settings } from 'lucide-react';
import DiagnosticsList from './List';
import DiagnosticConfig from './Config';

const DiagnosticosIndex = () => {
  const [activeTab, setActiveTab] = useState('respostas');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="respostas" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Respostas
          </TabsTrigger>
          <TabsTrigger value="configurar" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="respostas" className="mt-6">
          <DiagnosticsList />
        </TabsContent>

        <TabsContent value="configurar" className="mt-6">
          <DiagnosticConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagnosticosIndex;
