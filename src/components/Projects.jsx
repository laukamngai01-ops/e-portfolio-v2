import { useState } from "react";
import { projects, getFilmCount } from "../data/portfolio";
import { useLanguage } from "../context/LanguageContext";
import ProjectCover from "./ProjectCover";
import ProjectLink from "./ProjectLink";
import { useDwellTimer } from "../hooks/useDwellTimer";

function ProjectCard({ project }) {
  const { t } = useLanguage();
  const ref = useDwellTimer("ProjectCard_" + project.id);
  return (
    <article ref={ref} className={"work-card work-" + project.id + (project.featured ? " work-featured" : "")}>
      {project.featured && (
        <div className="featured-heading">
          <span>{t("Featured story", "焦點案例")}</span>
          <span>{project.name}</span>
        </div>
      )}
      <ProjectCover project={project} />
      <div className="work-meta">
        <span>
          {t(project.category)}
        </span>
        <span>
          {project.featured ? <>{String(getFilmCount(project)).padStart(2, "0")} {t("FILMS / VIEW CASE STUDY", "部影片／查看製作案例")}</> : <>{String(project.items.length).padStart(2, "0")} {t("SELECTED", "件作品")}</>}
        </span>
      </div>
      <ProjectLink projectId={project.id} imageId={project.spotlight || project.cover} className="work-title">
        <h3>{t(project.title)}</h3>
      </ProjectLink>
      <p>{t(project.subtitle)}</p>
      {project.featured && <div className="featured-note">
        <p>{t("A brief, a cast of characters, four finished films. Independently created from script to final edit.", "從指定訊息、角色世界，到四部完整影片。由劇本到最終剪輯，獨立完成。")}</p>
        <ProjectLink projectId={project.id} imageId={project.spotlight || project.cover} className="inline-link">{t("View case study", "查看製作案例")} <span aria-hidden="true">↗</span></ProjectLink>
      </div>}
    </article>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const visible =
    filter === "all"
      ? projects
      : projects.filter((project) => (project.discipline || project.id) === filter);
  return (
    <section id="projects" className="work-section shell">
      <p className="editorial-marker"><span>01 / {t("SELECTED WORK", "精選作品")}</span><span>{String(projects.length).padStart(2, "0")} {t("COLLECTIONS", "個作品集")}</span></p>
      <div className="work-heading">
        <h2>{t("Selected work", "精選作品")}<span className="heading-dot">.</span></h2>
        <p>
          {t(
            "A selection of things I have shot, designed and brought to life.",
            "一些由我拍攝、設計，並親手完成的作品。",
          )}
        </p>
      </div>
      <div
        className="work-filters"
        role="group"
        aria-label={t("Filter work by discipline", "按類別篩選作品")}
      >
        <button
          type="button"
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          {t("All work", "全部作品")} <sup>{String(projects.length).padStart(2, "0")}</sup>
        </button>
        {projects.filter((project) => !project.discipline).map((project) => (
          <button
            type="button"
            key={project.id}
            aria-pressed={filter === project.id}
            onClick={() => setFilter(project.id)}
          >
            {t(project.category)}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visible.length} {t("collections shown", "個作品集")}
      </p>
      <div className={"work-grid" + (filter !== "all" ? " is-filtered" : "")}>
        {visible.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
