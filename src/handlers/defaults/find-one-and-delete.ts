import * as h3 from "h3";
import { FindOneAndDeleteOptions } from "mongodb";
import { z } from "zod";

import * as M from "../../middlewares";
import { dataSources } from "../../mdb";
import { defaultSchema } from "./utils";

const schema = defaultSchema.extend({
  filter: z.record(z.unknown()),
});

export const method = "post";
export const endPoint = "/defaults/findOneAndDelete";
export const handler = async (event: h3.H3Event) => {
  const body = await M.bodyHandler({ event, schema });

  return dataSources[body.dataSource]
    .db(body.database)
    .collection(body.collection)
    .findOneAndDelete(body.filter, body.options as FindOneAndDeleteOptions);
};

export default [endPoint, h3.defineEventHandler({ handler }), method] as const;
