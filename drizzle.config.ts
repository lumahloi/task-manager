// import type { Config } from "drizzle-kit";

// export default {
//   schema: "./src/server/db/schema.ts",
//   out: "./drizzle",
//   driver: "better-sqlite",
//   dbCredentials: {
//     url: "sqlite.db",
//   },
// } satisfies Config;

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: ".drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./sqlite.db",
  },
});