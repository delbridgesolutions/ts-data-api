# API Endpoints Documentation

This document provides comprehensive documentation for all available endpoints in the Delbridge TypeScript Data API for MongoDB.

## Overview

The API provides two main categories of endpoints:

- **Default MongoDB Operations**: Standard MongoDB operations at `/defaults/*`
- **Custom Functions**: User-defined functions at `/custom/*` (implementation varies)

All endpoints use **POST** method and require JWT authentication via the `Authorization: Bearer <token>` header.

**Important**: The parameter structure for all default MongoDB operations mirrors the native [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/) function signatures. This ensures consistency and familiarity for developers.

## Authentication

All requests must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Content Types

The API supports both JSON and EJSON content types:

- `Content-Type: application/json` - Standard JSON format
- `Content-Type: application/ejson` - Extended JSON format (recommended for MongoDB data types)

## Common Request Structure

All default endpoints share a common base structure:

```json
{
  "dataSource": "string", // Required: Data source name
  "database": "string", // Required: Database name
  "collection": "string", // Required: Collection name
  "options": {} // Optional: MongoDB operation options
}
```

The request body structure closely follows the [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/) method signatures, with the addition of `dataSource`, `database`, and `collection` fields to specify the target connection and location. The `options` parameter accepts the same options as the corresponding MongoDB driver methods.

## Default MongoDB Operations

### 1. Aggregate

Performs an aggregation pipeline operation.

**Endpoint:** `POST /defaults/aggregate`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "pipeline": [
    { "$match": { "status": "active" } },
    { "$group": { "_id": "$department", "count": { "$sum": 1 } } }
  ],
  "options": {
    "allowDiskUse": true
  }
}
```

### 2. Bulk Write

Performs multiple write operations in a single request.

**Endpoint:** `POST /defaults/bulkWrite`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "operations": [
    {
      "insertOne": {
        "document": { "name": "John", "email": "john@example.com" }
      }
    },
    {
      "updateOne": {
        "filter": { "name": "Jane" },
        "update": { "$set": { "status": "active" } }
      }
    }
  ],
  "options": {
    "ordered": true
  }
}
```

### 3. Count Documents

Counts documents matching a filter.

**Endpoint:** `POST /defaults/countDocuments`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "status": "active"
  },
  "options": {
    "timeoutMS": 1000
  }
}
```

### 4. Delete Many

Deletes multiple documents matching a filter.

**Endpoint:** `POST /defaults/deleteMany`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "status": "inactive"
  },
  "options": {}
}
```

### 5. Delete One

Deletes a single document matching a filter.

**Endpoint:** `POST /defaults/deleteOne`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "_id": { "$oid": "507f1f77bcf86cd799439011" }
  }
}
```

### 6. Distinct

Returns distinct values for a specified field.

**Endpoint:** `POST /defaults/distinct`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "key": "department",
  "filter": {
    "status": "active"
  },
  "options": {}
}
```

### 7. Find One and Delete

Finds a single document and deletes it.

**Endpoint:** `POST /defaults/findOneAndDelete`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "status": "inactive"
  },
  "options": {
    "sort": { "lastLogin": 1 }
  }
}
```

### 8. Find One and Replace

Finds a single document and replaces it.

**Endpoint:** `POST /defaults/findOneAndReplace`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "_id": { "$oid": "507f1f77bcf86cd799439011" }
  },
  "replacement": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "active"
  },
  "options": {
    "returnDocument": "after"
  }
}
```

### 9. Find One and Update

Finds a single document and updates it.

**Endpoint:** `POST /defaults/findOneAndUpdate`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "email": "john@example.com"
  },
  "update": {
    "$set": { "lastLogin": { "$date": "2024-01-15T10:30:00Z" } }
  },
  "options": {
    "returnDocument": "after",
    "upsert": false
  }
}
```

### 10. Find One

Finds a single document matching a filter.

**Endpoint:** `POST /defaults/findOne`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "email": "john@example.com"
  },
  "options": {
    "projection": { "_id": 0, "name": 1, "email": 1 }
  }
}
```

### 11. Find

Finds multiple documents matching a filter.

**Endpoint:** `POST /defaults/find`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "status": "active"
  },
  "options": {
    "projection": { "name": 1, "email": 1 },
    "sort": { "name": 1 },
    "limit": 10,
    "skip": 0
  }
}
```

### 12. Insert Many

Inserts multiple documents into a collection.

**Endpoint:** `POST /defaults/insertMany`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "documents": [
    {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "status": "active"
    },
    {
      "name": "Bob Smith",
      "email": "bob@example.com",
      "status": "active"
    }
  ],
  "options": {
    "ordered": true
  }
}
```

### 13. Insert One

Inserts a single document into a collection.

**Endpoint:** `POST /defaults/insertOne`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "document": {
    "name": "John Doe",
    "email": "john@example.com",
    "status": "active",
    "createdAt": { "$date": "2024-01-15T10:30:00Z" }
  },
  "options": {}
}
```

### 14. Replace One

Replaces a single document matching a filter.

**Endpoint:** `POST /defaults/replaceOne`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "_id": { "$oid": "507f1f77bcf86cd799439011" }
  },
  "replacement": {
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "status": "active",
    "updatedAt": { "$date": "2024-01-15T10:30:00Z" }
  },
  "options": {
    "upsert": false
  }
}
```

### 15. Update Many

Updates multiple documents matching a filter.

**Endpoint:** `POST /defaults/updateMany`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "department": "engineering"
  },
  "update": {
    "$set": {
      "status": "active",
      "updatedAt": { "$date": "2024-01-15T10:30:00Z" }
    }
  },
  "options": {
    "upsert": false
  }
}
```

### 16. Update One

Updates a single document matching a filter.

**Endpoint:** `POST /defaults/updateOne`

**Request Body Example:**

```json
{
  "dataSource": "local",
  "database": "mydb",
  "collection": "users",
  "filter": {
    "email": "john@example.com"
  },
  "update": {
    "$set": {
      "lastLogin": { "$date": "2024-01-15T10:30:00Z" },
      "loginCount": { "$inc": 1 }
    }
  },
  "options": {
    "upsert": false
  }
}
```

## Data Source Configuration

Available data sources are configured via the `DATA_SOURCES` environment variable. The default configuration includes:

```json
{
  "local": "mongodb://127.0.0.1:27017"
}
```

Ensure your `dataSource` field matches one of the configured data source names.

## Best Practices

1. **Use EJSON**: Prefer `application/ejson` content type to preserve MongoDB data types
2. **Specify Projections**: Use projection options to limit returned fields and improve performance
3. **Index Your Queries**: Ensure proper indexing for filter and sort operations
4. **Limit Results**: Use `limit` and `skip` options for pagination
5. **Handle Errors**: Implement proper error handling for all API calls
6. **Secure Tokens**: Keep JWT tokens secure and implement proper token refresh mechanisms
