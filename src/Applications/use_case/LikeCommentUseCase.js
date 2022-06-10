const GiveLike = require('../../Domains/likes/entities/GiveLike');

class LikeCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const giveLike = new GiveLike(useCasePayload);
    await this._threadRepository.getThreadById(useCasePayload.thread_id);
    let comment = await this._commentRepository.getCommentById(giveLike.comment_id);
    let like = await this._likeRepository.getLikeByCommentIdAndOwnerId(giveLike.comment_id, giveLike.owner_id);
    if (!like) {
      await this._likeRepository.likeComment(giveLike);
      await this._commentRepository.updateCommentLikeCountById(giveLike.comment_id, comment.likeCount + 1);
    } else {
      await this._likeRepository.unlikeComment(like.id);
      await this._commentRepository.updateCommentLikeCountById(giveLike.comment_id, comment.likeCount - 1);
    }
  }
}

module.exports = LikeCommentUseCase;
