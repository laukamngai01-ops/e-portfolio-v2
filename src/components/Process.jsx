import { useLanguage } from "../context/LanguageContext";
const experience = [
  [
    "2025–2026",
    ["Content Designer / Videographer", "內容設計師／影片製作"],
    "DC Ballet",
    [
      "Social campaigns, promotional films and motion graphics with artistic teams.",
      "與藝術團隊合作，製作社群宣傳、推廣影片與動態視覺。",
    ],
  ],
  [
    "2022–2025",
    ["Construction Worker", "建築工人"],
    ["Infrastructure support", "基建支撐工程"],
    [
      "Steel support structures, site coordination and safety checks.",
      "鋼製支撐結構施工、現場協調與安全檢查。",
    ],
  ],
  [
    "2021",
    ["Cook", "廚師"],
    "Beans Group",
    [
      "Food preparation and quality control in a busy kitchen.",
      "在繁忙廚房負責備料、烹調及品質管理。",
    ],
  ],
  [
    "2018–2021",
    ["Restaurant Runner", "餐廳傳菜員"],
    ["Fine dining", "精緻餐飲"],
    [
      "Detail-focused service and clear communication under pressure.",
      "注重細節的服務，以及高壓環境下的溝通協作。",
    ],
  ],
];
export default function Process() {
  const { t } = useLanguage();
  return (
    <section className="experience-section shell">
      <div className="experience-heading">
        <h2>{t("An unexpected path.", "不一樣的來路。")}</h2>
        <p>{t("Experience that shapes how I work.", "不同的經歷，塑造今天的工作方式。")}</p>
      </div>
      <div className="experience-list">
        {experience.slice(0, 1).map(([date, role, company, description]) => (
          <article className="experience-row" key={date}>
            <span className="small-label">{date}</span>
            <div>
              <h3>{t(role)}</h3>
              <p>{Array.isArray(company) ? t(company) : company}</p>
            </div>
            <p>{t(description)}</p>
          </article>
        ))}
        <details className="earlier-experience">
          <summary><span>{t("Earlier experience", "更早的工作經歷")} <small>2018–2025</small></span><span className="skill-plus" aria-hidden="true">+</span></summary>
          <p className="experience-context">{t("Before visual media: construction and hospitality. A foundation in practical work, teamwork and delivery.", "投入影像工作以前，我曾從事建築與餐飲工作。這些經歷是我實作、協作與交付習慣的起點。")}</p>
          {experience.slice(1).map(([date, role, company, description]) => <article className="experience-row" key={date}>
            <span className="small-label">{date}</span>
            <div><h3>{t(role)}</h3><p>{Array.isArray(company) ? t(company) : company}</p></div>
            <p>{t(description)}</p>
          </article>)}
        </details>
      </div>
    </section>
  );
}
