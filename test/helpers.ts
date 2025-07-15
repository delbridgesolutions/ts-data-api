import { app } from "../src/app";
import { dataSources } from "../src/mdb";
import { getBodyParser, getBodySerializer } from "../src/utils";
import { toPlainHandler } from "h3";

export async function cleanAllCollections() {
  await Promise.all(
    Object.values(dataSources).map(async (client) => {
      const collections = await client.db("test").collections();

      return Promise.all(
        collections.map((c) => c.deleteMany({}).catch((e) => e))
      );
    })
  );
}

export function withDb(test: () => void): void {
  beforeAll(async () => {
    await Promise.all(
      Object.values(dataSources).map(async (client) => {
        await client.connect();
      })
    );
  });

  beforeEach(async () => {
    await cleanAllCollections();
  });

  afterAll(async () => {
    await Promise.all(
      Object.values(dataSources).map(async (client) => {
        await client.close();
      })
    );
  });

  test();
}

export const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDkwNjk3MDF9.aLgkBEzvsyDCRtpfAmIYxCxMI1ck9A4EFu6BipwARbM";

type Requester = (args: {
  contentType?: "application/json" | "application/ejson";
  data?: object;
  url: string;
  token?: string;
}) => Promise<{
  body: any;
  status: number;
}>;

const handler = toPlainHandler(app);

export const requester: Requester = async (args) => {
  const contentType = args.contentType ?? "application/ejson";
  const { parser } = getBodyParser(contentType);
  const { serializer } = getBodySerializer(contentType);

  return handler({
    method: "POST",
    path: args.url,
    headers: {
      Authorization: `Bearer ${args.token ?? token}`,
      "content-type": contentType,
    },
    body: serializer(args.data),
  }).then(({ body, status }) => ({
    body: parser(body as unknown as string),
    status,
  }));
};
