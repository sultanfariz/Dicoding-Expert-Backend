const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async insertComment(addComment) {
    const { content, owner_id, thread_id } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, thread_id, owner_id, content, created_at',
      values: [id, thread_id, owner_id, content],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET deleted_at = NOW() WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('comment tidak ditemukan');
    }
  }

  async getCommentsByThreadId(thread_id) {
    if (!thread_id) {
      return [];
    }

    const query = {
      text: 'SELECT * FROM comments WHERE thread_id = $1',
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    // result.rows.forEach(row => {
    //   row.created_at = new Date(row.created_at);
    //   row.deleted_at = row.deleted_at ? new Date(row.deleted_at) : null;
    // });

    result.rows.sort((a, b) => {
      if (a.created_at > b.created_at) return -1;
      if (a.created_at < b.created_at) return 1;
      return 0;
    });

    return result.rows.map(row => {
      let comment = new AddedComment({ ...row });
      comment.content = comment.deleted_at ? '**komentar telah dihapus**' : comment.content;
      return comment;
    });
  }
}

module.exports = CommentRepositoryPostgres;
