class GetThreadDetailUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload.id);
    const comments = await this._commentRepository.getCommentsByThreadId(thread.id);

    console.log("comments", comments);

    // sort comments by created_at
    comments.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    thread.comments = comments;

    console.log("thread", thread.comments);

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
