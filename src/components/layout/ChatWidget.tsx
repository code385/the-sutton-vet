"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ResolvedSiteSettings } from "@/sanity/lib/siteSettings";

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

  if (/(fee|fees|price|prices|pricing|cost|costs|consultation|vaccination|microchip|neuter|neutering)/.test(normalized)) {
    return buildStandardMessage("fees", siteSettings);
  }

  if (/(health plan|plan|monthly|preventative|prevention|parasite|booster|worming|flea|tick)/.test(normalized)) {
    return buildStandardMessage("plan", siteSettings);
  }

  if (/(register|registration|book|booking|lupa|first visit|new client|appointment)/.test(normalized)) {
    return buildStandardMessage("booking", siteSettings);
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
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const hasStartedConversation = messages.some((message) => message.role === "user");

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const quickActions = useMemo(
    () => [
      { label: siteSettings.chatSettings.registerButtonLabel, href: siteSettings.ctas.book, variant: "button-primary" },
      { label: siteSettings.chatSettings.whatsappButtonLabel, href: siteSettings.ctas.whatsapp, variant: "button-muted" },
    ],
    [siteSettings],
  );

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

    setMessages((current) => {
      if (current.length === 1 && current[0]?.id === "bot-intro") {
        return [userMessage, botReply];
      }

      return [...current, userMessage, botReply];
    });
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
    <div className={`chat-widget${isOpen ? " is-open" : ""}`}>
      {isOpen ? (
        <section className="chat-panel" aria-label="Chat help widget">
          <div className="chat-panel-header">
            <div>
              <p className="eyebrow">{siteSettings.chatSettings.eyebrow}</p>
              <h2>{siteSettings.chatSettings.title}</h2>
            </div>
            <button className="chat-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <span />
              <span />
            </button>
          </div>

          {!hasStartedConversation ? (
            <div className="chat-approved-strip">
              {siteSettings.chatSettings.topicButtons.map((topic) => (
                <button key={topic.label} type="button" className="chat-chip" onClick={() => submitQuery(topic.query)}>
                  {topic.label}
                </button>
              ))}
            </div>
          ) : null}

          <div ref={messageListRef} className="chat-message-list">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`chat-message chat-message-${message.role}${message.type === "emergency" ? " is-emergency" : ""}`}
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
            {quickActions.map((action) => (
              <a key={action.label} className={`button ${action.variant}`} href={action.href} target="_blank" rel="noreferrer">
                {action.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <button className="chat-launcher" type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen}>
        <span className="chat-launcher-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>Chat help</span>
      </button>
    </div>
  );
}
