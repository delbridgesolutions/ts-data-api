import * as h3 from "h3";
import { createServer } from "node:http";

import * as M from "./middlewares";
import { routerCustom, routerDefaults } from "./routes";

export const app = h3.createApp({
  onBeforeResponse: M.bodySerializer,
  onError: M.errorHandler,
  onRequest: M.isAuthenticated,
});

app.use(routerCustom);
app.use(routerDefaults);
app.use(
  "/",
  h3.defineEventHandler({
    handler: async () => ({
      message: "Delbridge TypeScript Data API",
      now: new Date().toISOString(),
    }),
  })
);

export default createServer(h3.toNodeListener(app));
