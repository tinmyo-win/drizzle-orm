# Drizzle ORM Project

A simple project demonstrating Drizzle ORM with MySQL, featuring posts, comments, replies, and likes tables.

## Database Schema

- **Posts**: Main content posts with title, content, and author
- **Comments**: Comments on posts
- **Replies**: Replies to comments
- **Likes**: Like system for posts, comments, and replies

## Setup

1. Make sure you have MySQL running locally
2. Create a database named `drizzle_db`
3. Install dependencies:
   ```bash
   yarn install
   ```

4. Generate and run migrations:
   ```bash
   yarn generate
   yarn migrate
   ```

5. Run the demo to seed data:
   ```bash
   yarn seed
   ```

## Database Configuration

The project is configured to connect to:
- Host: localhost
- Port: 3306
- Database: drizzle_db
- User: root
- Password: password

Update the connection settings in `src/db.js` and `drizzle.config.js` to match your MySQL setup.

## Scripts

- `yarn dev` - Run the demo application
- `yarn seed` - Run the seeding script to populate database with sample data
- `yarn generate` - Generate database migrations
- `yarn migrate` - Apply migrations to database
- `yarn studio` - Open Drizzle Studio (database browser)

## Schema Features

- **Relationships**: Proper foreign key relationships between tables
- **Timestamps**: Automatic created_at and updated_at fields
- **Flexible Likes**: Like system that can target posts, comments, or replies
- **Type Safety**: Full TypeScript support with Drizzle ORM
