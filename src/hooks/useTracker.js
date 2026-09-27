import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analytics } from "../utils/analytics";

export function useTracker() {
  const location = useLocation();

  useEffect(() => {
    // Record page views when the route changes.
    analytics.trackPageView(location.pathname + location.hash);

    // Capture clicks on elements with an explicit tracking attribute.
    const handleGlobalClick = (e) => {
      // Resolve the closest tracked element.
      const target = e.target.closest("[data-track]");
      if (target) {
        const eventName = target.getAttribute("data-track");
        analytics.trackClick(eventName, {
          text:
            target.innerText || target.getAttribute("aria-label") || "unknown",
        });
      }
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [location]);
}
