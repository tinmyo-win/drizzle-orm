import { db, connection } from './db.js';
import { posts, comments, replies, likes } from './schema.js';
import { eq, desc, asc, count, exists, like, and, sql, or } from 'drizzle-orm';

async function queryPosts() {
  console.log('🔍 Querying Posts...');
  
  try {
    const filters = [];
    const commentText = "Great post! Thanks for sharing.";
    // const commentSearch = exists(db.select().from(comments).where(eq(comments.postId, posts.id)).where(like(comments.content, `%${commentText}%`)));
    const commentSearch = sql`
      exists (
        select 1
        from ${comments}
        where ${comments.postId} = ${posts.id}
          and ${comments.content} like ${`%${commentText}%`}
      )
    `;

    const hasComment = sql`
      exists (
        select 1
        from ${comments}
        where ${comments.postId} = ${posts.id}
      )
    `;

    const noComments = sql`
      not exists (
        select 1
        from ${comments}
        where ${comments.postId} = ${posts.id}
      )
    `;

    const replyText = "I agree! Very informative. but not search";

    const replySearch = sql`
      exists (
        select 1
        from ${comments}
        inner join ${replies} on ${replies.commentId} = ${comments.id}
        where ${comments.postId} = ${posts.id}
          and ${replies.content} = ${replyText}
      )
    `;

    const hasReply = sql`
      exists (
        select 1
        from ${comments}
        inner join ${replies} on ${replies.commentId} = ${comments.id}
        where ${comments.postId} = ${posts.id}
      )
    `;

    // 2️⃣ Posts that have no replies
    const noReplies = sql`
      not exists (
        select 1
        from ${comments}
        inner join ${replies} on ${replies.commentId} = ${comments.id}
        where ${comments.postId} = ${posts.id}
      )
    `;


    filters.push(hasReply);


    const postData = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(...filters)).toSQL();

    console.log(postData);

  } catch (error) {
    console.error('❌ Query Error:', error);
  } finally {
    // Close the database connection
    await connection.end();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the queries
queryPosts().catch(async (error) => {
  console.error('❌ Fatal error:', error);
  await connection.end();
  process.exit(1);
});