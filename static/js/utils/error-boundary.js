export class ErrorBoundary {
  static handleError(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }

  static fallbackUI() {
    return `
      <div class="glass-card p-6 text-center">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p class="text-gray-600">Please try refreshing the page</p>
      </div>
    `;
  }
}