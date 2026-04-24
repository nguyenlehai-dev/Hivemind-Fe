/**
 * Centralized query key factory. Use these instead of inline arrays so
 * invalidations stay typo-proof across the codebase.
 *
 * Convention: `queryKeys.<resource>.<operation>(...args)`.
 */
export const queryKeys = {
  auth: {
    status: () => ["runway", "auth", "status"],
  },
  capabilities: {
    all: () => ["runway", "capabilities"],
  },
  models: {
    byMode: (mode) => ["runway", "models", mode],
  },
  generations: {
    all: () => ["runway", "generations"],
    detail: (jobId) => ["runway", "generation", jobId],
  },
  apps: {
    all: () => ["runway", "apps"],
    detail: (appId) => ["runway", "app", appId],
  },
  assets: {
    all: () => ["runway", "assets"],
  },
};
