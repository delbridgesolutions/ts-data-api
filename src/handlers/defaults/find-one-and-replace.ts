import * as h3 from "h3";
import { FindOneAndReplaceOptions } from "mongodb";
import { z } from "zod";

import * as M from "../../middlewares";
import { dataSources } from "../../mdb";
import { defaultSchema } from "./utils";

const schema = defaultSchema.extend({
  filter: z.record(z.unknown()),
  replacement: z.record(z.unknown()),
});

export const method = "post";
export const endPoint = "/defaults/findOneAndReplace";
export const handler = async (event: h3.H3Event) => {
  const body = await M.bodyHandler({ event, schema });

  return dataSources[body.dataSource]
    .db(body.database)
    .collection(body.collection)
    .findOneAndReplace(
      body.filter,
      body.replacement,
      body.options as FindOneAndReplaceOptions
    );
};

export default [endPoint, h3.defineEventHandler({ handler }), method] as const;
