import { Link, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";

// Only the clicked cover receives a transition name, so repeated projects stay valid.
// Browsers without View Transitions and reduced-motion users get ordinary navigation.
export default function ProjectLink({ projectId, imageId, children, ...props }) {
  const navigate = useNavigate();
  const to = "/project/" + projectId;
  const state = imageId ? { entryImage: imageId } : undefined;
  const open = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const source = event.currentTarget.matches("[data-project-cover]") ? event.currentTarget :
      event.currentTarget.closest("article")?.querySelector("[data-project-cover]");
    if (!source) return;
    event.preventDefault();
    source.style.viewTransitionName = "project-cover";
    const transition = document.startViewTransition(() => {
      flushSync(() => navigate(to, { state }));
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    // A skipped animation must never leave an unhandled rejection or prevent navigation.
    transition.ready.catch(() => {});
    transition.finished.catch(() => {}).finally(() => { source.style.viewTransitionName = ""; });
  };
  return <Link {...props} to={to} state={state} onClick={open}>{children}</Link>;
}
