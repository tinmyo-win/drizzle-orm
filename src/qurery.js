import { db, connection } from './db.js';
import { posts, comments, replies, likes } from './schema.js';
import { eq, like, and, exists, inArray, sql, notExists } from 'drizzle-orm';

async function queryPosts() {
  try {
    const commentText = "Great post! Thanks for sharing";
    const replyText = "I agree! Very informative. but not search";

    // Reusable subqueries using Drizzle-style `exists`
    const hasComment = exists(
      db.select({ id: comments.id })
        .from(comments)
        .where(eq(comments.postId, posts.id))
    );

    const hasReply = exists(
      db.select({ id: replies.id })
        .from(replies)
        .innerJoin(comments, eq(replies.commentId, comments.id))
        .where(eq(comments.postId, posts.id))
    );

    const noReply = notExists(
      db.select({ id: replies.id })
        .from(replies)
        .innerJoin(comments, eq(replies.commentId, comments.id))
        .where(eq(comments.postId, posts.id))
    );

    const commentSearch = exists(
      db.select({ id: comments.id })
        .from(comments)
        .where(and(
          eq(comments.postId, posts.id),
          like(comments.content, `%${commentText}%`)
        ))
    );

    const replySearch = exists(
      db.select({ id: replies.id })
        .from(replies)
        .innerJoin(comments, eq(replies.commentId, comments.id))
        .where(and(
          eq(comments.postId, posts.id),
          like(replies.content, `%${replyText}%`)
        ))
    );

    // ✅ Choose filters dynamically
    const filters = [hasComment, commentSearch];

    // 🧠 Directly get posts with relations, filtered
    const data = await db.query.posts.findMany({
      where: and(...filters),
      with: {
        comments: {
          with: {
            replies: true,
            likes: true,
          }
        }
      },
      orderBy: (posts, { asc }) => [asc(posts.id)],
      limit: 10,
    }).toSQL();

    const postIds = (await db.select({id: posts.id}).from(posts)
      .where(and(...filters))
      .orderBy(posts.id)
      .limit(10)).map(p => p.id);

    const rows = await db.select({
      post: posts,
      comment: comments,
    }).from(posts)
    .where(inArray(posts.id, postIds))
    .leftJoin(comments, eq(posts.id, comments.postId));

    const result = rows.reduce(
      (data, row) => {
        const post = row.post;
        const comment = row.comment;
        if (!data[post.id]) {
          data[post.id] = { post, comments: [] };
        }
        if (comment) {
          data[post.id].comments.push(comment);
        }
        return data;
      },
      {}
    );

    // console.log('✅ Result by select:', dataBySelect.length, 'posts found');

    console.log('✅ Result:', data.length, 'posts found');

    // console.log('✅ Result by select:', dataBySelect.length, 'posts found');

    console.log('✅ Result:', data.length, 'posts found');
    return data;

  } catch (error) {
    console.error('❌ Query Error:', error);
  } finally {
    await connection.end();
    console.log('🔌 Database connection closed');
  }
}

queryPosts();
