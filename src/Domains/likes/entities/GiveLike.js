class GiveLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner_id, comment_id } = payload;

    this.owner_id = owner_id;
    this.comment_id = comment_id;
  }

  _verifyPayload({ owner_id, comment_id }) {
    if (!owner_id || !comment_id) {
      throw new Error('GIVE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner_id !== 'string' || typeof comment_id !== 'string') {
      throw new Error('GIVE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GiveLike;
