const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');


describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.insertThread({
        id: 'thread-123',
        title: 'Dicoding Indonesia',
        body: 'All About Dicoding Indonesia here',
        owner_id: 'user-123',
      });
      const addComment = new AddComment({
        content: 'dicoding',
        owner_id: 'user-123',
        thread_id: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.insertComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.insertThread({
        id: 'thread-123',
        title: 'Dicoding Indonesia',
        body: 'All About Dicoding Indonesia here',
        owner_id: 'user-123',
      });
      const addComment = new AddComment({
        content: 'dicoding',
        thread_id: 'thread-123',
        owner_id: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.insertComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'dicoding',
        thread_id: 'thread-123',
        owner_id: 'user-123',
        created_at: expect.any(Object),
      }));
    });
  });

  describe('getCommentById', () => {
    it('should return comment detail correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.insertThread({
        id: 'thread-123',
        title: 'Dicoding Indonesia',
        body: 'All About Dicoding Indonesia here',
        owner_id: 'user-123',
      });

      await CommentsTableTestHelper.insertComment({
        id: 'comment-123',
        content: 'dicoding comment',
        thread_id: 'thread-123',
        owner_id: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comment).toStrictEqual(new CommentDetail({
        id: 'comment-123',
        thread_id: 'thread-123',
        username: 'dicoding',
        content: 'dicoding comment',
        created_at: expect.any(Object),
      }));
    });

    it('should throw error when comment not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const action = commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      await expect(action).rejects.toThrow(NotFoundError);
    });
  });


  describe('deleteComment', () => {
    it('should throw InvariantError when comment id is not provided', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(commentRepositoryPostgres.deleteComment()).rejects.toThrowError(InvariantError);
    });

    it('should throw InvariantError when comment id is not valid', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(commentRepositoryPostgres.deleteComment('invalid-id')).rejects.toThrowError(InvariantError);
    });

    it('should update deleted_at column to current timestamp', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.insertThread({
        id: 'thread-123',
        title: 'Dicoding Indonesia',
        body: 'All About Dicoding Indonesia here',
        owner_id: 'user-123',
      });

      await CommentsTableTestHelper.insertComment({
        id: 'comment-123',
        content: 'dicoding',
        owner_id: 'user-123',
        thread_id: 'thread-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].id).toBe('comment-123');
      expect(comments[0].deleted_at).toBeDefined();
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return empty array when thread id is not provided', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId();

      // Assert
      expect(comments).toHaveLength(0);
    });

    it('should return empty array when thread id is not valid', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('invalid-id');

      // Assert
      expect(comments).toHaveLength(0);
    });

    it('should return comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.insertThread({
        id: 'thread-123',
        title: 'Dicoding Indonesia',
        body: 'All About Dicoding Indonesia here',
        owner_id: 'user-123',
      });

      await CommentsTableTestHelper.insertComment({
        id: 'comment-123',
        content: 'dicoding comment',
        owner_id: 'user-123',
        thread_id: 'thread-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBe('comment-123');
      expect(comments[0].content).toBe('dicoding comment');
      expect(comments[0].username).toBe('dicoding');
      expect(comments[0].date).toBeDefined();
    });
  });
});
