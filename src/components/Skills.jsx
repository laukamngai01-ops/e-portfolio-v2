import { useLanguage } from "../context/LanguageContext";
const skills = [
  {
    title: ["Film & motion", "影片與動態"],
    text: [
      "Shooting, editing and colour for promotional films, events and social content.",
      "為宣傳影片、活動紀錄與社群內容進行拍攝、剪輯及調色。",
    ],
    tools: "Premiere Pro / DaVinci Resolve / After Effects / CapCut",
  },
  {
    title: ["Photography", "攝影"],
    text: [
      "Portraits, live performance and event photography, from shoot to final selection.",
      "人像、現場表演與活動攝影，從拍攝到選片及成品輸出。",
    ],
    tools: "Lightroom / Photoshop",
  },
  {
    title: ["Visual design", "視覺設計"],
    text: [
      "Layouts, promotional artwork and visual assets across print and digital formats.",
      "印刷與數碼媒體的版面編排、宣傳設計及視覺素材製作。",
    ],
    tools: "Illustrator / Photoshop / Figma",
  },
  {
    title: ["Creative technology", "創意技術"],
    text: [
      "Exploring generative workflows, real-time environments and interactive ideas.",
      "探索生成式創作流程、即時場景與互動概念。",
    ],
    tools: "ComfyUI / Blender / Unreal Engine / React",
  },
];
export default function Skills() {
  const { t } = useLanguage();
  return (
    <section id="skills" className="skills-section shell">
      <div className="skills-intro"><p className="editorial-marker"><span>03 / {t("CAPABILITIES", "實作能力")}</span></p><h2 className="display-title">{t("Ideas need\na maker.", "讓想法\n落地成形。")}</h2>
        <p>{t("A practical toolkit, from concept to delivery.", "從概念到交付，把創意化為成品的實作能力。")}</p>
      </div>
      <div className="skill-list">
        {skills.map((skill, i) => (
          <details
            className="skill-row"
            key={skill.title[0]}
            open={i === 0 ? true : undefined}
          >
            <summary>
              <h3>{t(skill.title)}</h3>
              <span className="skill-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="skill-body">
              <p>{t(skill.text)}</p>
              <p className="tool-list">{skill.tools}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
