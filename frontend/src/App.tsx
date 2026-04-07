import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiemLayout } from "@/components/SiemLayout";
import Overview from "./pages/Overview";
import LiveMonitoring from "./pages/LiveMonitoring";
import ThreatAnalysis from "./pages/ThreatAnalysis";
import IncidentReports from "./pages/IncidentReports";
import SiemSettings from "./pages/SiemSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiemLayout>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/monitoring" element={<LiveMonitoring />} />
            <Route path="/threats" element={<ThreatAnalysis />} />
            <Route path="/incidents" element={<IncidentReports />} />
            <Route path="/settings" element={<SiemSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SiemLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
