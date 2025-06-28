import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { SEOHead } from "@/components/shared/SEOHead";
import { Suspense } from "react";
import "./i18n";
import NotFound from "@/pages/not-found";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// Import removed to fix navigation issues with multiple animations
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import FloatingLogo from "@/components/ui/FloatingLogo";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Research from "@/pages/Research";
import PolicyBriefDetail from "@/pages/PolicyBriefDetail";
import ResearchPaperDetail from "@/pages/ResearchPaperDetail";
import Events from "@/pages/Events";
import CampusTour from "@/pages/CampusTour";
import GetInvolved from "@/pages/GetInvolved";
import Newsletter from "@/pages/Newsletter";
import Contact from "@/pages/Contact";
import Donate from "@/pages/Donate";
import Gallery from "@/pages/Gallery";
import Staff from "@/pages/Staff";
import EditArticle from "@/pages/admin/EditArticle";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/research" component={Research} />
      <Route path="/research/brief/:id" component={PolicyBriefDetail} />
      <Route path="/research/paper/:id" component={ResearchPaperDetail} />
      <Route path="/research/opinion/:id" component={PolicyBriefDetail} />
      <Route path="/events" component={Events} />
      <Route path="/events/campus-tour" component={CampusTour} />
      <Route path="/get-involved" component={GetInvolved} />
      <Route path="/newsletter" component={Newsletter} />
      <Route path="/contact" component={Contact} />
      <Route path="/donate" component={Donate} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/staff" component={Staff} />
      <Route path="/admin/edit-article/:id" component={EditArticle} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {/* Base SEO settings for the entire application */}
          <SEOHead 
            title="Home"
            description="Movement for Positive Change (MPC) is a policy research center dedicated to advancing Ghana's development through innovative research, collaborative insights, and interactive policy exploration."
            keywords="Ghana, policy research, development, social change, PanAfrican activism, MPC Ghana"
            ogImage="/assets/seo/og-image.jpg"
          />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
            <FloatingLogo position="bottom-right" />
            <ChatbotWidget 
              initialMessage="Hello! I'm the MPC Assistant. How can I help you with our research, policy briefs, or other information about the Movement for Positive Change?"
              systemPrompt={`You are an AI assistant for the Movement for Positive Change (MPC), a Ghanaian policy research organization focused on positive societal transformation in Ghana. MPC conducts research on economic development, natural resources, governance, education, and social issues in Ghana. 

Key information about MPC:
- Founded as a non-profit policy research center focused on Ghana's development
- Current research focuses include economic recovery, natural resource management, educational reform, and governance in Ghana
- Has published policy briefs on topics like "Economic Recovery Post-COVID in Ghana" and research papers like "The Natural Resource Trap"
- Organizes events including campus tours and community discussions 
- Has a mission to transform Ghana through research-backed policy recommendations

Always respond as if you are representing the Movement for Positive Change. When asked about research topics, reference our actual policy briefs and research papers if relevant. If asked about topics we haven't researched, acknowledge this but offer general information related to Ghana when possible.`}
            />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
