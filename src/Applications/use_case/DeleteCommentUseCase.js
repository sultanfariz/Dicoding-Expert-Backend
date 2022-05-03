const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload.thread_id);
    if (!thread) {
      throw new NotFoundError('thread not found');
    }

    if (!useCasePayload.comment_id) {
      throw new NotFoundError('comment_id is required');
    }

    // check user authorization
    const comment = await this._commentRepository.getCommentById(useCasePayload.comment_id);
    if (!comment) throw new NotFoundError('comment not found');

    const username = await this._userRepository.verifyUsernameById(useCasePayload.owner_id);
    if (comment.username !== username) throw new AuthorizationError('user not authorized');

    return await this._commentRepository.deleteComment(useCasePayload.comment_id);
  }
}

module.exports = DeleteCommentUseCase;
