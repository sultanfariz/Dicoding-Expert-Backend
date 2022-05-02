const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadDetailUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload.id);
    const comments = await this._commentRepository.getCommentsByThreadId(thread.id);
    thread.comments = comments;
    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
