import { useLanguage } from "../context/LanguageContext";
import { assetUrl, contact, getAsset } from "../data/portfolio";
import AssetImage from "./AssetImage";
export default function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="about-section">
      <div className="shell">
        <p className="editorial-marker"><span>02 / {t("THE PERSON BEHIND THE FRAME", "畫面背後的創作者")}</span><span>KAM NGAI LAU</span></p>
        <div className="about-grid">
          <div className="about-title">
            <h2>
              {t(
                "An eye for detail.\nA mind for making.",
                "細看每一刻。\n親手成就想法。",
              )}
            </h2>
            <figure className="about-photo">
              <AssetImage id="photography/photo_set_008" alt={t("A moment between performances, photographed by Kam Ngai Lau", "Kam Ngai Lau 拍攝的演出間歇片刻")} sizes="(max-width: 760px) 90vw, 42vw" />
              <figcaption>{t("Between performances. A photograph from my archive.", "演出之間。來自我的攝影紀錄。")}</figcaption>
            </figure>
          </div>
          <div className="about-story">
            <p className="about-lead">
              {t(
                "A brief becomes a film. I take it all the way.",
                "從一份要求，做到一部完整影片。",
              )}
            </p>
            <p>
              {t(
                "For PPP LEMON, my employer supplied the required copy and product talking points. I handled the creative production independently, from the script and characters to AI generation and the final edit.",
                "在 PPP LEMON 項目中，老闆提供必須出現的文字及產品說明重點；其餘創作製作由我獨立完成，包括劇本、角色、AI 生成與最終剪輯。",
              )}
            </p>
            <dl className="practice-notes">
              <div><dt>{t("START WITH", "由此開始")}</dt><dd>{t("The message the film needs to communicate", "影片需要傳達的訊息")}</dd></div>
              <div><dt>{t("WORK THROUGH", "親手完成")}</dt><dd>{t("Story, image-making and the edit", "敘事、影像製作與剪輯")}</dd></div>
            </dl>
            <p>
              {t(
                "Before working in visual media, I built steel support structures on construction sites. That experience still shapes how I work: plan carefully, communicate clearly, and follow through.",
                "投入視覺創作以前，我曾在建築工地搭建鋼製支撐結構。那段經驗讓我習慣周詳規劃、清楚溝通，並對交付負責。",
              )}
            </p>
            <a
              className="inline-link"
              href={assetUrl(getAsset(contact.resume).src)}
              target="_blank"
              rel="noreferrer"
            >
              {t("Read my résumé", "閱讀我的履歷")} ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
