import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  PlusCircle,
  Pencil,
  TicketCheck,
  Clock,
  TrendingUp,
  Search,
  Shield,
  Package2,
  Bell,
  LogOut,
  KeyRound,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  onLogout: () => void;
}

type UserRole = "admin" | "atendente" | "encarregado";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sector: string;
  status: "ativo" | "inativo";
}

const initialUsers: SystemUser[] = [
  { id: "1", name: "João Silva", email: "joao.silva@atacarejoflow.com", role: "atendente", sector: "Atendimento", status: "ativo" },
  { id: "2", name: "Maria Santos", email: "maria.santos@atacarejoflow.com", role: "encarregado", sector: "Hortifrúti", status: "ativo" },
  { id: "3", name: "Carlos Mendes", email: "carlos.mendes@atacarejoflow.com", role: "encarregado", sector: "Açougue", status: "ativo" },
  { id: "4", name: "Fernanda Lima", email: "fernanda.lima@atacarejoflow.com", role: "atendente", sector: "Atendimento", status: "ativo" },
  { id: "5", name: "Ricardo Alves", email: "ricardo.alves@atacarejoflow.com", role: "encarregado", sector: "Laticínios", status: "inativo" },
  { id: "6", name: "Ana Paula Costa", email: "admin@atacarejoflow.com", role: "admin", sector: "Gerência", status: "ativo" },
];

const sectors = ["Atendimento", "Hortifrúti", "Laticínios", "Açougue", "Gerência", "Financeiro", "Logística"];

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-destructive/10 text-destructive border-destructive/30" },
  encarregado: { label: "Encarregado", className: "bg-ai-blue-light text-ai-blue-foreground border-ai-blue-border" },
  atendente: { label: "Atendente", className: "bg-secondary text-secondary-foreground border-border" },
};

const emptyForm = { name: "", email: "", password: "", role: "" as UserRole | "", sector: "" };

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "users">("dashboard");

  // Stats
  const totalTickets = 47;
  const avgResolutionTime = "2h 34min";
  const topSector = "Hortifrúti";

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.sector.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const openNewUser = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditUser = (user: SystemUser) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role, sector: user.sector });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.role || !form.sector) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos antes de salvar.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: form.name, email: form.email, role: form.role as UserRole, sector: form.sector }
            : u
        )
      );
      toast({ title: "✅ Usuário Atualizado", description: `${form.name} foi atualizado com sucesso.` });
    } else {
      const newUser: SystemUser = {
        id: String(Date.now()),
        name: form.name,
        email: form.email,
        role: form.role as UserRole,
        sector: form.sector,
        status: "ativo",
      };
      setUsers((prev) => [...prev, newUser]);
      toast({ title: "✅ Usuário Criado", description: `${form.name} foi adicionado ao sistema.` });
    }
    setSaving(false);
    setModalOpen(false);
  };

  const toggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === "ativo" ? "inativo" : "ativo" } : u
      )
    );
    const user = users.find((u) => u.id === userId);
    const newStatus = user?.status === "ativo" ? "Inativo" : "Ativo";
    toast({ title: `👤 Status Alterado`, description: `${user?.name} agora está ${newStatus}.` });
  };

  const handleResetPassword = async () => {
    await new Promise((r) => setTimeout(r, 800));
    const user = users.find((u) => u.id === resetPasswordId);
    toast({ title: "🔑 Senha Redefinida", description: `Um link foi enviado para ${user?.email}.` });
    setResetPasswordId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b bg-card flex items-center px-6 gap-4 shadow-card sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
            <Package2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground text-base tracking-tight">AtacarejoFlow</span>
        </div>
        <div className="mx-3 h-5 w-px bg-border" />
        <Badge className="bg-destructive/10 text-destructive border border-destructive/30 text-xs font-semibold gap-1">
          <Shield className="w-3 h-3" /> Admin
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
            <Shield className="w-3.5 h-3.5 text-destructive" />
            <span className="text-xs font-medium text-foreground">Ana Paula Costa</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLogout}>
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          {([["dashboard", "Dashboard"], ["users", "Gestão de Usuários"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Visão Geral do Sistema</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Métricas consolidadas de todas as ocorrências</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ocorrências</CardTitle>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--secondary))" }}>
                      <TicketCheck className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{totalTickets}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-success font-semibold">38</span> resolvidas · <span className="text-warning font-semibold">9</span> em aberto
                  </p>
                </CardContent>
              </Card>

              <Card className="border shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Média de Resolução</CardTitle>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-ai-blue-light">
                      <Clock className="w-4 h-4" style={{ color: "hsl(var(--ai-blue))" }} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{avgResolutionTime}</p>
                  <p className="text-xs text-muted-foreground mt-1">Tempo médio por ticket resolvido</p>
                </CardContent>
              </Card>

              <Card className="border shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Setor com + Reclamações</CardTitle>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-warning-light">
                      <TrendingUp className="w-4 h-4 text-warning-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{topSector}</p>
                  <p className="text-xs text-muted-foreground mt-1">18 ocorrências nos últimos 30 dias</p>
                </CardContent>
              </Card>
            </div>

            {/* Breakdown by sector */}
            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle className="text-base font-bold">Ocorrências por Setor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { sector: "Hortifrúti", count: 18, pct: 38 },
                  { sector: "Laticínios", count: 14, pct: 30 },
                  { sector: "Açougue", count: 10, pct: 21 },
                  { sector: "Outros", count: 5, pct: 11 },
                ].map((row) => (
                  <div key={row.sector} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-24 flex-shrink-0">{row.sector}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${row.pct}%`, background: "var(--gradient-brand)" }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">{row.count} tickets</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* User summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Usuários", value: users.length, color: "text-foreground" },
                { label: "Ativos", value: users.filter(u => u.status === "ativo").length, color: "text-success" },
                { label: "Atendentes", value: users.filter(u => u.role === "atendente").length, color: "text-muted-foreground" },
                { label: "Encarregados", value: users.filter(u => u.role === "encarregado").length, color: "text-muted-foreground" },
              ].map((s) => (
                <Card key={s.label} className="border shadow-card text-center p-4">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">Gestão de Usuários</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{users.length} funcionários cadastrados no sistema</p>
              </div>
              <Button className="gap-2 font-semibold self-start sm:self-auto" style={{ background: "var(--gradient-brand)" }} onClick={openNewUser}>
                <PlusCircle className="w-4 h-4" />
                Novo Usuário
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, e-mail, setor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Table */}
            <Card className="border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold text-foreground">Nome</TableHead>
                      <TableHead className="font-semibold text-foreground hidden sm:table-cell">E-mail</TableHead>
                      <TableHead className="font-semibold text-foreground">Perfil</TableHead>
                      <TableHead className="font-semibold text-foreground hidden md:table-cell">Setor</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                          Nenhum usuário encontrado para "{searchQuery}"
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredUsers.map((user) => {
                      const roleCfg = roleConfig[user.role];
                      return (
                        <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-primary-foreground"
                                style={{ background: "var(--gradient-brand)" }}
                              >
                                {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                              </div>
                              <span className="font-medium text-foreground text-sm">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs border font-semibold ${roleCfg.className}`}>
                              {roleCfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{user.sector}</TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs border font-semibold ${
                                user.status === "ativo"
                                  ? "bg-success-light text-success border-success-border"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {user.status === "ativo" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                title="Editar usuário"
                                onClick={() => openEditUser(user)}
                              >
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                title="Redefinir senha"
                                onClick={() => setResetPasswordId(user.id)}
                              >
                                <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                title={user.status === "ativo" ? "Desativar" : "Ativar"}
                                onClick={() => toggleStatus(user.id)}
                              >
                                {user.status === "ativo" ? (
                                  <ToggleRight className="w-4 h-4 text-success" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Create / Edit User Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Nome Completo</Label>
              <Input
                placeholder="Ex: João Silva"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">E-mail</Label>
              <Input
                type="email"
                placeholder="joao@atacarejoflow.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            {!editingUser && (
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Senha Inicial</Label>
                <Input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Perfil (Role)</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as UserRole }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="encarregado">Encarregado</SelectItem>
                    <SelectItem value="atendente">Atendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Setor</Label>
                <Select value={form.sector} onValueChange={(v) => setForm((f) => ({ ...f, sector: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="font-semibold"
              style={{ background: "var(--gradient-brand)" }}
            >
              {saving ? "Salvando..." : editingUser ? "Salvar Alterações" : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Confirmation Modal */}
      <Dialog open={!!resetPasswordId} onOpenChange={() => setResetPasswordId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-warning-foreground" />
              Redefinir Senha
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Um link de redefinição de senha será enviado para o e-mail do usuário. Esta ação não pode ser desfeita.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setResetPasswordId(null)}>Cancelar</Button>
            <Button
              className="font-semibold bg-warning text-warning-foreground hover:bg-warning/90"
              onClick={handleResetPassword}
            >
              Enviar Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
