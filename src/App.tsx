// Importações dos componentes de UI e bibliotecas
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";

// Páginas públicas do site
import Index from "./pages/Index";
import WhyWay from "./pages/WhyWay";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogPostPreview from "./pages/BlogPostPreview";
import Columnist from "./pages/Columnist";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Páginas de Soluções
import Implementation from "./pages/solutions/Implementation";
import Consulting from "./pages/solutions/Consulting";
import Performance from "./pages/solutions/Performance";
import Journey from "./pages/solutions/Journey";

// Páginas administrativas
import Auth from "./pages/admin/Auth";
import ResetPassword from "./pages/admin/ResetPassword";
import PendingApproval from "./pages/admin/PendingApproval";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MemberDashboard from "./pages/admin/MemberDashboard";
import BlogPosts from "./pages/admin/blog/Posts";
import BlogPostEditor from "./pages/admin/blog/PostEditor";
import BlogCategories from "./pages/admin/blog/Categories";
import BlogTags from "./pages/admin/blog/Tags";
import Columnists from "./pages/admin/Columnists";
import CasesList from "./pages/admin/cases/List";
import NewCase from "./pages/admin/cases/New";
import CaseEditor from "./pages/admin/cases/Editor";
import CasesCategories from "./pages/admin/cases/Categories";
import CasesTags from "./pages/admin/cases/Tags";
import Contacts from "./pages/admin/Contacts";
import Users from "./pages/admin/Users";
import Permissions from "./pages/admin/Permissions";
import MediaLibrary from "./pages/admin/media/MediaLibrary";
import Academy from "./pages/admin/Academy";
import AcademyManage from "./pages/admin/academy/Manage";
import AcademyCategories from "./pages/admin/academy/Categories";
import AcademySettings from "./pages/admin/academy/Settings";
import AcademySuppliers from "./pages/admin/academy/Suppliers";
import AcademyContent from "./pages/admin/AcademyContent";
import BlogWay from "./pages/admin/BlogWay";
import Account from "./pages/admin/Account";
import Support from "./pages/admin/Support";
import Notifications from "./pages/admin/Notifications";
import Curation from "./pages/admin/Curation";
import ConductGuide from "./pages/admin/ConductGuide";
import ConductGuideEditor from "./pages/admin/ConductGuideEditor";
import GoogleReviewsSync from "./pages/admin/GoogleReviewsSync";
import LandingPagesList from "./pages/admin/landing/List";
import NewLandingPage from "./pages/admin/landing/New";
import EditLandingPage from "./pages/admin/landing/Edit";
import LandingPageView from "./pages/LandingPageView";

// Configuração do React Query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
          <Routes>
          {/* Rotas públicas do site */}
          <Route path="/" element={<Index />} />
          <Route path="/why-way" element={<WhyWay />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/preview/:id" element={<BlogPostPreview />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/colunista/:id" element={<Columnist />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Rotas de Soluções */}
          <Route path="/solucoes/implantacao-desenvolvimento" element={<Implementation />} />
          <Route path="/solucoes/consultoria" element={<Consulting />} />
          <Route path="/solucoes/performance-marketing" element={<Performance />} />
          <Route path="/solucoes/jornada" element={<Journey />} />
          
          {/* Rota de autenticação (login/registro) */}
          <Route path="/auth/login" element={<Auth />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/admin/pending-approval" element={<PendingApproval />} />
          
          {/* Rota de visualização de conteúdo da Academy (fora do layout admin) */}
          <Route path="/academy/content/:id" element={<AcademyContent />} />
          
          {/* Rota pública de landing pages */}
          <Route path="/lp/:slug" element={<LandingPageView />} />
          
          {/* Rotas administrativas protegidas */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="member-dashboard" element={<MemberDashboard />} />
            
            {/* Rotas do Blog */}
            <Route path="blog/posts" element={<BlogPosts />} />
            <Route path="blog/posts/new" element={<BlogPostEditor />} />
            <Route path="blog/posts/edit/:id" element={<BlogPostEditor />} />
            <Route path="blog/categories" element={<BlogCategories />} />
            <Route path="blog/tags" element={<BlogTags />} />
            <Route path="blog/columnists" element={<Columnists />} />
            
            {/* Rotas de Cases */}
            <Route path="cases/list" element={<CasesList />} />
            <Route path="cases/new" element={<NewCase />} />
            <Route path="cases/:id/editor" element={<CaseEditor />} />
            <Route path="cases/categories" element={<CasesCategories />} />
            <Route path="cases/tags" element={<CasesTags />} />
            
            {/* Rotas de Landing Pages */}
            <Route path="landing" element={<LandingPagesList />} />
            <Route path="landing/new" element={<NewLandingPage />} />
            <Route path="landing/:id/edit" element={<EditLandingPage />} />
            
            {/* Biblioteca de Mídia */}
            <Route path="media" element={<MediaLibrary />} />
            
            {/* Outras rotas admin */}
            <Route path="contacts" element={<Contacts />} />
            <Route path="users" element={<Users />} />
            <Route path="permissions" element={<Permissions />} />
            
            {/* Novas seções */}
            <Route path="academy" element={<Academy />} />
            <Route path="academy/suppliers" element={<AcademySuppliers />} />
            <Route path="academy/manage" element={<AcademyManage />} />
            <Route path="academy/categories" element={<AcademyCategories />} />
            <Route path="academy/settings" element={<AcademySettings />} />
            <Route path="blog-way" element={<BlogWay />} />
            <Route path="conduct-guide" element={<ConductGuide />} />
            <Route path="conduct-guide/edit" element={<ConductGuideEditor />} />
            <Route path="curation" element={<Curation />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="account" element={<Account />} />
            <Route path="support" element={<Support />} />
            <Route path="google-reviews" element={<GoogleReviewsSync />} />
          </Route>
          
          {/* Rota 404 - deve ser sempre a última */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
