class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, content, created_at, deleted_at, replies, like_count } = payload;

    this.id = id;
    this.username = username;
    this.date = created_at;
    this.content = deleted_at ? "**komentar telah dihapus**" : content;
    this.replies = replies;
    this.likeCount = like_count;
  }

  _verifyPayload({ id, username, content, created_at, like_count }) {
    // console.log("==============================================");
    // console.log(id, username, content, created_at, like_count);
    // console.log("like_count === undefined", like_count === undefined);
    // console.log("typeof like_count", typeof like_count);
    // console.log("==============================================");
    // if (!id || !username || !content || !created_at || like_count === undefined) {
    if (!id || !username || !content || !created_at) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || typeof created_at !== 'object' || typeof like_count !== 'number') {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentDetail;
