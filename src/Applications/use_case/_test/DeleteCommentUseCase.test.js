const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error when thread_id is not provided', async () => {
    const useCasePayload = {
      comment_id: 'comment-123',
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn().mockReturnValue(Promise.resolve(null));
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.deleteComment = jest.fn();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    const result = deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.deleteComment).not.toHaveBeenCalled();
    await expect(result).rejects.toThrowError('thread not found');
  });

  it('should throw error when comment_id is not provided', async () => {
    const useCasePayload = {
      thread_id: 'thread-123',
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn().mockReturnValue(Promise.resolve({}));
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.deleteComment = jest.fn();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    const result = deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.deleteComment).not.toHaveBeenCalled();
    await expect(result).rejects.toThrowError('comment_id is required');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread_id: 'thread-123',
      comment_id: 'comment-123',
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn()
      .mockResolvedValue({
        id: 'thread-123',
        title: 'thread-123',
        content: 'thread-123',
        created_at: '2020-01-01',
        username: 'user-123',
      });
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.deleteComment = jest.fn();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.comment_id);
  });
});
