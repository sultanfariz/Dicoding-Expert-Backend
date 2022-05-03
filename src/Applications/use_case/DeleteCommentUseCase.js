const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    console.log('DeleteCommentUseCase', useCasePayload);
    const thread = await this._threadRepository.getThreadById(useCasePayload.thread_id);
    if (!thread) {
      throw new NotFoundError('thread not found');
    }

    if (!useCasePayload.comment_id) {
      throw new NotFoundError('comment_id is required');
    }

    return await this._commentRepository.deleteComment(useCasePayload.comment_id);
  }
}

module.exports = DeleteCommentUseCase;
