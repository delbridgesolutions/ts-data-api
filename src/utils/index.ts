import { EJSON } from "bson";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const ObjectIdSchema = z
  .custom<ObjectId>((val) => ObjectId.isValid(val as string), {
    message: "Invalid ObjectId",
  })
  .transform((val) => new ObjectId(val));

export const getBodyParser = (contentType: string | undefined) => {
  if (contentType === "application/ejson") {
    return { contentType: "application/ejson", parser: EJSON.parse };
  }

  return { contentType: "application/json", parser: JSON.parse };
};

export const getBodySerializer = (contentType: string | undefined) => {
  if (contentType === "application/ejson") {
    return { contentType: "application/ejson", serializer: EJSON.stringify };
  }

  return { contentType: "application/json", serializer: JSON.stringify };
};
