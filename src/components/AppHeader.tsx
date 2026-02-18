import { Package2, Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
  role: "atendente" | "encarregado";
  onLogout: () => void;
  notifCount?: number;
}

const roleLabel = {
  atendente: "Atendente",
  encarregado: "Encarregado",
};

const AppHeader = ({ role, onLogout, notifCount = 0 }: AppHeaderProps) => {
  return (
    <header className="h-14 border-b bg-card flex items-center px-6 gap-4 shadow-card sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
          <Package2 className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground text-base tracking-tight">AtacarejoFlow</span>
      </div>

      <div className="mx-3 h-5 w-px bg-border" />

      <span className="text-sm text-muted-foreground">
        Dashboard do <span className="font-semibold text-foreground">{roleLabel[role]}</span>
      </span>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {notifCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center bg-destructive text-destructive-foreground">
              {notifCount}
            </Badge>
          )}
        </Button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            {role === "atendente" ? "João Silva" : "Maria Santos"}
          </span>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLogout}>
          <LogOut className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
