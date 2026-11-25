"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./i18n/LanguageProvider";

export function ContactEmail({ address }: { address: string }) {
  const { t } = useLanguage();
  const link = useRef<HTMLAnchorElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const request = useRef(0);
  const [feedback, setFeedback] = useState<"" | "emailCopied" | "emailSelect">("");

  useEffect(() => () => {
    request.current++;
    window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    const id = ++request.current;
    window.clearTimeout(timer.current);
    let result: "emailCopied" | "emailSelect" = "emailCopied";
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      if (id !== request.current || !link.current) return;
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(link.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
      result = "emailSelect";
    }
    if (id !== request.current) return;
    setFeedback(result);
    timer.current = window.setTimeout(() => setFeedback(""), result === "emailCopied" ? 2300 : 6000);
  };

  return <div className="contact-mail">
    <div className="contact-mail__row">
      <a ref={link} className="connect-email" dir="ltr" href={`mailto:${address}`}>{address}</a>
      <button className="contact-mail__copy" type="button" onClick={copy} aria-label={t("copyEmail")} title={t("copyEmail")}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {feedback === "emailCopied" ? <path d="m4 12 5 5L20 6" /> :
            <><rect x="8" y="8" width="12" height="13" rx="1.5" /><path d="M15 8V3H4v13h4" /></>}
        </svg>
      </button>
    </div>
    <p role="status" className="contact-mail__status">{feedback && t(feedback)}</p>
  </div>;
}
