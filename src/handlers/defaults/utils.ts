import { z } from "zod";

import { dataSourcesNames } from "../../mdb/index";

export const DataSourcesNamesSchema = z.enum(
  dataSourcesNames as [string, ...string[]],
  {
    message: `Data Source not found. Available Data Sources: ${JSON.stringify(dataSourcesNames)}`,
  }
);

export const defaultSchema = z.object({
  dataSource: DataSourcesNamesSchema,
  database: z.string(),
  collection: z.string(),
  options: z.record(z.unknown()).optional(),
});
