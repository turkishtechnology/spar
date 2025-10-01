import {
  sortToastQueue,
  getVisibleToasts,
  generateToastId,
  getAriaRole,
  getAriaLive,
} from '../utils';
import { PRIORITY_ORDER } from '../constants';
import type { ToastPriority } from '../Toast.types';

describe('Toast Utils', () => {
  describe('generateToastId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateToastId();
      const id2 = generateToastId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^toast-\d+-\d+$/);
      expect(id2).toMatch(/^toast-\d+-\d+$/);
    });

    it('should generate IDs with incremental counters', () => {
      const id1 = generateToastId();
      const id2 = generateToastId();

      const parts1 = id1.split('-');
      const parts2 = id2.split('-');

      const counter1 = parseInt(parts1[1] || '0');
      const counter2 = parseInt(parts2[1] || '0');

      expect(counter2).toBe(counter1 + 1);
    });
  });

  describe('sortToastQueue', () => {
    const createMockToast = (priority: ToastPriority, createdAt: number) => ({
      priority,
      createdAt,
      id: `toast-${createdAt}`,
    });

    it('should sort by priority DESC (high priority first)', () => {
      const toasts = [
        createMockToast('low', 1000),
        createMockToast('high', 2000),
        createMockToast('normal', 3000),
      ];

      const sorted = toasts.sort((a, b) => sortToastQueue(a, b, PRIORITY_ORDER));

      expect(sorted[0]!.priority).toBe('high');
      expect(sorted[1]!.priority).toBe('normal');
      expect(sorted[2]!.priority).toBe('low');
    });

    it('should sort by createdAt ASC for same priority (older first)', () => {
      const toasts = [
        createMockToast('normal', 3000),
        createMockToast('normal', 1000),
        createMockToast('normal', 2000),
      ];

      const sorted = toasts.sort((a, b) => sortToastQueue(a, b, PRIORITY_ORDER));

      expect(sorted[0]!.createdAt).toBe(1000);
      expect(sorted[1]!.createdAt).toBe(2000);
      expect(sorted[2]!.createdAt).toBe(3000);
    });

    it('should prioritize high priority even if created later', () => {
      const toasts = [
        createMockToast('low', 1000),
        createMockToast('normal', 2000),
        createMockToast('high', 3000),
      ];

      const sorted = toasts.sort((a, b) => sortToastQueue(a, b, PRIORITY_ORDER));

      expect(sorted[0]).toEqual(
        expect.objectContaining({
          priority: 'high',
          createdAt: 3000,
        }),
      );
    });

    it('should handle complex mixed priority and time scenarios', () => {
      const toasts = [
        createMockToast('normal', 3000),
        createMockToast('high', 1000),
        createMockToast('low', 2000),
        createMockToast('high', 4000),
        createMockToast('normal', 1500),
      ];

      const sorted = toasts.sort((a, b) => sortToastQueue(a, b, PRIORITY_ORDER));

      // Should be: high(1000), high(4000), normal(1500), normal(3000), low(2000)
      expect(sorted.map((t) => `${t.priority}-${t.createdAt}`)).toEqual([
        'high-1000',
        'high-4000',
        'normal-1500',
        'normal-3000',
        'low-2000',
      ]);
    });
  });

  describe('getVisibleToasts', () => {
    const createMockToast = (priority: ToastPriority, createdAt: number) => ({
      priority,
      createdAt,
      id: `toast-${createdAt}`,
    });

    it('should return all toasts when under visible limit', () => {
      const toasts = [createMockToast('high', 1000), createMockToast('normal', 2000)];

      const result = getVisibleToasts(toasts, 5, PRIORITY_ORDER);

      expect(result.visible).toHaveLength(2);
      expect(result.queued).toHaveLength(0);
      expect(result.visible).toEqual(toasts);
    });

    it('should split toasts into visible and queued when over limit', () => {
      const toasts = [
        createMockToast('low', 1000),
        createMockToast('high', 2000),
        createMockToast('normal', 3000),
        createMockToast('high', 4000),
      ];

      const result = getVisibleToasts(toasts, 2, PRIORITY_ORDER);

      expect(result.visible).toHaveLength(2);
      expect(result.queued).toHaveLength(2);

      // Visible should be high priority toasts
      expect(result.visible[0]!.priority).toBe('high');
      expect(result.visible[1]!.priority).toBe('high');

      // Queued should be lower priority
      expect(result.queued[0]!.priority).toBe('normal');
      expect(result.queued[1]!.priority).toBe('low');
    });

    it('should maintain proper sort order in both visible and queued', () => {
      const toasts = [
        createMockToast('normal', 3000),
        createMockToast('high', 1000),
        createMockToast('low', 2000),
        createMockToast('normal', 1500),
      ];

      const result = getVisibleToasts(toasts, 2, PRIORITY_ORDER);

      expect(result.visible.map((t) => `${t.priority}-${t.createdAt}`)).toEqual([
        'high-1000',
        'normal-1500',
      ]);

      expect(result.queued.map((t) => `${t.priority}-${t.createdAt}`)).toEqual([
        'normal-3000',
        'low-2000',
      ]);
    });

    it('should handle empty array', () => {
      const result = getVisibleToasts([], 3, PRIORITY_ORDER);

      expect(result.visible).toEqual([]);
      expect(result.queued).toEqual([]);
    });

    it('should handle zero visible limit', () => {
      const toasts = [createMockToast('high', 1000)];
      const result = getVisibleToasts(toasts, 0, PRIORITY_ORDER);

      expect(result.visible).toEqual([]);
      expect(result.queued).toEqual(toasts);
    });
  });

  describe('getAriaRole', () => {
    it('should return "alert" for error variant', () => {
      expect(getAriaRole('error')).toBe('alert');
    });

    it('should return "log" for loading variant', () => {
      expect(getAriaRole('loading')).toBe('log');
    });

    it('should return "status" for other variants', () => {
      expect(getAriaRole('success')).toBe('status');
      expect(getAriaRole('warning')).toBe('status');
      expect(getAriaRole('info')).toBe('status');
    });
  });

  describe('getAriaLive', () => {
    it('should return "assertive" for error and warning', () => {
      expect(getAriaLive('error')).toBe('assertive');
      expect(getAriaLive('warning')).toBe('assertive');
    });

    it('should return "polite" for other variants', () => {
      expect(getAriaLive('success')).toBe('polite');
      expect(getAriaLive('info')).toBe('polite');
      expect(getAriaLive('loading')).toBe('polite');
    });
  });
});
