import { endPoint } from "../../src/handlers/defaults/insert-one";

import { requester, withDb } from "../helpers";

withDb(() => {
  describe("Authentication Middleware Errors", () => {
    test("Should get an error when the token is malformed", async () => {
      const res = await requester({ token: "invalid", url: endPoint });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid Token: jwt malformed");
    });

    test("Should get an error when the token is expired", async () => {
      const res = await requester({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTI1MTMzNjAsImlhdCI6MTc1MjU0MzM2MH0.pNyeVrLBNh0d6LAeIDUv9N9mYf8vi2-E3gbF4CQWiM8",
        url: endPoint,
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid Token: jwt expired");
    });
  });
});
