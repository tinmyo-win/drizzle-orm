import { mysqlTable, serial, text, timestamp, int, boolean } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Posts table
export const posts = mysqlTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: int('author_id').notNull(),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Comments table
export const comments = mysqlTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  postId: int('post_id').notNull(),
  authorId: int('author_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Replies table (replies to comments)
export const replies = mysqlTable('replies', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  commentId: int('comment_id').notNull(),
  authorId: int('author_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Likes table (can like posts, comments, or replies)
export const likes = mysqlTable('likes', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  postId: int('post_id'),
  commentId: int('comment_id'),
  replyId: int('reply_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relations
export const postsRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  replies: many(replies),
  likes: many(likes),
}));

export const repliesRelations = relations(replies, ({ one, many }) => ({
  comment: one(comments, {
    fields: [replies.commentId],
    references: [comments.id],
  }),
  likes: many(likes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [likes.commentId],
    references: [comments.id],
  }),
  reply: one(replies, {
    fields: [likes.replyId],
    references: [replies.id],
  }),
}));
