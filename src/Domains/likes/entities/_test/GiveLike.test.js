const GiveLike = require('../GiveLike');

describe('a GiveLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner_id: 'user-123',
    };

    // Action and Assert
    expect(() => new GiveLike(payload)).toThrowError('GIVE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner_id: 'user-123',
      comment_id: 1234,
    };

    // Action and Assert
    expect(() => new GiveLike(payload)).toThrowError('GIVE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GiveLike object correctly', () => {
    // Arrange
    const payload = {
      owner_id: 'user-123',
      comment_id: 'comment-123',
    };

    // Action
    const { owner_id, comment_id } = new GiveLike(payload);

    // Assert
    expect(owner_id).toBe(payload.owner_id);
    expect(comment_id).toBe(payload.comment_id);
  });
});
