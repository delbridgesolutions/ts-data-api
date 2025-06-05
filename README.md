# Delbridge TypeScript Data API for MongoDB

This project provides a TypeScript implementation inspired by the deprecated [Atlas Data API](https://www.mongodb.com/docs/atlas/app-services/data-api/), utilizing [H3](https://www.npmjs.com/package/h3) for the HTTP server, [Zod](https://www.npmjs.com/package/zod) for schema validation, and the official [MongoDB Node.js Driver](https://www.npmjs.com/package/mongodb).

- The HTTP server supports both [JSON](https://en.wikipedia.org/wiki/JSON) and [EJSON](https://www.mongodb.com/docs/mongodb-shell/reference/ejson/) content types.
- Endpoint request bodies mirror the structure of the [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/) methods, with the addition of `dataSource`, `database`, and `collection` fields to specify the target, similar to the Atlas Data API.
- For detailed usage examples and endpoints, refer to the: `test/client.ts`, `test/custom/*`, `test/default/*` or the [Endpoints documentation](./ENDPOINTS.md).

## Executing

To run this application, ensure you have [Node.js](https://nodejs.org/en/download) installed. Then, execute the following commands in the project's root directory:

1.  `npm install`: Installs all necessary dependencies.
2.  `npm start`: Starts the application server.

The application starts with the following default environment variable settings:

- `APP_NAME=delbridge-typescript-data-api`
- `DATA_SOURCES='{"local": "mongodb://127.0.0.1:27017"}'`
- `JWT_SECRET=something-secure`
- `SERVER_ADDRESS=127.0.0.1`
- `SERVER_PORT=8080`

These default values are defined in [`./src/envs.ts`](./src/envs.ts). You can override them by setting environment variables. For more information, see the [Environment Variables](#environment-variables) section.

### Testing

Here are example `curl` commands to test `insertOne` and `findOne` operations against a running TypeScript Data API instance.

```bash
# Insert One Document
curl -s "http://127.0.0.1:8080/defaults/insertOne" \
  -X POST \
  -H "Content-Type: application/ejson" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDkwNjk3MDF9.aLgkBEzvsyDCRtpfAmIYxCxMI1ck9A4EFu6BipwARbM" \
  -d '{
    "dataSource": "local",
    "database": "test",
    "collection": "users",
    "document": {
      "name": "john"
    }
  }'

# Find One Document
curl -s "http://127.0.0.1:8080/defaults/findOne" \
  -X POST \
  -H "Content-Type: application/ejson" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDkwNjk3MDF9.aLgkBEzvsyDCRtpfAmIYxCxMI1ck9A4EFu6BipwARbM" \
  -d '{
    "dataSource": "local",
    "database": "test",
    "collection": "users",
    "filter": {
      "name": "john"
    },
    "options": {
      "projection": {"_id": 0, "name": 1}
    }
  }'
```

## Migrating from Atlas Data API

While this application isn't a drop-in replacement for the Atlas Data API, migrating is straightforward. The differences aim to align closely with the MongoDB Node.js Driver's parameter structure, offer greater customization and newer functions.

### Authentication

- **Atlas Data API:** Used an `apiKey` header for authentication.
- **Delbridge TypeScript Data API:** Uses JWT (JSON Web Token) authentication. Requests must include an `Authorization` header with a `Bearer` token.

The authentication functionality is implemented in the [is-authenticated](./src/middlewares/is-authenticated.ts) middleware, which you can customize.

### Authorization

- **Atlas Data API:** Linked authorization rules (e.g., `No Access`, `Read Only`, `Read and Write`, `Custom Access`) to the `apiKey`.
- **Delbridge TypeScript Data API:** Currently, this application does not implement granular authorization beyond authentication. All authenticated users have full access.

### Endpoints

- **Atlas Data API:** `https://<atlas-data-api-base-url>/action/<function-name>`
- **Delbridge TypeScript Data API:**
  - Standard MongoDB operations: `http://<your-host>:<your-port>/defaults/<function-name>`
  - Custom functions: `http://<your-host>:<your-port>/custom/<function-name>`

Obs: The base URL depends on your deployment and the `SERVER_ADDRESS` and `SERVER_PORT` environment variables.

### Request Body

Request bodies for the Atlas Data API are detailed in its [OpenAPI documentation](https://www.mongodb.com/docs/atlas/app-services/data-api/openapi/). Generally, Atlas Data API used a flat structure for MongoDB function parameters.

This application, however, mirrors the [MongoDB Node.js Driver's](https://mongodb.github.io/node-mongodb-native/) structure, often nesting options within an `options` object. Here's a comparison for a `find` operation:

```javascript
// Atlas Data API Body Structure
const AtlasDataAPIBody = {
  dataSource: "local",
  database: "todo",
  collection: "tasks",
  filter: {
    status: "complete",
  },
  projection: {
    // Flat options
    text: 1,
    completedAt: 1,
  },
  sort: {
    // Flat options
    completedAt: 1,
  },
  limit: 10, // Flat options
};

// TS Data API Body Structure
const TSDataAPIBody = {
  dataSource: "local",
  database: "todo",
  collection: "tasks",
  filter: {
    status: "complete",
  },
  options: {
    // Options nested under an 'options' key
    projection: {
      text: 1,
      completedAt: 1,
    },
    sort: {
      completedAt: 1,
    },
    limit: 10,
  },
};
```

### Comparison

The following `curl` commands are a comparison between a `find` operation in Atlas Data API and Delbridge TypeScript Data API.

```bash
# Atlas Data API
curl -s "https://<atlas-data-api-base-url>/action/find" \
  -X POST \
  -H "Content-Type: application/ejson" \
  -H "Accept: application/json" \
  -H "apiKey: $API_KEY" \
  -d '{
        "dataSource": "local",
        "database": "todo",
        "collection": "tasks",
        "filter": {
          "status": "complete"
        },
        "projection": {
          "text": 1,
          "completedAt": 1
        },
        "sort": {
          "completedAt": 1
        },
        "limit": 10
      }'

# Delbridge TypeScript Data API
curl -s "http://<delbridge-typescript-data-api-base-url>/defaults/find" \
  -X POST \
  -H "Content-Type: application/ejson" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
        "dataSource": "local",
        "database": "todo",
        "collection": "tasks",
        "filter": {
          "status": "complete"
        },
        "options": {
          "projection": {
            "text": 1,
            "completedAt": 1
          },
          "sort": {
            "completedAt": 1
          },
          "limit": 10
        }
      }'
```

## Environment Variables

The configuration for environment variables, including their management, parsing, and default values, is located in [envs.ts](./src/envs.ts).

- **`APP_NAME`**

  - Specifies the application name used in the [MongoDB Client](https://mongodb.github.io/node-mongodb-native/6.16/interfaces/MongoClientOptions.html#appName) connection.
  - This helps identify the source of operations when analyzing MongoDB queries, logs, and performance.
  - _Default_: `delbridge-typescript-data-api`

- **`DATA_SOURCES`**

  - Defines the data sources available to the Data API.
  - This must be a **stringified JSON object** where each key is a data source name and its corresponding value is the MongoDB connection URI.
  - **Example**:
    To configure two data sources, `local` and `atlas`, you would set the environment variable as follows:
    ```
    DATA_SOURCES='{"local": "mongodb://127.0.0.1:27017/mydb", "atlas": "mongodb+srv://user:pwd@cluster-name.123abc.net/anotherdb"}'
    ```
    This configuration connects:
    - `local` to `mongodb://127.0.0.1:27017/mydb`
    - `atlas` to `mongodb+srv://user:pwd@cluster-name.123abc.net/anotherdb`
  - _Default_: `'{"local": "mongodb://127.0.0.1:27017"}'`

- **`JWT_SECRET`**

  - The secret key used to sign and verify JSON Web Tokens (JWTs) for authentication.
  - **Important**: This should be a strong, unique, and private string.
  - _Default_: `something-secure`

- **`SERVER_ADDRESS`**

  - The IP address to which the server will bind.
  - _Default_: `127.0.0.1` (listens to localhost)

- **`SERVER_PORT`**
  - The port number to which the server will bind.
  - _Default_: `8080`

## Content Type: JSON vs EJSON

When exchanging data with the API, understanding the difference between `JSON` and `EJSON` is crucial for data integrity, especially when working with MongoDB's rich BSON types.

- **Standard `JSON`**:
  If you use the standard `JSON` format, the data types available to your application are limited to:

  - `null`
  - `boolean`
  - `number`
  - `string`
  - `object`
  - `array`

- **[`EJSON`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/) (Extended JSON)**:
  EJSON allows your application to utilize all data types from the [`BSON`](https://www.mongodb.com/docs/manual/reference/bson-types/) specification. This includes, but is not limited to, types like:
  - `Double`
  - `ObjectId`
  - `Date` (represented as `{$date: "YYYY-MM-DDTHH:mm:ss.SSSZ"}`)
  - `UUID` (represented as `{$uuid: "..."}`)
  - And many others.

**Recommendation:**
For users of this application, it is **highly recommended to use the `EJSON` content type format.** This ensures that field values retain their original BSON data types, preventing data loss or unintended type coercion when interacting with MongoDB. The following code demonstrates that when you stringify and parse a document containing `ObjectId` and `Date` fields using standard `JSON`, these fields are converted to `string`. In contrast, using `EJSON` preserves their original data types.

```mjs
import { EJSON, ObjectId } from "bson";

const document = {
  _id: new ObjectId(),
  now: new Date(),
};

const documentEJSON = EJSON.parse(EJSON.stringify(document));
const documentJSON = JSON.parse(JSON.stringify(document));

console.log("EJSON:", documentEJSON);
/*
EJSON: {
  _id: new ObjectId('68373f58236c235ceae63814'),
  now: new Date(2025-05-28T16:52:40.408Z)
}
*/
console.log("JSON:", documentJSON);
/*
JSON: {
  _id: '68373f58236c235ceae63814',
  now: '2025-05-28T16:52:40.408Z'
}
*/
```

## Creating Your Own JWT

To create your own JSON Web Token (JWT), you can use the script provided in the file [./test/jwt.ts](./test/jwt.ts). Follow these steps to generate a JWT:

1. Ensure you have the required dependencies installed in your project by running:

   ```bash
   npm install
   ```

2. Execute the following command in your terminal to run the script:

   ```bash
   npx ts-node ./test/jwt.ts
   ```

### Default Behavior

By default, this script generates a JWT using the secret key specified in the `JWT_SECRET` environment variable. The payload of the token will be empty unless you modify the script to include additional data.

### Customizing the JWT

If you want to customize the payload or use a different secret, you can edit the script located at `./test/jwt.ts`. For example, you can add fields to the payload or change the signing algorithm as needed.
