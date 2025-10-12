import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, UserCheck, FileText, Mail } from "lucide-react";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Políticas de Privacidade | Way E-commerce</title>
        <meta name="description" content="Política de Privacidade da Way E-commerce. Saiba como coletamos, usamos e protegemos seus dados pessoais." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Políticas de Privacidade
                </h1>
                <p className="text-muted-foreground text-lg">
                  Última atualização: Janeiro de 2025
                </p>
              </div>

              {/* Content */}
              <div className="space-y-8 text-foreground/90">
                {/* Section 1 */}
                <section className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">1. Introdução</h2>
                      <p className="leading-relaxed">
                        A Way E-commerce está comprometida em proteger a privacidade e os dados pessoais de seus usuários. 
                        Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações 
                        quando você utiliza nossos serviços, acessa nosso website ou interage conosco.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">2. Dados que Coletamos</h2>
                      <p className="leading-relaxed mb-4">
                        Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Dados de identificação:</strong> Nome, e-mail, telefone, empresa</li>
                        <li><strong>Dados de navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas</li>
                        <li><strong>Dados de comunicação:</strong> Mensagens enviadas através de formulários de contato</li>
                        <li><strong>Cookies:</strong> Informações armazenadas no seu navegador para melhorar a experiência</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <UserCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">3. Como Usamos seus Dados</h2>
                      <p className="leading-relaxed mb-4">
                        Utilizamos suas informações pessoais para:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Responder às suas solicitações e fornecer suporte</li>
                        <li>Enviar comunicações sobre nossos serviços e conteúdos relevantes</li>
                        <li>Melhorar nossos serviços e personalizar sua experiência</li>
                        <li>Realizar análises e pesquisas para desenvolvimento de negócios</li>
                        <li>Cumprir obrigações legais e regulatórias</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">4. Proteção de Dados</h2>
                      <p className="leading-relaxed mb-4">
                        Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra 
                        acesso não autorizado, alteração, divulgação ou destruição:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Criptografia de dados em trânsito e em repouso</li>
                        <li>Controles de acesso rigorosos e autenticação</li>
                        <li>Monitoramento contínuo de segurança</li>
                        <li>Backups regulares e planos de recuperação</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">5. Seus Direitos (LGPD)</h2>
                      <p className="leading-relaxed mb-4">
                        De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Confirmação da existência de tratamento de dados</li>
                        <li>Acesso aos seus dados pessoais</li>
                        <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                        <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                        <li>Portabilidade dos dados a outro fornecedor</li>
                        <li>Eliminação dos dados tratados com seu consentimento</li>
                        <li>Revogação do consentimento</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 6 */}
                <section className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">6. Compartilhamento de Dados</h2>
                      <p className="leading-relaxed mb-4">
                        Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing. 
                        Podemos compartilhar dados apenas:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Com prestadores de serviços que nos auxiliam nas operações</li>
                        <li>Quando exigido por lei ou ordem judicial</li>
                        <li>Para proteger nossos direitos e propriedade</li>
                        <li>Com seu consentimento explícito</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 7 */}
                <section className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">7. Contato</h2>
                      <p className="leading-relaxed mb-4">
                        Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato conosco:
                      </p>
                      <div className="space-y-2 ml-4">
                        <p><strong>E-mail:</strong> contato@wayecommerce.com.br</p>
                        <p><strong>Telefone:</strong> (83) 99644-3602</p>
                        <p><strong>Endereço:</strong> João Pessoa, Paraíba - Brasil</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 8 */}
                <section className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">8. Alterações na Política</h2>
                      <p className="leading-relaxed">
                        Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você revise 
                        esta página regularmente para se manter informado sobre como protegemos suas informações. 
                        A data da última atualização será sempre indicada no topo desta página.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Privacy;
