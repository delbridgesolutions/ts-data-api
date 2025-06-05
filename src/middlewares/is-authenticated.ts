import * as h3 from "h3";
import { verify } from "jsonwebtoken";

import { envs } from "../envs";

export const Errors = {
  noHeader: () => {
    return h3.createError({
      message: "Authorization header not provided",
      status: 401,
    });
  },
  invalidToken: () => {
    return h3.createError({
      message: "Invalid Token",
      status: 401,
    });
  },
};

type IsAuthenticated = (event: h3.H3Event) => void | never;

export const isAuthenticated: IsAuthenticated = (event) => {
  const authorization = h3.getHeader(event, "Authorization");

  if (authorization == null) throw Errors.noHeader();

  const token = authorization.replace("Bearer ", "");

  verify(token, envs.JWT_SECRET, (err) => {
    if (err != null) throw Errors.invalidToken();
  });
};
