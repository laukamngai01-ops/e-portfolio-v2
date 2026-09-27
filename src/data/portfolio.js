import catalog from "./assets.json";
import { PROJECTS_DATA } from "./projects";

const additionalCatalogs = import.meta.glob("./asset-collections/*.json", {
  eager: true,
  import: "default",
});
const assets = Object.assign({}, catalog.assets, ...Object.values(additionalCatalogs).map((collection) => collection.assets));

export const assetUrl = (path) =>
  import.meta.env.BASE_URL + path.replace(/^\//, "");
export const getAsset = (id) => {
  const asset = assets[id];
  if (!asset) throw new Error("Unknown asset ID: " + id);
  return asset;
};
export const getFilmCount = (project) => project.items.filter((id) => getAsset(id).type === "video").length;
const responsiveImages = (asset) => Object.entries(asset.variants || {})
  .filter(([key]) => /^w\d+$/.test(key))
  .map(([key, variant]) => ({ ...variant, width: Math.min(asset.width, Number(key.slice(1))) }))
  .sort((a, b) => a.width - b.width);
export const imageUrl = (id, size = 1920) => {
  const asset = getAsset(id);
  return assetUrl(
    asset.variants?.["w" + size]?.src ||
      responsiveImages(asset).at(-1)?.src ||
      asset.variants?.poster?.src ||
      asset.src,
  );
};
export const imageSet = (id) => {
  const asset = getAsset(id);
  const variants = [...new Map(responsiveImages(asset).map((variant) => [variant.width, variant])).values()];
  return variants.length ? variants.map((variant) => `${assetUrl(variant.src)} ${variant.width}w`).join(", ") : undefined;
};
const originalItems = (id) =>
  PROJECTS_DATA.find((item) => item.id === id).items.map(
    (item) =>
      id +
      "/" +
      item.src
        .split("/")
        .pop()
        .replace(/\.[^.]+$/, ""),
  );

export const projects = [
  {
    id: "ppp-lemon",
    discipline: "ai-film",
    featured: true,
    number: "05",
    title: ["Small characters.\nBig stories.", "小角色。\n大故事。"],
    category: ["AI film", "AI 影像"],
    name: "PPP LEMON",
    subtitle: ["PPP LEMON — a character-led brand film series", "PPP LEMON — 以角色帶動敘事的品牌影片系列"],
    intro: [
      "A cast of fruit characters turns product messaging into a four-film series. My employer supplied the required wording and product talking points; I independently handled the creative development and production, from script and character design to AI-generated shots, voice and final edit.",
      "用一群水果角色，把產品訊息轉化為四部系列短片。由老闆提供必須出現的文字及產品重點，其餘創意發展與製作由我獨立完成，涵蓋劇本、角色設定、分鏡、AI 影像生成、配音及最終剪輯。",
    ],
    role: ["Solo creator / End-to-end production", "獨立創作／完整影片製作"],
    facts: [
      { label: ["Presented collection", "展示內容"], value: ["4 completed films · 16:9 · 720p", "四部完整影片 · 16:9 · 720p"] },
      { label: ["Presented edition", "展示版本"], value: ["Cantonese · Traditional Chinese captions", "粵語配音 · 繁體中文字幕"] },
    ],
    process: [
      ["Brief → script", "需求 → 劇本"],
      ["Characters → storyboard", "角色 → 分鏡"],
      ["AI shots → selection", "AI 鏡頭 → 篩選"],
      ["Voice → edit → delivery", "配音 → 剪輯 → 交付"],
    ],
    story: [
      { title: ["The starting point", "從指定訊息出發"], text: ["The brief began with required copy and product talking points, not a finished screenplay. My task was to give those messages a story, a visual world and a finished film.", "需求的起點是指定文字與產品重點，而不是一份完成的劇本。我的工作是為這些訊息建立故事、視覺世界，並完成影片。"] },
      { title: ["One cast. Four stories.", "同一組角色，四段故事。"], text: ["A citrus-world adventure, a blind-tasting conversation, an enzyme product story and a sunlit terrace scene. Recurring fruit characters connect the series, while each film uses a different setting to introduce its product.", "從柑橘世界冒險、盲選對話，到酵素產品故事與陽光露台場景，重複登場的水果角色串連整個系列，各部影片則以不同情境帶出產品。"] },
      { title: ["From generation to delivery", "從生成到交付"], text: ["I handled the script, character direction, storyboards, AI generation, voice and edit as one production workflow. The finished exports bring the generated shots, dialogue, captions and branded endings together.", "劇本、角色設定、分鏡、AI 生成、配音與剪輯，全部由我串連成完整的製作流程。成片整合生成鏡頭、對白、字幕與品牌片尾，完成交付。"] },
    ],
    cover: "ppp-lemon/ensemble",
    spotlight: "ppp-lemon/terrace",
    preview: "ppp-lemon/film-04",
    items: ["ppp-lemon/film-01", "ppp-lemon/film-02", "ppp-lemon/film-03", "ppp-lemon/film-04", "ppp-lemon/ensemble", "ppp-lemon/blind-taste", "ppp-lemon/enzyme", "ppp-lemon/terrace"],
    labels: {
      "ppp-lemon/film-01": ["01 / Lemon polyphenols & enzymes", "01／神奇檸檬多酚與酵素：甚麼是多酚？"],
      "ppp-lemon/film-02": ["02 / Lemon lozenges & sea grapes", "02／檸檬多酚無糖潤喉糖加埋海葡萄無糖製造？"],
      "ppp-lemon/film-03": ["03 / Sea grape essence × Enzyme King", "03／海葡萄修復精華 × 酵素之霸"],
      "ppp-lemon/film-04": ["04 / Polyphenols & glucosamine", "04／關節保養點樣揀？純素無糖＋補鈣｜多酚葡萄糖胺"],
      "ppp-lemon/ensemble": ["Film still / The ensemble", "成片截圖／角色群像"],
      "ppp-lemon/blind-taste": ["Film still / The blind-tasting conversation", "成片截圖／盲選中的對話"],
      "ppp-lemon/enzyme": ["Film still / Enzyme King", "成片截圖／酵素之霸"],
      "ppp-lemon/terrace": ["Film still / A conversation on the terrace", "成片截圖／露台上的對話"],
    },
  },
  {
    id: "photography",
    number: "01",
    title: ["Between the moments.", "舞台以外的瞬間。"],
    category: ["Photography", "攝影"],
    subtitle: [
      "Performance, portraits & the moments in between",
      "表演、人像，以及那些不經意的片刻",
    ],
    intro: [
      "A collection of portraits and performance photographs, from outdoor events to the quiet moments backstage. Gesture, expression and available light lead the frame.",
      "從戶外演出到後台片刻，這組攝影作品記錄人物的姿態與表情，透過現場光線，保留表演以外的溫度。",
    ],
    role: ["Photography / Selection / Colour", "攝影／選片／調色"],
    tools: "Lightroom, Photoshop",
    process: [
      ["Observe the setting", "觀察現場"],
      ["Capture the moment", "捕捉瞬間"],
      ["Select & colour", "選片與調色"],
      ["Prepare the final images", "整理成品"],
    ],
    cover: "photography/photo_lohas_008",
    spotlight: "photography/photo_asaf_299",
    secondary: "photography/photo_asaf_299",
    items: originalItems("photography"),
  },
  {
    id: "graphic-design",
    number: "02",
    title: ["Made to be seen.", "讓訊息被看見。"],
    category: ["Graphic design", "平面設計"],
    subtitle: [
      "Print & campaign visuals for DC School of Ballet",
      "DC 芭蕾舞學校的印刷與宣傳視覺",
    ],
    intro: [
      "Calendars, promotional banners and event artwork for a ballet school. A selection of finished designs across print, desktop and mobile formats.",
      "為芭蕾舞學校製作的月曆、宣傳橫幅與活動視覺，涵蓋印刷、桌面及流動裝置等不同使用情境。",
    ],
    role: [
      "Graphic design / Image editing / Layout",
      "平面設計／影像編修／版面編排",
    ],
    tools: "Photoshop, Illustrator, ChatGPT, Gemini",
    process: [
      ["Review the brief", "理解需求"],
      ["Develop the layout", "發展版面"],
      ["Refine the artwork", "修整視覺"],
      ["Adapt across formats", "適配不同格式"],
    ],
    cover: "graphic-design/graphic_design_study_case_1",
    secondary: "graphic-design/graphic_v2_1",
    items: originalItems("graphic-design"),
  },
  {
    id: "videography",
    number: "03",
    title: ["A sense of movement.", "讓畫面流動。"],
    category: ["Videography", "影片製作"],
    subtitle: [
      "Events, performance & social films",
      "活動紀錄、表演與社群影片",
    ],
    intro: [
      "Moving-image work spanning ballet classes, live events and social content. Each film brings shooting, editing and delivery together in a format suited to its audience.",
      "從芭蕾舞課堂、現場活動到社群內容，將拍攝、剪輯與交付串連起來，以合適的節奏和格式呈現每段影像。",
    ],
    role: ["Videography / Editing / Colour", "影片拍攝／剪輯／調色"],
    tools: "Sony FX3, DJI Pocket 2, Premiere Pro, CapCut",
    process: [
      ["Plan the sequence", "規劃鏡頭"],
      ["Shoot on location", "現場拍攝"],
      ["Shape the edit", "剪輯敘事"],
      ["Colour & deliver", "調色與交付"],
    ],
    cover: "videography/photo_v2_4",
    preview: "videography/photo_v2_4",
    secondary: "videography/video_lohas_v2",
    items: originalItems("videography"),
  },
  {
    id: "ai-film",
    number: "04",
    title: ["Beyond the lens.", "鏡頭以外的想像。"],
    category: ["AI film", "AI 影像"],
    subtitle: [
      "Generative image-making & film experiments",
      "生成式影像與影片實驗",
    ],
    intro: [
      "A collection of generative film experiments exploring visual ideas through prompting, image generation and editing. AI-assisted work is presented as its own discipline.",
      "透過提示設計、影像生成與剪輯探索視覺想法。這組生成式影片實驗獨立展示，清楚標示 AI 輔助創作的性質。",
    ],
    role: ["Concept / Generation / Editing", "概念／生成／剪輯"],
    tools: "ChatGPT, Pippit, CapCut",
    process: [
      ["Develop the idea", "發展概念"],
      ["Direct the generation", "引導生成"],
      ["Select & assemble", "選取與組接"],
      ["Edit & finish", "剪輯與完成"],
    ],
    cover: "ai-film/ai_film_new_4",
    preview: "ai-film/ai_film_new_4",
    secondary: "ai-film/ai_film_new_3",
    items: originalItems("ai-film"),
  },
];
export const contact = {
  email: "laukamngai01@gmail.com",
  resume: "documents/resume",
};
