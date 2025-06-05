import { DataSourcesObjectSchema } from "../../src/envs";
import { DataSourcesNamesSchema } from "../../src/handlers/defaults/utils";

test("Data Sources Object Zod Parser", () => {
  const receivedResult = DataSourcesObjectSchema.parse(
    JSON.stringify({
      "in-memory": "mongodb://127.0.0.1:27018",
      "wired-tiger": "mongodb://127.0.0.1:27017",
    })
  );
  const expectedResult = {
    "in-memory": "mongodb://127.0.0.1:27018",
    "wired-tiger": "mongodb://127.0.0.1:27017",
  };

  expect(receivedResult).toStrictEqual(expectedResult);
});

test("Data Sources Names Parser", () => {
  expect.assertions(2);

  const result_fail = DataSourcesNamesSchema.safeParse("in-memory");

  if (!result_fail.success) {
    expect(result_fail.error.message).toContain("Data Source not found");
  }

  const result_success = DataSourcesNamesSchema.safeParse("local");

  if (result_success.success) {
    expect(result_success.data).toBe("local");
  }
});
