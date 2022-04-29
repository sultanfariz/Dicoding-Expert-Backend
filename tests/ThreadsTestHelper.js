/* istanbul ignore file */
const AuthenticationsTestHelper = require('./AuthenticationsTestHelper');

const ThreadsTestHelper = {
  async getThreadId(server, accessToken) {
    /** add thread */
    const insertThreadRes = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'title',
        body: 'body',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (insertThreadRes.statusCode !== 201) {
      throw new Error('Failed to insert thread');
    }

    const { data: { addedThread: { id: threadId } } } = JSON.parse(insertThreadRes.payload);
    return threadId;
  },
};

module.exports = ThreadsTestHelper;