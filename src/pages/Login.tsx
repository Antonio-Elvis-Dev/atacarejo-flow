import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Lock, Mail, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (role: "atendente" | "encarregado" | "admin") => void;
}


const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    // Demo routing: admin@ => Admin, encarregado@ => Supervisor, else Attendant
    if (email.includes("admin")) {
      onLogin("admin");
    } else if (email.includes("encarregado")) {
      onLogin("encarregado");
    } else {
      onLogin("atendente");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-sidebar)" }}>
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, hsl(0 0% 100% / 1) 20px, hsl(0 0% 100% / 1) 21px)`
      }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "hsl(var(--accent))" }}>
            <Package2 className="w-8 h-8" style={{ color: "hsl(var(--primary-foreground))" }} />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "hsl(0 0% 100%)" }}>AtacarejoFlow</h1>
          <p className="mt-1 text-sm" style={{ color: "hsl(210 40% 75%)" }}>Sistema de Gestão de Ocorrências</p>
        </div>

        <Card className="border-0 shadow-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-foreground">Entrar na Plataforma</CardTitle>
          <CardDescription className="space-y-0.5">
              <span className="block">Use <span className="font-medium text-accent">admin@empresa.com</span> para Admin</span>
              <span className="block">Use <span className="font-medium text-accent">encarregado@empresa.com</span> para Encarregado</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground font-medium">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-muted-foreground">Lembrar acesso</span>
                </label>
                <button type="button" className="text-sm font-medium" style={{ color: "hsl(var(--ai-blue))" }}>
                  Esqueceu a senha?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 font-semibold text-base"
                style={{ background: "var(--gradient-brand)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Autenticando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-xs" style={{ color: "hsl(210 40% 60%)" }}>
          © 2025 AtacarejoFlow · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Login;
