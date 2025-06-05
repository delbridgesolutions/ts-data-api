import { MongoClient } from "mongodb";

import { envs } from "../envs";

export const dataSourcesNames = Object.keys(envs.DATA_SOURCES);

export const dataSources = Object.entries(envs.DATA_SOURCES).reduce<{
  [key: string]: MongoClient;
}>((clients, [key, value]) => {
  clients[key] = new MongoClient(value, {
    appName: envs.APP_NAME,
    ignoreUndefined: true,
    readPreference: "primaryPreferred",
    writeConcern: { journal: true, w: "majority" },
  });

  return clients;
}, {});
