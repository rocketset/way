import { useParams, Link } from "react-router-dom";
import { useCase } from "@/hooks/useCase";
import { useCaseBlocks } from "@/hooks/useCaseBlocks";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroBlock } from "@/components/case/HeroBlock";
import { TextColumnsBlock } from "@/components/case/TextColumnsBlock";
import { BenefitsBlock } from "@/components/case/BenefitsBlock";
import CaseContactForm from "@/components/CaseContactForm";

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: caseData, isLoading, error } = useCase(id || "");
  const { data: blocks, isLoading: blocksLoading } = useCaseBlocks(id || "");

  if (isLoading || blocksLoading) {
    return (
      <div className="min-h-screen bg-black py-20 px-6">
        <div className="container mx-auto space-y-8">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-lg">Case não encontrado</p>
          <Link to="/cases">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Cases
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Link to="/cases">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Cases
          </Button>
        </Link>
      </div>

      {/* Render Dynamic Blocks */}
      {blocks?.map((block) => {
        switch (block.block_type) {
          case "hero":
            return <HeroBlock key={block.id} data={block.content as import("@/hooks/useCaseBlocks").HeroBlockContent} />;
          case "text_columns":
            return <TextColumnsBlock key={block.id} data={block.content as import("@/hooks/useCaseBlocks").TextColumnsBlockContent} />;
          case "benefits":
            return <BenefitsBlock key={block.id} data={block.content as import("@/hooks/useCaseBlocks").BenefitsBlockContent} />;
          default:
            return null;
        }
      })}

      {/* Contact Form */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="container mx-auto">
          <CaseContactForm />
        </div>
      </section>
    </div>
  );
};

export default CaseDetail;
