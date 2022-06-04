/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('likes', {
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
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('likes', 'like_unique', {
    unique: ['comment_id', 'owner_id'],
  });
}

exports.down = pgm => {
  pgm.dropTable('likes');
};
