import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { assetUrl, contact, getAsset, imageUrl } from "../data/portfolio";
import AssetImage from "./AssetImage";

const scenes = [
  { id: "ppp-lemon/ensemble", project: "ppp-lemon", label: ["Imagined worlds", "想像成真"], title: "PPP LEMON", detail: ["Brand films · Solo production", "品牌影片 · 獨立製作"] },
  { id: "videography/photo_v2_4", project: "videography", label: ["Moving images", "流動影像"], title: "DC BALLET", detail: ["Film · Shooting & editing", "影片 · 拍攝與剪輯"] },
  { id: "photography/photo_set_008", project: "photography", label: ["Quiet moments", "細看日常"], title: "BETWEEN MOMENTS", detail: ["Photography · Live performance", "攝影 · 現場演出"] },
];

function FilmPreview({ asset }) {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const video = useRef(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element || failed) return;
    if (reduced) { element.pause(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) element.pause();
      else if (!manuallyPaused.current) element.play().catch(() => {});
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced, failed]);
  if (failed) return <AssetImage id={asset.id} alt={t("Ballet film still", "芭蕾舞影片截圖")} eager />;
  return <>
    <video ref={video} src={assetUrl(asset.variants.preview.src)} poster={imageUrl(asset.id)} muted loop playsInline preload="metadata"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}
      aria-label={t("Ballet film preview", "芭蕾舞影片預覽")} />
    <button className="film-control glass-on-media" type="button" onClick={() => {
      manuallyPaused.current = !video.current.paused;
      if (video.current.paused) video.current.play().catch(() => {}); else video.current.pause();
    }} aria-label={playing ? t("Pause preview", "暫停預覽") : t("Play preview", "播放預覽")}>
      {playing ? "Ⅱ" : "▷"}
    </button>
  </>;
}

export default function Hero() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(1);
  const scene = scenes[selected];
  return (
    <section id="hero" className="hero shell">
      <div className="hero-copy">
        <p className="hero-identity"><span>{t("INDEPENDENT PERSPECTIVE", "以自己的視角，創作")}</span><span>HONG KONG / PORTFOLIO</span></p>
        <h1 lang="en" aria-label="Kam Ngai Lau"><span className="hero-title-line"><span>Kam Ngai</span></span><span className="hero-title-line"><span>Lau<span className="name-stop" aria-hidden="true">.</span></span></span></h1>
        <div className="hero-intro">
          <p className="hero-discipline">{t("FILMMAKING & AI IMAGE-MAKING", "影片製作與 AI 影像創作")}</p>
          <p className="hero-description">{t("From the first idea to the final cut. I make films, photographs and visual stories — with a camera, with AI, and with a hands-on approach.", "從第一個想法，到最後一次剪輯。以鏡頭與 AI 製作影片，結合攝影與設計，親手把訊息變成畫面。")}</p>
          <div className="hero-actions">
            <Link className="primary-link" to="/#projects">{t("Explore work", "瀏覽作品")} <span aria-hidden="true">↗</span></Link>
            <a className="inline-link" href={assetUrl(getAsset(contact.resume).src)} target="_blank" rel="noreferrer" data-track="resume_opened_hero">{t("Résumé", "閱讀履歷")} <span aria-hidden="true">↗</span></a>
          </div>
          <Link className="hero-contact" to="/#contact">{t("Discuss a role or a project", "洽談職位或創作合作")} <span aria-hidden="true">→</span></Link>
        </div>
        <div className="hero-caption"><span>{t("Real moments. New worlds.", "記錄真實。創造想像。")}</span><span>{t("FILM / PHOTOGRAPHY / DESIGN", "影片／攝影／設計")}</span></div>
      </div>
      <div className="hero-stage">
        <div className="optical-frame">
          <div className="hero-screen" key={scene.id}>
            {getAsset(scene.id).type === "video" ? <FilmPreview asset={getAsset(scene.id)} /> :
              <AssetImage id={scene.id} alt={t(scene.detail) + " / " + scene.title} eager sizes="(max-width: 599px) 92vw, 72vw" />}
          </div>
          <div className="hero-scene-meta" aria-live="polite">
            <div><strong>{scene.title}</strong><p>{t(scene.detail)}</p></div>
            <Link to={"/project/" + scene.project} className="scene-open" data-track={"project_opened_" + scene.project}
              aria-label={t("View project: ", "查看作品：") + scene.title}>↗</Link>
          </div>
        </div>
        <Link className="hero-still" to="/project/photography" data-track="project_opened_photography">
          <AssetImage id="photography/photo_lohas_008" alt={t("A ballet dancer outdoors, photographed by Kam Ngai Lau", "Kam Ngai Lau 拍攝的戶外芭蕾舞者")} eager sizes="(max-width: 599px) 40vw, 26vw" />
          <span><strong>{t("THE STILL FRAME", "定格的瞬間")}</strong><span aria-hidden="true">↗</span></span>
        </Link>
        <div className="scene-selector" role="group" aria-label={t("Choose a featured project", "選取焦點作品")}>
          {scenes.map((item, index) => <button key={item.id} type="button" aria-label={t(item.label)} aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <AssetImage id={item.id} alt="" sizes="64px" />
            <span>{t(item.label)}</span>
          </button>)}
        </div>
      </div>
    </section>
  );
}
