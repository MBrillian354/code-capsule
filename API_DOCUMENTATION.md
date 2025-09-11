# Code Capsule API Documentation

## Overview

The Code Capsule API provides endpoints for managing learning capsules, user progress, bookmarks, and content creation. Built with Next.js and uses RESTful conventions.

Base URL: `https://your-domain.com/api`

## Authentication

Most endpoints require user authentication. Authentication is handled via session cookies. Unauthenticated requests to protected endpoints will return a 401 Unauthorized response.

## Endpoints

### Health Check

#### GET /api/health

Check the health status of the API.

**Response:**

```json
{
    "ok": true,
    "status": "ok"
}
```

### Root

#### GET /api

A simple hello world endpoint for testing API connectivity.

**Response:**

```json
{
    "message": "Hello world!"
}
```

### Capsules

#### GET /api/capsules

Retrieve a list of public capsules with optional user progress information.

**Query Parameters:**

-   `limit` (optional): Number of capsules to return (1-50, default: 20)
-   `offset` (optional): Number of capsules to skip (0-10000, default: 0)

**Authentication:** Optional (includes user progress if authenticated)

**Response:**

```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "total_pages": number,
      "content": {
        "meta": {
          "description": "string",
          "source_url": "string"
        },
        "pages": [
          {
            "page_title": "string",
            "body": "string"
          }
        ]
      },
      "created_by": "string",
      "created_at": "ISO timestamp",
      "last_page_read": number | null,
      "overall_progress": number | null,
      "bookmarked_date": "ISO timestamp" | null,
      "last_accessed": "ISO timestamp" | null
    }
  ],
  "pagination": {
    "limit": number,
    "offset": number,
    "count": number
  }
}
```

**Cache Control:** Public cache with 30s TTL

#### GET /api/capsules/{id}

Retrieve a specific capsule by ID with optional user progress.

**Path Parameters:**

-   `id`: Capsule UUID

**Authentication:** Optional (includes user progress if authenticated)

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "total_pages": number,
  "content": {
    "meta": {
      "description": "string",
      "source_url": "string"
    },
    "pages": [
      {
        "page_title": "string",
        "body": "string"
      }
    ]
  },
  "created_by": "string",
  "created_at": "ISO timestamp",
  "last_page_read": number | null,
  "overall_progress": number | null,
  "bookmarked_date": "ISO timestamp" | null,
  "last_accessed": "ISO timestamp" | null
}
```

**Error Responses:**

-   404: Capsule not found

**Cache Control:** Public cache with 30s TTL

### Capsule Management

#### POST /api/capsule/create

Create a new capsule from a URL. This endpoint processes the URL content and generates a structured learning capsule using AI.

**Authentication:** Required

**Request Body:**

```json
{
    "url": "https://example.com/article"
}
```

**Response (Success):**

```json
{
    "ok": true,
    "id": "capsule-uuid"
}
```

**Response (Error):**

```json
{
    "ok": false,
    "error": "Error message"
}
```

**Error Codes:**

-   400: Invalid request or URL processing failed

#### GET /api/capsule/create/stream

Stream the capsule creation process from a URL. Returns Server-Sent Events with progress updates.

**Authentication:** Required

**Query Parameters:**

-   `url`: The URL to process

**Response:** Server-Sent Events stream

**Event Types:**

-   `progress`: Progress updates during creation
    ```json
    {
      "step": "fetching" | "extracting" | "chunking" | "generating" | "finalizing",
      "message": "Progress message"
    }
    ```
-   `completed`: Creation successful
    ```json
    {
        "id": "capsule-uuid"
    }
    ```
-   `failed`: Creation failed
    ```json
    {
        "error": "Error message"
    }
    ```

**Headers:**

```
Content-Type: text/event-stream
Cache-Control: no-cache, no-transform
Connection: keep-alive
X-Accel-Buffering: no
```

### User Progress

#### POST /api/capsule/progress

Update user progress for a specific capsule.

**Authentication:** Required

**Request Body:**

```json
{
  "capsuleId": "capsule-uuid",
  "lastPageRead": number (optional),
  "overallProgress": number 0-100 (optional),
  "bookmarkedDate": "ISO timestamp" (optional),
  "lastAccessed": "ISO timestamp" (optional)
}
```

**Response:**

```json
{
    "success": true
}
```

**Error Responses:**

-   400: Invalid request data
-   401: Unauthorized
-   500: Failed to update progress

### Bookmarks

#### POST /api/capsule/bookmark

Toggle bookmark status for a capsule.

**Authentication:** Required

**Request Body:**

```json
{
  "capsuleId": "capsule-uuid",
  "isBookmarked": true | false
}
```

**Response:**

```json
{
  "success": true,
  "bookmarked": true | false
}
```

**Error Responses:**

-   400: Invalid request data
-   401: Unauthorized
-   500: Failed to toggle bookmark

## Error Handling

All endpoints return appropriate HTTP status codes and JSON error responses:

```json
{
  "error": "Error message",
  "details": [...] // Optional validation details
}
```

## Data Types

### Capsule

```typescript
{
  id: string;
  title?: string | null;
  total_pages?: number | null;
  content?: {
    meta?: {
      description?: string;
      source_url?: string;
    };
    pages: Array<{
      page_title: string;
      body: string;
    }>;
  };
  created_by?: string | null;
  created_at?: string | null;
}
```

### Capsule with Progress

Extends Capsule with user-specific progress data:

```typescript
{
  ...Capsule,
  last_page_read?: number | null;
  overall_progress?: number | null;
  bookmarked_date?: string | null;
  last_accessed?: string | null;
}
```