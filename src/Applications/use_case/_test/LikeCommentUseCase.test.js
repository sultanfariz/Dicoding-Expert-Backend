const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');
const GiveLike = require('../../../Domains/likes/entities/GiveLike');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('LikeCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      owner_id: 'user-123',
      comment_id: 'comment-123',
      thread_id: 'thread-123',
    };
    const expectedGiveLike = new GiveLike({
      id: 'like-123',
      comment_id: useCasePayload.comment_id,
      owner_id: useCasePayload.owner_id,
      created_at: expect.any(String),
      deleted_at: null,
    });

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(async () => {
      return new AddedThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner_id: 'user-123',
        created_at: expect.any(String),
      });
    });
    mockCommentRepository.getCommentById = jest.fn(async () => {
      return new CommentDetail({
        id: 'comment-123',
        content: 'content',
        thread_id: 'thread-123',
        username: 'username',
        like_count: 0,
        created_at: expect.any(String),
      });
    });
    mockCommentRepository.updateCommentLikeCountById = jest.fn(async () => {
      Promise.resolve(1);
    });
    mockLikeRepository.likeComment = jest.fn(() => Promise.resolve(expectedGiveLike));

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockLikeRepository.likeComment).toBeCalledWith(new GiveLike({
      owner_id: useCasePayload.owner_id,
      comment_id: useCasePayload.comment_id,
    }));
    expect(mockCommentRepository.updateCommentLikeCountById).toBeCalledWith(useCasePayload.comment_id, 1);
  });
});
