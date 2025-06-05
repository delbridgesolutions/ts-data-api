import { ObjectId } from "mongodb";

import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/bulk-write";

import { requester, withDb } from "../helpers";

withDb(() => {
  describe("Bulk Write", () => {
    const client = dataSources["local"];
    const user = { _id: new ObjectId(), points: 10 };

    test("Should bulk write operations", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        operations: [
          {
            insertOne: { document: user },
          },
          {
            updateOne: {
              filter: { _id: user._id },
              update: { $inc: { points: 10 } },
            },
          },
        ],
      };

      const collection = client.db(data.database).collection(data.collection);

      const { body } = await requester({ data, url: endPoint });

      expect(body.insertedCount).toBe(1);
      expect(body.matchedCount).toBe(1);
      expect(body.modifiedCount).toBe(1);

      const userAfter = await collection.findOne({ _id: user._id });

      expect(userAfter!.points).toBe(20);
    });

    test("Should execute the same query as before with some bulk write options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        operations: [
          {
            insertOne: { document: user },
          },
          {
            updateOne: {
              filter: { _id: user._id },
              update: { $inc: { points: 10 } },
            },
          },
        ],
        options: {
          comment: "Bulk Write test operation",
          forceServerObjectId: true,
          ordered: true,
        },
      };

      const collection = client.db(data.database).collection(data.collection);

      const { body } = await requester({ data, url: endPoint });

      expect(body.insertedCount).toBe(1);
      expect(body.matchedCount).toBe(1);
      expect(body.modifiedCount).toBe(1);

      const userAfter = await collection.findOne({ _id: user._id });

      expect(userAfter!.points).toBe(20);
    });

    test("Should return an error when a invalid bulk write operations is provided", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        operations: [
          {
            insertSomething: { document: user },
          },
        ],
      };

      const { body } = await requester({ data, url: endPoint });

      expect(body.message).toContain("bulkWrite only supports");
    });
  });
});
