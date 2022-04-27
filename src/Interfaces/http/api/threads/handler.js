const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner_id } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    request.payload.owner_id = owner_id;
    const addedThread = await addThreadUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread: {
          id: addedThread.id,
          title: addedThread.title,
          owner: addedThread.owner_id,
        },
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
