import { Megaphone, Users, LayoutDashboard, ShoppingCart, DollarSign, LucideIcon } from 'lucide-react';

export interface DiagnosticTool {
  id: string;
  name: string;
  description: string;
  importance: string;
}

export interface DiagnosticHub {
  id: string;
  name: string;
  icon: LucideIcon;
  tools: DiagnosticTool[];
}

export const diagnosticHubs: DiagnosticHub[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Megaphone,
    tools: [
      {
        id: 'video-commerce',
        name: 'Vídeo Commerce',
        description: 'Vídeos interativos que demonstram produtos e aumentam conversão.',
        importance: 'Aumenta conversão em até 80% através de experiências interativas com vídeo'
      },
      {
        id: 'web-push',
        name: 'Web Push',
        description: 'Notificações diretas no navegador para recuperar carrinhos abandonados.',
        importance: 'Recupera até 30% dos carrinhos abandonados com notificações diretas'
      },
      {
        id: 'popup',
        name: 'Pop-up',
        description: 'Janelas estratégicas para capturar leads e reduzir abandono de carrinho.',
        importance: 'Captura leads e reduz abandono com ofertas estratégicas no momento certo'
      },
      {
        id: 'sites',
        name: 'Sites',
        description: 'Presença online profissional para transmitir credibilidade à sua marca.',
        importance: 'Presença digital profissional que transmite credibilidade e confiança'
      },
      {
        id: 'landing-pages',
        name: 'Landing Pages',
        description: 'Páginas focadas em conversão para campanhas e lançamentos específicos.',
        importance: 'Páginas otimizadas para conversão de campanhas específicas'
      },
      {
        id: 'automacoes',
        name: 'Automações',
        description: 'Processos automatizados de marketing como emails e fluxos de nutrição.',
        importance: 'Escala suas ações de marketing sem aumentar equipe'
      },
      {
        id: 'gestao-trafego',
        name: 'Gestão de Tráfego',
        description: 'Gerenciamento de anúncios pagos em Google, Facebook, Instagram e TikTok.',
        importance: 'Otimiza investimento em mídia paga e reduz custo de aquisição'
      },
      {
        id: 'calendario-comercial',
        name: 'Calendário Comercial',
        description: 'Planejamento de ações para Black Friday, Natal e outras datas importantes.',
        importance: 'Planeja e antecipa ações para datas sazonais e eventos importantes'
      }
    ]
  },
  {
    id: 'relacionamento',
    name: 'Relacionamento',
    icon: Users,
    tools: [
      {
        id: 'fluxos',
        name: 'Fluxos',
        description: 'Sequências automáticas de mensagens (WhatsApp, email, SMS) por etapa da jornada.',
        importance: 'Automatiza comunicação em diferentes estágios da jornada do cliente'
      },
      {
        id: 'comunidades',
        name: 'Comunidades',
        description: 'Grupos exclusivos para criar conexão e engajamento entre os clientes.',
        importance: 'Cria engajamento e transforma clientes em defensores da marca'
      },
      {
        id: 'crm',
        name: 'CRM',
        description: 'Sistema para centralizar dados de clientes e histórico de interações.',
        importance: 'Centraliza dados e histórico para atendimento personalizado'
      },
      {
        id: 'sac',
        name: 'SAC',
        description: 'Plataforma de atendimento ao cliente com chat, ticket e gestão de demandas.',
        importance: 'Garante suporte eficiente e aumenta satisfação do cliente'
      }
    ]
  },
  {
    id: 'gestao',
    name: 'Gestão',
    icon: LayoutDashboard,
    tools: [
      {
        id: 'mapas-mentais',
        name: 'Mapas Mentais',
        description: 'Ferramenta visual para organizar ideias, processos e estratégias da equipe.',
        importance: 'Organiza ideias e estratégias de forma visual e colaborativa'
      },
      {
        id: 'kanban',
        name: 'Kanban',
        description: 'Quadro de gestão visual de tarefas e projetos (estilo Trello).',
        importance: 'Gerencia projetos e tarefas com visibilidade total do fluxo de trabalho'
      }
    ]
  },
  {
    id: 'comercial',
    name: 'Comercial',
    icon: ShoppingCart,
    tools: [
      {
        id: 'precificacao',
        name: 'Precificação',
        description: 'Estratégia de preços considerando custos, concorrência e valor percebido.',
        importance: 'Define preços competitivos que maximizam margem e vendas'
      },
      {
        id: 'qualidade-produtos',
        name: 'Qualidade de Produtos',
        description: 'Controle de qualidade de fotos, descrições e especificações dos produtos.',
        importance: 'Garante padrão de excelência e reduz devoluções'
      }
    ]
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    icon: DollarSign,
    tools: [
      {
        id: 'fluxo-caixa',
        name: 'Fluxo de Caixa',
        description: 'Controle de entradas e saídas de dinheiro para evitar problemas financeiros.',
        importance: 'Controla entradas e saídas para garantir saúde financeira'
      },
      {
        id: 'conciliacao',
        name: 'Conciliação',
        description: 'Conferência automática entre vendas realizadas e pagamentos recebidos.',
        importance: 'Evita erros e perdas com conferência automática de transações'
      },
      {
        id: 'dashboard-financeiro',
        name: 'Dashboard Financeiro',
        description: 'Painel com visão geral de receitas, despesas e indicadores financeiros.',
        importance: 'Visualiza métricas financeiras em tempo real para decisões rápidas'
      },
      {
        id: 'relatorios',
        name: 'Relatórios',
        description: 'Relatórios analíticos para tomada de decisão baseada em dados.',
        importance: 'Gera insights estratégicos através de análise de dados consolidados'
      }
    ]
  }
];

export const getTotalTools = (): number => {
  return diagnosticHubs.reduce((total, hub) => total + hub.tools.length, 0);
};

export const calculateScore = (answers: Record<string, boolean>): number => {
  const totalTools = getTotalTools();
  const activeTools = Object.values(answers).filter(Boolean).length;
  return Math.round((activeTools / totalTools) * 100);
};

export const getScoreLevel = (score: number): { level: string; color: string; bgColor: string } => {
  if (score >= 80) return { level: 'Excelente', color: 'text-green-500', bgColor: 'bg-green-500' };
  if (score >= 60) return { level: 'Bom', color: 'text-blue-500', bgColor: 'bg-blue-500' };
  if (score >= 40) return { level: 'Médio', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
  return { level: 'Inicial', color: 'text-red-500', bgColor: 'bg-red-500' };
};

export const getHubScore = (hubId: string, answers: Record<string, boolean>): number => {
  const hub = diagnosticHubs.find(h => h.id === hubId);
  if (!hub) return 0;
  
  const hubTools = hub.tools.map(t => t.id);
  const activeInHub = hubTools.filter(toolId => answers[toolId]).length;
  return Math.round((activeInHub / hub.tools.length) * 100);
};

export const getRecommendations = (answers: Record<string, boolean>): { hub: DiagnosticHub; tools: DiagnosticTool[] }[] => {
  return diagnosticHubs
    .map(hub => ({
      hub,
      tools: hub.tools.filter(tool => !answers[tool.id])
    }))
    .filter(item => item.tools.length > 0);
};

export const getActiveTools = (answers: Record<string, boolean>): { hub: DiagnosticHub; tools: DiagnosticTool[] }[] => {
  return diagnosticHubs
    .map(hub => ({
      hub,
      tools: hub.tools.filter(tool => answers[tool.id])
    }))
    .filter(item => item.tools.length > 0);
};
