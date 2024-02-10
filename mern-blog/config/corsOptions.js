const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",") || [];
const isDev = process.env.NODE_ENV == "development";

const corsOptions = {
  origin: (origin, cb) => {
    if (allowedOrigins.indexOf(origin) !== -1 || isDev) {
      cb(null, true);
    } else {
      cb(new Error("Not Allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
