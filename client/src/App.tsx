import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MotionLayout } from "@/components/motion";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/research" component={Research} />
      <Route path="/research/brief/:id" component={PolicyBriefDetail} />
      <Route path="/research/paper/:id" component={ResearchPaperDetail} />
      <Route path="/events" component={Events} />
      <Route path="/events/campus-tour" component={CampusTour} />
      <Route path="/get-involved" component={GetInvolved} />
      <Route path="/newsletter" component={Newsletter} />
      <Route path="/contact" component={Contact} />
      <Route path="/donate" component={Donate} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/staff" component={Staff} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <MotionLayout>
                <Router />
              </MotionLayout>
            </main>
            <Footer />
            <ChatbotWidget 
              initialMessage="Hello! I'm the MPC Assistant. How can I help you with our research, policy briefs, or other information?"
              systemPrompt="You are an AI assistant for the Movement for Positive Change (MPC), a policy research organization focused on Ghana's development. Answer questions about MPC's research, policy briefs, events, and initiatives. Be helpful, concise, and accurate. If you don't know something, say so honestly."
            />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
