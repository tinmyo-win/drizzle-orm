import { db, connection } from './db.js';
import { posts, comments, replies, likes } from './schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🚀 Starting Drizzle ORM Demo');
  
  try {
    // Insert sample data
    console.log('📝 Inserting sample post...');
    await db.insert(posts).values({
      title: 'My First Post',
      content: 'This is the content of my first post using Drizzle ORM!',
      authorId: 1,
      published: true,
    });
    
    // Get the inserted post
    const [post] = await db.select().from(posts).orderBy(posts.id).limit(1).offset(0);
    console.log('✅ Post created:', post);
    
    console.log('💬 Adding a comment...');
    await db.insert(comments).values({
      content: 'Great post! Thanks for sharing.',
      postId: post.id,
      authorId: 2,
    });
    
    // Get the inserted comment
    const [comment] = await db.select().from(comments).where(eq(comments.postId, post.id));
    console.log('✅ Comment created:', comment);
    
    console.log('↩️ Adding a reply...');
    await db.insert(replies).values({
      content: 'I agree! Very informative.',
      commentId: comment.id,
      authorId: 3,
    });
    
    // Get the inserted reply
    const [reply] = await db.select().from(replies).where(eq(replies.commentId, comment.id));
    console.log('✅ Reply created:', reply);
    
    console.log('❤️ Adding likes...');
    await db.insert(likes).values([
      { userId: 2, postId: post.id },
      { userId: 3, commentId: comment.id },
      { userId: 1, replyId: reply.id },
    ]);
    
    console.log('✅ Likes added!');
    
    // Query all data to verify
    console.log('🔍 Fetching all data...');
    const allPosts = await db.select().from(posts);
    const allComments = await db.select().from(comments);
    const allReplies = await db.select().from(replies);
    const allLikes = await db.select().from(likes);
    
    console.log('📊 Database contents:');
    console.log('Posts:', allPosts);
    console.log('Comments:', allComments);
    console.log('Replies:', allReplies);
    console.log('Likes:', allLikes);
    
    console.log('🎉 Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the database connection
    await connection.end();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

main().catch(async (error) => {
  console.error('❌ Fatal error:', error);
  await connection.end();
  process.exit(1);
});
