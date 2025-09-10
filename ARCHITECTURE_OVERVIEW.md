# Architecture Overview

## Key design decisions

-   Repository + Service layering structure
    -   services layer handles validation (capsules.service.ts).
    -   repositories layer contains SQL queries
    -   queries layer acts as the front gate for server components and routes (index.ts).
-   JSON content model for capsules
    -   `capsules.content` uses JSON data type. This hopefully gives future flexibibility especially for AI-generated contents.
-   Resilient content extraction
    -   Primary extraction via Mozilla Readability; fallback to unfluff.
-   OpenAI-compatible DeepSeek integration
    -   Uses `response_format: { type: "json_object" }` and a strict system/user prompt contract to enforce JSON output (deepseek.ts).
-   Auth and routing
    -   JWT stored in cookies (session.ts), read in middleware (middleware.ts).
    -   Protected and public route configurations are centralizedin routes.ts.

### High-level architecture

-   Runtime/framework
    -   Next.js App Router (Next 15, React 19).
    -   UI with MUI + Tailwind.
-   Backend shape
    -   Public API: API routes under api (REST-style).
    -   Internal/Client API: Initially using a single Data Access Layer, now separated into API route → queries → repositories (SQL) → Postgres
-   Data
    -   Capsule content stored as JSON for flexibility (`capsules.content`).
-   Auth
    -   Cookie-based JWT (JOSE), HS256, httpOnly + secure cookies.
    -   Any route always passes middleware.ts, reading the cookie for authN/authZ purposes.
-   AI/Extraction
    -   Content extraction (Readability + unfluff) → HTML→Markdown (Turndown) → chunking → DeepSeek (OpenAI-compatible) with `JSON-mode` output.

### Data Model/Schema

`users` model

```
id
name
email
password (bcrypt)
```

`capsules` model

```
id
title
total_pages
content(JSON)
created_by
created_at
```

`user_capsules`

```
id
user_id
capsule_id
last_page_read
overall_progress
bookmarked_date
last_accessed
```

### Consumable API

**Public**

-   GET `/api/health` → simple status.
-   GET `/api/capsules?limit&offset` → list public capsules (optionally merges user progress if session present).
-   GET `/api/capsules/[id]` → capsule details (optionally merges user progress).

**Auth required**

-   POST `/api/capsule/create` → create capsule from a URL.
-   POST `/api/capsule/progress` → update reading/progress.
-   POST `/api/capsule/bookmark` → update bookmark date.

## System Flow

### User Journey Flow

```
Landing Page → Explore & Learn (Public) → Sign Up/Login → Dashboard → Create/Bookmark/Learn & Track Progress
```

### Capsule Creation Flow

```
URL Submission → Content Extraction → AI Processing → Validation → Database Storage
```

1. **URL Validation**: Check if URL is valid HTTP(S)
2. **Content Fetching**: Retrieve HTML from the URL
3. **Content Extraction**: Use Mozilla Readability to extract main content
4. **Markdown Conversion**: Convert HTML into markdown
5. **Content Chunking**: Break content into smaller sections
6. **AI Generation**: DeepSeek API creates learning capsule
7. **Content Validation**: Ensure generated content matches expected schema
8. **Database Storage**: Save capsule with metadata and content

### Authentication Flow

```
Login/Signup → JWT Creation → Cookie Storage → Middleware Validation → Route Access
```
