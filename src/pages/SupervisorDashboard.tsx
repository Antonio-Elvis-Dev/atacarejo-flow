import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  User,
  Tag,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { toast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  client: string;
  phone: string;
  category: string;
  sector: string;
  description: string;
  attendant: string;
  date: string;
  time: string;
  status: "aberto" | "em_analise" | "resolvido";
  aiInsight: string;
}

const mockTickets: Ticket[] = [
  {
    id: "#TK-1047",
    client: "Supermercado Bom Preço",
    phone: "(11) 9 8854-2210",
    category: "Reclamação - Entrega",
    sector: "Hortifrúti",
    description:
      "Cliente relatou que o pedido #P-2281 não foi entregue no prazo acordado. Aguardava entrega para ontem às 10h, mas até o momento sem previsão. Produto: Caixa de Refrigerantes (24 un) x 50 caixas.",
    attendant: "João Silva",
    date: "18/02/2025",
    time: "14:32",
    status: "aberto",
    aiInsight:
      "## Análise da Ocorrência\n\nCom base no relato, identifiquei **alta criticidade** para este caso. Recomendações:\n\n**1. Ação Imediata (próximas 2h)**\n- Contatar a transportadora para rastrear o pedido #P-2281\n- Verificar se houve falha no registro de saída do estoque\n\n**2. Comunicação com o Cliente**\n- Ligar em até 30 minutos com previsão atualizada\n- Oferecer **desconto de 5%** no próximo pedido como compensação\n\n**3. Prevenção Futura**\n- Verificar se há gargalo na rota de entrega desta região\n- Checar capacidade do veículo alocado",
  },
  {
    id: "#TK-1046",
    client: "Atacado Central Ltda.",
    phone: "(21) 9 7731-0091",
    category: "Reclamação - Produto",
    sector: "Laticínios",
    description:
      "Lote de biscoitos recebido com data de validade vencida. Identificados 3 paletes completos com problema. CNPJ do fornecedor: 12.345.678/0001-90.",
    attendant: "João Silva",
    date: "18/02/2025",
    time: "14:25",
    status: "em_analise",
    aiInsight:
      "## Análise de Produto Vencido\n\nSituação classificada como **Urgente — Risco Sanitário**.\n\n**Ações Recomendadas**\n1. **Bloquear imediatamente** os 3 paletes para evitar comercialização\n2. Acionar o **setor de Qualidade** para inspeção presencial em até 24h\n3. Registrar **não conformidade** no sistema e notificar o fornecedor\n4. Verificar se outros clientes receberam do mesmo lote\n\n**Documentação Necessária**\n- Nota fiscal de entrada do lote\n- Código do lote e data de validade impressa na embalagem\n- Fotos para laudo de devolução",
  },
  {
    id: "#TK-1045",
    client: "Distribuidora Norte S.A.",
    phone: "(31) 9 9201-4450",
    category: "Reclamação - Cobrança",
    sector: "Açougue",
    description:
      "Cliente contestou duplicidade de cobrança na fatura #F-8842. Afirma ter pago via PIX em 15/02 mas o boleto continua em aberto no portal.",
    attendant: "João Silva",
    date: "18/02/2025",
    time: "14:10",
    status: "aberto",
    aiInsight:
      "## Análise de Cobrança Duplicada\n\nPossível **falha de conciliação bancária**. Prioridade: Média.\n\n**Passos para Resolução**\n1. Solicitar ao cliente o **comprovante de pagamento PIX** (ID da transação)\n2. Encaminhar ao setor **Financeiro** para conciliação manual\n3. Se confirmado o pagamento, baixar o boleto em até **2 dias úteis**\n4. Enviar confirmação por e-mail ao cliente\n\n**Prevenção**\n- Verificar se o sistema de conciliação automática está operando normalmente",
  },
];

const sectors = ["Todos", "Hortifrúti", "Laticínios", "Açougue"];

const statusConfig = {
  aberto: { label: "Aberto", className: "bg-warning-light text-warning-foreground border-warning/40", icon: AlertCircle },
  em_analise: { label: "Em Análise", className: "bg-ai-blue-light text-ai-blue-foreground border-ai-blue-border", icon: Clock },
  resolvido: { label: "Resolvido", className: "bg-success-light text-success border-success-border", icon: CheckCircle2 },
};

interface SupervisorDashboardProps {
  onLogout: () => void;
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  const lines = content.split("\n");
  return (
    <div className="space-y-1 text-sm leading-relaxed" style={{ color: "hsl(var(--ai-blue-foreground))" }}>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="font-bold text-base mb-2 pb-1 border-b" style={{ borderColor: "hsl(var(--ai-blue-border))" }}>
              {line.replace("## ", "")}
            </p>
          );
        }
        if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
          return <p key={i} className="font-semibold mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
        }
        if (line.match(/^\d+\./)) {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className="ml-4 flex gap-2">
              <span className="flex-shrink-0 font-semibold">{line.match(/^\d+\./)?.[0]}</span>
              <span>
                {parts.map((p, j) =>
                  j % 2 === 1 ? <strong key={j}>{p}</strong> : p.replace(/^\d+\.\s*/, "")
                )}
              </span>
            </p>
          );
        }
        if (line.startsWith("- ")) {
          const parts = line.replace("- ", "").split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className="ml-4 flex gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "hsl(var(--ai-blue))" }} />
              <span>
                {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
              </span>
            </p>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        );
      })}
    </div>
  );
};

const SupervisorDashboard = ({ onLogout }: SupervisorDashboardProps) => {
  const [tickets, setTickets] = useState(mockTickets);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);
  const [activeSector, setActiveSector] = useState("Todos");
  const [finalResponses, setFinalResponses] = useState<Record<string, string>>({});

  const handleResolve = async (ticketId: string) => {
    setResolving(ticketId);
    await new Promise((r) => setTimeout(r, 1200));
    setTickets((prev) =>
      prev.map((t) => t.id === ticketId ? { ...t, status: "resolvido" } : t)
    );
    setResolving(null);
    toast({
      title: "✅ Ticket Encerrado",
      description: `${ticketId} foi marcado como resolvido com sucesso.`,
    });
  };

  const openCount = tickets.filter((t) => t.status !== "resolvido").length;

  const filteredTickets = activeSector === "Todos"
    ? tickets
    : tickets.filter((t) => t.sector === activeSector);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader role="encarregado" onLogout={onLogout} notifCount={openCount} />

      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Tickets Atribuídos</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {openCount > 0
              ? `Você tem ${openCount} ocorrência${openCount > 1 ? "s" : ""} pendente${openCount > 1 ? "s" : ""} para resolver`
              : "Todos os tickets foram resolvidos 🎉"}
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {[
            { label: "Total", value: tickets.length, color: "text-foreground", bg: "bg-card" },
            { label: "Pendentes", value: tickets.filter(t => t.status !== "resolvido").length, color: "text-warning", bg: "bg-warning-light" },
            { label: "Resolvidos", value: tickets.filter(t => t.status === "resolvido").length, color: "text-success", bg: "bg-success-light" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl border p-3 md:p-4 shadow-card text-center`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sector Filters */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground mr-1">Setor:</span>
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                activeSector === sector
                  ? "border-primary text-primary-foreground"
                  : "border-border text-muted-foreground bg-card hover:border-primary/50"
              }`}
              style={activeSector === sector ? { background: "hsl(var(--primary))" } : {}}
            >
              {sector}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTickets.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm bg-card rounded-xl border">
              Nenhum ticket encontrado para o setor "{activeSector}".
            </div>
          )}

          {filteredTickets.map((ticket) => {
            const status = statusConfig[ticket.status];
            const StatusIcon = status.icon;
            const isInsightOpen = expandedInsight === ticket.id;
            const isResolved = ticket.status === "resolvido";
            const isResolving = resolving === ticket.id;
            const finalResponse = finalResponses[ticket.id] ?? "";

            return (
              <Card key={ticket.id} className={`border shadow-card transition-all duration-200 ${isResolved ? "opacity-75" : "hover:shadow-elevated"}`}>
                <CardHeader className="pb-3 px-4 md:px-6">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center font-bold text-xs text-primary flex-shrink-0">
                        {ticket.id.replace("#", "")}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">{ticket.client}</CardTitle>
                        <p className="text-xs text-muted-foreground">{ticket.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs font-medium">
                        {ticket.sector}
                      </Badge>
                      <Badge className={`text-xs border ${status.className} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 px-4 md:px-6">
                  {/* Meta info */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {ticket.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {ticket.attendant}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {ticket.date} às {ticket.time}
                    </span>
                  </div>

                  {/* Attendant report */}
                  <div className="rounded-lg bg-muted p-3 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                      📋 Relato do Atendente
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{ticket.description}</p>
                  </div>

                  {/* AI Insight */}
                  <div className="rounded-xl overflow-hidden border" style={{ borderColor: "hsl(var(--ai-blue-border))" }}>
                    <button
                      className="w-full flex items-center justify-between p-3 transition-colors"
                      style={{ background: "var(--gradient-ai)" }}
                      onClick={() => setExpandedInsight(isInsightOpen ? null : ticket.id)}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(0 0% 100%)" }}>
                        <Sparkles className="w-4 h-4" />
                        ✨ Insight do Gemini (IA)
                      </span>
                      {isInsightOpen ? (
                        <ChevronUp className="w-4 h-4" style={{ color: "hsl(0 0% 100% / 0.8)" }} />
                      ) : (
                        <ChevronDown className="w-4 h-4" style={{ color: "hsl(0 0% 100% / 0.8)" }} />
                      )}
                    </button>

                    {isInsightOpen && (
                      <div className="p-4" style={{ background: "hsl(var(--ai-blue-light))" }}>
                        <MarkdownRenderer content={ticket.aiInsight} />
                      </div>
                    )}
                  </div>

                  {/* Final Response field (only when not yet resolved) */}
                  {!isResolved && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-foreground">
                        📝 Resposta Final
                      </Label>
                      <Textarea
                        placeholder="Descreva como o problema foi resolvido antes de encerrar o ticket..."
                        value={finalResponse}
                        onChange={(e) =>
                          setFinalResponses((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                        }
                        className="min-h-[80px] resize-none text-sm"
                      />
                    </div>
                  )}

                  {/* Resolved final response display */}
                  {isResolved && finalResponse && (
                    <div className="rounded-lg bg-success-light border border-success-border p-3">
                      <p className="text-xs font-semibold text-success uppercase tracking-wide mb-1">
                        ✅ Resposta Final Registrada
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{finalResponse}</p>
                    </div>
                  )}

                  {/* Action */}
                  {!isResolved && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleResolve(ticket.id)}
                        disabled={isResolving}
                        className="gap-2 font-semibold"
                        style={{ background: isResolving ? undefined : "hsl(var(--success))", color: "hsl(var(--success-foreground))" }}
                      >
                        {isResolving ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Marcar como Resolvido
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {isResolved && (
                    <div className="flex items-center gap-2 justify-end">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">Resolvido com sucesso</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
