const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forum_api_jwt',
      tags: ['api', 'comments'],
      description: 'Create a new comment',
    },
  },
]);

module.exports = routes;
