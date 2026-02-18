import { useState } from "react";
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
  RefreshCw,
  FileText,
  CheckCircle2,
  Loader2,
  Wifi,
  Clock,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";

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
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [registeredTickets, setRegisteredTickets] = useState<string[]>([]);

  const handleSync = async () => {
    setSyncing(true);
    setSynced(false);
    await new Promise((r) => setTimeout(r, 2000));
    setSyncing(false);
    setSynced(true);
  };

  const handleOpenTicket = (call: Call) => {
    setSelectedCall(call);
    setCategory("");
    setDescription("");
    setResponsible("");
    setSubmitted((prev) => prev.filter((id) => id !== call.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCall) return;
    setSubmitting(true);
    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 2500));
    setSubmitting(false);
    setRegisteredTickets((prev) => [...prev, selectedCall.id]);
    setSubmitted((prev) => [...prev, selectedCall.id]);
    setSelectedCall(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader role="atendente" onLogout={onLogout} notifCount={mockCalls.length - registeredTickets.length} />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Central de Atendimento</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Gerencie as chamadas recebidas e registre ocorrências</p>
          </div>
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
            {syncing ? "Sincronizando..." : synced ? "VoIP Sincronizado" : "Sincronizar VoIP"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT COLUMN - Call List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <PhoneCall className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Chamadas Sincronizadas</span>
              <Badge variant="secondary" className="ml-auto text-xs font-medium">
                {mockCalls.length - registeredTickets.length} pendentes
              </Badge>
            </div>

            {mockCalls.map((call) => {
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
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
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
