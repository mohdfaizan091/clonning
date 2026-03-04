import * as Sentry from "@sentry/node";

export const initSentry = () => {
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
    console.log("Sentry initialized");
  }
};

export { Sentry };