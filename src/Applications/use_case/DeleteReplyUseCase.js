const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository, userRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload.thread_id);
    if (!thread) {
      throw new NotFoundError('thread not found');
    }

    const comment = await this._commentRepository.getCommentById(useCasePayload.comment_id);
    if (!comment) {
      throw new NotFoundError('comment not found');
    }

    if (!useCasePayload.reply_id) {
      throw new NotFoundError('reply_id is required');
    }

    // check user authorization
    const reply = await this._replyRepository.getReplyById(useCasePayload.reply_id);

    const username = await this._userRepository.verifyUsernameById(useCasePayload.owner_id);
    if (reply.username !== username) throw new AuthorizationError('user not authorized');

    return await this._replyRepository.deleteReply(useCasePayload.reply_id);
  }
}

module.exports = DeleteReplyUseCase;
