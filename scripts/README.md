# Database Seeding

This directory contains scripts for seeding the database with initial data.

## Seed Script

The `seed.js` script creates sample data for a new Code Capsule project setup. It includes:

- **1 User**: A sample user account for testing
- **1 Capsule**: A complete "Introduction to JavaScript" learning capsule with 5 pages
- **1 User-Capsule relationship**: Shows the user's progress on the capsule (40% complete, bookmarked)

## Prerequisites

Before running the seed script, ensure you have:

1. A PostgreSQL database set up
2. The `POSTGRES_URL` environment variable configured
3. All database tables created (users, capsules, user_capsules)

## Running the Seed Script

```bash
# Using the npm script (recommended)
pnpm run seed

# Or directly with Node.js
node scripts/seed.js
```

## Sample Data

### User Account
- **Email**: `john.doe@example.com`
- **Password**: `password123`
- **Name**: John Doe

### Capsule Content
- **Title**: Introduction to JavaScript
- **Pages**: 5 comprehensive lessons covering:
  1. Getting Started with JavaScript
  2. Functions and Control Flow
  3. Objects and Arrays
  4. DOM Manipulation
  5. Modern JavaScript Features

### User Progress
- **Progress**: 40% complete (2 out of 5 pages read)
- **Status**: Bookmarked
- **Last Page Read**: Page 2

## Safety Features

- The script checks if data already exists before seeding
- Prevents duplicate data insertion
- Provides clear success/error messaging
- Uses secure password hashing with bcrypt

## Environment Variables

Make sure your `.env.local` file contains:

```env
POSTGRES_URL=your_postgresql_connection_string
```

## Database Schema

The seed script populates these tables:

- `users`: User accounts
- `capsules`: Learning content
- `user_capsules`: User progress tracking

See the database schema attachments for detailed table structures.
