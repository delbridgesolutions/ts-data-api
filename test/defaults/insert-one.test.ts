import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/insert-one";

import { requester, withDb } from "../helpers";
import { ObjectId } from "mongodb";

withDb(() => {
  describe("Insert One", () => {
    const client = dataSources["local"];
    const user = { _id: new ObjectId(), points: 10 };

    test("Should insert one document", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        document: user,
      };
      const collection = client.db(data.database).collection(data.collection);

      const countBefore = await collection.countDocuments({});
      expect(countBefore).toBe(0);

      const { body } = await requester({ data, url: endPoint });

      expect(body.acknowledged).toBe(true);
      expect(body.insertedId).toBeInstanceOf(ObjectId);

      const countAfter = await collection.countDocuments({});
      expect(countAfter).toBe(1);
    });

    test("Should insert one document with some insert one options", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        document: user,
        options: {
          comment: "Insert One comment",
        },
      };
      const collection = client.db(data.database).collection(data.collection);

      const countBefore = await collection.countDocuments({});
      expect(countBefore).toBe(0);

      const { body } = await requester({ data, url: endPoint });

      expect(body.acknowledged).toBe(true);
      expect(body.insertedId).toBeInstanceOf(ObjectId);

      const countAfter = await collection.countDocuments({});
      expect(countAfter).toBe(1);
    });

    test("Should return an error when inserting one document with an existing _id", async () => {
      const data = {
        dataSource: "local",
        database: "test",
        collection: "users",
        document: user,
      };
      const collection = client.db(data.database).collection(data.collection);

      await collection.insertOne(user);

      const { body } = await requester({ data, url: endPoint });

      expect(body.message).toContain("E11000 duplicate key error collection");
    });
  });
});
