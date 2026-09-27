class StealthAnalytics {
  constructor() {
    this.sessionStartTime = Date.now();
    this.posthog = null;
    this.posthogReady = null;

    // Initialize PostHog
    if (typeof window !== "undefined") {
      const PH_KEY = import.meta.env.VITE_POSTHOG_KEY;
      const PH_HOST =
        import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";
      if (PH_KEY) {
        this.posthogReady = import("posthog-js").then(
          ({ default: posthog }) => {
            posthog.init(PH_KEY, {
              api_host: PH_HOST,
              capture_pageview: false,
              session_recording: {
                maskAllInputs: true,
                maskTextSelector: null,
              },
            });
            this.posthog = posthog;
            return posthog;
          },
        );
      }

      window.addEventListener("beforeunload", () => this.trackExit());
    }
  }

  // Base method to capture any event
  capture(eventName, properties = {}) {
    if (import.meta.env.VITE_POSTHOG_KEY) {
      if (this.posthog) {
        this.posthog.capture(eventName, properties);
      } else {
        this.posthogReady?.then((posthog) =>
          posthog.capture(eventName, properties),
        );
      }
    }

    // Stealth mode: only log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Stealth Analytics -> PostHog] 🕵️ ${eventName}`, properties);
    }
  }

  // Track page views
  trackPageView(path) {
    if (import.meta.env.VITE_POSTHOG_KEY) {
      if (this.posthog) {
        this.posthog.capture("$pageview", { $current_url: path });
      } else {
        this.posthogReady?.then((posthog) =>
          posthog.capture("$pageview", { $current_url: path }),
        );
      }
    }
    if (import.meta.env.DEV) {
      console.log(`[Stealth Analytics -> PostHog] 🕵️ $pageview`, { path });
    }
  }

  // Track how long someone spent looking at a specific section
  trackDwellTime(sectionName, timeInMs) {
    if (timeInMs < 1000) return; // Ignore less than 1 second
    this.capture("dwell_time", {
      section: sectionName,
      time_seconds: Math.round(timeInMs / 1000),
    });
  }

  // Track clicks on specific important elements
  trackClick(elementName, additionalData = {}) {
    this.capture("custom_click", { element: elementName, ...additionalData });
  }

  // Track when they leave the site
  trackExit() {
    const totalSessionTime = Date.now() - this.sessionStartTime;
    this.capture("site_exit", {
      total_time_seconds: Math.round(totalSessionTime / 1000),
      last_path: window.location.hash,
    });
  }
}

export const analytics = new StealthAnalytics();
