const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.likeCommentHandler,
    options: {
      auth: 'forum_api_jwt',
      tags: ['api', 'likes'],
      description: 'Like or unlike comment',
    },
  },
]);

module.exports = routes;
