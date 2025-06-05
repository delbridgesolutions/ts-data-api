import { envs } from "./envs";
import { dataSourcesNames } from "./mdb";

import app from "./app";

app.listen(envs.SERVER_PORT, envs.SERVER_ADDRESS, () => {
  const message =
    `Delbridge TypeScript Data API running on ${envs.SERVER_ADDRESS}:${envs.SERVER_PORT}` +
    `\nAvailable Data Sources: ${JSON.stringify(dataSourcesNames)}`;

  console.log(message);
});
