import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import KnowledgeBase from "./pages/KnowledgeBase";
import Templates from "./pages/Templates";
import AIAssistant from "./pages/AIAssistant";
import Scheduling from "./pages/Scheduling";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";  // Import your Login page here
import pb from "@/lib/pb";          // Import PocketBase instance

const queryClient = new QueryClient();

// PrivateRoute component to protect routes requiring auth
function PrivateRoute({ children }: { children: JSX.Element }) {
  if (!pb.authStore.isValid) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Protected Settings Route */}
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
