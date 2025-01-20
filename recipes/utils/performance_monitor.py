from django.db import connection
from django.core.cache import cache
from time import time

class PerformanceMonitor:
    """Monitors application performance metrics"""
    
    @staticmethod
    def track_query_performance(func):
        """Decorator to track query performance"""
        def wrapper(*args, **kwargs):
            start = time()
            initial_queries = len(connection.queries)
            
            result = func(*args, **kwargs)
            
            end = time()
            final_queries = len(connection.queries)
            
            metrics = {
                'execution_time': end - start,
                'query_count': final_queries - initial_queries
            }
            PerformanceMonitor._store_metrics(func.__name__, metrics)
            
            return result
        return wrapper
    
    @staticmethod
    def _store_metrics(operation, metrics):
        """Store performance metrics"""
        cache_key = f'perf_metrics_{operation}'
        current_metrics = cache.get(cache_key, [])
        current_metrics.append(metrics)
        cache.set(cache_key, current_metrics[-100:], timeout=86400)  # Keep last 100 metrics for 24h