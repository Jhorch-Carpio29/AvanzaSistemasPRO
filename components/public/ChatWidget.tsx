"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, X, Send, RotateCcw, Sparkles } from "lucide-react";

// Worker de Cloudflare (Workers AI + AI Gateway "avanza-chat")
const CHAT_URL =
  process.env.NEXT_PUBLIC_CHAT_URL || "https://avanza-chat.jhor-carpio-27.workers.dev/chat";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Msg = {
  role: "assistant",
  content:
    "¡Hola! Soy el asistente virtual de AVANZA SISTEMAS PRO – Lista 1. Puedo contarte sobre nuestros candidatos, propuestas, eventos y cómo votar el 4 de diciembre. ¿En qué te ayudo?",
};

const SUGGESTIONS = [
  "¿Quiénes son los candidatos?",
  "¿Cuáles son sus propuestas?",
  "¿Cómo voto por la Lista 1?",
  "¿Qué eventos hay?",
];

function renderText(text: string) {
  // Negritas **texto** y saltos de línea
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-gold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      abortRef.current?.abort();
    };
  }, []);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;

    const history: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.filter((m) => m !== WELCOME).map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        let msg = "El asistente no está disponible por ahora. Inténtalo más tarde.";
        try {
          msg = (await res.json()).error || msg;
        } catch {
          /* respuesta sin JSON */
        }
        throw new Error(msg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const piece: string = json.choices?.[0]?.delta?.content ?? json.response ?? "";
            if (piece) {
              answer += piece;
              setMessages([...history, { role: "assistant", content: answer }]);
            }
          } catch {
            /* fragmento incompleto */
          }
        }
      }

      if (!answer.trim()) throw new Error("No recibí respuesta. Inténtalo de nuevo.");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setMessages(history);
      setError((e as Error).message || "Ocurrió un error. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([WELCOME]);
    setError(null);
    setLoading(false);
    setInput("");
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <>
      {/* Botón flotante: robot animado */}
      {!open && (
        <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
          <div className="bot-bubble relative max-w-[210px] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-[13px] font-semibold leading-snug text-dark shadow-[0_8px_30px_rgba(0,0,0,0.45)] pointer-events-none">
            ¡Hola! 👋 Pregúntame lo que quieras sobre la <span className="text-crimson">Lista 1</span>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir asistente virtual"
            className="relative h-[72px] w-[72px] rounded-full"
          >
            <span className="bot-ring absolute inset-0 rounded-full bg-gold/60" />
            <span className="bot-ring absolute inset-0 rounded-full bg-crimson/40 [animation-delay:0.8s]" />
            <span className="bot-shake relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-gold via-[#F59E0B] to-crimson border-[3px] border-white shadow-[0_8px_30px_rgba(234,179,8,0.6)] hover:scale-110 transition-transform">
              <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden="true">
                <line x1="32" y1="6" x2="32" y2="14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                <circle cx="32" cy="6" r="3.5" fill="#0D0D0F" stroke="#fff" strokeWidth="2" />
                <rect x="10" y="14" width="44" height="34" rx="12" fill="#fff" />
                <rect x="15" y="20" width="34" height="22" rx="8" fill="#0D0D0F" />
                <circle cx="25" cy="31" r="4.5" fill="#22D3EE" />
                <circle cx="39" cy="31" r="4.5" fill="#22D3EE" />
                <path d="M26 38 Q32 42 38 38" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <rect x="4" y="26" width="5" height="12" rx="2.5" fill="#fff" />
                <rect x="55" y="26" width="5" height="12" rx="2.5" fill="#fff" />
                <rect x="20" y="50" width="24" height="8" rx="4" fill="#fff" />
              </svg>
            </span>
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white" />
          </button>
        </div>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Asistente virtual AVANZA SISTEMAS PRO"
          className="fixed z-[60] inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[390px] h-[min(600px,calc(100dvh-1.5rem))] flex flex-col rounded-2xl overflow-hidden border border-gold/40 bg-dark-card shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(234,179,8,0.15)] animate-slide-up"
        >
          {/* Cabecera */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gold/20 via-crimson/15 to-gold/10 border-b border-gold/30">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gold/60 bg-white shrink-0">
              <Image src="/logo.png" alt="AVANZA SISTEMAS PRO" fill className="object-contain" sizes="40px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text-primary leading-tight">Asistente AVANZA</p>
              <p className="flex items-center gap-1.5 text-[11px] text-cyan">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                En línea · IA con información oficial
              </p>
            </div>
            <button
              onClick={reset}
              title="Nueva conversación"
              aria-label="Nueva conversación"
              className="p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar asistente"
              className="p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-dark/60">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isTyping = loading && i === messages.length - 1 && !m.content;
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? "rounded-2xl rounded-br-md bg-gradient-to-br from-gold to-gold-dim text-dark font-medium"
                        : "rounded-2xl rounded-bl-md bg-dark-elevated border border-dark-border text-zinc-100"
                    }`}
                  >
                    {isTyping ? (
                      <span className="inline-flex gap-1 py-1" aria-label="Escribiendo">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" />
                      </span>
                    ) : (
                      renderText(m.content)
                    )}
                  </div>
                </div>
              );
            })}

            {showSuggestions && (
              <div className="pt-1 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-medium hover:bg-gold hover:text-dark transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    {s}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <p className="text-xs text-crimson bg-crimson/10 border border-crimson/30 rounded-lg px-3 py-2">{error}</p>
            )}
            <div ref={endRef} />
          </div>

          {/* Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 px-3 py-3 border-t border-dark-border bg-dark-card"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Escribe tu pregunta..."
              className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-dark-elevated border border-dark-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Enviar"
              className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-gold to-gold-dim text-dark flex items-center justify-center disabled:opacity-40 hover:shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="px-3 pb-2 -mt-1 text-center text-[10px] text-text-muted bg-dark-card">
            Respuestas generadas por IA con Cloudflare Workers AI. Verifica los datos importantes.
          </p>
        </div>
      )}
    </>
  );
}
