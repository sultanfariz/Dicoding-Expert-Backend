const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.getThreadById(useCasePayload.thread_id);
    await this._commentRepository.getCommentById(addReply.comment_id);
    return this._replyRepository.insertReply(addReply);
  }
}

module.exports = AddReplyUseCase;
