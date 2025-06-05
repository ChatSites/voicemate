
// Build information utilities
import { env } from '@/config/environment';

export interface BuildInfo {
  version: string;
  timestamp: string;
  environment: string;
  gitCommit?: string;
  buildNumber?: string;
}

export const getBuildInfo = (): BuildInfo => {
  return {
    version: env.BUILD_VERSION,
    timestamp: env.BUILD_TIMESTAMP,
    environment: env.NODE_ENV,
    gitCommit: import.meta.env.VITE_GIT_COMMIT,
    buildNumber: import.meta.env.VITE_BUILD_NUMBER,
  };
};

export const logBuildInfo = (): void => {
  const buildInfo = getBuildInfo();
  
  if (env.IS_DEVELOPMENT) {
    console.log('🏗️ Build Info:', buildInfo);
  }
  
  // Add build info to window for debugging
  if (typeof window !== 'undefined') {
    (window as any).__BUILD_INFO__ = buildInfo;
  }
};

export const isBuildStale = (maxAgeHours: number = 24): boolean => {
  const buildTime = new Date(env.BUILD_TIMESTAMP);
  const now = new Date();
  const ageInHours = (now.getTime() - buildTime.getTime()) / (1000 * 60 * 60);
  
  return ageInHours > maxAgeHours;
};
