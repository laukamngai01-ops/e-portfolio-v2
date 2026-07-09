import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { analytics } from '../utils/analytics';

export function useDwellTimer(sectionName, customRef = null) {
  const internalRef = useRef(null);
  const ref = customRef || internalRef;
  const isInView = useInView(ref, { amount: 0.5 }); // Trigger when 50% visible
  const startTime = useRef(null);

  useEffect(() => {
    if (isInView) {
      startTime.current = Date.now();
    } else {
      if (startTime.current) {
        const dwellTime = Date.now() - startTime.current;
        analytics.trackDwellTime(sectionName, dwellTime);
        startTime.current = null;
      }
    }

    return () => {
      // If unmounting while still in view
      if (startTime.current) {
        const dwellTime = Date.now() - startTime.current;
        analytics.trackDwellTime(sectionName, dwellTime);
      }
    };
  }, [isInView, sectionName]);

  return ref;
}
