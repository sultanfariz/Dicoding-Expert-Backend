const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._commentRepository.getCommentById(addReply.comment_id);
    return this._replyRepository.insertReply(addReply);
  }
}

module.exports = AddReplyUseCase;
