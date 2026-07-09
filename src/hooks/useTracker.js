import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../utils/analytics';

export function useTracker() {
  const location = useLocation();

  useEffect(() => {
    // 每次路由变化时记录 PV
    analytics.trackPageView(location.pathname + location.hash);

    // 设置全局点击监听，捕获带有 data-track 的元素的点击
    const handleGlobalClick = (e) => {
      // 往上找直到找到带有 data-track 属性的元素
      const target = e.target.closest('[data-track]');
      if (target) {
        const eventName = target.getAttribute('data-track');
        analytics.trackClick(eventName, {
          text: target.innerText || target.getAttribute('aria-label') || 'unknown'
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [location]);
}
