"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ResolvedSiteSettings } from "@/sanity/lib/siteSettings";
import styles from "./ChatWidget.module.css";

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.9 11.9 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.69 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.42ZM12.06 21.8a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.86 9.86 0 0 1-1.52-5.26c0-5.45 4.44-9.89 9.9-9.89a9.83 9.83 0 0 1 7 2.9 9.84 9.84 0 0 1 2.89 7c0 5.45-4.44 9.89-9.9 9.89Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.71.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
  </svg>;
}

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  type?: "standard" | "emergency";
  text: string;
  topicLabel?: string;
};

type ChatWidgetProps = {
  siteSettings: ResolvedSiteSettings;
  emergencyKeywords: string[];
};

const chatHistoryKey = "sutton-vet-chat-history-v1";
const maxStoredMessages = 40;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<ChatMessage>;
  return (
    typeof message.id === "string" &&
    (message.role === "bot" || message.role === "user") &&
    typeof message.text === "string" &&
    (!message.type || message.type === "standard" || message.type === "emergency") &&
    (!message.topicLabel || typeof message.topicLabel === "string")
  );
}

function buildEmergencyMessage(siteSettings: ResolvedSiteSettings): ChatMessage {
  return {
    id: `bot-emergency-${Date.now()}`,
    role: "bot",
    type: "emergency",
    text: siteSettings.chatSettings.emergencyReply,
    topicLabel: siteSettings.chatSettings.emergencyLabel,
  };
}

function buildFallbackMessage(siteSettings: ResolvedSiteSettings): ChatMessage {
  return {
    id: `bot-fallback-${Date.now()}`,
    role: "bot",
    text: siteSettings.chatSettings.fallbackReply,
    topicLabel: siteSettings.chatSettings.introLabel,
  };
}

function buildStandardMessage(topic: string, siteSettings: ResolvedSiteSettings): ChatMessage {
  switch (topic) {
    case "hours":
      return {
        id: `bot-hours-${Date.now()}`,
        role: "bot",
        text: siteSettings.chatSettings.hoursReply,
        topicLabel: "Opening hours",
      };
    case "location":
      return {
        id: `bot-location-${Date.now()}`,
        role: "bot",
        text: siteSettings.chatSettings.locationReply,
        topicLabel: "Location & parking",
      };
    case "fees":
      return {
        id: `bot-fees-${Date.now()}`,
        role: "bot",
        text: siteSettings.chatSettings.feesReply,
        topicLabel: "Basic fee ranges",
      };
    case "plan":
      return {
        id: `bot-plan-${Date.now()}`,
        role: "bot",
        text: siteSettings.chatSettings.planReply,
        topicLabel: "Health Plan",
      };
    case "booking":
      return {
        id: `bot-booking-${Date.now()}`,
        role: "bot",
        text: siteSettings.chatSettings.bookingReply,
        topicLabel: "Registration & booking",
      };
    case "services":
      return {
        id: `bot-services-${Date.now()}`,
        role: "bot",
        text: siteSettings.chatSettings.servicesReply,
        topicLabel: "Services",
      };
    case "careers":
      return {
        id: `bot-careers-${Date.now()}`,
        role: "bot",
        text: siteSettings.chatSettings.careersReply,
        topicLabel: "Careers",
      };
    case "contact":
      return {
        id: `bot-contact-${Date.now()}`,
        role: "bot",
        text: siteSettings.chatSettings.contactReply,
        topicLabel: "Contact",
      };
    case "payments":
      return {
        id: `bot-payments-${Date.now()}`,
        role: "bot",
        text: siteSettings.chatSettings.paymentsReply,
        topicLabel: "Payments",
      };
    default:
      return buildFallbackMessage(siteSettings);
  }
}

function resolveTopic(input: string, siteSettings: ResolvedSiteSettings, emergencyKeywords: string[]) {
  const normalized = input.toLowerCase().trim();

  if (!normalized) {
    return buildStandardMessage("hours", siteSettings);
  }

  if (emergencyKeywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) {
    return buildEmergencyMessage(siteSettings);
  }

  if (/(opening|hours|open|close|closing|weekend|saturday|sunday)/.test(normalized)) {
    return buildStandardMessage("hours", siteSettings);
  }

  if (/(parking|park|location|address|directions|find you|hackbridge|sutton|where are you|visit)/.test(normalized)) {
    return buildStandardMessage("location", siteSettings);
  }

  if (/(fee|fees|price|prices|pricing|cost|costs|quote|how much)/.test(normalized)) {
    return buildStandardMessage("fees", siteSettings);
  }

  if (/(health plan|plan|monthly|preventative|prevention|parasite|booster|worming|flea|tick)/.test(normalized)) {
    return buildStandardMessage("plan", siteSettings);
  }

  if (/(payment|payments|pay online|deposit|lupa pay|klarna|instalment|installment)/.test(normalized)) {
    return buildStandardMessage("payments", siteSettings);
  }

  if (/(register|registration|book|booking|first visit|new client|appointment)/.test(normalized)) {
    return buildStandardMessage("booking", siteSettings);
  }

  if (/(service|services|consult|vaccination|microchip|neuter|neutering|dental|dentistry|diagnostic|x-ray|ultrasound|surgery|orthopaedic|orthopedic|endoscopy|home visit|euthanasia|cremation|nurse clinic)/.test(normalized)) {
    return buildStandardMessage("services", siteSettings);
  }

  if (/(career|careers|job|jobs|vacancy|vacancies|hiring|nurse role|work for|join the team|apply)/.test(normalized)) {
    return buildStandardMessage("careers", siteSettings);
  }

  if (/(contact|phone|telephone|email|call you|message you|whatsapp)/.test(normalized)) {
    return buildStandardMessage("contact", siteSettings);
  }

  return buildFallbackMessage(siteSettings);
}

export function ChatWidget({ siteSettings, emergencyKeywords }: ChatWidgetProps) {
  const initialMessages: ChatMessage[] = useMemo(
    () => [
      {
        id: "bot-intro",
        role: "bot",
        text: siteSettings.chatSettings.introText,
        topicLabel: siteSettings.chatSettings.introLabel,
      },
    ],
    [siteSettings],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [historyReady, setHistoryReady] = useState(false);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(chatHistoryKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const restored = parsed.filter(isChatMessage).slice(-maxStoredMessages);
          if (restored.length) setMessages(restored);
        }
      }
    } catch {
      window.sessionStorage.removeItem(chatHistoryKey);
    } finally {
      setHistoryReady(true);
    }
  }, []);

  useEffect(() => {
    if (!historyReady) return;
    try {
      window.sessionStorage.setItem(chatHistoryKey, JSON.stringify(messages.slice(-maxStoredMessages)));
    } catch {
      // The chat still works when private browsing or storage policies block persistence.
    }
  }, [historyReady, messages]);

  function submitQuery(rawQuery: string) {
    const trimmed = rawQuery.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const botReply = resolveTopic(trimmed, siteSettings, emergencyKeywords);

    setMessages((current) => [...current, userMessage, botReply].slice(-maxStoredMessages));
    setDraft("");
  }

  function restartConversation() {
    window.sessionStorage.removeItem(chatHistoryKey);
    setMessages(initialMessages);
    setDraft("");
  }

  useEffect(() => {
    if (!isOpen || !messageListRef.current) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const container = messageListRef.current;
      if (!container) {
        return;
      }

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, isOpen]);

  return (
    <div className={`chat-widget ${styles.widget}${isOpen ? " is-open" : ""}`}>
      {isOpen ? (
        <section className={`chat-panel ${styles.panel}`} aria-label="Chat help widget">
          <div className="chat-panel-header">
            <div className="chat-assistant-identity">
              <span className="chat-assistant-avatar" aria-hidden="true">SV</span>
              <div>
                <h2>{siteSettings.practiceName} Assistant</h2>
                <p>Practice information and quick help</p>
              </div>
            </div>
            <div className="chat-panel-header-actions">
              <button className="chat-restart" type="button" onClick={restartConversation}>
                New chat
              </button>
              <button className="chat-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <span />
                <span />
              </button>
            </div>
          </div>

          <div ref={messageListRef} className="chat-message-list">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`chat-message chat-message-${message.role}${message.type === "emergency" ? " is-emergency" : ""}${message.id === "bot-intro" ? " is-intro" : ""}`}
              >
                {message.topicLabel ? <p className="chat-message-label">{message.topicLabel}</p> : null}
                <p>{message.text}</p>
                {message.type === "emergency" ? (
                  <a className="button button-emergency chat-emergency-button" href={siteSettings.ctas.emergency}>
                    {siteSettings.chatSettings.emergencyButtonLabel}
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          <div className="chat-panel-controls">
            <div className="chat-suggestions">
              <p>Suggested questions</p>
              <div className="chat-approved-strip">
                {siteSettings.chatSettings.topicButtons.map((topic) => (
                  <button key={topic.label} type="button" className="chat-chip" onClick={() => submitQuery(topic.query)}>
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="chat-form"
              onSubmit={(event) => {
                event.preventDefault();
                submitQuery(draft);
              }}
            >
              <label className="sr-only" htmlFor="chat-query">
                Ask a question
              </label>
              <input
                id="chat-query"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={siteSettings.chatSettings.inputPlaceholder}
              />
              <button className="button button-primary" type="submit">
                Send
              </button>
            </form>

            <div className="chat-static-actions">
              <a className={styles.phoneLink} href={siteSettings.ctas.call}>Call {siteSettings.phone}</a>
              <a className="button button-primary" href={siteSettings.ctas.register}>
                {siteSettings.chatSettings.registerButtonLabel}
              </a>
              <a className={`button button-muted ${styles.whatsappAction}`} href={siteSettings.ctas.whatsapp} target="_blank" rel="noopener noreferrer" title={`${siteSettings.chatSettings.whatsappButtonLabel} on WhatsApp (opens in a new tab)`}>
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <div className={styles.launcherRow}>
      <a className={styles.floatingWhatsapp} href={siteSettings.ctas.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Message The Sutton Vet on WhatsApp (opens in a new tab)" title="Message us on WhatsApp">
        <WhatsAppIcon />
      </a>
      <button className="chat-launcher" type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen}>
        <span className="chat-launcher-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>Chat help</span>
      </button>
      </div>
    </div>
  );
}
