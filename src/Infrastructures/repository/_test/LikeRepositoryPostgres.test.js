const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const GiveLike = require('../../../Domains/likes/entities/GiveLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');


describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('likeComment function', () => {
    it('should persist add like correctly', async () => {
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
        content: 'Hello World',
        owner_id: 'user-123',
        thread_id: 'thread-123',
      });
      const giveLike = new GiveLike({
        owner_id: 'user-123',
        comment_id: 'comment-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.likeComment(giveLike);

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(1);
      expect(like[0].owner_id).toBe('user-123');
      expect(like[0].comment_id).toBe('comment-123');
    });
  });

  describe('unlikeComment function', () => {
    it('should throw InvariantError when like id is empty', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(likeRepositoryPostgres.unlikeComment()).rejects.toThrowError(InvariantError);
    });

    it('should throw NotFoundError when like is not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(likeRepositoryPostgres.unlikeComment('like-124')).rejects.toThrowError(NotFoundError);
    });

    it('should delete like when like id is valid', async () => {
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

      await LikesTableTestHelper.insertLike({
        id: 'like-123',
        owner_id: 'user-123',
        comment_id: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.unlikeComment('like-123');

      // Assert
      const replies = await LikesTableTestHelper.findLikeById('like-123');
      expect(replies).toHaveLength(0);
    });
  });

  describe('getLikeByCommentIdAndOwnerId function', () => {
    it('should throw InvariantError when comment id is empty', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(likeRepositoryPostgres.getLikeByCommentIdAndOwnerId('', 'owner-123')).rejects.toThrowError(InvariantError);
    });

    it('should throw InvariantError when owner id is empty', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(likeRepositoryPostgres.getLikeByCommentIdAndOwnerId('comment-123', '')).rejects.toThrowError(InvariantError);
    });

    it('should return empty array when comment id is not found', async () => {
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
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const likes = await likeRepositoryPostgres.getLikeByCommentIdAndOwnerId('comment-124', 'owner-123');

      // Assert
      expect(likes).toBe(null);
    });

    it('should return null when owner id is not found', async () => {
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

      await LikesTableTestHelper.insertLike({
        id: 'like-123',
        owner_id: 'user-123',
        comment_id: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const likes = await likeRepositoryPostgres.getLikeByCommentIdAndOwnerId('comment-123', 'owner-124');

      // Assert
      expect(likes).toBe(null);
    });

    it('should return like when comment id and owner id is valid', async () => {
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

      await LikesTableTestHelper.insertLike({
        id: 'like-123',
        owner_id: 'user-123',
        comment_id: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const likes = await likeRepositoryPostgres.getLikeByCommentIdAndOwnerId('comment-123', 'user-123');

      // Assert
      expect(likes).toBeDefined();
      expect(likes.id).toBe('like-123');
      expect(likes.owner_id).toBe('user-123');
      expect(likes.comment_id).toBe('comment-123');
    });
  });
});
