const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner_id } = request.auth.credentials;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    request.payload.owner_id = owner_id;
    const addedComment = await addCommentUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment: {
          id: addedComment.id,
          content: addedComment.content,
          owner: addedComment.owner_id,
        },
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
