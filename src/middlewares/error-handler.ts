import { H3Error, type H3Event, setResponseStatus } from "h3";

import { bodySerializer } from "./body-serializer";

type ErrorHandler = (error: H3Error, event: H3Event) => unknown;

export const errorHandler: ErrorHandler = async (
  { message, statusCode },
  event
) => {
  setResponseStatus(event, statusCode ?? 500);

  return bodySerializer(event, { body: { message } });
};
