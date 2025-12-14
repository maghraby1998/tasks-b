// src/bugsnag.config.ts
import Bugsnag from '@bugsnag/js';
import BugsnagPluginExpress from '@bugsnag/plugin-express';

if (process.env.BUGSNAG_API_KEY) {
  Bugsnag.start({
    apiKey: process.env.BUGSNAG_API_KEY!,
    plugins: [BugsnagPluginExpress],
    appVersion: '1.0.0',
    releaseStage: process.env.NODE_ENV || 'development',
  });
}

export const bugsnag: any = process.env.BUGSNAG_API_KEY ? Bugsnag : null;
