import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  PhoneCall,
  FileText,
  CheckCircle2,
  Loader2,
  Wifi,
  Clock,
  Search,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { toast } from "@/hooks/use-toast";

interface Call {
  id: string;
  phone: string;
  duration: string;
  time: string;
  client: string;
}

const mockCalls: Call[] = [
  { id: "#CH-4821", phone: "(11) 9 8854-2210", duration: "3m 12s", time: "14:32", client: "Supermercado Bom Preço" },
  { id: "#CH-4820", phone: "(21) 9 7731-0091", duration: "1m 48s", time: "14:25", client: "Atacado Central Ltda." },
  { id: "#CH-4819", phone: "(31) 9 9201-4450", duration: "5m 07s", time: "14:10", client: "Distribuidora Norte S.A." },
  { id: "#CH-4818", phone: "(11) 9 6642-8810", duration: "2m 30s", time: "13:58", client: "Mercadão da Família" },
  { id: "#CH-4817", phone: "(85) 9 8810-3320", duration: "4m 15s", time: "13:44", client: "Rede Atacadista Forte" },
];

const categories = [
  "Reclamação - Produto",
  "Reclamação - Atendimento",
  "Reclamação - Entrega",
  "Reclamação - Cobrança",
  "Sugestão",
  "Elogio",
  "Dúvida / Informação",
];

const responsaveis = [
  "Carlos Mendes (Encarregado Geral)",
  "Fernanda Lima (Setor de Entrega)",
  "Ricardo Alves (Setor Financeiro)",
  "Ana Paula (Atendimento ao Cliente)",
  "Marcos Sousa (Gerência)",
];

interface AttendantDashboardProps {
  onLogout: () => void;
}

const AttendantDashboard = ({ onLogout }: AttendantDashboardProps) => {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(true);
  const [syncedAt, setSyncedAt] = useState<Date>(new Date());
  const [syncLabel, setSyncLabel] = useState("Sincronizado há 2 min");
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [highPriority, setHighPriority] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registeredTickets, setRegisteredTickets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Update sync label every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (synced && syncedAt) {
        const diffMs = Date.now() - syncedAt.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) setSyncLabel("Sincronizado agora");
        else if (diffMin === 1) setSyncLabel("Sincronizado há 1 min");
        else setSyncLabel(`Sincronizado há ${diffMin} min`);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [synced, syncedAt]);

  const filteredCalls = mockCalls.filter((call) => {
    const q = searchQuery.toLowerCase();
    return (
      call.client.toLowerCase().includes(q) ||
      call.phone.includes(q) ||
      call.id.toLowerCase().includes(q)
    );
  });

  const handleSync = async () => {
    setSyncing(true);
    setSynced(false);
    await new Promise((r) => setTimeout(r, 2000));
    const now = new Date();
    setSyncedAt(now);
    setSyncLabel("Sincronizado agora");
    setSyncing(false);
    setSynced(true);
    toast({
      title: "✅ VoIP Sincronizado",
      description: "Lista de chamadas atualizada com sucesso.",
    });
  };

  const handleOpenTicket = (call: Call) => {
    setSelectedCall(call);
    setCategory("");
    setDescription("");
    setResponsible("");
    setHighPriority(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCall) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2500));
    setSubmitting(false);
    setRegisteredTickets((prev) => [...prev, selectedCall.id]);
    toast({
      title: "📋 Ocorrência Registrada",
      description: `Ticket ${selectedCall.id} gerado com sucesso${highPriority ? " — marcado como ALTA PRIORIDADE" : ""}.`,
    });
    setSelectedCall(null);
  };

  const pendingCount = mockCalls.filter((c) => !registeredTickets.includes(c.id)).length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader role="atendente" onLogout={onLogout} notifCount={pendingCount} />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header row */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">Central de Atendimento</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Gerencie as chamadas recebidas e registre ocorrências</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <Button
              variant="outline"
              className="gap-2 font-medium"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? (
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
              ) : (
                <Wifi className="w-4 h-4 text-success" />
              )}
              {syncing ? "Sincronizando..." : "VoIP Sincronizado"}
            </Button>
            {synced && !syncing && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                {syncLabel}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT COLUMN - Call List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <PhoneCall className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Chamadas Sincronizadas</span>
              <Badge variant="secondary" className="ml-auto text-xs font-medium">
                {pendingCount} pendentes
              </Badge>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, telefone ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {filteredCalls.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhuma chamada encontrada para "{searchQuery}"
              </div>
            )}

            {filteredCalls.map((call) => {
              const isRegistered = registeredTickets.includes(call.id);
              const isSelected = selectedCall?.id === call.id;

              return (
                <div
                  key={call.id}
                  className={`bg-card rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-primary shadow-elevated"
                      : isRegistered
                      ? "opacity-60 border-border"
                      : "border-border hover:border-primary/40 hover:shadow-card cursor-pointer"
                  }`}
                  onClick={() => !isRegistered && handleOpenTicket(call)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isRegistered ? "bg-success-light" : "bg-secondary"
                      }`}>
                        {isRegistered ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <Phone className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground">{call.id}</p>
                        <p className="text-sm font-semibold text-foreground">{call.phone}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">{call.client}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {call.time}
                      </div>
                      <span className="text-xs text-muted-foreground">{call.duration}</span>
                      {!isRegistered && (
                        <Button
                          size="sm"
                          className="h-6 text-xs px-2 mt-1"
                          style={{ background: "var(--gradient-brand)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenTicket(call);
                          }}
                        >
                          Abrir Ticket
                        </Button>
                      )}
                      {isRegistered && (
                        <Badge className="text-xs bg-success-light text-success border-success-border">
                          Registrado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN - Form */}
          <div className="lg:col-span-3">
            {selectedCall ? (
              <Card className="border shadow-card">
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-center gap-2 flex-wrap">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <CardTitle className="text-base font-bold text-foreground">
                      Registro de Ocorrência
                    </CardTitle>
                    <Badge variant="outline" className="ml-auto font-mono text-xs">
                      {selectedCall.id}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-foreground">Cliente</Label>
                      <Input
                        value={selectedCall.client}
                        readOnly
                        className="bg-muted text-muted-foreground font-medium cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tel: {selectedCall.phone} · Duração: {selectedCall.duration}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-foreground">Categoria da Ocorrência</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-foreground">Descrição do Relato</Label>
                      <Textarea
                        placeholder="Descreva detalhadamente o relato do cliente..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[120px] resize-none"
                        required
                      />
                      <p className="text-xs text-muted-foreground text-right">{description.length} / 500 caracteres</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-foreground">Responsável</Label>
                      <Select value={responsible} onValueChange={setResponsible} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Atribuir a um encarregado..." />
                        </SelectTrigger>
                        <SelectContent>
                          {responsaveis.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* High Priority Toggle */}
                    <button
                      type="button"
                      onClick={() => setHighPriority((p) => !p)}
                      className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-200 text-left ${
                        highPriority
                          ? "border-warning bg-warning-light"
                          : "border-border bg-card hover:border-warning/50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        highPriority ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold transition-colors ${highPriority ? "text-warning-foreground" : "text-foreground"}`}>
                          Prioridade Alta
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {highPriority ? "Ticket será escalado como urgente" : "Clique para marcar como urgente"}
                        </p>
                      </div>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        highPriority ? "border-warning bg-warning" : "border-border"
                      }`}>
                        {highPriority && <div className="w-2 h-2 rounded-full bg-warning-foreground" />}
                      </div>
                    </button>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedCall(null)}
                        disabled={submitting}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 font-semibold"
                        style={{ background: "var(--gradient-brand)" }}
                        disabled={submitting || !category || !description || !responsible}
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analisando com IA...
                          </span>
                        ) : (
                          "Registrar Ocorrência"
                        )}
                      </Button>
                    </div>

                    {submitting && (
                      <div className="rounded-lg p-3 border flex items-center gap-3" style={{ background: "hsl(var(--ai-blue-light))", borderColor: "hsl(var(--ai-blue-border))" }}>
                        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: "hsl(var(--ai-blue))" }} />
                        <p className="text-xs font-medium" style={{ color: "hsl(var(--ai-blue-foreground))" }}>
                          ✨ Gemini está analisando o relato e gerando insights de solução...
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
                <div>
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-secondary">
                    <FileText className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">Nenhuma chamada selecionada</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clique em "Abrir Ticket" em uma chamada da lista ao lado para iniciar o registro.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendantDashboard;
