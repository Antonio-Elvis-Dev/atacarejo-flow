import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import AttendantDashboard from "./pages/AttendantDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";

const queryClient = new QueryClient();

type Role = "atendente" | "encarregado" | null;

const App = () => {
  const [role, setRole] = useState<Role>(null);

  const handleLogin = (r: "atendente" | "encarregado") => setRole(r);
  const handleLogout = () => setRole(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {role === null && <Login onLogin={handleLogin} />}
        {role === "atendente" && <AttendantDashboard onLogout={handleLogout} />}
        {role === "encarregado" && <SupervisorDashboard onLogout={handleLogout} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
