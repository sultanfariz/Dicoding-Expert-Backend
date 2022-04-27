const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forum_api_jwt',
      tags: ['api', 'threads'],
      description: 'Create a new thread',
    },
  },
]);

module.exports = routes;
