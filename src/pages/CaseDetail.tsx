import { useParams } from "react-router-dom";
import { useCase } from "@/hooks/useCase";
import { useCaseBlocks } from "@/hooks/useCaseBlocks";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroBlock } from "@/components/case/HeroBlock";
import { TextColumnsBlock } from "@/components/case/TextColumnsBlock";
import { BenefitsBlock } from "@/components/case/BenefitsBlock";
import { ClientInfoBlock } from "@/components/case/ClientInfoBlock";
import CaseContactForm from "@/components/CaseContactForm";
import MockupSection from "@/components/MockupSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: caseData, isLoading, error } = useCase(id || "");
  const { data: blocks, isLoading: blocksLoading } = useCaseBlocks(id || "");
  
  // Fetch case tags
  const { data: caseTags = [] } = useQuery({
    queryKey: ['case-tags-detail', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('case_tags')
        .select('tag_id, tags(id, nome)')
        .eq('case_id', id);
      
      if (error) throw error;
      
      return data.map(ct => ({
        id: ct.tags?.id || '',
        nome: ct.tags?.nome || ''
      }));
    },
    enabled: !!id
  });

  if (isLoading || blocksLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background py-32 px-6">
          <div className="container mx-auto space-y-8">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (error || !caseData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">404</h1>
            <p className="text-muted-foreground text-lg">Case não encontrado</p>
            <a href="/cases" className="inline-block text-primary hover:underline">
              Voltar para Cases
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="min-h-screen bg-background">
        {/* Render Dynamic Blocks */}
        {blocks?.map((block) => {
        // Find hero block to pass to ClientInfoBlock
        const heroBlock = blocks.find(b => b.block_type === "hero");
        const heroData = heroBlock ? {
          ...(heroBlock.content as import("@/hooks/useCaseBlocks").HeroBlockContent),
          tags: caseTags
        } : undefined;

        switch (block.block_type) {
          case "client_info":
            return <ClientInfoBlock 
              key={block.id} 
              data={block.content as import("@/hooks/useCaseBlocks").ClientInfoBlockContent} 
              caseId={id || ""} 
              heroData={heroData}
            />;
          case "hero":
            // Skip rendering hero separately as it's now inside ClientInfoBlock
            return null;
          case "text_columns":
            return <TextColumnsBlock key={block.id} data={block.content as import("@/hooks/useCaseBlocks").TextColumnsBlockContent} />;
          case "benefits":
            return <BenefitsBlock key={block.id} data={block.content as import("@/hooks/useCaseBlocks").BenefitsBlockContent} />;
          default:
            return null;
        }
      })}

        {/* MacBook Mockup Section */}
        {caseData?.mockup_screenshot_url && (
          <MockupSection 
            screenshotUrl={caseData.mockup_screenshot_url}
            title="Veja o projeto em ação"
            description="Conheça como transformamos ideias em soluções digitais de sucesso"
          />
        )}

        {/* Contact Form */}
        <section className="py-24 px-6 bg-gradient-to-b from-background via-card/20 to-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Quer resultados como este?
              </h2>
              <p className="text-lg text-muted-foreground">
                Entre em contato e descubra como podemos transformar seu negócio
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-primary via-accent to-transparent rounded-full mx-auto mt-6" />
            </div>
            <CaseContactForm />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CaseDetail;
