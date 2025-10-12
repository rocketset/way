import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Phone, Globe, MapPin } from "lucide-react";

// Lista de fornecedores recomendados
const suppliers = [
  {
    id: 1,
    name: "TechSolutions Brasil",
    category: "Tecnologia e Desenvolvimento",
    description: "Empresa especializada em soluções de software e desenvolvimento web",
    email: "contato@techsolutions.com.br",
    phone: "+55 11 3456-7890",
    website: "www.techsolutions.com.br",
    location: "São Paulo, SP"
  },
  {
    id: 2,
    name: "Marketing Digital Pro",
    category: "Marketing e Publicidade",
    description: "Agência focada em estratégias de marketing digital e gestão de mídias sociais",
    email: "info@marketingpro.com.br",
    phone: "+55 21 2345-6789",
    website: "www.marketingpro.com.br",
    location: "Rio de Janeiro, RJ"
  },
  {
    id: 3,
    name: "Cloud Services Inc",
    category: "Infraestrutura e Cloud",
    description: "Provedor de serviços de cloud computing e infraestrutura",
    email: "sales@cloudservices.com",
    phone: "+55 11 4567-8901",
    website: "www.cloudservices.com",
    location: "São Paulo, SP"
  },
  {
    id: 4,
    name: "Design Studio",
    category: "Design e UX",
    description: "Estúdio de design especializado em UX/UI e identidade visual",
    email: "hello@designstudio.com.br",
    phone: "+55 48 3210-9876",
    website: "www.designstudio.com.br",
    location: "Florianópolis, SC"
  },
  {
    id: 5,
    name: "E-commerce Solutions",
    category: "E-commerce",
    description: "Soluções completas para lojas virtuais e marketplaces",
    email: "contato@ecommercesol.com.br",
    phone: "+55 11 5678-9012",
    website: "www.ecommercesol.com.br",
    location: "São Paulo, SP"
  },
  {
    id: 6,
    name: "Consultoria Empresarial",
    category: "Consultoria",
    description: "Consultoria em gestão empresarial e processos",
    email: "consultoria@empresarial.com.br",
    phone: "+55 31 2109-8765",
    website: "www.consultoriaempresarial.com.br",
    location: "Belo Horizonte, MG"
  }
];

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lista de Fornecedores</h1>
        <p className="text-muted-foreground mt-2">
          Fornecedores recomendados e parceiros de confiança
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {supplier.category}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {supplier.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a 
                    href={`mailto:${supplier.email}`}
                    className="hover:text-primary transition-colors truncate"
                  >
                    {supplier.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a 
                    href={`tel:${supplier.phone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {supplier.phone}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <a 
                    href={`https://${supplier.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors truncate"
                  >
                    {supplier.website}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{supplier.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
