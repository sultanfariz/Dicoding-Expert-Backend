const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.likeCommentHandler = this.likeCommentHandler.bind(this);
  }

  async likeCommentHandler(request, h) {
    const { id: owner_id } = request.auth.credentials;
    const { commentId: comment_id, threadId: thread_id } = request.params;
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    const payload = {
      owner_id,
      comment_id,
      thread_id,
    };
    await likeCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
