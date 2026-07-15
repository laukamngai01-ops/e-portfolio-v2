import posthog from 'posthog-js'

class StealthAnalytics {
  constructor() {
    this.sessionStartTime = Date.now();
    
    // Initialize PostHog
    if (typeof window !== 'undefined') {
      const PH_KEY = import.meta.env.VITE_POSTHOG_KEY;
      const PH_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
      if (PH_KEY) {
        posthog.init(PH_KEY, {
          api_host: PH_HOST,
          // We will manually track page views in React Router
          capture_pageview: false, 
          // Disable automatic masking so you can actually see what they are looking at
          session_recording: {
            maskAllInputs: true, // Only mask input fields
            maskTextSelector: null, // Don't mask regular text
          }
        });
      }

      window.addEventListener('beforeunload', () => this.trackExit());
    }
  }

  // Base method to capture any event
  capture(eventName, properties = {}) {
    if (import.meta.env.VITE_POSTHOG_KEY) {
      posthog.capture(eventName, properties);
    }
    
    // Stealth mode: only log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Stealth Analytics -> PostHog] 🕵️ ${eventName}`, properties);
    }
  }

  // Track page views
  trackPageView(path) {
    if (import.meta.env.VITE_POSTHOG_KEY) {
      posthog.capture('$pageview', { $current_url: path });
    }
    if (import.meta.env.DEV) {
      console.log(`[Stealth Analytics -> PostHog] 🕵️ $pageview`, { path });
    }
  }

  // Track how long someone spent looking at a specific section
  trackDwellTime(sectionName, timeInMs) {
    if (timeInMs < 1000) return; // Ignore less than 1 second
    this.capture('dwell_time', {
      section: sectionName,
      time_seconds: Math.round(timeInMs / 1000)
    });
  }

  // Track clicks on specific important elements
  trackClick(elementName, additionalData = {}) {
    this.capture('custom_click', { element: elementName, ...additionalData });
  }

  // Track when they leave the site
  trackExit() {
    const totalSessionTime = Date.now() - this.sessionStartTime;
    this.capture('site_exit', {
      total_time_seconds: Math.round(totalSessionTime / 1000),
      last_path: window.location.hash
    });
  }
}

export const analytics = new StealthAnalytics();
