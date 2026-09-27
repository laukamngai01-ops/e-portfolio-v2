import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { assetUrl, getAsset } from "../data/portfolio";
import { useLanguage } from "../context/LanguageContext";
import AssetImage from "./AssetImage";
import ProjectLink from "./ProjectLink";

export default function ProjectCover({ project }) {
  const { t } = useLanguage();
  const video = useRef(null);
  const frame = useRef(null);
  const timer = useRef(null);
  const manual = useRef(false);
  const suppressed = useRef(false);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const preview = project.preview ? getAsset(project.preview).variants?.preview : null;
  const cover = project.spotlight || project.cover;

  const stop = () => { clearTimeout(timer.current); video.current?.pause(); };
  const play = () => {
    const element = video.current;
    if (!element || !preview || failed) return;
    // Intent-driven loading: mounting a card never downloads its clip.
    if (!element.getAttribute("src")) element.src = assetUrl(preview.src);
    element.play().catch(() => {});
  };
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { clearTimeout(timer.current); element.pause(); manual.current = false; }
    }, { threshold: 0.15 });
    observer.observe(frame.current);
    const hide = () => { if (document.hidden) element.pause(); };
    document.addEventListener("visibilitychange", hide);
    return () => {
      clearTimeout(timer.current);
      observer.disconnect();
      document.removeEventListener("visibilitychange", hide);
      element.pause();
    };
  }, []);
  useEffect(() => { if (reduced) { clearTimeout(timer.current); video.current?.pause(); } }, [reduced]);

  return <div ref={frame} className={"work-media" + (playing ? " is-playing" : "")}
    onPointerEnter={(event) => {
      if (event.pointerType !== "mouse" || suppressed.current || reduced || navigator.connection?.saveData || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      timer.current = setTimeout(play, 160);
    }}
    onPointerLeave={() => { clearTimeout(timer.current); if (!manual.current) stop(); }}>
    <ProjectLink projectId={project.id} imageId={cover} className="work-visual" data-project-cover
      aria-label={t("View " + project.category[0], "查看" + project.category[1])} data-track={"project_opened_" + project.id}>
      <AssetImage id={cover} alt={t(project.subtitle)} sizes={project.featured ? "100vw" : "(max-width: 760px) 100vw, 60vw"} />
      {preview && <video ref={video} muted playsInline loop preload="none" aria-hidden="true" tabIndex={-1}
        onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => { setFailed(true); setPlaying(false); }} />}
      <span className="work-corner" aria-hidden="true">↗</span>
    </ProjectLink>
    {preview && !failed && <button className="cover-preview glass-on-media" type="button" aria-pressed={playing}
      aria-label={(playing ? t("Pause preview: ", "暫停預覽：") : t("Play preview: ", "播放預覽：")) + (project.name || t(project.category))}
      onClick={() => {
        clearTimeout(timer.current);
        if (playing) { suppressed.current = true; manual.current = false; stop(); }
        else { suppressed.current = false; manual.current = true; play(); }
      }}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>{playing ? t("Pause", "暫停") : t("Preview", "預覽")}</button>}
    {failed && <p className="preview-error" role="status">{t("Preview unavailable. Open the project to watch.", "預覽暫時無法載入，請開啟作品觀看。")}</p>}
  </div>;
}
