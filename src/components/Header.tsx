import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight, ChevronDown, Rocket, User } from "lucide-react";
import logoWay from "@/assets/logo-way.png";

interface HeaderProps {
  variant?: 'default' | 'landing';
}

const Header = ({ variant = 'default' }: HeaderProps) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isSolutionsMenuOpen, setIsSolutionsMenuOpen] = useState(false);
  const [isNovidadesMenuOpen, setIsNovidadesMenuOpen] = useState(false);
  
  // Desktop hover states
  const [solutionsHovered, setSolutionsHovered] = useState(false);
  const [novidadesHovered, setNovidadesHovered] = useState(false);
  const solutionsTimeoutRef = useRef<NodeJS.Timeout>();
  const novidadesTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle scroll detection for all pages
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Only detect active section on homepage when user has scrolled
      if (location.pathname === '/' && window.scrollY > 50) {
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
    
    // Only check scroll position on mount, don't run section detection
    setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Set active section based on current route
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveSection('inicio');
    } else if (location.pathname === '/why-way') {
      setActiveSection('por-que-way');
    } else if (location.pathname === '/blog' || location.pathname.startsWith('/blog/')) {
      setActiveSection('blog');
    } else if (location.pathname === '/cases' || location.pathname.startsWith('/cases/')) {
      setActiveSection('cases');
    } else if (location.pathname === '/contact') {
      setActiveSection('contato');
    } else {
      setActiveSection('');
    }
  }, [location.pathname]);

  const defaultNavItems = [{
    id: "inicio",
    label: "Início",
    type: "link",
    path: "/"
  }, {
    id: "por-que-way",
    label: "Sobre",
    type: "link",
    path: "/why-way"
  }, {
    id: "cases",
    label: "Cases",
    type: "link",
    path: "/cases"
  }, {
    id: "contato",
    label: "Contato",
    type: "link",
    path: "/contact"
  }];

  const landingNavItems = [{
    id: "como-funciona",
    label: "Como funciona",
    type: "anchor",
    anchor: "#como-funciona"
  }, {
    id: "o-que-descobre",
    label: "O que você descobre",
    type: "anchor",
    anchor: "#o-que-descobre"
  }, {
    id: "quem-somos",
    label: "Quem somos",
    type: "anchor",
    anchor: "#quem-somos"
  }];

  const navItems = variant === 'landing' ? landingNavItems : defaultNavItems;

  const novidadesItems = [{
    label: "Blog",
    path: "/blog",
    isExternal: false,
    isClient: false
  }, {
    label: "Relatórios e Guias",
    path: "/clientes/relatorios-guias",
    isExternal: false,
    isClient: true
  }, {
    label: "Central de ajuda",
    path: "/clientes/central-ajuda",
    isExternal: false,
    isClient: true
  }, {
    label: "Agenda de Eventos do Setor",
    path: "/blog/agenda-de-eventos-do-setor-do-e-commerce-2026",
    isExternal: false,
    isClient: false
  }];

  const solutionItems = [{
    label: "Mentoria e Consultoria",
    path: "/solucoes/consultoria",
    isExternal: false
  }, {
    label: "Implantação e Desenvolvimento",
    path: "/solucoes/implantacao-desenvolvimento",
    isExternal: false
  }, {
    label: "Performance e Marketing",
    path: "/solucoes/performance-marketing",
    isExternal: false
  }];

  const handleNavClick = (item: typeof defaultNavItems[0]) => {
    if (item.type === "link" && item.path) {
      window.location.href = item.path;
    } else {
      if (location.pathname === '/') {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth"
          });
          setIsMobileMenuOpen(false);
        }
      } else {
        window.location.href = "/#" + item.id;
      }
    }
  };

  // Handlers for hover dropdowns
  const handleSolutionsEnter = () => {
    clearTimeout(solutionsTimeoutRef.current);
    setSolutionsHovered(true);
  };

  const handleSolutionsLeave = () => {
    solutionsTimeoutRef.current = setTimeout(() => {
      setSolutionsHovered(false);
    }, 150);
  };

  const handleNovidadesEnter = () => {
    clearTimeout(novidadesTimeoutRef.current);
    setNovidadesHovered(true);
  };

  const handleNovidadesLeave = () => {
    novidadesTimeoutRef.current = setTimeout(() => {
      setNovidadesHovered(false);
    }, 150);
  };

  return <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || location.pathname !== "/" ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg" : "bg-transparent"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <img src={logoWay} alt="Way+ E-commerce" className="h-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center ${variant === 'landing' ? 'ml-8' : 'justify-center flex-1 mx-8'}`}>
            <div className={`flex items-center gap-1 bg-background/50 backdrop-blur-sm px-4 py-2 border border-border/50 ${variant === 'landing' ? 'rounded-md' : 'rounded-full'}`}>
              {variant === 'landing' ? (
                /* Landing page - Anchor navigation */
                <>
                  {landingNavItems.map((item) => (
                    <a 
                      key={item.id} 
                      href={item.anchor}
                      className="relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md group text-foreground/70 hover:text-foreground"
                    >
                      <div className="absolute inset-0 bg-primary/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">{item.label}</span>
                      <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </a>
                  ))}
                </>
              ) : (
                /* Default - Full navigation with dropdowns */
                <>
                  {/* First 2 items: INÍCIO, SOBRE */}
                  {navItems.slice(0, 2).map((item) => (
                    <button 
                      key={item.id} 
                      onClick={() => handleNavClick(item)} 
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${activeSection === item.id ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
                    >
                      {activeSection === item.id && <>
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-ping" />
                      </>}
                      <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">{item.label}</span>
                      <div className={`absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activeSection === item.id ? "scale-x-100" : ""}`} />
                    </button>
                  ))}
                  
                  {/* Soluções Dropdown with Hover */}
                  <div 
                    className="relative"
                    onMouseEnter={handleSolutionsEnter}
                    onMouseLeave={handleSolutionsLeave}
                  >
                    <button className="relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group text-foreground/70 hover:text-foreground">
                      <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-1">
                        Soluções
                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${solutionsHovered ? "rotate-180" : ""}`} />
                      </span>
                      <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </button>
                    
                    {/* Dropdown Content */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${solutionsHovered ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                      <div className="w-72 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-lg p-2">
                        {solutionItems.map(solution => (
                          solution.isExternal ? (
                            <a 
                              key={solution.label} 
                              href={solution.path} 
                              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all duration-300 rounded-lg group"
                            >
                              <span className="font-medium group-hover:text-foreground transition-colors duration-300">
                                {solution.label}
                              </span>
                              {solution.label === "Jornada Way" && <Rocket className="h-5 w-5 text-primary transition-colors duration-300" />}
                            </a>
                          ) : (
                            <Link 
                              key={solution.label} 
                              to={solution.path} 
                              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all duration-300 rounded-lg group"
                            >
                              <span className="font-medium group-hover:text-foreground transition-colors duration-300">
                                {solution.label}
                              </span>
                              {solution.label === "Jornada Way" && <Rocket className="h-5 w-5 text-primary transition-colors duration-300" />}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CASES button */}
                  <button 
                    onClick={() => handleNavClick(defaultNavItems.find(item => item.id === "cases")!)} 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${activeSection === "cases" ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
                  >
                    {activeSection === "cases" && <>
                      <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-ping" />
                    </>}
                    <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Cases</span>
                    <div className={`absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activeSection === "cases" ? "scale-x-100" : ""}`} />
                  </button>

                  {/* Novidades Dropdown with Hover */}
                  <div 
                    className="relative"
                    onMouseEnter={handleNovidadesEnter}
                    onMouseLeave={handleNovidadesLeave}
                  >
                    <button className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${activeSection === "blog" ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}>
                      {activeSection === "blog" && <>
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-ping" />
                      </>}
                      <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-1">
                        Novidades
                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${novidadesHovered ? "rotate-180" : ""}`} />
                      </span>
                      <div className={`absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activeSection === "blog" ? "scale-x-100" : ""}`} />
                    </button>
                    
                    {/* Dropdown Content */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${novidadesHovered ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                      <div className="w-72 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-lg p-2">
                        {novidadesItems.map(item => (
                          <Link 
                            key={item.label} 
                            to={item.path} 
                            className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all duration-300 rounded-lg group"
                          >
                            <span className="font-medium group-hover:text-foreground transition-colors duration-300">
                              {item.label}
                            </span>
                            {item.isClient && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 transition-all duration-300">
                                Clientes
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Trabalhe conosco button */}
                  <Link to="/carreiras" className="relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group text-foreground/70 hover:text-foreground">
                    <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Trabalhe conosco</span>
                    <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </Link>

                  {/* CONTATO button */}
                  <button 
                    onClick={() => handleNavClick(defaultNavItems.find(item => item.id === "contato")!)} 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${activeSection === "contato" ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
                  >
                    {activeSection === "contato" && <>
                      <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-ping" />
                    </>}
                    <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Contato</span>
                    <div className={`absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activeSection === "contato" ? "scale-x-100" : ""}`} />
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            {variant === 'landing' ? (
              /* Landing page CTA */
              <Button 
                onClick={() => {
                  const heroSection = document.getElementById('hero-diagnostico');
                  if (heroSection) {
                    heroSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="font-medium px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 rounded-md"
              >
                <span className="flex items-center gap-2">
                  Começar diagnóstico
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Button>
            ) : (
              /* Default CTAs */
              <>
                <Button className="font-medium px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 rounded-lg" asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Área do Cliente
                  </Link>
                </Button>
                  
                <Button onClick={() => handleNavClick(defaultNavItems.find(item => item.id === "contato")!)} className="relative bg-primary text-background font-medium px-5 py-2.5 hover:bg-primary/90 transition-all duration-300 rounded-lg group">
                  <span className="flex items-center gap-2">
                    Entrar em contato   
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors duration-300">
            {isMobileMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Animated bottom border */}
      {isScrolled && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />}
    </header>

    {/* Mobile Menu */}
    <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? "visible" : "invisible"}`}>
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMobileMenuOpen(false)} />

      {/* Menu content - with scroll support */}
      <div className={`absolute top-20 left-0 right-0 bottom-0 bg-card/95 backdrop-blur-lg border-b border-border transition-transform duration-500 overflow-y-auto overscroll-contain ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-1">
            {navItems.slice(0, 2).map((item, index) => (
              <button 
                key={item.id} 
                onClick={() => handleNavClick(item)} 
                className={`flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-300 ${activeSection === item.id ? "bg-primary/10 text-primary" : "bg-background/50 text-foreground hover:bg-primary/5"}`} 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span>{item.label}</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeSection === item.id ? "translate-x-1" : ""}`} />
              </button>
            ))}
            
            {/* Soluções Menu */}
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => setIsSolutionsMenuOpen(!isSolutionsMenuOpen)} 
                className="flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-300 bg-background/50 text-foreground hover:bg-primary/5" 
                style={{ animationDelay: `0.10s` }}
              >
                <span>Soluções</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSolutionsMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              {/* Submenu de Soluções */}
              <div className={`overflow-hidden transition-all duration-300 ${isSolutionsMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex flex-col gap-1 pl-3">
                  {solutionItems.map(solution => (
                    solution.isExternal ? (
                      <a 
                        key={solution.label} 
                        href={solution.path} 
                        className="flex items-center gap-2 px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-300 bg-background/30 text-foreground hover:bg-primary/5"
                      >
                        <span>{solution.label}</span>
                      </a>
                    ) : (
                      <Link 
                        key={solution.label} 
                        to={solution.path} 
                        className="flex items-center gap-2 px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-300 bg-background/30 text-foreground hover:bg-primary/5" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{solution.label}</span>
                      </Link>
                    )
                  ))}
                </div>
              </div>
            </div>
            
            {/* Cases button */}
            <button 
              onClick={() => handleNavClick(defaultNavItems.find(item => item.id === "cases")!)} 
              className={`flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-300 ${activeSection === "cases" ? "bg-primary/10 text-primary" : "bg-background/50 text-foreground hover:bg-primary/5"}`}
            >
              <span>Cases</span>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeSection === "cases" ? "translate-x-1" : ""}`} />
            </button>

            {/* Novidades Menu */}
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => setIsNovidadesMenuOpen(!isNovidadesMenuOpen)} 
                className={`flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-300 ${activeSection === "blog" ? "bg-primary/10 text-primary" : "bg-background/50 text-foreground hover:bg-primary/5"}`}
              >
                <span>Novidades</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isNovidadesMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${isNovidadesMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex flex-col gap-1 pl-3">
                  {novidadesItems.map(item => (
                    <Link 
                      key={item.label} 
                      to={item.path} 
                      className="flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-300 bg-background/30 text-foreground hover:bg-primary/5" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      {item.isClient && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                          Clientes
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Trabalhe conosco button */}
            <Link 
              to="/carreiras" 
              className="flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-300 bg-background/50 text-foreground hover:bg-primary/5" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Trabalhe conosco</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300" />
            </Link>

            {/* Contato button */}
            <button 
              onClick={() => handleNavClick(defaultNavItems.find(item => item.id === "contato")!)} 
              className={`flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-300 ${activeSection === "contato" ? "bg-primary/10 text-primary" : "bg-background/50 text-foreground hover:bg-primary/5"}`}
            >
              <span>Contato</span>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeSection === "contato" ? "translate-x-1" : ""}`} />
            </button>
            
            <div className="mt-3 flex flex-col gap-2 pb-4">
              <Button className="w-full text-sm font-medium py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300" asChild>
                <Link to="/admin" className="flex items-center justify-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="w-4 h-4" />
                  Área do Cliente
                </Link>
              </Button>
                
              <Button onClick={() => handleNavClick(defaultNavItems.find(item => item.id === "contato")!)} className="w-full bg-primary text-background text-sm font-medium py-3 hover:bg-primary/90 transition-all duration-300 rounded-lg group">
                <span className="flex items-center gap-2 justify-center">
                  VAMOS CONVERSAR!
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </>;
};

export default Header;