require('dotenv').config({ path: '../config/.env' });

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  netlify: {
    siteId: process.env.NETLIFY_SITE_ID,
    authToken: process.env.NETLIFY_AUTH_TOKEN,
  },
  nhost: require('../config/nhost.config'),
  supabase: require('../config/supabase.config'),
};
