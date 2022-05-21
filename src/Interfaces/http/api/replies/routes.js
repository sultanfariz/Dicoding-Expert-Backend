const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forum_api_jwt',
      tags: ['api', 'replies'],
      description: 'Create a new reply',
    },
  },
  // {
  //   method: 'DELETE',
  //   path: '/threads/{threadId}/comments/{commentId}',
  //   handler: handler.deleteReplyHandler,
  //   options: {
  //     auth: 'forum_api_jwt',
  //     tags: ['api', 'comments'],
  //     description: 'Delete a comment',
  //   },
  // }
]);

module.exports = routes;
