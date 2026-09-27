import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { assetUrl, contact, getAsset } from "../data/portfolio";
export default function Contact() {
  const { t } = useLanguage();
  const [copyState, setCopyState] = useState("idle");
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };
  return (
    <footer id="contact" className="contact-section">
      <div className="shell">
        <div className="section-label">
          <span>04 / {t("CONTACT", "聯絡")}</span>
          <span>
            {t("Creative roles & collaborations", "創意職位與合作機會")}
          </span>
        </div>
        <div
          className="contact-heading"
        >
          <h2>{t("Let's make\nthe next frame.", "一起完成，\n下一個畫面。")}</h2>
          <p className="contact-signature"><strong>Kam Ngai Lau</strong><span>{t("Filmmaking & AI image-making / Hong Kong", "影片製作與 AI 影像創作／香港")}</span><span>{t("For a role, an interview or a creative collaboration.", "歡迎洽談職位、面試或創作合作。")}</span></p>
        </div>
        <div className="contact-bottom">
          <div className="email-group">
            <a href={"mailto:" + contact.email} data-track="contact_email_clicked">{contact.email} ↗</a>
            <button
              type="button"
              className="copy-email"
              onClick={copyEmail}
              aria-label={t("Copy email address", "複製電郵地址")}
            >
              {copyState === "copied" ? "✓" : "⧉"}
            </button>
            <span className="copy-status" role="status">
              {copyState === "copied"
                ? t("Email copied", "已複製電郵")
                : copyState === "failed"
                  ? t("Please select and copy the email.", "請選取並複製電郵。")
                  : ""}
            </span>
          </div>
          <a
            className="footer-resume"
            href={assetUrl(getAsset(contact.resume).src)}
            download="Kam-Ngai-Lau-Resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            {t("Download résumé", "下載履歷")} ↗
          </a>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} KAM NGAI LAU</span>
          <span>{t("An independent point of view.", "以自己的視角，創作。")}</span>
          <Link to="/#hero">{t("Back to top", "返回頂部")} ↑</Link>
        </div>
      </div>
    </footer>
  );
}
