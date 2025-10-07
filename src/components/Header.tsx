import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoWay from "@/assets/logo-way.png";
import iconNuvemshop from "@/assets/icon-nuvemshop.svg";
import iconWordpress from "@/assets/icon-wordpress.svg";

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);

  // Handle scroll detection for all pages
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Only detect active section on homepage
      if (location.pathname === '/') {
        const sections = ["inicio", "por-que-way", "solucoes", "cases", "contato"];
        const current = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        if (current) setActiveSection(current);
      }
    };

    handleScroll(); // Run once on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Set active section based on current route
  useEffect(() => {
    if (location.pathname === '/why-way') {
      setActiveSection('por-que-way');
    } else if (location.pathname === '/blog' || location.pathname.startsWith('/blog/')) {
      setActiveSection('blog');
    } else if (location.pathname === '/cases' || location.pathname.startsWith('/cases/')) {
      setActiveSection('cases');
    } else if (location.pathname === '/contact') {
      setActiveSection('contato');
    } else if (location.pathname !== '/') {
      setActiveSection('');
    }
  }, [location.pathname]);

  const navItems = [
    { id: "inicio", label: "Início", type: "link", path: "/" },
    { id: "por-que-way", label: "Sobre", type: "link", path: "/why-way" },
    { id: "solucoes", label: "Soluções", type: "scroll" },
    { id: "cases", label: "Cases", type: "link", path: "/cases" },
    { id: "blog", label: "Blog", type: "link", path: "/blog" },
    { id: "contato", label: "Contato", type: "link", path: "/contact" },
  ];

  const platformItems = [
    { label: "Nuvem Shop", icon: iconNuvemshop },
    { label: "Wordpress", icon: iconWordpress },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.type === "link" && item.path) {
      // Use window.location for navigation to ensure page reload and scroll to top
      window.location.href = item.path;
    } else {
      // For scroll items, only work on homepage
      if (location.pathname === '/') {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setIsMobileMenuOpen(false);
        }
      } else {
        // If not on homepage, navigate to homepage first
        window.location.href = "/#" + item.id;
      }
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              to="/"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img 
                src={logoWay} 
                alt="Way+ E-commerce" 
                className="h-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" 
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                {/* First 3 items: INÍCIO, POR QUE A WAY?, SOLUÇÕES */}
                {navItems.slice(0, 3).map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${
                      activeSection === item.id
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {/* Active indicator with animation */}
                    {activeSection === item.id && (
                      <>
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-ping" />
                      </>
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Animated underline on hover */}
                    <div className={`absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                      activeSection === item.id ? "scale-x-100" : ""
                    }`} />
                  </button>
                ))}
                
                {/* Plataformas Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group text-foreground/70 hover:text-foreground">
                      <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-1">
                        Plataformas
                        <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                      </span>
                      <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="center" 
                    className="w-56 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl"
                  >
                    {platformItems.map((platform) => (
                      <DropdownMenuItem 
                        key={platform.label}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all duration-300 rounded-lg group"
                      >
                        <img 
                          src={platform.icon} 
                          alt={platform.label}
                          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="font-medium group-hover:text-black transition-colors duration-300">
                          {platform.label}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Last 3 items: CASES, BLOG, CONTATO */}
                {navItems.slice(3).map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${
                      activeSection === item.id
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {/* Active indicator with animation */}
                    {activeSection === item.id && (
                      <>
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-ping" />
                      </>
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Animated underline on hover */}
                    <div className={`absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                      activeSection === item.id ? "scale-x-100" : ""
                    }`} />
                  </button>
                ))}
              </div>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
            <Button 
                onClick={() => handleNavClick(navItems.find(item => item.id === "contato")!)}
                className="relative bg-gradient-to-r from-primary via-yellow-500 to-primary text-gray-900 hover:shadow-2xl font-bold px-6 py-3 rounded-full transition-all duration-300 overflow-hidden group hover:scale-105"
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <span className="relative z-10 flex items-center gap-2">
                  Falar com a gente
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>

                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping opacity-20" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Animated bottom border */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        )}
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity duration-500 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu content */}
        <div
          className={`absolute top-20 left-0 right-0 bg-card/80 backdrop-blur-lg border-b border-border transition-transform duration-500 ${
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <nav className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-2">
              {navItems.slice(0, 3).map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center justify-between px-6 py-4 text-left font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary shadow-lg"
                      : "bg-background/50 text-foreground hover:bg-primary/5"
                  }`}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                    activeSection === item.id ? "translate-x-1" : ""
                  }`} />
                </button>
              ))}
              
              {/* Plataformas Menu */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
                  className="flex items-center justify-between px-6 py-4 text-left font-medium rounded-xl transition-all duration-300 bg-background/50 text-foreground hover:bg-primary/5"
                  style={{
                    animationDelay: `0.15s`,
                  }}
                >
                  <span>Plataformas</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                    isPlatformMenuOpen ? "rotate-180" : ""
                  }`} />
                </button>
                
                {/* Submenu de Plataformas */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  isPlatformMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="flex flex-col gap-2 pl-4">
                    {platformItems.map((platform) => (
                      <button
                        key={platform.label}
                        className="flex items-center gap-3 px-6 py-3 text-left font-medium rounded-xl transition-all duration-300 bg-background/30 text-foreground hover:bg-primary/5"
                      >
                        <img 
                          src={platform.icon} 
                          alt={platform.label}
                          className="w-5 h-5"
                        />
                        <span>{platform.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {navItems.slice(3).map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center justify-between px-6 py-4 text-left font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary shadow-lg"
                      : "bg-background/50 text-foreground hover:bg-primary/5"
                  }`}
                  style={{
                    animationDelay: `${(index + 4) * 0.05}s`,
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                    activeSection === item.id ? "translate-x-1" : ""
                  }`} />
                </button>
              ))}
              
              <Button
                onClick={() => handleNavClick(navItems.find(item => item.id === "contato")!)}
                className="mt-4 bg-gradient-to-r from-primary via-yellow-500 to-primary text-gray-900 hover:shadow-2xl font-bold py-6 rounded-xl"
              >
                Falar com a gente
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
