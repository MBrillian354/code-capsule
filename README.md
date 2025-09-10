# CodeCapsule

A modern learning platform that transforms articles and web content into structured, trackable learning experiences.

Website is live at https://code-capsule-orcin.vercel.app/

## Project Overview

CodeCapsule is a full-stack web application that allows users to:

-   **Capture Content**: Paste any URL to automatically extract and convert articles into `capsules`
-   **Track Progress**: Track learning progress by chapter
-   **Explore**: Browse capsules created by the community
-   **Bookmark**: Save your favorite capsules for easy access

## Technology Stack

-   **Frontend**: Next.js 15, React 19, Material-UI 7, TypeScript
-   **Backend**: Next.js API Routes, Node.js
-   **Database**: PostgreSQL
-   **AI Integration**: DeepSeek API
-   **Authentication**: Jose (JWT) with secure cookie storage
-   **Styling**: Material-UI with Emotion, Tailwind CSS

## Prerequisites

-   Node.js 18.0 or higher
-   PostgreSQL database
-   pnpm (recommended) or npm/yarn
-   DeepSeek API key

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mbrillian354/code-capsule.git
cd code-capsule
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory. An example file `.env.example` is provided.

### 4. Set Up Database

Make sure PostgreSQL is running and create your database:

```bash
# Run database migrations
pnpm seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application running.

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/             # Public API routes
│   ├── dashboard/       # Authenticated user dashboard page
│   ├── explore/         # Public capsule exploration
│   ├── learn/           # Public Learning interface
│   └── ui/              # Global styles and theme
├── components/          # Reusable React components
│   ├── layouts/         # Layout components
│   └── shared/          # Shared UI components
├── lib/                 # Utility functions and client-side logic
└── server/              # Server-side logic
    ├── auth/            # Authentication utilities
    ├── db/              # Database client
    ├── queries/         # Database queries
    ├── repositories/    # Data access layer
    └── services/        # Business logic services

```

## Available Scripts

-   `pnpm dev` - Start development server with Turbopack
-   `pnpm build` - Build for production
-   `pnpm start` - Start production server
-   `pnpm lint` - Run ESLint
-   `pnpm seed` - Seed database

## How It Works

### Capsule Creation Pipeline

The core feature of CodeCapsule is converting web articles into a structured learning module called `Capsules`:

1. **URL Submission**: POST to `/api/capsule/create` with `{ url: string }`
2. **Content Extraction**: Validate URL, fetch and extract main content using Mozilla Readability
3. **Content Processing**: Convert HTML to Markdown and perform chunking
4. **AI**: Use DeepSeek API to generate capsule
5. **Validation & Storage**: Validate content shape and insert to PostgreSQL database

### User Journey

1. **Open the web**: User begin from a landing page
2. **Explore**: Browse community capsules
3. **Sign Up/Login**: Log in to create and save capsules
4. **Create Capsules**: Insert a URL, wait for conversion to finish
5. **Learn**: Read through capsules and track your learning progress
6. **Bookmark**: Save favorite capsule for easer access

### Health Check

-   `GET /api/health` - Service health status
