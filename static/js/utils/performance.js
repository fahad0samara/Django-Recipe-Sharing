export const PerformanceMonitor = {
  measureTiming(label) {
    performance.mark(`${label}-start`);
    return {
      end() {
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = performance.getEntriesByName(label).pop();
        return measure.duration;
      }
    };
  },

  trackResourceLoading() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
          console.debug(`API Call to ${entry.name} took ${entry.duration}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    return observer;
  }
};