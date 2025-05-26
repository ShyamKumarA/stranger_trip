// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://117f8c462993d0f4f450c0760fba676d@o4509270375727104.ingest.us.sentry.io/4509270386016256",
  integrations: [Sentry.mongoIntegration()],
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});