class GetThreadDetailUseCase {
  constructor({ userRepository, threadRepository, commentRepository, replyRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload.id);
    const comments = await this._commentRepository.getCommentsByThreadId(thread.id);

    // sort comments by created_at
    comments.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // get comment's replies
    for (let i = 0; i < comments.length; i++) {
      const replies = await this._replyRepository.getRepliesByCommentId(comments[i].id);
      // sort replies by created_at
      replies.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      comments[i].replies = replies;
    }

    thread.comments = comments;

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
