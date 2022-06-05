/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.addColumns('comments', {
    like_count: {
      type: 'INTEGER',
      default: 0,
    },
  });
};

exports.down = pgm => {
  pgm.dropColumns('comments', 'like_count');
};
