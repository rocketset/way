import { useTheme } from "@/contexts/ThemeContext";
import logoWay from "@/assets/logo-way.png";
import logoWayBlack from "@/assets/logo-way-black.png";
import heroBanner from "@/assets/hero-banner.png";

const Footer = () => {
  const { actualTheme } = useTheme();
  const currentLogo = actualTheme === 'dark' ? logoWayBlack : logoWay;
  
  return <footer className="bg-background border-t border-border">
      {/* Banner Section */}
      

      {/* Links Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-foreground mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sobre</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Carreiras</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">LINKS</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Soluções</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cases</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Suporte</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">SUPORTE</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentação</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">REDES SOCIAIS</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <img src={currentLogo} alt="Way+" className="h-6" />
          <p className="text-sm text-muted-foreground">
            © 2025 Way+ E-commerce. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;