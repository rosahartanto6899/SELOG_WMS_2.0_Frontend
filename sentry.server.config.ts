// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { decryptData } from "@sera-utils/encryptor";

Sentry.init({
  dsn: decryptData(process.env.GLITCHTIP_DSN),

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Disable auto session tracking while initializing the Sentry instance.
  autoSessionTracking: false,
});
