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
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id, comment_id, owner_id, content, created_at',
      values: [id, comment_id, owner_id, content],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getReplyById(id) {
    const query = {
      text: `SELECT 
              likes.id,
              likes.comment_id,
              likes.content,
              likes.created_at,
              likes.deleted_at,
              users.username 
            FROM likes
            INNER JOIN users ON likes.owner_id = users.id
            WHERE likes.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return new ReplyDetail({ ...result.rows[0] });
  }

  async deleteReply(id) {
    if (!id) {
      throw new InvariantError('id is required');
    }

    const query = {
      text: 'UPDATE likes SET deleted_at = NOW() WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('reply tidak ditemukan');
    }
  }

  async getRepliesByCommentId(comment_id) {
    if (!comment_id) return [];

    const query = {
      text: `SELECT 
              likes.id,
              likes.comment_id,
              likes.content,
              likes.created_at,
              likes.deleted_at,
              users.username
            FROM likes
            INNER JOIN users ON likes.owner_id = users.id
            WHERE likes.comment_id = $1`,
      values: [comment_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows.map(row => {
      return new ReplyDetail({ ...row });
    });
  }
}

module.exports = LikeRepositoryPostgres;
