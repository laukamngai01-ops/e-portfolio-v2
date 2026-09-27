import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { projects, assetUrl, getAsset, imageUrl } from "../data/portfolio";
import { useLanguage } from "../context/LanguageContext";
import AssetImage from "../components/AssetImage";
import Contact from "../components/Contact";
import { useDwellTimer } from "../hooks/useDwellTimer";

function VideoItem({ asset, label }) {
  const [failed, setFailed] = useState(false);
  const { t } = useLanguage();
  if (failed)
    return (
      <div className="media-error" role="status">
        <p>{t("The video could not be loaded.", "影片暫時無法載入。")}</p>
        <button type="button" onClick={() => setFailed(false)}>
          {t("Try again", "重新載入")}
        </button>
        <a href={assetUrl(asset.src)} target="_blank" rel="noreferrer">
          {t("Open video file", "開啟影片檔案")} ↗
        </a>
      </div>
    );
  return (
    <video
      controls
      playsInline
      preload="none"
      poster={imageUrl(asset.id)}
      aria-label={label}
      onError={() => setFailed(true)}
    >
      {asset.variants?.webm && <source src={assetUrl(asset.variants.webm.src)} type='video/webm; codecs="vp9, opus"' />}
      <source src={assetUrl(asset.src)} type="video/mp4" onError={() => setFailed(true)} />
    </video>
  );
}

function ImageViewer({ images, index, setIndex, onClose, title }) {
  const ref = useRef(null);
  const { t } = useLanguage();
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  const previous = () => setIndex((index + images.length - 1) % images.length);
  const next = () => setIndex((index + 1) % images.length);
  const asset = getAsset(images[index]);
  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={t("Image viewer", "影像檢視器")}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
      }}
    >
      <div className="lightbox-header">
        <span>
          {title} / {String(index + 1).padStart(2, "0")} OF{" "}
          {String(images.length).padStart(2, "0")}
        </span>
        <button type="button" autoFocus onClick={onClose}>
          {t("Close", "關閉")} ×
        </button>
      </div>
      <div className="lightbox-frame">
        <AssetImage
          key={asset.id}
          id={asset.id}
          alt={title + " / " + (index + 1)}
          eager
        />
      </div>
      <div className="lightbox-footer">
        <button
          type="button"
          onClick={previous}
          aria-label={t("Previous image", "上一張影像")}
        >
          ←
        </button>
        <a href={assetUrl(asset.src)} target="_blank" rel="noreferrer">
          {t("View full-resolution image", "查看完整解像度影像")} ↗
        </a>
        <button
          type="button"
          onClick={next}
          aria-label={t("Next image", "下一張影像")}
        >
          →
        </button>
      </div>
    </dialog>
  );
}

function ProjectContent({ project }) {
  const { t, language } = useLanguage();
  const { state } = useLocation();
  const entryImage = project.items.includes(state?.entryImage) ? state.entryImage : project.cover;
  const [viewerIndex, setViewerIndex] = useState(null);
  const viewerTrigger = useRef(null);
  const images = project.items.filter((id) => getAsset(id).type === "image");
  const ref = useDwellTimer("ProjectDetail_" + project.id);
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [project.id]);
  useEffect(() => {
    const title =
      (project.name || project.category[language === "en" ? 0 : 1]) + " — Kam Ngai Lau";
    const description = project.intro[language === "en" ? 0 : 1];
    const previousTitle = document.title;
    document.title = title;
    const updates = [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      [
        'meta[property="og:image"]',
        new URL(imageUrl(project.cover), window.location.origin).href,
      ],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', description],
      [
        'meta[name="twitter:image"]',
        new URL(imageUrl(project.cover), window.location.origin).href,
      ],
    ];
    const previous = updates.map(([selector, value]) => {
      const element = document.querySelector(selector);
      const old = element?.getAttribute("content");
      element?.setAttribute("content", value);
      return [element, old];
    });
    return () => {
      document.title = previousTitle;
      previous.forEach(([element, value]) => {
        if (element && value != null) element.setAttribute("content", value);
      });
    };
  }, [project, language]);
  return (
    <>
      <article ref={ref} className={"detail detail-" + project.id}>
        <div className="shell">
          <div className="detail-top">
            <Link to="/#projects" data-track="back_to_work">
              ↙ {t("Back to work", "返回作品")}
            </Link>
            <span>
              {t(project.category)}
            </span>
          </div>
          {project.name && <p className="case-name">{project.name} / {t("AI-ASSISTED BRAND FILMS", "AI 輔助品牌影片")}</p>}
          <div className="detail-heading">
            <h1 className="detail-title">{t(project.title)}</h1>
            <a className="inline-link" href="#case-films" onClick={(event) => {
              event.preventDefault();
              document.getElementById("case-films")?.scrollIntoView({ behavior: "instant" });
            }}>{project.featured ? t("Watch the films", "觀看成片") : t("Explore the collection", "瀏覽作品選輯")} <span aria-hidden="true">↓</span></a>
          </div>
          <figure className="detail-cover" style={{ viewTransitionName: "project-cover" }}>
            <AssetImage id={entryImage} alt={t(project.subtitle)} eager />
          </figure>
          <div className="detail-intro">
            <p>{t(project.intro)}</p>
            <dl className="detail-info">
              <div>
                <dt>{t("My role", "我的職責")}</dt>
                <dd>{t(project.role)}</dd>
              </div>
              {project.tools && <div>
                <dt>{t("Tools & equipment", "工具與器材")}</dt>
                <dd>{project.tools}</dd>
              </div>}
              {project.facts?.map((fact) => <div key={fact.label[0]}>
                <dt>{t(fact.label)}</dt>
                <dd>{t(fact.value)}</dd>
              </div>)}
            </dl>
          </div>
          {project.featured && <a className="case-watch" href="#case-films" onClick={(event) => {
            event.preventDefault();
            document.getElementById("case-films")?.scrollIntoView({ behavior: "instant" });
          }}>{t("Watch the film series", "觀看系列成片")} ↓</a>}
          {project.story && <section className="case-story" aria-label={t("Project story", "案例介紹")}>
            {project.story.map((section) => <div key={section.title[0]}>
              <h2>{t(section.title)}</h2>
              <p>{t(section.text)}</p>
            </div>)}
          </section>}
          <div className="section-label">
            <span>{t("Working process", "製作流程")}</span>
            <span>
              {t("From first idea to final frame", "從最初構想到最後畫面")}
            </span>
          </div>
          <div className="workflow">
            {project.process.map((step, i) => (
              <div key={step[0]}>
                <span>0{i + 1}</span>
                <p>{t(step)}</p>
              </div>
            ))}
          </div>
          <div className="gallery-heading" id="case-films">
            <h2>{project.featured ? t("The finished films", "完整成片") : t("The collection", "作品選輯")}</h2>
            <p>
              {project.featured ? t("The latest complete films, followed by selected frames. AI-generated imagery; Cantonese audio and Traditional Chinese captions.", "最新完整影片，以及精選成片截圖。影像採用 AI 生成，配以粵語對白與繁體中文字幕。") : images.length
                ? t(
                    "Select an image to explore in full.",
                    "點選影像，開啟完整檢視。",
                  )
                : t(
                    "Original films. Select a film to play.",
                    "原始影片。選取影片即可播放。",
                  )}
            </p>
          </div>
          <div className="detail-gallery">
            {project.items.map((id, index) => {
              const asset = getAsset(id);
              const label =
                project.labels?.[id] ? t(project.labels[id]) : t(project.category) +
                " / " +
                String(index + 1).padStart(2, "0");
              return (
                <figure
                  className={
                    "gallery-item" +
                    (asset.width / asset.height > 1.8 ? " is-wide" : "")
                  }
                  key={id}
                >
                  {asset.type === "video" ? (
                    <VideoItem asset={asset} label={label} />
                  ) : (
                    <button
                      className="gallery-open"
                      type="button"
                      onClick={(event) => {
                        viewerTrigger.current = event.currentTarget;
                        setViewerIndex(images.indexOf(id));
                      }}
                      aria-label={
                        t("Enlarge image ", "放大影像 ") + (index + 1)
                      }
                    >
                      <AssetImage
                        id={id}
                        alt={label}
                        sizes="(max-width: 760px) 100vw, 50vw"
                      />
                      <span className="gallery-expand" aria-hidden="true">
                        ↗
                      </span>
                    </button>
                  )}
                  <figcaption>
                    <span>{label}</span>
                    <span>
                      {asset.type === "video"
                        ? Math.floor(asset.duration / 60) +
                          ":" +
                          String(Math.floor(asset.duration % 60)).padStart(
                            2,
                            "0",
                          )
                        : asset.width + " × " + asset.height}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
        <section className="next-work">
          <Link
            to={"/project/" + next.id}
            className="shell"
            data-track={"next_project_" + next.id}
          >
            <small>
              {t("Up next", "下一個作品集")} / {t(next.category)}
            </small>
            <h2>{t(next.title)}</h2>
            <span className="next-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </section>
      </article>
      <Contact />
      {viewerIndex !== null && (
        <ImageViewer
          images={images}
          index={viewerIndex}
          setIndex={setViewerIndex}
          onClose={() => {
            setViewerIndex(null);
            requestAnimationFrame(() => viewerTrigger.current?.focus({ preventScroll: true }));
          }}
          title={t(project.category)}
        />
      )}
    </>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);
  if (!project) return <Navigate to="/not-found" replace />;
  return <ProjectContent key={project.id} project={project} />;
}
