const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const { any } = require('joi');

describe('GetThreadDetailUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };
    const expectedThreadDetail = new ThreadDetail({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      created_at: expect.any(Date),
      username: 'dicoding',
      comments: [new CommentDetail({
        id: 'comment-123',
        content: 'content',
        created_at: expect.any(Date),
        username: 'username',
      })],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(async () => {
      return new ThreadDetail({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner_id: 'user-123',
        username: 'dicoding',
        created_at: expect.any(Date),
        comments: [],
      });
    });
    mockCommentRepository.getCommentsByThreadId = jest.fn(async () => {
      return [
        new CommentDetail({
          id: 'comment-123',
          username: 'username',
          content: 'content',
          thread_id: 'thread-123',
          created_at: expect.any(Date),
          deleted_at: null,
        })
      ];
    });
    mockUserRepository.getUsernameById = jest.fn(async () => {
      return 'username';
    });

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.id);
  });
});
