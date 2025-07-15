import { dataSources } from "../../src/mdb";
import { endPoint } from "../../src/handlers/defaults/insert-one";

import { requester, withDb } from "../helpers";
import { ObjectId } from "mongodb";

withDb(() => {
  const client = dataSources["local"];

  describe("Body Parser and Body Serializer", () => {
    const user = { _id: new ObjectId(), born: new Date("1990-01-01") };
    const data = {
      dataSource: "local",
      database: "test",
      collection: "users",
      document: user,
    };

    test("Should insert one document using the EJSON parser and serializer", async () => {
      const collection = client.db(data.database).collection(data.collection);

      await requester({ data, url: endPoint });

      const userFromCollection = await collection.findOne({});
      expect(userFromCollection?._id).toStrictEqual(user._id);
      expect(userFromCollection?.born).toStrictEqual(user.born);
    });

    test("Should insert one document using the JSON parser and serializer", async () => {
      const collection = client.db(data.database).collection(data.collection);

      await requester({ contentType: "application/json", data, url: endPoint });

      const userFromCollection = await collection.findOne({});
      expect(userFromCollection?._id).toStrictEqual(user._id.toString());
      expect(userFromCollection?.born).toStrictEqual(user.born.toISOString());
    });
  });

  describe("Body Handler Errors", () => {
    test("Should get an error when a body is not provided", async () => {
      const { body, status } = await requester({ url: endPoint });

      expect(status).toBe(400);
      expect(body.message).toBe("Body not provided");
    });

    test("Should get an error when a body with the wrong format is provided", async () => {
      const { body, status } = await requester({
        url: endPoint,
        data: { document: { invalidField: "invalidValue" } },
      });

      expect(status).toBe(400);
      expect(body.message).toContain("Body expected not provided");
    });
  });
});
