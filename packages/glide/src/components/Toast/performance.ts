// @ts-nocheck - Temporary workaround for dependency issues
/**
 * Performance validation utilities for Toast component optimization
 */

import type { ToastConfig, ToastItem } from './types';

/**
 * Performance monitoring interface
 */
interface PerformanceMetrics {
  renderTime: number;
  stateUpdateTime: number;
  memoryUsage: number;
  rerenderCount: number;
}

/**
 * Performance tracker for Toast operations
 */
export class ToastPerformanceTracker {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private renderCounts: Map<string, number> = new Map();

  /**
   * Start tracking performance for a specific operation
   */
  startTracking(operationId: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${operationId}-start`);
    }
  }

  /**
   * End tracking and record metrics
   */
  endTracking(operationId: string): PerformanceMetrics | null {
    if (typeof performance === 'undefined') {
      return null;
    }

    const startMark = `${operationId}-start`;
    const endMark = `${operationId}-end`;

    performance.mark(endMark);

    try {
      performance.measure(operationId, startMark, endMark);
      const measures = performance.getEntriesByName(operationId, 'measure');
      const measure = measures[0];

      if (!measure) {
        return null;
      }

      const metrics: PerformanceMetrics = {
        renderTime: measure.duration,
        stateUpdateTime: measure.duration, // Simplified for this implementation
        memoryUsage: this.getMemoryUsage(),
        rerenderCount: this.getRerenderCount(operationId),
      };

      this.metrics.set(operationId, metrics);

      // Cleanup performance entries
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(operationId);

      return metrics;
    } catch (error) {
      // Performance tracking failed
      if (typeof window !== 'undefined' && window.console) {
        window.console.warn('Performance tracking failed:', error);
      }
      return null;
    }
  }

  /**
   * Track component re-renders
   */
  trackRerender(componentName: string): void {
    const current = this.renderCounts.get(componentName) || 0;
    this.renderCounts.set(componentName, current + 1);
  }

  /**
   * Get re-render count for a component
   */
  getRerenderCount(componentName: string): number {
    return this.renderCounts.get(componentName) || 0;
  }

  /**
   * Get memory usage (simplified)
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize || 0;
    }
    return 0;
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, PerformanceMetrics> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.renderCounts.clear();
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const allMetrics = this.getAllMetrics();
    const totalRenders = Array.from(this.renderCounts.values()).reduce(
      (sum, count) => sum + count,
      0,
    );

    let report = '=== Toast Component Performance Report ===\n\n';

    report += `Total Component Renders: ${totalRenders}\n`;
    report += `Tracked Operations: ${Object.keys(allMetrics).length}\n\n`;

    Object.entries(allMetrics).forEach(([operation, metrics]) => {
      report += `Operation: ${operation}\n`;
      report += `  Render Time: ${metrics.renderTime.toFixed(2)}ms\n`;
      report += `  Re-renders: ${metrics.rerenderCount}\n`;
      report += `  Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB\n\n`;
    });

    return report;
  }
}

/**
 * Performance benchmark utilities
 */
export class ToastBenchmark {
  private tracker = new ToastPerformanceTracker();

  /**
   * Benchmark toast creation performance
   */
  async benchmarkToastCreation(configs: ToastConfig[], iterations: number = 100): Promise<number> {
    const operationId = 'toast-creation-batch';
    this.tracker.startTracking(operationId);

    // Simulate batch toast creation
    for (let i = 0; i < iterations; i++) {
      configs.forEach((config, index) => {
        // Simulate toast creation overhead
        const mockToast = {
          id: `test-${i}-${index}`,
          ...config,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // Simulate some processing
        JSON.stringify(mockToast);
      });
    }

    const metrics = this.tracker.endTracking(operationId);
    return metrics?.renderTime || 0;
  }

  /**
   * Benchmark state update performance
   */
  async benchmarkStateUpdates(updateCount: number = 1000): Promise<number> {
    const operationId = 'state-updates-batch';
    this.tracker.startTracking(operationId);

    // Simulate rapid state updates
    let state: { toasts: ToastItem[]; isPaused: boolean } = { toasts: [], isPaused: false };

    for (let i = 0; i < updateCount; i++) {
      const newToast: ToastItem = {
        id: `update-${i}`,
        variant: 'info' as const,
        size: 'medium' as const,
        priority: 'normal' as const,
        isOpen: true,
        content: `Update ${i}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPersistent: false,
        isLoading: false,
      };

      state = {
        ...state,
        toasts: [...state.toasts, newToast],
      };
    }

    const metrics = this.tracker.endTracking(operationId);
    return metrics?.stateUpdateTime || 0;
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(metrics: Record<string, PerformanceMetrics>): string[] {
    const recommendations: string[] = [];

    Object.entries(metrics).forEach(([operation, metric]) => {
      if (metric.renderTime > 16) {
        // 60fps threshold
        recommendations.push(
          `${operation}: Consider optimizing render time (${metric.renderTime.toFixed(2)}ms > 16ms)`,
        );
      }

      if (metric.rerenderCount > 5) {
        recommendations.push(
          `${operation}: High re-render count (${metric.rerenderCount}), check memoization`,
        );
      }

      if (metric.memoryUsage > 10 * 1024 * 1024) {
        // 10MB threshold
        recommendations.push(
          `${operation}: High memory usage (${(metric.memoryUsage / 1024 / 1024).toFixed(2)}MB)`,
        );
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('✅ All performance metrics are within optimal ranges');
    }

    return recommendations;
  }

  /**
   * Generate complete performance analysis
   */
  async runCompleteAnalysis(): Promise<string> {
    const testConfigs: ToastConfig[] = [
      { variant: 'info', size: 'medium', priority: 'normal' },
      { variant: 'error', size: 'large', priority: 'high' },
      { variant: 'success', size: 'small', priority: 'low' },
      { variant: 'warning', size: 'medium', priority: 'normal' },
    ];

    const creationTime = await this.benchmarkToastCreation(testConfigs, 50);
    const updateTime = await this.benchmarkStateUpdates(500);

    const allMetrics = this.tracker.getAllMetrics();
    const recommendations = this.getRecommendations(allMetrics);

    let analysis = '=== Complete Toast Performance Analysis ===\n\n';
    analysis += `Toast Creation Benchmark: ${creationTime.toFixed(2)}ms (50 iterations)\n`;
    analysis += `State Update Benchmark: ${updateTime.toFixed(2)}ms (500 updates)\n\n`;
    analysis += this.tracker.generateReport();
    analysis += '\n=== Performance Recommendations ===\n';
    recommendations.forEach((rec) => (analysis += `- ${rec}\n`));

    return analysis;
  }
}

// Export singleton instances for easy use
export const performanceTracker = new ToastPerformanceTracker();
export const toastBenchmark = new ToastBenchmark();
