const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeComment(giveLike) {
    const { owner_id, comment_id } = giveLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id, comment_id, owner_id, created_at',
      values: [id, comment_id, owner_id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async unlikeComment(id) {
    if (!id) {
      throw new InvariantError('id is required');
    }

    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply not found');
    }
  }

  async getLikeByCommentIdAndOwnerId(commentId, ownerId) {
    if (!commentId) {
      throw new InvariantError('commentId is required');
    }

    if (!ownerId) {
      throw new InvariantError('ownerId is required');
    }

    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner_id = $2',
      values: [commentId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return result.rows[0];
  }
}

module.exports = LikeRepositoryPostgres;
