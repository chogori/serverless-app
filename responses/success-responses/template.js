const createSuccessResponse = message => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  },
  body: JSON.stringify(message),
});

module.exports = createSuccessResponse;
