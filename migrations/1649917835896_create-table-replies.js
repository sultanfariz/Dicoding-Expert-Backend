/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments',
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    deleted_at: {
      type: 'TIMESTAMP',
      notNull: false,
      default: null,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('replies');
};
