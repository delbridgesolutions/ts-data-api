import { sign } from "jsonwebtoken";

import { envs } from "../src/envs";

const secret = envs.JWT_SECRET;
const payload = {};
const token = sign(payload, secret);

console.log(`\n\nGenerated JWT: ${token}`);
