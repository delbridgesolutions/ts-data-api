import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/aggregate";

import { requester, withDb } from "../helpers";

withDb(() => {
  const client = dataSources["local"];

  describe("Aggregate", () => {
    const users = [{ points: 10 }, { points: 20 }, { points: 30 }];

    test("Should return the total points in a collection using aggregation pipeline", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        pipeline: [
          {
            $group: {
              _id: null,
              total: { $sum: "$points" },
            },
          },
        ],
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });
      const bodyExpected = [
        { _id: null, total: users.reduce((acc, cur) => acc + cur.points, 0) },
      ];

      expect(body).toStrictEqual(bodyExpected);
    });

    test("Should execute the same query as before with some aggregation options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        pipeline: [
          {
            $group: {
              _id: null,
              total: { $sum: "$points" },
            },
          },
        ],
        options: {
          allowDiskUse: true,
          batchSize: 5,
          maxTimeMS: 10_000,
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });
      const bodyExpected = [
        { _id: null, total: users.reduce((acc, cur) => acc + cur.points, 0) },
      ];

      expect(body).toStrictEqual(bodyExpected);
    });

    test("Should return and error when the pipeline is bad formatted", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        pipeline: [
          {
            $nonExistingStage: {},
          },
        ],
      };

      const collection = client.db(data.database).collection(data.collection);

      await collection.insertMany(users);

      const { body } = await requester({ data, url: endPoint });

      expect(body.message).toContain("Unrecognized pipeline stage name");
    });
  });
});
