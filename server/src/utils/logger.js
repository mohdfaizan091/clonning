import winston from "winston";

const { combine, timestamp, colorize, printf, json } = winston.format;

// Development ke liye readable format
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : "";
  return `${timestamp} [${level}]: ${message} ${metaStr}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [
    // Console — hamesha
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "HH:mm:ss" }),
        devFormat
      ),
    }),

    // File — sirf production mein
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: combine(timestamp(), json()),
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
            format: combine(timestamp(), json()),
          }),
        ]
      : []),
  ],
});

export default logger;